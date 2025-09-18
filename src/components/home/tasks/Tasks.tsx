import { Text } from "../../ui/text/Text";
import { Cards } from "../cards/Cards";
import styles from "./tasks.module.scss";
import {
  useGetColumnsQuery,
  useGetTasksQuery,
} from "../../../generated/graphql";
import useCardStore from "../../../store/useEditManager";

export const Tasks = () => {
  const { searchCardElement } = useCardStore();
  const {
    loading: isloadingCols,
    data: colsData,
    error: errorCols,
  } = useGetColumnsQuery();
  const {
    loading: isloadingTasks,
    data: tasksData,
    error: errorData,
  } = useGetTasksQuery({
    variables: {
      input: searchCardElement ? { name: searchCardElement } : {},
    },
  });

  if (isloadingCols || isloadingTasks)
    return (
      <div className={styles.spinnerContainer}>
        <span className={styles.loader}></span>
      </div>
    );

  if (errorCols || errorData) return <p>Unexpected Error</p>;

  const columns = colsData?.__type?.enumValues || [];

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

  return (
    <div className={styles.tasksContainer}>
      {columns.map((col) => (
        <div key={col.name} className={styles.taskColumns}>
          <div className={styles.headerTask}>
            <Text variant="title">
              {col.name}({tasksByStatus[col.name]?.length || 0})
            </Text>
          </div>
          <div className={styles.tasks}>
            {tasksByStatus[col.name]?.map((task) => (
              <Cards key={task.id} task={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
