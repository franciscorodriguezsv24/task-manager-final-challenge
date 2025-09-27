import { useState, useRef, useMemo } from "react";
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useMutation } from "@apollo/client";
import { EDIT_TASK } from "../api/graphql/queries.graphql";
import { useCustomToast } from "./UseCustomToast";
import type { Task } from "../generated/graphql";
import type {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";

interface UseDragAndDropProps {
  tasks: Task[];
  tasksData?: { tasks: Task[] };
}

interface UseDragAndDropReturn {
  activeTask: Task | null;
  isDragging: boolean;
  optimisticTasks: Task[];
  pendingUpdates: Set<string>;
  sensors: SensorDescriptor<SensorOptions>[];
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  setOptimisticTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  tasksByStatus: Record<string, Task[]>;
}

export const useDragAndDrop = ({
  tasks,
  tasksData,
}: UseDragAndDropProps): UseDragAndDropReturn => {
  const { showToast } = useCustomToast();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [optimisticTasks, setOptimisticTasks] = useState<Task[]>(tasks);
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  const pendingUpdatesRef = useRef<Set<string>>(new Set());
  const prevSnapshotRef = useRef<Task[] | null>(null);
  const lastTaskIdRef = useRef<string | null>(null);

  const addPending = (id: string) => {
    pendingUpdatesRef.current.add(id);
    setPendingUpdates(new Set(pendingUpdatesRef.current));
  };

  const removePending = (id: string) => {
    pendingUpdatesRef.current.delete(id);
    setPendingUpdates(new Set(pendingUpdatesRef.current));
  };

  const beginUpdateSnapshot = () => {
    prevSnapshotRef.current = optimisticTasks;
  };

  const revertIfNeeded = () => {
    if (prevSnapshotRef.current) {
      setOptimisticTasks(prevSnapshotRef.current);
      prevSnapshotRef.current = null;
    }
  };

  const applyLocalStatusChange = (
    taskId: string,
    status: Task["status"],
  ): void => {
    setOptimisticTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t)),
    );
  };

  const tasksByStatus = useMemo(
    () =>
      optimisticTasks?.reduce(
        (acc, task) => {
          acc[task.status] = acc[task.status]
            ? [...acc[task.status], task]
            : [task];
          return acc;
        },
        {} as Record<string, Task[]>,
      ) || {},
    [optimisticTasks],
  );

  const [updateTask] = useMutation(EDIT_TASK, {
    onError: (error) => {
      console.error("Error updating task:", error);
      pendingUpdatesRef.current.clear();
      setPendingUpdates(new Set());
      revertIfNeeded();
      setIsDragging(false);
      showToast("error", "the card won't be updated");
    },
    onCompleted: () => {
      if (lastTaskIdRef.current) {
        removePending(lastTaskIdRef.current);
        lastTaskIdRef.current = null;
      }
      setIsDragging(false);
      showToast("success", "the card was updated successfully");
    },
  });

  function handleDragStart(event: DragStartEvent) {
    const taskIdRaw = event.active.id as string;
    const taskId = taskIdRaw.replace("task:", "");

    const currentTask = optimisticTasks.find((task) => task.id === taskId);
    setActiveTask(currentTask || null);
    setIsDragging(true);

    if (optimisticTasks.length !== tasks.length) {
      setOptimisticTasks([...tasks]);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    if (!isDragging) return;

    const activeIdRaw = event.active.id as string;
    const overIdRaw = event.over?.id as string;
    if (!overIdRaw) return;

    const activeId = activeIdRaw.replace("task:", "");
    const isOverIsCol = overIdRaw.startsWith("col:");
    const overId = isOverIsCol
      ? overIdRaw.replace("col:", "")
      : overIdRaw.replace("task:", "");

    const currentTask = optimisticTasks.find((task) => task.id === activeId);
    if (!currentTask) return;

    if (isOverIsCol) {
      if (currentTask.status !== overId) {
        applyLocalStatusChange(activeId, overId as Task["status"]);
      }
      return;
    }

    const overTask = optimisticTasks.find((task) => task.id === overId);
    if (!overTask) return;

    if (currentTask.status === overTask.status) {
      const tasksInColumn = tasksByStatus[currentTask.status] || [];
      const activeIndex = tasksInColumn.findIndex(
        (task) => task.id === activeId,
      );
      const overIndex = tasksInColumn.findIndex((task) => task.id === overId);

      if (activeIndex !== overIndex) {
        const reorderedTasks = arrayMove(tasksInColumn, activeIndex, overIndex);
        const updatedTasks = optimisticTasks.map((task) => {
          if (task.status === currentTask.status) {
            const newIndex = reorderedTasks.findIndex((t) => t.id === task.id);
            return newIndex !== -1 ? reorderedTasks[newIndex] : task;
          }
          return task;
        });

        setOptimisticTasks(updatedTasks);
      }
    } else {
      applyLocalStatusChange(activeId, overTask.status);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    setIsDragging(false);
    if (!over) return;

    const activeIdRaw = active.id as string;
    const overIdRaw = over.id as string;
    const activeTaskId = activeIdRaw.replace("task:", "");
    const isOverIsCol = overIdRaw.startsWith("col:");
    const overId = isOverIsCol
      ? overIdRaw.replace("col:", "")
      : overIdRaw.replace("task:", "");

    if (pendingUpdatesRef.current.has(activeTaskId)) return;

    let newStatus: Task["status"] | null = null;
    if (isOverIsCol) {
      newStatus = overId as Task["status"];
    } else {
      const overTask = ((tasksData?.tasks as Task[]) || []).find(
        (t) => t.id === overId,
      );
      newStatus = overTask?.status ?? null;
    }

    if (!newStatus) return;

    const currentTaskOnServer = ((tasksData?.tasks as Task[]) || []).find(
      (t) => t.id === activeTaskId,
    );
    if (!currentTaskOnServer) return;
    if (currentTaskOnServer.status === newStatus) return;

    const currentData = active.data.current?.task;

    const tasksInColumn = optimisticTasks.filter(
      (task) => task.status === newStatus,
    );

    const newPosition = tasksInColumn.findIndex(
      (task) => task.id === activeTaskId,
    );

    beginUpdateSnapshot();
    addPending(activeTaskId);
    lastTaskIdRef.current = activeTaskId;
    applyLocalStatusChange(activeTaskId, newStatus);

    updateTask({
      variables: { input: { id: activeTaskId, status: newStatus } },
      optimisticResponse: {
        __typename: "Mutation",
        updateTask: {
          __typename: "Task",
          id: activeTaskId,
          status: newStatus,
          name: currentData.name ?? "",
          assignee: currentData.assignee ?? null,
          dueDate: currentData.dueDate ?? null,
          pointEstimate: currentData.pointEstimate ?? null,
          tags: currentData.tags ?? [],
          position: newPosition,
        },
      },
      update: (cache) => {
        cache.modify({
          id: cache.identify({ __typename: "Task", id: activeTaskId }),
          fields: {
            status: () => newStatus,
          },
        });
      },
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(KeyboardSensor),
  );

  return {
    activeTask,
    isDragging,
    optimisticTasks,
    pendingUpdates,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    setOptimisticTasks,
    tasksByStatus,
  };
};
