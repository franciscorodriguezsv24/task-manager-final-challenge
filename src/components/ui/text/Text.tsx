import type { ReactNode } from "react";
import styles from "./text.module.scss";

interface TextProps {
  variant: string;
  children: ReactNode;
  className?: string;
}

export const Text = ({
  variant = "subtile",
  className,
  children,
  ...props
}: TextProps) => {
  return (
    <p className={`${className} ${styles[variant]}`} {...props}>
      {children}
    </p>
  );
};
