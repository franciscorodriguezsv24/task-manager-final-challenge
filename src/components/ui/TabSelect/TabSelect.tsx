import { Tab, TabGroup, TabList } from "@headlessui/react";
import styles from "./tabSelect.module.scss";

export const TabSelect = () => {
  return (
    <TabGroup className={styles.containerTab}>
      <TabList className={styles.buttonContainer}>
        <Tab className={styles.button}>Dashboard</Tab>
        <Tab className={styles.button}>Task</Tab>
      </TabList>
    </TabGroup>
  );
};
