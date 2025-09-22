import { Text } from "../../ui/text/Text";
import { Cards } from "../cards/Cards";
import styles from "./tasks.module.scss";
import {
  useGetColumnsQuery,
  useGetTasksQuery,
  type FilterTaskInput,
} from "../../../generated/graphql";
import useCardStore from "../../../store/useEditManager";
import { useMemo } from "react";
import { RiCloseCircleLine } from "@remixicon/react";
import { columnName } from "../../../hooks/columnName";
import { LoadingComponent } from "../../ui/loading/Loading";

export const Tasks = () => {
  const { searchCardElement, filtersElement } = useCardStore();

  const queryInput = useMemo(() => {
    const input: FilterTaskInput = {};

    if (searchCardElement) {
      input.name = searchCardElement;
    }

    if (filtersElement) {
      if (filtersElement.assigneeId) {
        input.assigneeId = filtersElement.assigneeId; //
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
  });

  if (isloadingCols || isloadingTasks) return <LoadingComponent />;

  if (errorCols || errorData) return <p>Unexpected Error</p>;

  const tasksByStatus =
    tasksData?.tasks?.reduce(
      (acc, task) => {
        acc[task.status] = acc[task.status]
          ? [...acc[task.status], task]
          : [task];
        return acc;
      },
      {} as Record<string, typeof tasksData.tasks>,
    ) || {};

  const orderedColumns = Object.keys(columnName).map((key) => ({ name: key }));
  return (
    <div className={styles.tasksContainer}>
      {orderedColumns.map((col) => (
        <div key={col.name} className={styles.taskColumns}>
          <div className={styles.headerTask}>
            <Text variant="title">
              {columnName[col.name]} ({tasksByStatus[col.name]?.length || 0})
            </Text>
          </div>
          <div className={styles.tasks}>
            {tasksByStatus[col.name]?.length >= 0 ? (
              tasksByStatus[col.name].map((task) => (
                <Cards key={task.id} task={task} />
              ))
            ) : (
              <div className={styles.textUnavailable}>
                <RiCloseCircleLine />
                <Text variant="subtitle" className={styles.textError}>
                  No tasks available
                </Text>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
