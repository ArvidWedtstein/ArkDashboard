import clsx from "clsx";
import { ReactNode, forwardRef } from "react";

type BadgeProps = {
  variant?: "standard";
  content?: React.ReactNode | string | number;
  color?:
    | "DEFAULT"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error";
  anchor?: {
    vertical?: "top" | "bottom";
    horizontal?: "left" | "right";
  };
  max?: number;
  showZero?: boolean;
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>((props, ref) => {
  const {
    anchor = {
      vertical: "top",
      horizontal: "right",
    },
    color = "DEFAULT",
    content,
    max = 99,
    showZero = false,
  } = props;
  const colors = {
    primary: "bg-blue-400 text-white",
    secondary: "text-white bg-zinc-500",
    info: "bg-sky-400 text-black/90",
    success: "text-black/90 bg-green-500",
    warning: "text-black/90 bg-orange-400",
    error: "bg-red-500 text-white",
    DEFAULT: "dark:text-black/90 text-white bg-black dark:bg-white",
  };
  const classes = clsx(
    "absolute h-5 min-w-[20px] box-border flex flex-wrap place-content-center items-center rounded-xl transition-all ease-in-out px-1 text-xs",
    colors[color],
    {
      "-translate-x-1/2 left-0": anchor.horizontal == "left",
      "translate-x-1/2 right-0": anchor.horizontal == "right",
      "-translate-y-1/2 top-0": anchor.vertical === "top",
      "translate-y-1/2 bottom-0": anchor.vertical === "bottom",
      "origin-top-left":
        anchor.vertical === "top" && anchor.horizontal === "left",
      "origin-top-right":
        anchor.vertical === "top" && anchor.horizontal === "right",
      "origin-bottom-left":
        anchor.vertical === "bottom" && anchor.horizontal === "left",
      "origin-bottom-right":
        anchor.vertical === "bottom" && anchor.horizontal === "right",
    }
  );

  let child: ReactNode | number = isNaN(parseInt(content.toString()))
    ? content
    : typeof content === "string"
    ? parseInt(content)
    : content;
  return (
    <span className={classes} ref={ref}>
      {max && typeof child === "number"
        ? child > max
          ? `${max}+`
          : child === 0 && showZero
          ? child
          : ""
        : child}
    </span>
  );
});

export default Badge;
