import styles from "./tasks.module.scss";
import {
  useGetColumnsQuery,
  useGetTasksQuery,
  type FilterTaskInput,
  type Task,
} from "../../../generated/graphql";
import useCardStore from "../../../store/useEditManager";
import { useMemo, useEffect } from "react";
import { columnName } from "../../../hooks/columnName";
import { LoadingComponent } from "../../ui/loading/Loading";
import { DndContext, DragOverlay, rectIntersection } from "@dnd-kit/core";
import { TaskColumn } from "../taskColumns/TaskColumns";
import { Cards } from "../cards/Cards";
import { useDragAndDrop } from "../../../hooks/useDragAndDrop";

export const Tasks = () => {
  const { searchCardElement, filtersElement } = useCardStore();

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

  const tasksToDisplay = useMemo(() => {
    const serverTasks = tasksData?.tasks || [];
    return serverTasks as Task[];
  }, [tasksData?.tasks]);

  const {
    activeTask,
    isDragging,
    optimisticTasks,
    pendingUpdates,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    setOptimisticTasks,
  } = useDragAndDrop({
    tasks: tasksToDisplay,
    tasksData: tasksData ? { tasks: tasksToDisplay } : undefined,
  });

  useEffect(() => {
    if (tasksData?.tasks) {
      setOptimisticTasks(tasksData.tasks as Task[]);
    }
  }, [tasksData?.tasks, setOptimisticTasks]);

  const finalTasksToDisplay = useMemo(() => {
    if (pendingUpdates.size > 0 || isDragging) {
      return optimisticTasks;
    }
    return tasksToDisplay;
  }, [pendingUpdates.size, isDragging, optimisticTasks, tasksToDisplay]);

  const finalTasksByStatus = useMemo(
    () =>
      finalTasksToDisplay?.reduce(
        (acc, task) => {
          acc[task.status] = acc[task.status]
            ? [...acc[task.status], task]
            : [task];
          return acc;
        },
        {} as Record<string, Task[]>,
      ) || {},
    [finalTasksToDisplay],
  );

  const orderedColumns = Object.keys(columnName).map((key) => ({
    name: key,
  }));

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
          <TaskColumn
            key={col.name}
            colName={col.name}
            tasks={finalTasksByStatus[col.name] || []}
          />
        ))}

        <DragOverlay>
          {activeTask ? (
            <div
              style={{
                opacity: 0.5,
                cursor: "grabbing",
                filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))",
                zIndex: 9999,
                pointerEvents: "none",
                scale: "1.0",
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
