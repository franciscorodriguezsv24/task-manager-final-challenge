import {
  OverlayArrow,
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  TooltipTrigger as AriaTooltipTrigger,
  type TooltipTriggerComponentProps,
} from "react-aria-components";

import styles from "./tooltip.module.scss";

export interface TooltipProps extends Omit<AriaTooltipProps, "children"> {
  children: React.ReactNode;
}

export function Tooltip({ children, ...props }: TooltipProps) {
  return (
    <AriaTooltip {...props} className={styles.reactAriaTooltip}>
      <OverlayArrow className={styles["react-aria-OverlayArrow"]}>
        <svg width={8} height={8} viewBox="0 0 8 8">
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </AriaTooltip>
  );
}

export function TooltipTrigger(props: TooltipTriggerComponentProps) {
  return <AriaTooltipTrigger {...props} />;
}
