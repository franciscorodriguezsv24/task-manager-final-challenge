import type { ReactNode } from "react";
import styles from "./button.module.scss";

interface ButtonProps {
  variant?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const Button = ({
  variant = "button",
  children,
  className,
  disabled,
  onClick,
  type,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${className} ${styles[variant]}`}
      {...props}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};
