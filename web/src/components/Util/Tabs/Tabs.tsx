import clsx from "clsx";
import React, { useState } from "react";

interface ITabs {
  tabs: {
    title: string | React.ReactNode;
    content: string | React.ReactNode;
  }[];
  tabClassName?: React.ClassAttributes<HTMLButtonElement> | string;
}
const Tabs = ({ tabs, tabClassName }: ITabs) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col">
      <div className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <ul className="-mb-px flex flex-wrap">
          {tabs.map(({ title }, index) => (
            <li key={`${index}-tablist-${title}`} className={clsx("flex-grow")}>
              <button
                onClick={() => setActiveTab(index)}
                className={clsx(
                  "w-full rounded-t-lg border-b-2 py-2 focus:outline-none",
                  tabClassName,
                  {
                    "border-pea-600 text-pea-600 dark:text-pea-500 dark:border-pea-500 font-medium":
                      activeTab === index,
                    "border-transparent border-gray-200 hover:border-gray-300 hover:text-gray-600 dark:border-gray-500 dark:hover:text-gray-300":
                      activeTab !== index,
                  }
                )}
              >
                {title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-grow">
        {tabs.map(({ content }, index) => (
          <div
            key={`tabcontent-${index}`}
            className={`${activeTab === index ? "" : "hidden"}`}
          >
            {content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
