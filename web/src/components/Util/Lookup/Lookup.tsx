import { useController } from "@redwoodjs/forms";
import {
  ChangeEventHandler,
  useEffect,
  useLayoutEffect,
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
        : options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
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
  btnClassName?: string;
  groupBy?: string;
  displayAsAmount?: boolean;
  multiple?: boolean;
  closeOnSelect?: boolean;
  options: {
    label: string;
    value: string | object | number;
    image?: string;
    disabled?: boolean;
    selected?: boolean;
  }[];
  onChange?: ChangeEventHandler | undefined;
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

// TODO: add renderOption prop
export const MultiSelectLookup = ({
  options,
  name,
  defaultValue,
  className,
  btnClassName,
  groupBy: group,
  placeholder,
  search = false,
  disabled = false,
  clearable = true,
  displayAsAmount = false,
  multiple = false,
  closeOnSelect = false,
  onSelect,
  onChange,
  filterFn,
  sortFn,
}: ILookupMultiSelect) => {

  // https://codepen.io/JohnReynolds57/pen/LJxXbE

  const { ref, setIsComponentVisible, isComponentVisible } =
    useComponentVisible(false);

  const [selectedOptions, setSelectedOptions] = useState<
    ILookupMultiSelect["options"]
  >([]);

  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Init
  const updateLayout = () => {
    if (!ref?.current) return;

    const spaceingToButton = 4; //
    const btn = ref.current.firstChild as HTMLButtonElement;
    const menu = ref.current.lastChild as HTMLDivElement;

    const btnBounds = btn.getBoundingClientRect();
    const menuBounds = menu.getBoundingClientRect();

    let dropdownLeft = btnBounds.left;
    let dropdownTop = btn.offsetTop + btnBounds.height + spaceingToButton;

    // Flip dropdown to right if it goes off screen
    if (dropdownLeft + menuBounds.width > window.innerWidth) {
      dropdownLeft = btnBounds.right - menuBounds.width;
    }

    // Flip dropdown to top if it goes off screen bottom. Account for scroll
    if (dropdownTop + menuBounds.height > window.innerHeight + window.scrollY) {
      dropdownTop = btn.offsetTop - menuBounds.height - spaceingToButton;
    }

    setMenuPosition({ top: dropdownTop, left: dropdownLeft });
  }

  useLayoutEffect(() => {
    updateLayout();
    window.addEventListener("resize", () => updateLayout());

    return () => {
      window.removeEventListener("resize", () => updateLayout());
    };
  }, [])

  // TODO: fix single select
  const { field } = !!name && useController({ name: name });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredOptions = useMemo(() => {
    const lowercaseSearchterm = searchTerm.toLowerCase();

    const filtered = options.filter((option) => {
      if (searchTerm && filterFn) {
        return filterFn(option, searchTerm);
      }

      return (
        !searchTerm || option.label.toLowerCase().includes(lowercaseSearchterm)
      );
    });

    const sorted = sortFn ? filtered.sort(sortFn) : filtered;
    const grouped = group ? groupBy(sorted, group) : sorted;

    // For collapsing the group if there is only one group
    if (Object.keys(grouped).length === 1 && group) {
      openIndexesRef.current = [0];
    }
    return grouped as any;
  }, [options, searchTerm, filterFn, sortFn]);

  // Update selectedOption when defaultValue changes
  useEffect(() => {
    const valuesToSelect: string[] =
      defaultValue
        ?.split(",")
        .map((s) => s.trim())
        .slice(0, multiple ? undefined : 1) || [];

    const selected = options.filter(
      (option) =>
        valuesToSelect.includes(option.value.toString()) || option.selected
    );

    setSelectedOptions(selected);
    !!name && field.onChange(multiple ? valuesToSelect : valuesToSelect[0]);
  }, [defaultValue]);

  const openIndexesRef = useRef<number[]>([]);

  const handleOptionChange = (
    option: ArrayElement<ILookupMultiSelect["options"]>
  ) => {
    if (!option) return;

    const isSelected = selectedOptions.some((o) => o?.value === option.value);

    const updateOptions = isSelected
      ? selectedOptions.filter(
        (item) => item?.value !== option.value && item !== null
      )
      : multiple ? [
        ...selectedOptions.filter(
          (item) => item !== null && item !== undefined
        ),
        option,
      ] : [option];

    setSelectedOptions(updateOptions);

    if (!!name) {
      field.onChange(
        multiple
          ? updateOptions.filter((f) => f != null).map((o) => o?.value)
          : option.value
      );
    }

    onSelect?.(multiple ? updateOptions : [option]);
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
    setSearchTerm("");
    onSelect?.([]);
    name && field.onChange(null);
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
    <div className={clsx("flex w-fit items-center text-black dark:text-white", className)} ref={ref}>
      <button
        onClick={() => !disabled && setIsComponentVisible(!isComponentVisible)}
        className={clsx(
          "rw-input flex h-full select-none items-center text-center transition ease-in hover:border-zinc-400",
          btnClassName,
          {
            "cursor-not-allowed": disabled,
          }
        )}
      >
        {/* FIX: Not needed? */}
        {/* TODO: test to ensure its really not needed */}
        {/* {name && (
          <input
            type="text"
            name={name}
            id={name}
            value={
              selectedOptions &&
              selectedOptions
                .filter((o) => o != null)
                .map((o) => o?.value)
                .join(",")
            }
            onChange={(e) => { }}
            className="hidden"
            disabled={disabled}
          />
        )} */}
        <p className="max-w-xs truncate whitespace-nowrap">
          {displayAsAmount
            ? `${selectedOptions.length} Selected`
            : selectedOptions.filter((o) => o != null).length > 0
              ? selectedOptions
                .filter((o) => o != null && o?.label != null)
                .map((o) => o?.label)
                .join(", ")
              : placeholder}
        </p>

        <div className="pointer-events-none ml-auto flex select-none flex-row">
          {clearable && selectedOptions.filter((d) => d != null).length > 0 && (
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
        </div>
      </button>

      {/* Dropdown Menu */}
      <div
        role="menu"
        style={{
          top: `${menuPosition.top}px`,
          left: `${menuPosition.left}px`,
        }}
        className={clsx("absolute z-30 max-w-full w-fit min-w-[15rem] select-none space-y-1.5 rounded-lg border border-zinc-500 bg-white shadow transition-all duration-300 ease-in-out dark:bg-zinc-800", {
          'hidden': !isComponentVisible,
          'block': isComponentVisible,
        })}
      >
        <ul
          className="relative z-10 max-h-48 overflow-y-auto text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownButton"
        >
          {multiple || search && (
            <li
              className="sticky top-0 left-0 flex items-center rounded-t-lg shadow-md"
            >
              <div className="rw-button-group my-0 w-full rounded-none border-b border-zinc-500">
                {search && (
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder={"Search..."}
                    className="rw-input flex w-full grow items-center !rounded-b-none border-none outline-none dark:bg-zinc-700"
                    disabled={disabled}
                  />
                )}
                {multiple && (
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className={clsx(
                      "rw-button rw-button-gray !rounded-b-none !border-0 !border-l border-zinc-500 transition ease-in-out dark:!bg-zinc-700",
                      {
                        "!text-pea-500 !ring-pea-500 !ring-1 ring-inset":
                          selectedOptions.length === options.length &&
                          options.length > 0,
                      }
                    )}
                    title="Select All"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="rw-button-icon"
                    >
                      <path d="M475.3 164.7c-6.25-6.25-16.38-6.25-22.62 0L192 425.4L59.31 292.7c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62l144 144C183.8 462.4 187.9 464 192 464s8.188-1.562 11.31-4.688l272-272C481.6 181.1 481.6 170.9 475.3 164.7zM180.7 235.3C183.8 238.4 187.9 240 192 240s8.188-1.562 11.31-4.688l176-176c6.25-6.25 6.25-16.38 0-22.62s-16.38-6.25-22.62 0L192 201.4L123.3 132.7c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62L180.7 235.3z" />
                    </svg>
                    <span className="sr-only">Select All</span>
                  </button>
                )}
              </div>
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
                  if (!closeOnSelect) {
                    e.stopPropagation();
                  }
                  handleOptionChange(option);
                }}
                className={
                  "flex items-center py-2 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-600/90 dark:hover:text-white first:rounded-t-lg last:rounded-b-lg"
                }
              >
                {"image" in option && (
                  <img
                    className="mr-2 h-6 w-6 rounded-full"
                    src={option.image}
                    alt={option.label}
                  />
                )}
                <span className="grow">{option.label}</span>

                {selectedOptions.some((o) => o?.value === option.value) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
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
                            if (!closeOnSelect) {
                              e.stopPropagation();
                            }
                            handleOptionChange(option);
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
    </div>
  );
};
