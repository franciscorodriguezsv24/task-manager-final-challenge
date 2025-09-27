import { RiGalleryView2, RiMenuLine } from "@remixicon/react";
import { Button } from "../../components/ui/button/Button";
import styles from "./home.module.scss";
import { Tasks } from "../../components/home/tasks/Tasks";
import { CreateTask } from "../../components/home/createTask/CreateTask";
import { Filters } from "../../components/home/filters/Filters";
import { TabSelect } from "../../components/ui/TabSelect/TabSelect";
import { FilterBadge } from "../../components/home/filters/filterBadge/FilterBadge";
import { useState } from "react";
import { TaskList } from "../../components/home/taskList/TaskList";

export const Home = () => {
  const [viewType, setViewType] = useState<string>("dashboard");

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.buttonContainer}>
        <div className={styles.layoutButtonContainer}>
          <Button
            variant={viewType == "dashboard" ? "default" : "primary"}
            className={styles.buttons}
            onClick={() => setViewType("list")}
          >
            <RiMenuLine />
          </Button>
          <Button
            variant={viewType == "dashboard" ? "primary" : "default"}
            className={styles.buttons}
            onClick={() => setViewType("dashboard")}
          >
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
        <FilterBadge />
        <TabSelect setViewType={setViewType} />
      </div>

      <div className={styles.tasksArea} data-testid="action-tasks">
        {viewType === "dashboard" ? <Tasks /> : <TaskList />}
      </div>
    </div>
  );
};
