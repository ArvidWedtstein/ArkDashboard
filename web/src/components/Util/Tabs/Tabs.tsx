import { navigate } from "@redwoodjs/router";
import clsx from "clsx";
import React, { memo, useCallback, useEffect, useState } from "react";

interface ITabsProps {
  children: React.ReactElement<ITabProps>[];
  size?: "sm" | "md" | "lg";
  onSelect?: (tab: ITabProps, index: number) => void;
  selectedTab?: number;
}
interface ITabProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: string;
  link?: string;
  icon?: React.ReactNode | string;
  disabled?: boolean;
}
const Tabs = ({
  size = "lg",
  onSelect,
  selectedTab = 0,
  ...props
}: ITabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(
    (props?.children[selectedTab] as React.ReactElement<ITabProps>).props.label
  );

  const onClickTabItem = useCallback(
    (tab: ITabProps, index: number) => {
      setActiveTab(tab.label);
      onSelect?.(tab, index);
      tab.link && navigate(tab.link);
    },
    [activeTab, onSelect]
  );
  return (
    <div className="relative">
      <div className="border-b border-gray-200 dark:border-zinc-700">
        <ul className="-mb-px flex flex-wrap space-x-2 text-center text-sm font-medium text-zinc-500 dark:text-gray-400">
          {props.children &&
            props.children
              .filter((child) => React.isValidElement(child))
              .map((child, i) => {
                const { label, icon, disabled } = child.props;
                return (
                  <li key={label}>
                    <button
                      onClick={() => onClickTabItem(child.props, i)}
                      role="tab"
                      disabled={disabled}
                      className={clsx(
                        `group inline-flex items-center justify-center rounded-t-lg border-b-2 p-4`,
                        {
                          "border-pea-600 text-pea-600 dark:border-pea-500 dark:text-pea-500":
                            activeTab === label && !disabled,
                          "border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300":
                            activeTab !== label && !disabled,
                          "cursor-not-allowed border-transparent text-gray-400 dark:text-gray-500":
                            disabled,
                          "p-4": size === "lg",
                          "p-2": size === "md",
                          "p-1 text-xs": size === "sm",
                        }
                      )}
                      {...props}
                    >
                      {icon}
                      {label}
                    </button>
                  </li>
                );
              })}
        </ul>
      </div>

      <div className="tab-content">
        {props.children
          .filter((child) => React.isValidElement(child))
          .map((child) => {
            if (child.props.label !== activeTab) return undefined;
            return child.props.children;
          })}
      </div>
    </div>
  );
};

export default Tabs;

export const Tab = ({
  label,
  icon,
  onSelect,
  disabled,
  link,
  ...props
}: ITabProps) => {
  return <></>;
};
