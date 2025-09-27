import { Outlet } from "react-router";
import { Sidebar } from "./components/layout/sidebar/Sidebar";
import styles from "./layout.module.scss";
import { SearchBar } from "./components/layout/searchbar/SearchBar";
import { Toaster } from "sonner";
import { UseMediaQuery } from "./hooks/UseMediaQuery";

export const Layout = () => {
  const isMobile = UseMediaQuery("(max-width: 880px)");
  return (
    <>
      <div className={styles.container}>
        <div className={styles.sidebarContainer}>
          <Sidebar />
        </div>
        <div className={styles.contentContainer}>
          <SearchBar />
          <Outlet />
        </div>
      </div>
      <Toaster position={isMobile ? "top-center" : "bottom-right"} />
    </>
  );
};
