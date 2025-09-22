import styles from "./tasks.module.scss";
import {
  useGetColumnsQuery,
  useGetTasksQuery,
  type FilterTaskInput,
  type Task,
} from "../../../generated/graphql";
import useCardStore from "../../../store/useEditManager";
import { useMemo, useState, useEffect, useRef } from "react";
import { columnName } from "../../../hooks/columnName";
import { LoadingComponent } from "../../ui/loading/Loading";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  DragOverlay,
  rectIntersection,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useMutation } from "@apollo/client";
import { EDIT_TASK } from "../../../api/graphql/queries.graphql";
import { TaskColumn } from "../taskColumns/TaskColumns";
import { Cards } from "../cards/Cards";
import { useCustomToast } from "../../../hooks/UseCustomToast";

export const Tasks = () => {
  const { showToast } = useCustomToast();
  const { searchCardElement, filtersElement } = useCardStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [optimisticTasks, setOptimisticTasks] = useState<Task[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  const pendingUpdatesRef = useRef<Set<string>>(new Set());
  const prevSnapshotRef = useRef<Task[] | null>(null);

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

  const queryInput = useMemo(() => {
    const input: FilterTaskInput = {};

    if (searchCardElement) {
      input.name = searchCardElement;
    }

    if (filtersElement) {
      if (filtersElement.assigneeId) {
        input.assigneeId = filtersElement.assigneeId;
      }
      if (filtersElement.dueDate) {
        input.dueDate = filtersElement.dueDate;
      }
      if (filtersElement.pointEstimate) {
        input.pointEstimate = filtersElement.pointEstimate;
      }
      if (filtersElement.tags && filtersElement.tags.length > 0) {
        input.tags = filtersElement.tags;
      }
      if (filtersElement.status) {
        input.status = filtersElement.status;
      }
    }

    return input;
  }, [searchCardElement, filtersElement]);

  const lastTaskIdRef = useRef<string | null>(null);

  const { loading: isloadingCols, error: errorCols } = useGetColumnsQuery();
  const {
    loading: isloadingTasks,
    data: tasksData,
    error: errorData,
  } = useGetTasksQuery({
    variables: {
      input: queryInput,
    },
    context: {
      debounceKey: "1",
    },
    errorPolicy: "all",
  });

  useEffect(() => {
    if (tasksData?.tasks) {
      setOptimisticTasks(tasksData.tasks as Task[]);
    }
  }, [tasksData?.tasks]);

  const tasksToDisplay = useMemo(() => {
    if (pendingUpdates.size > 0 || isDragging) {
      return optimisticTasks;
    }
    const serverTasks = tasksData?.tasks || [];
    return serverTasks as Task[];
  }, [pendingUpdates.size, isDragging, optimisticTasks, tasksData?.tasks]);

  const tasksByStatus = useMemo(
    () =>
      tasksToDisplay?.reduce(
        (acc, task) => {
          acc[task.status] = acc[task.status]
            ? [...acc[task.status], task]
            : [task];
          return acc;
        },
        {} as Record<string, Task[]>,
      ) || {},
    [tasksToDisplay],
  );

  const orderedColumns = Object.keys(columnName).map((key) => ({
    name: key,
  }));

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

  const applyLocalStatusChange = (
    taskId: string,
    status: Task["status"],
  ): void => {
    setOptimisticTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t)),
    );
  };

  function handleDragStart(event: DragStartEvent) {
    const taskIdRaw = event.active.id as string;
    const taskId = taskIdRaw.replace("task:", "");

    const currentTask = tasksToDisplay.find((task) => task.id === taskId);
    setActiveTask(currentTask || null);
    setIsDragging(true);

    if (optimisticTasks.length !== tasksToDisplay.length) {
      setOptimisticTasks([...tasksToDisplay]);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    if (!isDragging) return;

    const activeIdRaw = event.active.id as string;
    const overIdRaw = event.over?.id as string;
    if (!overIdRaw) return;

    const activeId = activeIdRaw.replace("task:", "");
    const overIsCol = overIdRaw.startsWith("col:");
    const overId = overIsCol
      ? overIdRaw.replace("col:", "")
      : overIdRaw.replace("task:", "");

    const currentTask = optimisticTasks.find((task) => task.id === activeId);
    if (!currentTask) return;

    if (overIsCol) {
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
    const overIsCol = overIdRaw.startsWith("col:");
    const overId = overIsCol
      ? overIdRaw.replace("col:", "")
      : overIdRaw.replace("task:", "");

    if (pendingUpdatesRef.current.has(activeTaskId)) return;

    let newStatus: Task["status"] | null = null;
    if (overIsCol) {
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

  if (isloadingCols || isloadingTasks) return <LoadingComponent />;

  if (errorCols || errorData) {
    console.error("Query errors:", { errorCols, errorData });
    return <p>Unexpected Error</p>;
  }

  return (
    <div className={styles.tasksContainer}>
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={rectIntersection}
      >
        {orderedColumns.map((col) => (
          <SortableContext
            key={col.name}
            items={tasksByStatus[col.name]?.map((task) => task.id) || []}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn
              colName={col.name}
              tasks={tasksByStatus[col.name] || []}
            />
          </SortableContext>
        ))}

        <DragOverlay>
          {activeTask ? (
            <div
              style={{
                opacity: 0.9,
                cursor: "grabbing",
              }}
            >
              <Cards task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
