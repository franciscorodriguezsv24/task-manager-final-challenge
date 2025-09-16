import styles from "./sidebar.module.scss";
import Logo from "../../../assets/Logo.svg";
import { Link, useLocation } from "react-router";
import { RiGalleryView2, RiMenuLine } from "@remixicon/react";
import { CreateTask } from "../../home/createTask/CreateTask";

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className={styles.sidebarContainerElement}>
      <img src={Logo} alt="logo-ravn" className={styles.logoImg} />
      <div className={styles.linkContainer}>
        <Link
          to="/"
          className={`${styles.linkElement} ${location.pathname === "/" && styles.active}`}
        >
          <RiGalleryView2 className={styles.linkIcon} />
          Dashboard
        </Link>
        <div className={styles.buttonMobile}>
          <CreateTask />
        </div>
        <Link
          to="my-task"
          className={`${styles.linkElement} ${location.pathname === "/my-task" && styles.active}`}
        >
          <RiMenuLine className={styles.linkIcon} />
          My Task
        </Link>
      </div>
    </div>
  );
};
