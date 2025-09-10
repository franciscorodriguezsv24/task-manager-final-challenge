import type { ReactNode } from "react";

interface ModalProps {
  className: string;
  children: ReactNode;
}

export const ModalContainer = ({
  className,
  children,
  ...props
}: ModalProps) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};
