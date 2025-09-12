import type { ReactNode } from "react";
import styles from "./text.module.scss";

interface TextProps {
  variant?: string;
  children: ReactNode;
}

export const Text = ({ variant = "text", children, ...props }: TextProps) => {
  return (
    <p className={`${styles.text} ${styles[variant]}`} {...props}>
      {children}
    </p>
  );
};
