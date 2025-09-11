import { Text } from "../../ui/text/Text";
import { Cards } from "../cards/Cards";
import styles from "./tasks.module.scss";

export const Tasks = () => {
  return (
    <div className={styles.tasksContainer}>
      <div className={styles.taskColumns}>
        <div className={styles.headerTask}>
          <Text>Working</Text>
        </div>
        <div className={styles.tasks}>
          <Cards />
          <Cards />
          <Cards />
          <Cards />
          <Cards />
        </div>
      </div>

      <div className={styles.taskColumns}>
        <Text>Progress</Text>
        <div className={styles.tasks}>
          <Cards />
        </div>
      </div>

      <div className={styles.taskColumns}>
        <Text>Done</Text>
        <div className={styles.tasks}>
          <Cards />
        </div>
      </div>
    </div>
  );
};
