import { RiGalleryView2, RiMenuLine } from "@remixicon/react";
import { Button } from "../../components/ui/button/Button";
import styles from "./home.module.scss";
import { Tasks } from "../../components/home/tasks/Tasks";
import { CreateTask } from "../../components/home/createTask/CreateTask";
import { Filters } from "../../components/home/filters/Filters";
import { TabSelect } from "../../components/ui/TabSelect/TabSelect";
import { FilterBadge } from "../../components/home/filters/filterBadge/FilterBadge";

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
        <div className={styles.actionContainer} data-testid="action-container">
          <FilterBadge />
          <Filters />
          <CreateTask />
        </div>
      </div>
      <div className={styles.tabSelectedContainer}>
        <TabSelect />
      </div>
      <div className={styles.tasksArea} data-testid="action-tasks">
        <Tasks />
      </div>
    </div>
  );
};
