import type { ReactNode } from "react";
import styles from "./button.module.scss";

interface ButtonProps {
  variant?: string;
  children: ReactNode;
}

export const Button = ({
  variant = "button",
  children,
  ...props
}: ButtonProps) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
};
