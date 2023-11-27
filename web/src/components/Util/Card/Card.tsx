import { Link } from "@redwoodjs/router";
import clsx from "clsx";
import {
  AnchorHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  ImgHTMLAttributes,
  LegacyRef,
  MouseEventHandler,
  ReactNode,
  Ref,
  forwardRef,
  useRef,
} from "react";
import Ripple from "../Ripple/Ripple";
import { useRipple } from "src/components/useRipple";

type CardProps = {
  sx?: CSSProperties;
  children?: ReactNode | ReactNode[];
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
export const Card = ({ sx, children, className, ...props }: CardProps) => {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded bg-zinc-300 text-black dark:bg-zinc-800 dark:text-white",
        className
      )}
      style={{
        ...sx,
        backgroundImage: !!sx?.backgroundImage
          ? sx?.backgroundImage
          : `linear-gradient(#ffffff0d, #ffffff0d)`,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

type CardHeaderProps = {
  sx?: CSSProperties;
  avatar?: ReactNode;
  action?: ReactNode;
  title?: ReactNode;
  subheader?: ReactNode;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  titleProps?: HTMLAttributes<HTMLSpanElement>;
  subheaderProps?: HTMLAttributes<HTMLSpanElement>;
};
export const CardHeader = ({
  sx,
  avatar,
  title,
  titleProps,
  subheader,
  subheaderProps,
  action,
  className,
}: CardHeaderProps) => {
  return (
    <div
      className={clsx(
        "relative flex items-center justify-start p-4",
        className
      )}
      style={sx}
    >
      {avatar && <div className="mr-4 flex flex-[0_0_auto]">{avatar}</div>}
      {(title || subheader) && (
        <div className="flex-[1_1_auto]">
          {title && (
            <span {...titleProps} className={clsx("font-montserrat m-0 block text-sm font-normal leading-[1.43]", titleProps?.className)}>
              {title}
            </span>
          )}
          {subheader && (
            <span {...subheaderProps} className={clsx("font-montserrat m-0 block text-sm font-normal leading-[1.43] text-black/70 dark:text-white/70", subheaderProps?.className)}>
              {subheader}
            </span>
          )}
        </div>
      )}
      {action && (
        <div className="-my-1 -mr-2 flex-[0_0_auto] self-start">{action}</div>
      )}
    </div>
  );
};

type CardMediaImgProps = {
  alt: string;
  height: number | string;
};

type CardMediaBaseProps = {
  component?: "div" | "img";
  image: string;
  title?: string;
  sx?: CSSProperties;
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

type CardMediaImg = CardMediaBaseProps &
  CardMediaImgProps &
  ImgHTMLAttributes<HTMLImageElement>;

type CardMediaDiv = CardMediaBaseProps & {
  children?: ReactNode;
};

type CardMediaProps = CardMediaDiv | CardMediaImg;
export const CardMedia = ({ component = "img", ...props }: CardMediaProps) => {
  if (component === "img") {
    const { alt, height, className, image, ...imgprops } = props as CardMediaImg;
    return (
      <img
        className={className}
        src={image}
        style={props.sx}
        title={props.title}
        alt={alt}
        height={height}
        {...imgprops}
      />
    );
  } else {
    const { sx, image, title, className, children } = props;
    return (
      <div
        className={clsx("block !bg-cover bg-center bg-no-repeat", className)}
        role="img"
        style={{
          ...sx,
          backgroundImage: `url(${image})`,
        }}
        title={title}
      >
        {children}
      </div>
    );
  }
};

type CardContentProps = {
  children?: ReactNode | ReactNode[];
  sx?: CSSProperties;
  className?: HTMLAttributes<HTMLDivElement>["className"];
};
export const CardContent = ({ children, sx, className }: CardContentProps) => {
  return (
    <div className={clsx("p-4", className)} style={sx}>
      {children}
    </div>
  );
};

type CardActionsProps = {
  children?: ReactNode | ReactNode[];
  className?: HTMLAttributes<HTMLDivElement>["className"];
  sx?: CSSProperties;
};

export const CardActions = ({ children, className, sx }: CardActionsProps) => {
  return (
    <div style={sx} className={clsx("flex items-center p-2", className)}>
      {children}
    </div>
  );
};

type CardActionAreaBaseProps = CardActionsProps & {
  disabled?: boolean;
  disableRipple?: boolean
  component?: "link" | "button";
};

type ButtonProps = CardActionAreaBaseProps & HTMLAttributes<HTMLButtonElement>;
type LinkProps = CardActionAreaBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    to: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
  };

type CardActionAreaProps = ButtonProps | LinkProps;
export const CardActionArea = forwardRef((props: CardActionAreaProps, ref) => {
  const { children,
    sx,
    className,
    component = "button",
    ...other
  } = props;
  const rippleRef = useRef(null);
  const { enableRipple, getRippleHandlers } = useRipple({
    disabled: other.disabled,
    disableRipple: other.disableRipple,
    rippleRef
  })
  if (component === "button" && (!(props as LinkProps).href && !(props as LinkProps).to)) {
    return (
      <button
        className={clsx(
          "relative m-0 box-border block w-full cursor-pointer select-none rounded-[inherit] bg-transparent text-inherit",
          className
        )}
        tabIndex={0}
        type="button"
        style={sx}
        ref={ref as Ref<HTMLButtonElement>}
        {...getRippleHandlers(props)}
        {...(other as ButtonProps)}
      >
        {children}
        {enableRipple ? <Ripple ref={rippleRef} /> : null}
      </button>
    );
  }

  return (
    <Link
      className={clsx(
        "relative m-0 box-border block w-full cursor-pointer select-none rounded-[inherit] bg-transparent text-inherit",
        className
      )}
      tabIndex={0}
      style={sx}
      ref={ref as Ref<HTMLAnchorElement>}
      {...getRippleHandlers(props)}
      {...(other as LinkProps)}
    >
      {children}
      {enableRipple ? <Ripple ref={rippleRef} /> : null}
    </Link>
  );
});
