import { Outlet } from "react-router";
import { Sidebar } from "./components/layout/sidebar/Sidebar";
import styles from "./layout.module.scss";
import { SearchBar } from "./components/layout/searchbar/SearchBar";

export const Layout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>
      <div className={styles.contentContainer}>
        <SearchBar />
        <Outlet />
      </div>
    </div>
  );
};
