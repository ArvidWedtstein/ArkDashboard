import clsx from "clsx";
import { useState } from "react";
import Collapse from "../Collapse/Collapse";

type WithoutChildren<T> = T extends { children?: any, kids?: any } ? Omit<T, 'kids'> : T;

interface TreeViewProps<T extends { children?: any[] }> {
  options: T[],
  className?: string;
  getOptionLabel?: (option: WithoutChildren<T>, level: number) => string | null;
  getOptionIcon?: (option: WithoutChildren<T>, level: number) => string | React.ReactNode | null;
  getOptionCaption?: (option: WithoutChildren<T>, level: number) => string | React.ReactNode | null;
  onOptionSelect?: (option: WithoutChildren<T>, level: number, finalLevel: boolean) => void;
}

const TreeView = <T extends { children?: any[] }>(props: TreeViewProps<T>) => {
  const {
    options,
    getOptionLabel,
    getOptionIcon,
    getOptionCaption,
    onOptionSelect,
    className,
  } = props;

  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleToggle = (key: string) => {
    const isOpen = openItems.includes(key);
    setOpenItems((prevOpenItems) =>
      isOpen
        ? prevOpenItems.filter((item) => !item.startsWith(key))
        : [...prevOpenItems, key]
    );
  };

  const renderOption = (option: T, key: string, level: number) => {
    const icon = getOptionIcon?.(option as WithoutChildren<T>, level) || null;
    const caption = getOptionCaption?.(option as WithoutChildren<T>, level) || null;
    const label = getOptionLabel?.(option as WithoutChildren<T>, level) || null
    const isExpanded = openItems.includes(key);
    return (
      <div className={clsx("flex cursor-pointer items-center box-border px-2 w-full hover:bg-zinc-500/30 rounded", {
        "!pl-4": level > 0
      })} onClick={() => {
        handleToggle(key);
        onOptionSelect?.(option as WithoutChildren<T>, level, !(option?.children?.length > 0))
      }}>
        <div className="mr-1 flex-shrink-0 justify-center w-4 flex">
          {option?.children ? (
            <svg className="w-5 h-5 inline-block fill-current flex-shrink-0 transition-colors duration-200 select-none" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
              <path d={isExpanded ? "m7 10 5 5 5-5z" : "m10 17 5-5-5-5v10z"} />
            </svg>
          ) : (
            <div className="w-4" />
          )}
        </div>
        <div className="pl-1 box-border min-w-0 w-full relative text-base">
          <div className="flex items-center p-1 pr-0">
            {icon && typeof icon === 'string' ? (
              <img loading="lazy" className="w-5 h-5 fill-current mr-2 flex-shrink-0 inline-block select-none" src={icon} />
            ) : icon}
            <p className="m-0 flex-grow">{label}</p>
            <span className="m-0 text-inherit text-xs font-normal">{caption}</span>
          </div>
        </div>
      </div>
    )
  }

  const renderList = (lastOptionId: string, level: number = 0, options: T[]) => {
    return (
      <Collapse
        component={'ul'}
        className="p-0 ml-0"
        in={openItems.includes(lastOptionId)}
      >
        {options.map((option, optionIndex) => {
          const key = `${lastOptionId}-${optionIndex}`
          const isExpanded = openItems.includes(key);

          return (
            <li key={key} className="text-white/70 font-medium" aria-expanded={isExpanded}>
              {renderOption(option, key, level)}

              {option?.children && renderList(key, level + 1, option?.children)}
            </li>
          )
        })}
      </Collapse>
    )
  }

  return (
    <ul className={clsx("flex-grow-1 overflow-y-auto list-none", className)}>
      {options.map((option, optionIndex) => {
        const isExpanded = openItems.includes(`${optionIndex}`);

        return (
          <li key={`option-${optionIndex}`} className="text-white/70 font-medium" aria-expanded={isExpanded}>
            {renderOption(option, `${optionIndex}`, 0)}

            {renderList(`${optionIndex}`, 1, option.children)}
          </li>
        )
      })}
    </ul>
  )
}

export default TreeView
