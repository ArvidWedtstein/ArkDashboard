import clsx from "clsx";
import React, { useState } from "react";
interface ITabs {
  tabs:
    | {
        title: string;
        content: string | React.ReactNode;
      }[]
    | any[];
  tabClassName?: React.ClassAttributes<HTMLButtonElement>;
}
const Tabs = ({ tabs, tabClassName }: ITabs) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col">
      <div className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <ul className="-mb-px flex flex-wrap">
          {tabs.map((tab, index) => (
            <li
              key={`${index}-tablist-${tab.title}`}
              className={clsx("flex-grow", tabClassName)}
            >
              <button
                onClick={() => setActiveTab(index)}
                className={clsx(
                  "mx-2 w-full rounded-t-lg border-b-2 py-4 focus:outline-none",
                  {
                    "border-pea-600 text-pea-600 dark:text-pea-500 dark:border-pea-500 font-medium":
                      activeTab === index,
                    "border-transparent border-gray-200 hover:border-gray-300 hover:text-gray-600 dark:border-gray-500 dark:hover:text-gray-300":
                      activeTab !== index,
                  }
                )}
              >
                {tab.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-grow">
        {tabs.map((tab, index) => (
          <div
            key={`tabcontent-${index}`}
            className={`${activeTab === index ? "" : "hidden"}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
