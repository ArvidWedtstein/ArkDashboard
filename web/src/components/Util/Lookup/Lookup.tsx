import { useController } from "@redwoodjs/forms";
import {
  ChangeEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  clearable?: boolean;
  options?: {
    label: string;
    value: string | object | number;
    image?: string;
  }[];
  onSelect?: (value: ArrayElement<ILookup["options"]>) => void;
  onChange?: ChangeEventHandler | undefined;
  placeholder?: string;
  filterFn?: (
    option: { label: string; value: value; image?: string },
    searchTerm: string
  ) => boolean;
  sortFn?: (
    a: { label: string; value: value; image?: string },
    b: { label: string; value: value; image?: string }
  ) => number;
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
  clearable = true,
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
        : options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));
    const sorted = sortFn ? filtered.sort(sortFn) : filtered;
    const grouped = !!group ? groupBy(sorted, group) : sorted;
    if (Object.keys(grouped).length === 1 && group) {
      openIndexesRef.current = [0];
    }
    return grouped as any;
  }, [options, searchTerm, filterFn, sortFn]);

  const openIndexesRef = useRef<number[]>([]);
  const selectedOptionRef = useRef(
    defaultValue && hasOptions
      ? options.find((option) => option.value === defaultValue)
      : null
  );

  // Update selectedOption when defaultValue changes
  useEffect(() => {
    const selected = options.find((option) => option.value == defaultValue);

    selectedOptionRef.current = selected || defaultValue;
    !!name && field.onChange(defaultValue);
  }, [defaultValue]);

  // Handle input change
  const handleInputChange = (event) => {
    if (!event.target.value) {
      setSearchTerm("");
    }

    selectedOptionRef.current = null;

    setSearchTerm(event.target.value);
    onChange?.(event);
  };

  // Handle option select
  const handleOptionSelect = (option) => {
    selectedOptionRef.current = option;

    setSearchTerm(option.label);
    onSelect?.(option);
    !!name && field.onChange(option.value);
  };

  // Handle option clear
  const handleOptionClear = () => {
    selectedOptionRef.current = null;

    setSearchTerm("");
    onSelect?.({ label: null, value: null });
    !!name && field.onChange(null);
  };

  /**
   * @description For toggling the open state of the groups
   * @param index
   */
  const toggleOpen = (index) => {
    if (openIndexesRef.current.includes(index)) {
      openIndexesRef.current = openIndexesRef.current.filter(
        (i) => i !== index
      );
      return;
    }
  };

  return (
    <div className="relative flex w-fit items-center" ref={ref}>
      <div
        onClick={() => !disabled && setIsComponentVisible(!isComponentVisible)}
        className={clsx(
          "rw-input flex h-full select-none items-center text-center transition ease-in hover:border-zinc-400",
          className,
          {
            "cursor-not-allowed": disabled,
          }
        )}
      >
        {search ? (
          <input
            type="text"
            name={name}
            id={name}
            value={searchTerm}
            onChange={(e) => {
              handleInputChange(e);
              onChange?.(e);
            }}
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

        <div className="pointer-events-none ml-auto flex select-auto flex-row">
          <label htmlFor={name}>
            <svg
              className="pointer-events-none ml-2 h-4 w-4"
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
                d={isComponentVisible ? "M19 16L12 9l-7 7" : "M19 9l-7 7-7-7"}
              ></path>
            </svg>
          </label>
          {!!selectedOptionRef.current && clearable && (
            <svg
              onClick={handleOptionClear}
              fill="currentColor"
              className="pointer-events-auto ml-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
            </svg>
          )}
        </div>
      </div>

      {isComponentVisible ? (
        <div className="absolute top-0 z-10 mt-10 w-60 origin-top-right select-none rounded-lg border border-zinc-500 bg-white shadow transition-all duration-300 ease-in-out dark:bg-zinc-700">
          <ul
            className="relative z-10 max-h-48 overflow-y-auto py-1 text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownButton"
          >
            {!hasOptions ? (
              <li className="flex items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-zinc-700/50 dark:hover:text-white">
                No options available
              </li>
            ) : null}
            {!group
              ? filteredOptions.map((option) => (
                <li
                  key={option.value + Math.random()}
                  onClick={() => handleOptionSelect(option)}
                  className="flex items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-zinc-600/70 dark:hover:text-white"
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

interface ILookupMultiSelect {
  defaultValue?: any;
  search?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  name?: string;
  className?: string;
  group?: string;
  displayAsAmount?: boolean;
  onChange?: ChangeEventHandler | undefined;
  options: {
    label: string;
    value: string | object | number;
    image?: string;
    disabled?: boolean;
    selected?: boolean;
  }[];
  onSelect?: (
    value: ArrayElement<ILookupMultiSelect["options"]>["value"][]
  ) => void;
  filterFn?: (
    option: { label: string; value: value; image?: string },
    searchTerm: string
  ) => boolean;
  sortFn?: (
    a: { label: string; value: value; image?: string },
    b: { label: string; value: value; image?: string }
  ) => number;
  placeholder?: string;
}
export const MultiSelectLookup = ({
  options,
  search = false,
  className,
  disabled = false,
  clearable = true,
  displayAsAmount = false,
  name,
  group,
  onSelect,
  onChange,
  filterFn,
  sortFn,
  placeholder,
  defaultValue,
}: ILookupMultiSelect) => {
  const { ref, setIsComponentVisible, isComponentVisible } =
    useComponentVisible(false);
  const [selectedOptions, setSelectedOptions] = useState<ILookupMultiSelect["options"]>(
    options.filter((option) => option.selected).map((option) => option)
  );

  const { field } = !!name && useController({ name: name });
  const [searchTerm, setSearchTerm] = useState<string>(
    defaultValue && options.length > 0
      ? options?.find((option) => option?.value === defaultValue)?.label
      : ""
  );

  const filteredOptions = useMemo(() => {
    const filtered =
      filterFn && searchTerm
        ? options.filter((option) => filterFn(option, searchTerm))
        : options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));
    const sorted = sortFn ? filtered.sort(sortFn) : filtered;
    const grouped = !!group ? groupBy(sorted, group) : sorted;

    // For collapsing the group if there is only one group
    if (Object.keys(grouped).length === 1 && group) {
      openIndexesRef.current = [0];
    }
    return grouped as any;
  }, [options, searchTerm, filterFn, sortFn]);

  // Update selectedOption when defaultValue changes
  useEffect(() => {
    const selected = options.find((option) => option.value == defaultValue);

    setSelectedOptions([selected] || defaultValue);
    !!name && field.onChange(defaultValue);
  }, [defaultValue]);

  const openIndexesRef = useRef<number[]>([]);

  const handleOptionChange = (option: ArrayElement<ILookupMultiSelect["options"]>) => {
    try {
      setSelectedOptions((prevState) => {
        if (prevState.some((o) => o?.value === option.value)) {
          return prevState.filter((item) => item?.value !== option.value && item !== null);
        }
        return [...prevState, option];
      });


      !!name && field.onChange(selectedOptions.some((o) => o?.value === option.value)
        ? selectedOptions.filter((item) => item.value !== option.value && item !== null)
        : [...selectedOptions, option]);


      onSelect?.(
        selectedOptions.some((o) => o?.value === option.value)
          ? selectedOptions.filter((item) => item.value !== option.value && item !== null)
          : [...selectedOptions, option]
      );
    } catch (error) {
      console.error(error)
    }
  };

  // Handle input change
  const handleInputChange = (event) => {
    if (!event.target.value) {
      setSearchTerm("");
    }

    setSearchTerm(event.target.value);
    onChange?.(event);
  };

  const handleSelectAll = () => {
    if (selectedOptions.length === options.length) {
      setSelectedOptions([]);
      !!name && field.onChange(null);
      onSelect?.([]);
      return;
    }
    onSelect?.(options);
    !!name && field.onChange(options.map((o) => o?.value));
    setSearchTerm("");
    setSelectedOptions(options);
  };

  const handleClearSelection = () => {
    setSelectedOptions([]);
    onSelect?.([]);
    !!name && field.onChange(null);
    setSearchTerm("");
  };

  /**
 * @description For toggling the open state of the groups
 * @param index
 */
  const toggleOpen = (index) => {
    if (openIndexesRef.current.includes(index)) {
      openIndexesRef.current = openIndexesRef.current.filter(
        (i) => i !== index
      );
      return;
    }
  };


  return (
    <div className="relative flex w-fit items-center text-white" ref={ref}>
      <div
        onClick={() => !disabled && setIsComponentVisible(!isComponentVisible)}
        className={clsx(
          "rw-input flex h-full select-none items-center text-center transition ease-in hover:border-zinc-400",
          className,
          {
            "cursor-not-allowed": disabled,
          }
        )}
      >
        <p className="whitespace-nowrap truncate">{displayAsAmount ? `${selectedOptions.length} Selected` : selectedOptions.length > 0
          ? selectedOptions.filter(o => o != null).map((o) => o?.label).join(", ")
          : placeholder}
        </p>

        <div className="ml-auto pointer-events-none flex select-none flex-row">
          <label htmlFor={name}>
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isComponentVisible ? "M19 16L12 9l-7 7" : "M19 9l-7 7-7-7"}
              ></path>
            </svg>
          </label>
          {clearable && (
            <svg
              onClick={handleClearSelection}
              fill="currentColor"
              className="pointer-events-auto ml-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
            </svg>
          )}
        </div>
      </div>
      {isComponentVisible ? (
        <div className="absolute top-full min-w-[15rem] left-0 z-30 origin-top-right rounded-lg select-none shadow bg-white transition-all duration-300 ease-in-out w-full space-y-1.5 border border-zinc-500 dark:bg-zinc-700">
          <ul
            className="relative z-10 max-h-48 overflow-y-auto text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownButton"
          >
            <li
              onClick={handleSelectAll}
              className={"flex items-center py-2 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-600/90 dark:hover:text-white"}
            >
              <span className="grow">Select All</span>

              {selectedOptions.length === options.length && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5 shrink-0">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              )}
            </li>

            {search && (
              <li
                className="flex items-center mb-2"
              >
                <input
                  type="text"
                  name={name}
                  id={name}
                  value={searchTerm}
                  onChange={handleInputChange}
                  placeholder={placeholder || "Search..."}
                  className="rw-input flex w-full items-center outline-none !rounded-none border-x-0 shadow"
                  disabled={disabled}
                />
              </li>
            )}

            {!options || options.length == 0 ? (
              <li className="flex items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-zinc-700/50 dark:hover:text-white">
                No options available
              </li>
            ) : null}

            {!group
              ? filteredOptions.map((option) => (
                <li
                  key={option.value + Math.random()}
                  onClick={(e) => {
                    e.preventDefault();
                    handleOptionChange(option)
                  }}
                  className={clsx("flex items-center py-2 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-600/90 dark:hover:text-white", {
                    "dark:bg-zinc-600/50 bg-zinc-100/50": selectedOptions && selectedOptions.length > 0 && selectedOptions.some((o) => o?.value === option.value),
                  })}
                >
                  {"image" in option && (
                    <img
                      className="mr-2 h-6 w-6 rounded-full"
                      src={option.image}
                      alt=""
                    />
                  )}
                  <span className="grow">{option.label}</span>

                  {selectedOptions.some((o) => o?.value === option.value) && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5 shrink-0">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  )}
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
                            onClick={(e) => {
                              e.preventDefault();
                              handleOptionChange(option)
                            }}
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
