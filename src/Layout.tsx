import { Outlet } from "react-router";
import { Sidebar } from "./components/layout/sidebar/Sidebar";
import styles from "./layout.module.scss";

export const Layout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>
      <div className={styles.contentContainer}>
        <Outlet />
      </div>
    </div>
  );
};
