import { DetailedHTMLProps, ElementType, HTMLAttributes, MouseEventHandler, ReactNode, Ref, forwardRef, useRef } from "react";
import Ripple from "../Ripple/Ripple";
import { useRipple } from "src/components/useRipple";
import clsx from "clsx";

type ListProps = {
  children?: ReactNode;
  orientation?: 'horizontal' | 'vertical'
} & DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>;;
const List = forwardRef<HTMLUListElement, ListProps>((props, ref) => {
  const { className, orientation = "vertical" } = props;
  return (
    <ul
      {...props}
      className={clsx("relative m-0 list-none py-2", className, {
        "inline-flex": orientation === 'horizontal'
      })}
      ref={ref}
    >
      {props.children}
    </ul>
  );
});

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
  iconProps?: HTMLAttributes<HTMLDivElement>;
  onClick?: T extends 'button' ? MouseEventHandler<HTMLButtonElement> : T extends 'a' ? MouseEventHandler<HTMLAnchorElement> : MouseEventHandler<HTMLDivElement>;
} & DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>;

export const ListItem = forwardRef(<T extends ElementType = 'div'>(props: ListItemProps<T>, ref: Ref<HTMLLIElement>) => {
  const { disabled: disabled, disableRipple, icon, secondaryAction, secondaryActionProps, linkProps, iconProps, children, className, size = "medium", onClick, ...other } = props;
  const rippleRef = useRef(null);
  const { enableRipple, getRippleHandlers } = useRipple({
    disabled,
    disableRipple,
    rippleRef,
  });

  const Root: ElementType = props.href || props.to ? "a" : props.onClick ? "button" : "div";
  return (
    <li
      ref={ref}
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
          "dark:hover:bg-white/10 hover:bg-black/10": ((props.href || props.to) || props.onClick)
        })}
        disabled={disabled}
        href={props?.to || props?.href}
        {...(Root === 'button' ? { type: "button", onClick: (e) => onClick?.(e) } : {})}
      >
        {icon && (
          <div {...iconProps} className={clsx("inline-flex shrink-0 min-w-[36px]", iconProps?.className)}>
            {icon}
          </div>
        )}
        <div
          className={clsx("min-w-0 flex-auto text-left", {
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
});



export default List;
