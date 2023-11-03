import { Link } from "@redwoodjs/router";
import clsx from "clsx";
import { CSSProperties, HTMLAttributes, ImgHTMLAttributes, LinkHTMLAttributes, ReactNode } from "react";
import Ripple from "../Ripple/Ripple";

type CardProps = {
  sx?: CSSProperties;
  children?: ReactNode | ReactNode[];
  className?: HTMLAttributes<HTMLDivElement>["className"];
};
export const Card = ({ sx, children, className }: CardProps) => {
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
    >
      {children}
    </div>
  );
};

type CardHeaderProps = {
  sx?: CSSProperties;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  title?: string;
  subheader?: string;
  className?: HTMLAttributes<HTMLDivElement>["className"];
};
export const CardHeader = ({
  sx,
  avatar,
  title,
  subheader,
  action,
  className,
}: CardHeaderProps) => {
  return (
    <div className={clsx("relative flex items-center justify-start p-4", className)} style={sx}>
      {avatar && <div className="mr-4 flex flex-[0_0_auto]">{avatar}</div>}
      {(title || subheader) && (
        <div className="flex-[1_1_auto]">
          {title && (
            <span className="font-montserrat m-0 block text-sm font-normal leading-[1.43]">
              {title}
            </span>
          )}
          {subheader && (
            <span className="font-montserrat m-0 block text-sm font-normal leading-[1.43] text-black/70 dark:text-white/70">
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
}

type CardMediaBaseProps = {
  component?: "div" | "img";
  image: string;
  title?: string;
  sx?: CSSProperties;
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

type CardMediaImg = CardMediaBaseProps & CardMediaImgProps & ImgHTMLAttributes<HTMLImageElement>;

type CardMediaProps = CardMediaBaseProps | CardMediaImg;
export const CardMedia = ({ component = "img", ...props }: CardMediaProps) => {
  if (component === "img") {
    const { alt, height, className, ...imgprops } = props as CardMediaImg;
    return (
      <img
        className={className}
        src={props.image}
        style={props.sx}
        title={props.title}
        alt={alt}
        height={height}
        {...imgprops}
      />
    );
  } else {
    const { sx, image, title, className } = props;
    return (
      <div
        className={clsx("block !bg-cover bg-center bg-no-repeat", className)}
        role="img"
        style={{
          ...sx,
          backgroundImage: `url(${image})`,
        }}
        title={title}
      />
    );
  }
};

type CardContentProps = {
  children?: React.ReactNode | React.ReactNode[];
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


// type CommonProps = {
//   component?: "a" | "button";
// };

// type ButtonProps = CommonProps & HTMLAttributes<HTMLButtonElement>;
// type LinkProps = CommonProps & LinkHTMLAttributes<HTMLAnchorElement>;

// type Props = ButtonProps | LinkProps;

// const UniversalButton: React.FC<Props> = ({ component = 'button', ...props }) => {
//   if (component = 'a') {
//     const { href, ...linkProps } = props as LinkProps;
//     return <a href={href} {...linkProps} />;
//   } else {
//     const buttonProps = props as ButtonProps;
//     return <button {...buttonProps} />;
//   }
// };
type CardActionsProps = {
  children?: React.ReactNode | React.ReactNode[];
  className?: HTMLAttributes<HTMLDivElement>["className"];
  sx?: CSSProperties;
};

export const CardActions = ({ children, className, sx }: CardActionsProps) => {
  return <div style={sx} className={clsx("flex items-center p-2", className)}>{children}</div>;
};

type CardActionAreaBaseProps = CardActionsProps & {
  component?: "link" | "button";
};

type ButtonProps = CardActionAreaBaseProps & HTMLAttributes<HTMLButtonElement>;
type LinkProps = CardActionAreaBaseProps & LinkHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

type CardActionAreaProps = ButtonProps | LinkProps;
export const CardActionArea = ({
  children,
  sx,
  className,
  component = "button",
  ...props
}: CardActionAreaProps) => {
  if (component === 'button') {
    const btnProps = props as ButtonProps
    return (
      <button
        className={clsx(
          "relative m-0 box-border block w-full cursor-pointer select-none rounded-[inherit] bg-transparent text-inherit",
          className
        )}
        tabIndex={0}
        type="button"
        style={sx}
        {...btnProps}
      >
        {children}
        <Ripple />
      </button>
    )
  } else {
    const linkProps = props as LinkProps
    return (
      <Link {...linkProps} className="relative m-0 box-border block w-full cursor-pointer select-none rounded-[inherit] bg-transparent text-inherit">
        {children}
        <Ripple />
      </Link>
    );
  }
};
