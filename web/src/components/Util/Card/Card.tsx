import { Link } from "@redwoodjs/router";
import clsx from "clsx";
import {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  ForwardedRef,
  HTMLAttributes,
  ImgHTMLAttributes,
  MouseEventHandler,
  ReactNode,
  Ref,
  RefAttributes,
  forwardRef,
  useRef,
} from "react";
import Ripple from "../Ripple/Ripple";
import { useRipple } from "src/components/useRipple";
import { IntRange } from "src/lib/formatters";
import Text from "../Text/Text";

export type CardProps = {
  children?: ReactNode | ReactNode[];
  variant?: "standard" | "outlined" | "elevation" | "gradient";
  elevation?: IntRange<0, 7>;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const {
    style,
    children,
    className,
    variant = "standard",
    elevation = variant === "elevation" ? 1 : 0,
    ...other
  } = props;
  return (
    <div
      ref={ref}
      className={clsx(
        "relative overflow-hidden rounded text-black dark:text-white",
        className,
        {
          "border border-black/30 dark:border-white/30": variant === "outlined",
          "bg-zinc-300 dark:bg-zinc-800": variant !== "gradient",
          "dark:bg-gradient-to-tr dark:from-zinc-800 dark:to-zinc-900 bg-gradient-to-tr from-zinc-200 to-zinc-300 border border-zinc-500 dark:border-zinc-700": variant === 'gradient',
          "shadow-sm": variant === "elevation" && elevation === 1,
          shadow: variant === "elevation" && elevation === 2,
          "shadow-md": variant === "elevation" && elevation === 3,
          "shadow-lg": variant === "elevation" && elevation === 4,
          "shadow-xl": variant === "elevation" && elevation === 5,
          "shadow-2xl": variant === "elevation" && elevation === 6,
        }
      )}
      style={{
        ...style,
        ...(variant !== 'gradient' ? {
          backgroundImage: !!style?.backgroundImage
            ? style?.backgroundImage
            : `linear-gradient(#ffffff0d, #ffffff0d)`
        } : {}),
      }}
      {...other}
    >
      {children}
    </div>
  );
});

type CardHeaderProps = {
  avatar?: ReactNode;
  action?: ReactNode;
  title?: ReactNode;
  subheader?: ReactNode;
  titleProps?: HTMLAttributes<HTMLSpanElement>;
  subheaderProps?: HTMLAttributes<HTMLSpanElement>;
} & DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>((props, ref) => {
  const {
    avatar,
    title,
    titleProps,
    subheader,
    subheaderProps,
    action,
    className,
    ...other
  } = props;
  return (
    <div
      className={clsx(
        "relative flex items-center justify-start p-4",
        className
      )}
      ref={ref}
      {...other}
    >
      {avatar && <div className="mr-4 flex flex-[0_0_auto]">{avatar}</div>}
      {(title || subheader) && (
        <div className="flex-[1_1_auto]">
          {title && (
            <Text variant="body2" {...titleProps} className={clsx("block", titleProps?.className)}>
              {title}
            </Text>
          )}


          {subheader && (
            <Text variant="body2" {...subheaderProps} className={clsx("block text-black/70 dark:text-white/70", subheaderProps?.className)}>
              {subheader}
            </Text>
          )}
        </div>
      )}
      {action && (
        <div className="-my-1 -mr-2 flex-[0_0_auto] self-start">{action}</div>
      )}
    </div>
  );
});

type CardMediaImgProps = {
  alt: string;
  height: number | string;
};

type CardMediaBaseProps = {
  component?: "div" | "img";
  image: string;
  title?: string;
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

type CardMediaImg = CardMediaBaseProps &
  CardMediaImgProps &
  ImgHTMLAttributes<HTMLImageElement>;

type CardMediaDiv = CardMediaBaseProps & {
  children?: ReactNode;
} & DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

type CardMediaProps = CardMediaDiv | CardMediaImg;
export const CardMedia = forwardRef<HTMLImageElement | HTMLDivElement, CardMediaProps>((props, ref) => {
  const { component = "img", ...other } = props;
  if (component === "img") {
    const { alt, height, className, image, ...imgprops } =
      other as CardMediaImg;
    return (
      <img
        ref={ref as ForwardedRef<HTMLImageElement>}
        className={className}
        src={image}
        alt={alt}
        height={height}
        {...imgprops}
      />
    );
  } else {
    const { style, image, className, children, ...divProps } = other;
    return (
      <div
        ref={ref}
        className={clsx("block !bg-cover bg-center bg-no-repeat", className)}
        role="img"
        style={{
          ...style,
          background: `url(${image})`,
        }}
        {...divProps}
      >
        {children}
      </div>
    );
  }
});

type CardContentProps = {
  children?: ReactNode | ReactNode[];
  className?: HTMLAttributes<HTMLDivElement>["className"];
} & DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>((props, ref) => {
  const { children, className, ...other } = props;
  return (
    <div ref={ref} className={clsx("p-4", className)} {...other}>
      {children}
    </div>
  );
});

type CardActionsProps = {
  children?: ReactNode | ReactNode[];
} & DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>((props, ref) => {
  const { children, className, ...other } = props;
  return (
    <div ref={ref} className={clsx("flex items-center p-2", className)} {...other}>
      {children}
    </div>
  );
});

type CardActionAreaBaseProps = CardActionsProps & {
  disabled?: boolean;
  disableRipple?: boolean;
  component?: "link" | "button";
};

type ButtonProps = CardActionAreaBaseProps & DetailedHTMLProps<
  HTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
type LinkProps = CardActionAreaBaseProps & {
  to: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
} & DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & RefAttributes<HTMLAnchorElement>;

type CardActionAreaProps = ButtonProps | LinkProps;
export const CardActionArea = forwardRef<HTMLAnchorElement | HTMLButtonElement, CardActionAreaProps>((props, ref) => {
  const { children, className, component = "button", ...other } = props;
  const rippleRef = useRef(null);
  const { enableRipple, getRippleHandlers } = useRipple({
    disabled: other.disabled,
    disableRipple: other.disableRipple,
    rippleRef,
  });
  if (
    component === "button" &&
    !(props as LinkProps).href &&
    !(props as LinkProps).to
  ) {
    return (
      <button
        className={clsx(
          "relative m-0 box-border block w-full cursor-pointer select-none rounded-[inherit] bg-transparent text-inherit",
          className
        )}
        tabIndex={0}
        type="button"
        ref={ref as ForwardedRef<HTMLButtonElement>}
        {...getRippleHandlers(props)}
        {...(other as ButtonProps)}
      >
        {children}
        {enableRipple ? <Ripple ref={rippleRef} /> : null}
      </button>
    );
  } else {
    return (
      <Link
        className={clsx(
          "relative m-0 box-border block w-full cursor-pointer select-none rounded-[inherit] bg-transparent text-inherit",
          className
        )}
        tabIndex={0}
        ref={ref as ForwardedRef<HTMLAnchorElement>}
        {...getRippleHandlers(props)}
        {...(other as LinkProps)}
      >
        {children}
        {enableRipple ? <Ripple ref={rippleRef} /> : null}
      </Link>
    )
  }
});
