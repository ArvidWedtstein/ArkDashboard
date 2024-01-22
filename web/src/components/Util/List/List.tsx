import { DetailedHTMLProps, ElementType, HTMLAttributes, MouseEventHandler, ReactNode, createElement, useRef } from "react";
import Ripple from "../Ripple/Ripple";
import { useRipple } from "src/components/useRipple";
import clsx from "clsx";

type ListProps = {
  children?: React.ReactNode;
} & React.DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>;;
const List = (props: ListProps) => {
  return <ul className={clsx("relative m-0 list-none py-2", props?.className)} {...props}>{props.children}</ul>;
};

type ListItemProps<T extends ElementType = 'div'> = {
  icon?: ReactNode;
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean;
  disableRipple?: boolean;
  secondaryAction?: ReactNode;
  secondaryActionProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  to?: string;
  href?: string;
  linkProps?: Omit<HTMLAttributes<HTMLElement>, 'disabled' | 'color'>;
  onClick?: T extends 'button' ? MouseEventHandler<HTMLButtonElement> : T extends 'a' ? MouseEventHandler<HTMLAnchorElement> : MouseEventHandler<HTMLDivElement>;
} & DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>;

export const ListItem = <T extends ElementType = 'div'>(props: ListItemProps<T>) => {
  const { disabled: disabled, disableRipple, icon, secondaryAction, secondaryActionProps, linkProps, children, className, size = "medium", onClick, ...other } = props;
  const rippleRef = useRef(null);
  const { enableRipple, getRippleHandlers } = useRipple({
    disabled,
    disableRipple,
    rippleRef,
  });

  const Root: ElementType = props.href || props.to ? "a" : props.onClick ? "button" : "div";
  return (
    <li
      className={clsx("relative box-border flex w-full items-center justify-start text-left text-black dark:text-white", className)}
      {...other}
      {...getRippleHandlers()}
    >
      <Root
        {...linkProps}
        className={clsx("flex justify-start w-full items-center relative box-border", linkProps?.className, {
          "px-4 py-1.5": size === 'small',
          "py-2 px-4": size === "medium",
          "py-2.5 px-5": size === 'large',
          "text-zinc-500": disabled,
        })}
        disabled={disabled}
        href={props?.to || props?.href}
        {...(Root === 'button' ? { type: "button", onClick: (e) => onClick?.(e) } : {})}
      >
        {icon && (
          <div className="inline-flex shrink-0 min-w-[36px]">
            {icon}
          </div>
        )}
        <div
          className={clsx("min-w-0 flex-auto", {
            "my-1": size !== "small"
          })}
        >
          {children}
        </div>
        {secondaryAction && (
          <div {...secondaryActionProps} className={clsx("ml-4", secondaryActionProps?.className)}>{secondaryAction}</div>
        )}
        {enableRipple ? <Ripple ref={rippleRef} center={false} /> : null}
      </Root>
    </li>
  );
};



export default List;
