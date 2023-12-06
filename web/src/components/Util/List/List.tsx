import { HTMLAttributes, useRef } from "react";
import Ripple from "../Ripple/Ripple";
import { useRipple } from "src/components/useRipple";
import clsx from "clsx";

type ListProps = {
  children?: React.ReactNode;
};
const List = (props: ListProps) => {
  return <ul className="relative m-0 list-none py-2">{props.children}</ul>;
};

type ListItemProps = {
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean;
  disableRipple?: boolean;
} & React.DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>;
export const ListItem = (props: ListItemProps) => {
  const { disabled: disabled, disableRipple, icon, children, className, size = "medium", ...other } = props;
  const rippleRef = useRef(null);
  const { enableRipple, getRippleHandlers } = useRipple({
    disabled,
    disableRipple,
    rippleRef,
  });
  return (
    <li
      className={clsx("relative box-border flex w-full items-center justify-start text-left text-black dark:text-white", className, {
        "px-4 py-1.5": size === 'small',
        "py-2 px-4": size === "medium"
      })}
      {...other}
      {...getRippleHandlers()}
    >
      {icon && (
        <div className="inline-flex shrink-0 min-w-[36px]">
          {icon}
        </div>
      )}
      <div className={clsx("min-w-0 flex-[1_1_auto]", {
        "my-1": size !== "small"
      })}>{children}</div>
      {enableRipple ? <Ripple ref={rippleRef} center={false} /> : null}
    </li>
  );
};

export default List;
