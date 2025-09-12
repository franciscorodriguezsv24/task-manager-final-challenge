import type { ReactNode } from "react";

interface ModalProps {
  className: string;
  children: ReactNode;
}

export const ModalHeader = ({ className, children, ...props }: ModalProps) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};
