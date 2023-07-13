import clsx from "clsx";
import React, { memo, useEffect, useState } from "react";

interface ITabs {
  tabs: {
    title: string | React.ReactNode;
    icon?: string | React.ReactNode;
    content?: string | React.ReactNode;
    disabled?: boolean;
  }[];
  tabClassName?: React.ClassAttributes<HTMLButtonElement> | string;
  selectedTab?: number;
  onSelect?: (index: number) => void;
  type?: 'justify' | 'center' | 'start' | 'end' | 'between' | 'around' | 'evenly';
}
const Tabs = memo(({ tabs, tabClassName, onSelect, selectedTab = 0, type = 'evenly' }: ITabs) => {
  useEffect(() => {
    setActiveTab(selectedTab);
  }, [selectedTab]);
  const [activeTab, setActiveTab] = useState(selectedTab);

  return (
    <div className="flex flex-col">
      <div className="mb-4 text-center border-b border-zinc-500 text-sm text-gray-500 dark:text-gray-400">
        <ul className={clsx("-mb-px flex flex-row flex-wrap gap-1", `justify-${type}`)} role="tablist">
          {tabs.map(({ title, icon, disabled = false }, index) => (
            <li key={`${index}-tablist-${title}`} role="presentation">
              <button
                onClick={() => {
                  onSelect && onSelect(index);
                  setActiveTab(index);
                }}
                role="tab"
                id={`${title}-panel`}
                aria-controls={`${title}-panel`}
                disabled={disabled}
                className={clsx(
                  "inline-flex items-center py-2 px-4 font-medium rounded-t-lg focus:outline-none transition duration-150 disabled:cursor-not-allowed disabled:opacity-50",
                  tabClassName,
                  {
                    "border-b-2 border-pea-600 text-pea-600 dark:text-pea-500 dark:border-pea-500":
                      activeTab === index,
                    " hover:text-pea-400 dark:hover:text-pea-500 dark:hover:border-pea-500 hover:border-pea-600 hover:border-b-2":
                      activeTab !== index && !disabled,
                  }
                )}
              >
                {title}
                {icon && icon}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {tabs.every((tab) => tab.content != null) && (
        <div className="flex-grow">
          {tabs.map(({ title, content }, index) => (
            <div
              key={`tabcontent-${index}`}
              role="tabpanel"
              aria-labelledby={`${title}-panel`}
              className={`${activeTab === index ? "" : "hidden"}`}
            >
              {content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default Tabs;
