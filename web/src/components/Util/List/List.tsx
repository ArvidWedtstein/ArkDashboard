import { ElementType, HTMLAttributes, useRef } from "react";
import Ripple from "../Ripple/Ripple";
import { useRipple } from "src/components/useRipple";
import clsx from "clsx";

type ListProps = {
  children?: React.ReactNode;
} & React.DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>;;
const List = (props: ListProps) => {
  return <ul className={clsx("relative m-0 list-none py-2", props?.className)} {...props}>{props.children}</ul>;
};

type ListItemProps = {
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean;
  disableRipple?: boolean;
  secondaryAction?: React.ReactNode;
  secondaryActionProps?: React.DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  to?: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | React.MouseEventHandler<HTMLLIElement>
} & React.DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>;
export const ListItem = (props: ListItemProps) => {
  const { disabled: disabled, disableRipple, icon, secondaryAction, secondaryActionProps, children, className, size = "medium", onClick, ...other } = props;
  const rippleRef = useRef(null);
  const { enableRipple, getRippleHandlers } = useRipple({
    disabled,
    disableRipple,
    rippleRef,
  });
  const Root: ElementType = props.href || props.to ? "a" : props.onClick ? "button" : 'div';
  return (
    <li
      className={clsx("relative box-border flex w-full items-center justify-start text-left text-black dark:text-white", className)}
      {...other}
      {...getRippleHandlers()}
    >
      <Root className={clsx("flex justify-start w-full items-center relative box-border", {
        "px-4 py-1.5": size === 'small',
        "py-2 px-4": size === "medium"
      })} href={props?.to || props?.href} type="button" onClick={(e) => {
        if (!(props.href || props.to)) {
          onClick?.(e)
        }
      }}>
        {icon && (
          <div className="inline-flex shrink-0 min-w-[36px]">
            {icon}
          </div>
        )}
        <div className={clsx("min-w-0 flex-auto", {
          "my-1": size !== "small"
        })}>{children}</div>
        {secondaryAction && (
          <div {...secondaryActionProps} className={clsx("ml-4", secondaryActionProps?.className)}>{secondaryAction}</div>
        )}
        {enableRipple ? <Ripple ref={rippleRef} center={false} /> : null}
      </Root>
    </li>
  );
};

export default List;
