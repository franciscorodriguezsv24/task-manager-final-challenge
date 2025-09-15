import type { ReactNode } from "react";
import styles from "./button.module.scss";

interface ButtonProps {
  variant?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Button = ({
  variant = "button",
  children,
  className,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${className} ${styles[variant]}`}
      {...props}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
