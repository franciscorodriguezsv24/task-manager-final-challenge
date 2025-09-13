import { RiGalleryView2, RiMenuLine } from "@remixicon/react";
import { Button } from "../../components/ui/button/Button";
import styles from "./home.module.scss";
import { Tasks } from "../../components/home/tasks/Tasks";
import { CreateTask } from "../../components/home/createTask/CreateTask";

export const Home = () => {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.buttonContainer}>
        <div className={styles.layoutButtonContainer}>
          <Button variant="default" className={styles.buttons}>
            <RiMenuLine />
          </Button>
          <Button variant="primary" className={styles.buttons}>
            <RiGalleryView2 />
          </Button>
        </div>
        <CreateTask />
      </div>
      <div className={styles.tasksArea}>
        <Tasks />
      </div>
    </div>
  );
};
