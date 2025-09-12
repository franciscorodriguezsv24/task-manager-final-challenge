import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className: string;
}

export const CardFooter = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};
