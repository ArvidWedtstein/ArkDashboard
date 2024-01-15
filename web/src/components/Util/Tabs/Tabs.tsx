import { navigate } from "@redwoodjs/router";
import clsx from "clsx";
import React, { Ref, forwardRef, memo, useCallback, useEffect, useRef, useState } from "react";
import Button, { ButtonProps } from "../Button/Button";

interface ITabsProps {
  children: React.ReactElement<ITabProps>[];
  size?: "small" | "medium" | "large";
  onSelect?: (tab: ITabProps, index: number) => void;
  selectedTabIndex?: number;
  orientation?: "horizontal" | "vertical";
  activeColor?: ButtonProps["color"];
}
interface ITabProps extends ButtonProps {
  label: string | React.ReactNode;
  link?: string;
}

interface ITabItemProps extends ITabProps {
  active: boolean;
  activeColor?: ITabProps["color"];
  onClick: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  ref: Ref<HTMLButtonElement | HTMLAnchorElement>;
}
export const TabItem = forwardRef(({
  label,
  disabled,
  active,
  onClick,
  activeColor = "success",
  ...props
}: ITabItemProps,
  ref: Ref<HTMLButtonElement | HTMLAnchorElement>) => {
  return (
    <Button
      role="tab"
      onClick={onClick}
      disabled={disabled}
      ref={ref}
      variant="text"
      aria-selected={active}
      className="rounded-none"
      color={active && !disabled ? activeColor : 'secondary'}
      {...props}
    >
      {label}
    </Button>
  );
});


const Tabs = memo(({
  size = "large",
  onSelect,
  selectedTabIndex = 0,
  orientation = "horizontal",
  activeColor = "success",
  children
}: ITabsProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(
    selectedTabIndex
  );
  const [tabStyle, setTabStyle] = useState<React.CSSProperties>({});
  const tabRefs = useRef<Array<HTMLButtonElement | HTMLAnchorElement>>([]);

  const onClickTabItem = useCallback(
    (index: number) => {
      const newActiveTabElement = tabRefs.current[index];

      if (newActiveTabElement) {
        const newTabStyle = orientation === "horizontal" ? {
          width: newActiveTabElement?.offsetWidth,
          left: newActiveTabElement?.offsetLeft - 8,
        } : {
          height: newActiveTabElement?.offsetHeight,
          top: newActiveTabElement?.offsetTop - 8,
        };
        setTabStyle(newTabStyle);
      }

      setActiveTabIndex(index);

      const tab = children[index]?.props;

      onSelect?.(tab, index);
      tab?.link && navigate(tab.link);
    },
    [onSelect, children]
  );

  useEffect(() => {
    onClickTabItem(selectedTabIndex);
  }, [selectedTabIndex]);


  return (
    <div className={clsx("relative flex", {
      "flex-col": orientation === "horizontal",
      "flex-row": orientation === "vertical",
    })}>
      <div className={clsx(`relative border-black/10 dark:border-white/10 flex flex-wrap text-center text-sm font-medium text-zinc-500 dark:text-gray-400`, {
        "flex-row border-b space-x-2": orientation === "horizontal",
        "flex-col border-r space-y-2": orientation === "vertical",
      })} role="tablist">
        {children
          .filter((child) => React.isValidElement(child))
          .map((child, i) => (
            <TabItem
              key={i}
              {...child.props}
              active={activeTabIndex === i}
              onClick={() => onClickTabItem(i)}
              ref={(el) => (tabRefs.current[i] = el)}
              size={size}
              activeColor={activeColor}
              {...child.props}
            />
          )
          )}
        <div aria-label="Indicator" className={clsx(`absolute transition-all ease-in-out duration-300`, { // -mb-px
          "h-0.5 w-0 bottom-0 left-0": orientation === "horizontal",
          "w-0.5 h-0 top-0 right-0": orientation === "vertical",
          "bg-primary-400": activeColor === 'primary',
          "bg-secondary-500": activeColor === 'secondary',
          "bg-success-600": activeColor === "success",
          "bg-warning-400": activeColor === 'warning',
          "bg-error-500": activeColor === 'error',
          "dark:bg-white bg-zinc-900": activeColor === 'DEFAULT',
        })} style={tabStyle} />
      </div>

      <div className="" role="tabpanel">
        {children
          .filter((child) => React.isValidElement(child))
          .map((child, i) => {
            if (activeTabIndex !== i) return null;
            return child.props.children;
          })}
      </div>
    </div>
  );
});

export default Tabs;

export const Tab = ({
}: ITabProps) => {
  return <></>;
};