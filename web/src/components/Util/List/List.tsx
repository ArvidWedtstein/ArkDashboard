import { useRef } from "react";
import Ripple from "../Ripple/Ripple";
import { useRipple } from "src/components/useRipple";

type ListProps = {
  children?: React.ReactNode;
};
const List = (props: ListProps) => {
  return <ul className="relative m-0 list-none py-2">{props.children}</ul>;
};

type ListItemProps = {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  disableRipple?: boolean;
};
export const ListItem = (props: ListItemProps) => {
  const { disabled: disabled, disableRipple } = props;
  const rippleRef = useRef(null);
  const { enableRipple, getRippleHandlers } = useRipple({
    disabled,
    disableRipple,
    rippleRef,
  });
  return (
    <li
      className="relative box-border flex w-full items-center justify-start py-2 px-4 text-left"
      {...getRippleHandlers()}
    >
      {props?.icon && (
        <div className="inline-flex min-w-[56px] shrink-0 text-black dark:text-white">
          {props.icon}
        </div>
      )}
      <div className="my-1 min-w-0 flex-[1_1_auto]">{props.children}</div>
      {enableRipple ? <Ripple ref={rippleRef} center={false} /> : null}
    </li>
  );
};

export default List;
