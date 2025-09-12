import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className: string;
}

export const CardContainer = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};
