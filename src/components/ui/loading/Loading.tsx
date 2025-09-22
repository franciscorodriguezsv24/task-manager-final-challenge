import styles from "./loading.module.scss";

export const LoadingComponent = () => {
  return (
    <div className={styles.spinnerContainer}>
      <span className={styles.loader}></span>
    </div>
  );
};
