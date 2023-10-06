import { navigate } from "@redwoodjs/router";
import clsx from "clsx";
import React, { forwardRef, memo, useCallback, useEffect, useRef, useState } from "react";

interface ITabsProps {
  children: React.ReactElement<ITabProps>[];
  size?: "sm" | "md" | "lg";
  onSelect?: (tab: ITabProps, index: number) => void;
  selectedTabIndex?: number;
  orientation?: "horizontal" | "vertical";
}
interface ITabProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: string | React.ReactNode;
  link?: string;
  icon?: React.ReactNode | string;
  disabled?: boolean;
}

interface ITabItemProps extends ITabProps {
  active: boolean;
  size?: "sm" | "md" | "lg";
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  ref: React.LegacyRef<HTMLButtonElement>;
}
export const TabItem = forwardRef(({
  label,
  icon,
  disabled,
  active,
  onClick,
  size,
  ...props
}: ITabItemProps,
  ref: React.Ref<HTMLButtonElement>) => {
  return (
    <button
      type="button"
      onClick={onClick}
      role="tab"
      disabled={disabled}
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center rounded-t-lg max-w-xs",
        {
          "text-pea-600 dark:text-pea-500":
            !disabled && active,
          "hover:text-gray-600 dark:hover:text-gray-300":
            !active && !disabled,
          "text-gray-400 dark:text-gray-500":
            disabled,
          "p-4": size === "lg",
          "p-2": size === "md",
          "p-1 text-xs": size === "sm",
        }
      )}
      aria-selected={active}
      {...props}
    >
      {icon}
      {label}
    </button>
  );
});


const Tabs = memo(({
  size = "lg",
  onSelect,
  selectedTabIndex = 0,
  orientation = "horizontal",
  children
}: ITabsProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(
    selectedTabIndex
  );
  const [tabStyle, setTabStyle] = useState<React.CSSProperties>({});
  const tabRefs = useRef<Array<HTMLButtonElement>>([]);

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
      <div className={clsx(`relative -mb-px border-gray-200 dark:border-zinc-700 flex flex-wrap text-center text-sm font-medium text-zinc-500 dark:text-gray-400`, {
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
              {...child.props}
            />
          )
          )}
        <div className={clsx(`absolute bg-pea-600 dark:bg-pea-500 transition-all ease-in-out duration-300`, {
          "h-0.5 w-0 bottom-0 left-0": orientation === "horizontal",
          "w-0.5 h-0 top-0 right-0": orientation === "vertical",
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