import { useDroppable } from "@dnd-kit/core";
import { RiCloseCircleLine } from "@remixicon/react";
import { Text } from "../../ui/text/Text";
import { Cards } from "../cards/Cards";
import styles from "./taskColumns.module.scss";
import { columnName } from "../../../hooks/columnName";
import type { Task } from "../../../generated/graphql";

interface Props {
  colName: string;
  tasks?: Task[];
}

export const TaskColumn = ({ colName, tasks }: Props) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `col:${colName}`,
  });

  return (
    <div className={styles.taskColumns}>
      <div className={styles.headerTask}>
        <Text variant="title">
          {columnName[colName]} ({tasks?.length || 0})
        </Text>
      </div>

      <div
        ref={setNodeRef}
        className={`${styles.tasks} ${isOver ? styles.isOver : ""}`}
      >
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => <Cards key={task.id} task={task} />)
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
  );
};
