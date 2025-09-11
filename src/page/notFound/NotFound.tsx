import { RiErrorWarningLine } from "@remixicon/react";
import styles from "./notFound.module.scss";

export const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      <RiErrorWarningLine />
      The page was not found, please contact your company
    </div>
  );
};
