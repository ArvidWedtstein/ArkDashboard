import { useController } from "@redwoodjs/forms";
import { ChangeEventHandler, useEffect, useMemo, useRef, useState } from "react";
import useComponentVisible from "../../useComponentVisible";
import { ArrayElement, groupBy } from "src/lib/formatters";
import clsx from "clsx";
type value = string | object | number | null | undefined;
interface ILookup {
  defaultValue?: any;
  children?: React.ReactNode[];
  className?: string;
  search?: boolean;
  group?: string;
  name?: string;
  disabled?: boolean;
  options?: { label: string; value: string | object | number; image?: string }[];
  onSelect?: (value: ArrayElement<ILookup["options"]>) => void;
  onChange?: ChangeEventHandler | undefined;
  placeholder?: string;
  filterFn?: (option: { label: string; value: value; image?: string }, searchTerm: string) => boolean;
  sortFn?: (a: { label: string; value: value; image?: string }, b: { label: string; value: value; image?: string }) => number;
}

const Lookup = ({
  defaultValue,
  children,
  className,
  onSelect,
  search = false,
  group,
  name,
  disabled = false,
  options,
  placeholder,
  onChange,
  filterFn,
  sortFn,
}: ILookup) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const hasOptions = options.length > 0;

  const { field } = !!name && useController({ name: name });
  const [searchTerm, setSearchTerm] = useState<string>(
    defaultValue && hasOptions
      ? options?.find((option) => option?.value === defaultValue)?.label
      : ""
  );

  // Run filter and sort functions when options or searchTerm changes
  const filteredOptions = useMemo(() => {
    const filtered =
      filterFn && searchTerm
        ? options.filter((option) => filterFn(option, searchTerm))
        : options;
    const sorted = sortFn ? filtered.sort(sortFn) : filtered;
    const grouped = !!group ? groupBy(sorted, group) : sorted;
    if (Object.keys(grouped).length === 1) {
      openIndexesRef.current = [0];
    }
    return grouped as any[];
  }, [options, searchTerm, filterFn, sortFn]);

  const openIndexesRef = useRef<number[]>([])
  const selectedOptionRef = useRef(defaultValue && hasOptions
    ? options.find((option) => option.value === defaultValue)
    : null)

  // Update selectedOption when defaultValue changes
  useEffect(() => {
    const selected = options.find((option) => option.value == defaultValue);

    selectedOptionRef.current = selected || defaultValue
    !!name && field.onChange(defaultValue);
  }, [defaultValue]);

  // Handle input change
  const handleInputChange = (event) => {
    if (!event.target.value) {
      setSearchTerm("");
    }

    selectedOptionRef.current = null

    setSearchTerm(event.target.value);
    onChange && onChange(event);
  };

  // Handle option select
  const handleOptionSelect = (option) => {
    selectedOptionRef.current = option

    setSearchTerm(option.label);
    // name && clearErrors(name)
    onSelect && onSelect(option);
    !!name && field.onChange(option.value);
  };

  // Handle option clear
  const handleOptionClear = () => {
    selectedOptionRef.current = null;

    setSearchTerm("");
    // name && clearErrors(name)
    onSelect && onSelect({ label: null, value: null });
    !!name && field.onChange(null);
  };

  /**
   * @description For toggling the open state of the groups
   * @param index
   */
  const toggleOpen = (index) => {
    if (openIndexesRef.current.includes(index)) {
      openIndexesRef.current = openIndexesRef.current.filter((i) => i !== index);
    } else {
      openIndexesRef.current = [...openIndexesRef.current, index];
    }
  };



  return (
    <div className="relative flex items-center w-fit" ref={ref}>
      <div
        onClick={() => !disabled && setIsComponentVisible(true)}
        className={clsx(
          "rw-input flex h-full items-center text-center ",
          className,
          {
            "cursor-not-allowed select-none": disabled,
          }
        )}
      >
        {search ? (
          <input
            type="text"
            name={name}
            id={name}
            value={searchTerm}
            onChange={onChange}
            placeholder={placeholder || "Search..."}
            className="flex w-full items-center bg-transparent outline-none"
            disabled={disabled}
          />
        ) : (
          <>
            <input
              type="text"
              name={name}
              id={name}
              value={searchTerm}
              className="hidden"
              onChange={handleInputChange}
              disabled={disabled}
            />
            {children
              ? children
              : selectedOptionRef?.current
                ? selectedOptionRef?.current?.label
                : placeholder}
          </>
        )}

        <div className="flex flex-row">
          <label htmlFor={name}>
            <svg
              className="ml-2 h-4 w-4"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </label>
          {!!selectedOptionRef.current && (
            <svg
              onClick={handleOptionClear}
              fill="currentColor"
              className="ml-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
            </svg>
          )}
        </div>
      </div>

      {isComponentVisible ? (
        <div className="absolute top-12 z-10 w-60 rounded border-gray-800 bg-white shadow dark:bg-gray-700">
          <ul
            className="max-h-48 overflow-y-auto py-1 text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownButton"
          >
            {!hasOptions ? (
              <li className="flex items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                No options available
              </li>
            ) : null}
            {!group
              ? filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleOptionSelect(option)}
                  className="flex items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {"image" in option && (
                    <img
                      className="mr-2 h-6 w-6 rounded-full"
                      src={option.image}
                      alt=""
                    />
                  )}
                  {option.label}
                </li>
              ))
              : Object.keys(filteredOptions).map((key, i) => {
                return (
                  <li key={key}>
                    <div
                      onClick={() => toggleOpen(i)}
                      className="flex items-center justify-between border-t border-b-2 border-gray-200 px-4 pb-2 pt-3 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <span className="mr-2 font-semibold">{key}</span>
                      <svg
                        className="h-4 w-4"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={
                            openIndexesRef?.current?.includes(i)
                              ? "M19 16L12 9l-7 7"
                              : "M19 9l-7 7-7-7"
                          }
                        ></path>
                      </svg>
                    </div>
                    {openIndexesRef?.current?.includes(i) && (
                      <ul className="">
                        {filteredOptions[key].map((option, i) => (
                          <li
                            key={i}
                            onClick={() => handleOptionSelect(option)}
                            className="flex items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            {"image" in option && (
                              <img
                                className="mr-2 h-6 w-6 rounded-full"
                                src={option.image}
                                alt=""
                              />
                            )}
                            {option.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default Lookup;