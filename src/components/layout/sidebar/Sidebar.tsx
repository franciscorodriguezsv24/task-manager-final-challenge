import styles from "./sidebar.module.scss";
import Logo from "../../../assets/Logo.svg";
import { Link } from "react-router";
import { RiGalleryView2, RiMenuLine, RiAddCircleFill } from "@remixicon/react";

export const Sidebar = () => {
  return (
    <div className={styles.sidebarContainer}>
      <img src={Logo} alt="logo-ravn" className={styles.logoImg} />
      <div className={styles.linkContainer}>
        <Link to="/" className={styles.linkElement}>
          <RiGalleryView2 className={styles.linkIcon} />
          Dashboard
        </Link>
        <button className={styles.buttonMobile}>
          <RiAddCircleFill className={styles.linkIcon} />
          Add Project
        </button>
        <Link to="my-task" className={styles.linkElement}>
          <RiMenuLine className={styles.linkIcon} />
          My Task
        </Link>
      </div>
    </div>
  );
};
