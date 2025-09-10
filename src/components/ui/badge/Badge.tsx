import type { ReactNode } from "react";
import styles from "./badge.module.scss";

interface BadgeProps {
  variant?: string;
  children: ReactNode;
}

export const Badge = ({
  variant = "badge",
  children,
  ...props
}: BadgeProps) => {
  return (
    <button className={`${styles.badge} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
};
