import type { ReactNode } from "react";
import styles from "./badge.module.scss";

interface BadgeProps {
  variant?: string;
  children: ReactNode;
  date?: Date | string | null;
}

export const Badge = ({
  variant = "badge",
  children,
  date,
  ...props
}: BadgeProps) => {
  let computedVariant = variant;

  if (date) {
    const dueDate = new Date(date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    switch (true) {
      case dueDate.getTime() < today.getTime():
        computedVariant = "warning";
        break;
      case dueDate.getTime() === today.getTime():
        computedVariant = "secondary";
        break;
      case dueDate.getTime() > today.getTime():
        computedVariant = "primary";
        break;
      default:
        computedVariant = variant;
    }
  }

  return (
    <button className={`${styles.badge} ${styles[computedVariant]}`} {...props}>
      {children}
    </button>
  );
};
