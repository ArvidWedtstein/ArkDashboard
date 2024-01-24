import clsx from "clsx";
import { ReactNode, forwardRef, isValidElement } from "react";
import { formatNumber, isEmpty } from "src/lib/formatters";

type BadgeProps = {
  variant?: "standard" | "outlined";
  content?: React.ReactNode | string | number;
  color?:
  | "DEFAULT"
  | "primary"
  | "secondary"
  | "info"
  | "purple"
  | "success"
  | "warning"
  | "error"
  | "none";
  anchor?: {
    vertical?: "top" | "bottom";
    horizontal?: "left" | "right";
  };
  children?: ReactNode;
  max?: number;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  /**
   * @default false
   */
  showZero?: boolean;
  standalone?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
  title?: string;
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>((props, ref) => {
  const {
    anchor = {
      vertical: "top",
      horizontal: "right",
    },
    color = "DEFAULT",
    variant = "standard",
    size = 'medium',
    content,
    max = 99,
    showZero = false,
    standalone = false,
    fullWidth = false,
    children,
    className,
    title,
    onClick,
  } = props;

  const variants = {
    standard: {
      primary: "bg-primary-400 text-white",
      secondary: "text-white bg-secondary-500",
      info: "bg-sky-400 text-black/90",
      purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      success: "text-black/90 bg-success-500",
      warning: "text-black/90 bg-warning-400",
      error: "bg-error-500 text-white",
      DEFAULT: "dark:text-black/90 text-white bg-black dark:bg-white",
      none: "dark:text-white/90 text-black",
    },
    outlined: {
      primary: "bg-primary-400/10 text-primary-600 ring-1 ring-inset ring-primary-500/10 dark:text-primary-500 dark:ring-primary-400/30",
      secondary: "bg-secondary-300 text-secondary-600 ring-1 ring-inset ring-secondary-500/10 dark:bg-secondary-400/10 dark:text-secondary-400 dark:ring-secondary-400/20",
      info: "bg-blue-400/10 text-blue-700 ring-1 ring-inset ring-blue-700/30 dark:bg-blue-400/20 dark:text-blue-400 dark:ring-blue-400/30",
      purple: "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10 dark:bg-blue-400/10 dark:text-purple-400 dark:ring-purple-400/30",
      success: "bg-success-50 text-success-700 ring-success-600/20 dark:bg-success-500/10 dark:text-success-400 dark:ring-success-500/20 ring-1 ring-inset",
      warning: "bg-warning-50 text-warning-800 ring-1 ring-inset ring-warning-600/20 dark:bg-warning-400/10 dark:text-warning-500 dark:ring-warning-400/20",
      error: "bg-error-50 text-error-700 ring-1 ring-inset ring-error-600/10 dark:bg-error-400/10 dark:text-error-400 dark:ring-error-400/20",
      DEFAULT: "dark:bg-white/10 bg-black/10 ring-1 ring-inset dark:ring-white/30 ring-black/30 dark:text-white/90 text-black/70",
      none: "ring-1 ring-inset dark:ring-white/30 ring-black/30 dark:text-white/90 text-black/70"
    }
  }
  const sizes = {
    small: clsx({
      "min-w-[20px] min-h-[20px] p-0.5": !standalone,
      "px-1.5 py-0.5": standalone
    }),
    medium: clsx({
      "px-1 min-w-[20px] min-h-[20px]": !standalone,
      "px-2.5 py-1": standalone
    }),
    large: ``,
  }
  const classes = clsx("items-center text-xs",
    variants[variant][color],
    sizes[size],
    {
      "w-full": fullWidth,
      "-translate-x-1/2 left-0": anchor.horizontal == "left" && !standalone,
      "translate-x-1/2 right-0": anchor.horizontal == "right" && !standalone,
      "-translate-y-1/2 top-0": anchor.vertical === "top" && !standalone,
      "translate-y-1/2 bottom-0": anchor.vertical === "bottom" && !standalone,
      "origin-top-left":
        anchor.vertical === "top" && anchor.horizontal === "left" && !standalone,
      "origin-top-right":
        anchor.vertical === "top" && anchor.horizontal === "right" && !standalone,
      "origin-bottom-left":
        anchor.vertical === "bottom" && anchor.horizontal === "left" && !standalone,
      "origin-bottom-right":
        anchor.vertical === "bottom" && anchor.horizontal === "right" && !standalone,
      "rounded-xl absolute box-border flex flex-wrap place-content-center transition-all ease-in-out": !standalone,
      "inline-flex rounded font-medium": standalone
    }
  );

  let child: ReactNode | number = isValidElement(content)
    ? content
    : typeof content === "string" && /^\d+$/.test(content)
      ? parseInt(content)
      : content;

  return (
    <span className={clsx(className, {
      "relative": !isEmpty(children),
      "cursor-pointer select-none": onClick
    })}
      onClick={onClick}
      title={title}
    >
      {children}
      <span className={clsx(classes, {
        "hidden": typeof child === "number" && child === 0 && !showZero
      })} ref={ref}>
        {max && typeof child === "number"
          ? child > max
            ? `${max}+`
            : formatNumber(child)
          : child}
      </span>
    </span>
  )
});

export default Badge;
