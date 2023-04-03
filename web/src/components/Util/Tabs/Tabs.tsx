import clsx from 'clsx';
import React, { useState } from 'react';
interface ITabs {
  tabs: {
    title: string;
    content: string | React.ReactNode;
  }[] | any[];
  tabClassName?: React.ClassAttributes<HTMLButtonElement>;
}
const Tabs = ({
  tabs,
  tabClassName
}: ITabs) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col">
      <div className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4">
        <ul className="flex flex-wrap -mb-px">
          {tabs.map((tab, index) => (
            <li className={clsx("flex-grow", tabClassName)}>
              <button onClick={() => setActiveTab(index)} className={clsx("py-4 border-b-2 rounded-t-lg focus:outline-none w-full mx-2", {
                "border-pea-600 text-pea-600 dark:text-pea-500 dark:border-pea-500 font-medium": activeTab === index,
                "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 border-gray-200 dark:border-gray-500": activeTab !== index
              })}>{tab.title}</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-grow">
        {tabs.map((tab, index) => (
          <div key={index} className={`${activeTab === index ? '' : 'hidden'}`}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;