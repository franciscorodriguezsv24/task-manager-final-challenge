import { Tab, TabGroup, TabList } from "@headlessui/react";
import styles from "./tabSelect.module.scss";

interface TabSelectProps {
  setViewType: React.Dispatch<React.SetStateAction<string>>;
}

export const TabSelect = ({ setViewType }: TabSelectProps) => {
  return (
    <TabGroup className={styles.containerTab}>
      <TabList className={styles.buttonContainer}>
        <Tab className={styles.button} onClick={() => setViewType("dashboard")}>
          Dashboard
        </Tab>
        <Tab className={styles.button} onClick={() => setViewType("list")}>
          Task
        </Tab>
      </TabList>
    </TabGroup>
  );
};
