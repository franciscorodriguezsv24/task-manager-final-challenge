import type { ReactNode } from "react";
import styles from "./button.module.scss";

interface ButtonProps {
  variant?: string;
  children: ReactNode;
  className?: string;
}

export const Button = ({
  variant = "button",
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button className={`${className} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
};
