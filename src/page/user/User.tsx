import { UserElement } from "../../components/user/User/UserElement";
import styles from "./user.module.scss";

export const User = () => {
  return (
    <div className={styles.container}>
      <UserElement />
    </div>
  );
};
