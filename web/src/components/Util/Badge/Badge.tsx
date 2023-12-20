import clsx from "clsx";
import { ReactNode, forwardRef, isValidElement } from "react";
import { isEmpty } from "src/lib/formatters";

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
  | "error";
  anchor?: {
    vertical?: "top" | "bottom";
    horizontal?: "left" | "right";
  };
  children?: ReactNode;
  max?: number;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
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
      primary: "bg-blue-400 text-white",
      secondary: "text-white bg-zinc-500",
      info: "bg-sky-400 text-black/90",
      purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      success: "text-black/90 bg-green-500",
      warning: "text-black/90 bg-orange-400",
      error: "bg-red-500 text-white",
      DEFAULT: "dark:text-black/90 text-white bg-black dark:bg-white",
    },
    outlined: {
      primary: "bg-blue-400/10 text-blue-600 ring-1 ring-inset ring-blue-500/10 dark:text-blue-500 dark:ring-blue-400/30",
      secondary: "bg-zinc-300 text-zinc-600 ring-1 ring-inset ring-zinc-500/10 dark:bg-zinc-400/10 dark:text-zinc-400 dark:ring-zinc-400/20",
      info: "bg-blue-400/10 text-blue-700 ring-1 ring-inset ring-blue-700/30 dark:bg-blue-400/20 dark:text-blue-400 dark:ring-blue-400/30",
      purple: "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10 dark:bg-blue-400/10 dark:text-purple-400 dark:ring-purple-400/30",
      success: "bg-pea-50 text-pea-700 ring-pea-600/20 dark:bg-pea-500/10 dark:text-pea-400 dark:ring-pea-500/20 ring-1 ring-inset",
      warning: "bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20",
      error: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20",
      DEFAULT: "dark:bg-white/10 bg-black/10 ring-1 ring-inset dark:ring-white/30 ring-black/30 dark:text-white/90 text-black/70"
    }
  }
  const sizes = {
    small: clsx({
      "px-1 min-w-[20px] h-5": !standalone,
      "px-1.5 py-0.5": standalone
    }),
    medium: clsx({
      "px-1 min-w-[20px] h-5": !standalone,
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
    <span className={clsx("inline-flex flex-shrink-0", className, {
      "relative": !isEmpty(children),
      "cursor-pointer select-none": onClick
    })}
      onClick={onClick}
      title={title}
    >
      {children}
      <span className={classes} ref={ref}>
        {max && typeof child === "number"
          ? child > max
            ? `${max}+`
            : child === 0 && !showZero
              ? ""
              : child
          : child}
      </span>
    </span>
  )
});

export default Badge;
