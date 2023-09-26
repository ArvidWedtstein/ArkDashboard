import { set, useController } from "@redwoodjs/forms";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import useComponentVisible from "../../useComponentVisible";
import { ArrayElement } from "src/lib/formatters";
import clsx from "clsx";


type value = string | object | number | null | undefined;


interface ILookup {
  defaultValue?: string[];
  name?: string;
  className?: string;
  btnClassName?: string;
  groupBy?: string;
  disabled?: boolean;
  search?: boolean;
  disableClearable?: boolean;
  readOnly?: boolean;
  filterSelectedOptions?: boolean;
  multiple?: boolean;
  closeOnSelect?: boolean;
  inputValue?: string;
  // limitTags?: number;
  options: {
    label: string;
    value: string | object | number;
    image?: string;
    disabled?: boolean;
    selected?: boolean;
    inSearch?: boolean;
    [key: string]: string | object | number | boolean | undefined;
  }[];
  renderTags?: (
    selectedOptions: Readonly<ILookup["options"]>
  ) => React.ReactNode;
  onInputChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    newInputValue: string
  ) => void;
  onSelect?: (options: ILookup["options"]) => void;
  filterFn?: (
    option: { label: string; value: value; image?: string },
    searchTerm: string
  ) => boolean;
  placeholder?: string;
}

export const Lookup = ({
  options,
  name,
  defaultValue,
  className,
  btnClassName,
  placeholder,
  inputValue,
  search = false,
  disabled = false,
  readOnly = false,
  disableClearable = false,
  multiple = false,
  closeOnSelect = false,
  filterSelectedOptions = false,
  renderTags,
  onSelect,
  onInputChange,
  filterFn,
}: ILookup) => {
  const { ref, setIsComponentVisible, isComponentVisible } =
    useComponentVisible(false);


  // Convert this to store all options instead and set selected to the ones that are selected
  const [selectedOptions, setSelectedOptions] = useState<
    ILookup["options"]
  >([]);

  const { field } = !!name && useController({ name: name });
  const [searchTerm, setSearchTerm] = useState<string>(inputValue || "");
  const [internalValue, setInternalValue] = useState<string>("");

  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Init
  const updateLayout = () => {
    if (!ref?.current) return;

    const spaceingToButton = 4;
    // const btn = ref.current.firstChild as HTMLButtonElement;
    const btn = ref.current.firstChild as HTMLDivElement;
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
  };


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

    return filtered;
  }, [options, searchTerm, filterFn]);


  useEffect(() => {
    setSelectedOptions((prev) => prev.map((option) => {
      if (searchTerm && filterFn) {
        return ({
          ...option,
          inSearch: filterFn(option, searchTerm)
        });
      }

      return ({
        ...option,
        inSearch: !searchTerm || option.label.toLowerCase().includes(searchTerm.toLowerCase())
      });
    }))
  }, [options, searchTerm, filterFn]);

  // Update selectedOption when defaultValue changes
  useEffect(() => {
    setSearchTerm("");
    setInternalValue("");
    const valuesToSelect: string[] =
      defaultValue?.map((s) => s?.trim()).slice(0, multiple ? undefined : 1) ||
      [];

    const selected: ILookup["options"] = options.map((option) => {
      const isSelected = valuesToSelect.includes(option.value.toString());

      return {
        ...option,
        selected: isSelected,
        inSearch: !searchTerm || option.label.toLowerCase().includes(searchTerm.toLowerCase())
      };
    });

    setSelectedOptions(selected);
    !!name && field.onChange(multiple ? valuesToSelect : valuesToSelect[0]);

    updateLayout();
  }, [defaultValue]);

  const handleOptionSelect = useCallback(
    (
      event: React.MouseEvent<HTMLLIElement> | React.MouseEvent<SVGSVGElement>,
      option: ArrayElement<ILookup["options"]>
    ) => {
      event.preventDefault();

      if (!option || option.disabled) return;

      const isSelected = selectedOptions.some((o) => o?.value === option.value && o?.selected);

      const updateOptions = selectedOptions.map((o) => {
        if (o?.value === option.value) {
          return {
            ...o,
            selected: !isSelected,
          };
        }

        return multiple ? o : { ...o, selected: false };
      });

      console.log(updateOptions.filter((f) => f.selected))
      setSelectedOptions(updateOptions);

      if (!!name) {
        field.onChange(
          multiple
            ? updateOptions.filter((f) => f != null && f.selected).map((o) => o?.value)
            : [option.value]
        );
      }

      onSelect?.(multiple ? updateOptions : [option]);

      if (closeOnSelect && !isSelected) {
        setIsComponentVisible(false);
      }

      setSearchTerm("");
      setInternalValue(multiple ? "" : option.label);
    },
    [selectedOptions, multiple, onSelect]
  );

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value || "");
    setInternalValue(event.target.value || "");
    onInputChange?.(event, event.target.value);
  };

  // const handleSelectAll = () => {
  //   if (selectedOptions.length === options.filter((o) => !o.disabled).length) {
  //     setSelectedOptions([]);
  //     !!name && field.onChange([]);
  //     onSelect?.([]);
  //     return;
  //   }

  //   onSelect?.(options.filter((o) => !o.disabled));
  //   !!name &&
  //     field.onChange(options.filter((o) => !o.disabled).map((o) => o?.value));

  //   setSelectedOptions(options.map((o) => ({ ...o, selected: !o.disabled })));
  // };

  const handleClearSelection = () => {
    setSelectedOptions((prev) => prev.map((o) => ({ ...o, selected: false })));
    setSearchTerm("");
    setInternalValue("");
    onSelect?.([]);
    name && field.onChange([]);
  };

  const toggleLookup = () => {
    if (!disabled) {
      setIsComponentVisible(!isComponentVisible);

      if (!isComponentVisible) {
        setSearchTerm("");
        updateLayout();
      }
    }
  };

  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    if (!disabled) {
      setIsComponentVisible(!isComponentVisible);

      if (!isComponentVisible) {
        setSearchTerm("");
        updateLayout();
      }
    }
  };


  return (
    <div
      className={clsx(
        "relative flex w-fit items-center text-black dark:text-white",
        className
      )}
      ref={ref}
    >
      <div
        className={clsx(
          "relative mx-0 inline-flex min-w-0 w-full flex-col p-0 align-top text-black dark:text-white",
          // {
          //   "pointer-events-none text-black/50 dark:text-white/50": disabled,
          //   "mt-2 mb-1": margin === "dense",
          //   "mt-4 mb-2": margin === "normal",
          //   "mt-0 mb-0": margin == "none",
          // }
        )}
      >
        <label
          className={clsx("pointer-events-none absolute left-0 top-0 z-10 block origin-top-left max-w-[calc(100%-24px)] translate-x-3.5 translate-y-4 scale-100 transform overflow-hidden text-ellipsis font-normal leading-6 transition duration-200 text-base", {
            "!pointer-events-auto !max-w-[calc(133%-32px)] !-translate-y-2 !translate-x-3.5 !scale-75 !select-none": isComponentVisible || selectedOptions.filter((o) => o != null && o.selected).length > 0 || searchTerm.length > 0,
          })}
          htmlFor={`input-${name}`}
        >
          Test
          {/* {label ?? name} {required && " *"} */}
        </label>
        <div
          className={clsx("relative box-border inline-flex cursor-text items-center rounded text-base font-normal leading-6 p-2 w-full flex-wrap", btnClassName, {
            "pr-10": !disableClearable && selectedOptions.filter((d) => d != null && d.selected).length == 0,
            "pr-12": !disableClearable && selectedOptions.filter((d) => d != null && d.selected).length > 0,
          })}
        >
          {/* Chips */}
          {renderTags != null ? renderTags(selectedOptions.filter((o) => o != null && o.selected)) : multiple && selectedOptions.filter((o) => o != null && o.selected).length > 0 && selectedOptions.filter((o) => o != null && o.selected).map((option) => (
            <div role="button" className="relative bg-white/10 max-w-[calc(100%-6px)] m-0.5 align-middle select-none appearance-none text-xs inline-flex items-center justify-center whitespace-nowrap h-8 rounded-2xl outline-0 box-border">
              <span className="overflow-hidden text-ellipsis whitespace-nowrap px-3">{option.label}</span>
              {!readOnly && (
                <svg onClick={(e) => handleOptionSelect(e, option)} className="text-white/60 inline-block w-4 h-4 fill-current shrink-0 select-none mr-1 -ml-1.5 hover:text-white/40 transition-colors text-base" viewBox="0 0 24 24" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                </svg>
              )}
            </div>
          ))}

          <input
            aria-invalid="false"
            id={`input-${name}`}
            type="text"
            className={"peer m-0 box-content block h-6 w-0 min-w-[30px] grow rounded border-0 bg-transparent py-2 px-1 font-[inherit] text-base focus:outline-none disabled:pointer-events-none"}
            disabled={disabled}
            value={internalValue}
            readOnly={readOnly}
            placeholder={placeholder}
            onChange={handleInputChange}
            onFocus={handleFocus}
            role="combobox"
          />

          <div className="absolute right-2 top-[calc(50%-14px)] whitespace-nowrap text-black/70 dark:text-white/70">
            {!disableClearable &&
              selectedOptions.filter((d) => d != null && d.selected).length > 0 && (
                <button type="button" onClick={handleClearSelection} className="peer-hover:visible peer-focus:visible relative box-border hover:bg-white/10 transition rounded-full p-1 -mr-0.5 inline-flex justify-center items-center appearance-none">
                  <svg
                    className="h-4 w-4 fill-current shrink-0 select-none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    focusable="false"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              )}
            <button
              type="button"
              onClick={toggleLookup}
              className="hover:bg-white/10 transition rounded-full p-1 inline-flex justify-center relative -mr-0.5 items-center appearance-none"
            >
              <svg
                className="h-4 w-4"
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
                />
              </svg>
            </button>
          </div>
          <fieldset
            aria-hidden="true"
            style={{
              inset: "-5px 0px 0px",
            }}
            className={clsx(
              "pointer-events-none absolute m-0 min-w-0 overflow-hidden rounded border border-zinc-500 px-2 text-left transition duration-75 peer-invalid:!border-red-500 peer-hover:border-2 peer-hover:border-zinc-300 peer-focus:border-2 peer-focus:border-zinc-300 peer-disabled:border peer-disabled:border-zinc-500",
              {
                "top-0": isComponentVisible || selectedOptions.filter((o) => o != null && o.selected).length > 0 || searchTerm.length > 0,
              }
            )}
          >
            <legend
              style={{ float: "unset", height: "11px" }}
              className={clsx(
                "invisible block w-auto max-w-[.01px] overflow-hidden whitespace-nowrap p-0 !text-xs transition-all duration-75",
                {
                  "!max-w-full": isComponentVisible || selectedOptions.filter((o) => o != null && o.selected).length > 0 || searchTerm.length > 0
                }
              )}
            >
              <span className="visible inline-block px-1 opacity-0">
                Test
              </span>
            </legend>
          </fieldset>
        </div>
      </div>

      {/* <button
        type="button"
        onClick={toggleLookup}
        className={clsx(
          "rw-input group/lookup min-w-[10rem] flex h-full select-none items-center bg-zinc-50 text-center transition ease-in hover:border-zinc-400 dark:bg-zinc-600",
          btnClassName,
          {
            "cursor-not-allowed": disabled,
          }
        )}
      >
        <div className="flex max-w-xs truncate whitespace-nowrap">
          {customDisplay
            ? customDisplay(selectedOptions)
            : selectedOptions.filter((o) => o != null).length > 0
              ? `${selectedOptions
                .filter((o) => o != null && o?.label != null)
                .map((o) => o?.label)
                .slice(
                  0,
                  limitTags && !isComponentVisible ? limitTags : undefined
                )
                .join(", ")} ${limitTags &&
                  selectedOptions.length - limitTags > 0 &&
                  !isComponentVisible
                  ? `+${selectedOptions.length - limitTags}`
                  : ""
              }`
              : placeholder}
        </div>

        <div className="pointer-events-none ml-auto flex select-none flex-row transition-all">
          {!disableClearable &&
            selectedOptions.filter((d) => d != null).length > 0 && (
              <svg
                onClick={handleClearSelection}
                fill="currentColor"
                className={"pointer-events-auto ml-2 h-4 w-4 group-focus/lookup:visible group-hover/lookup:visible invisible"}
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
      </button> */}

      {/* Dropdown Menu */}
      <div
        role="menu"
        style={{
          top: `${menuPosition.top}px`,
          left: `${menuPosition.left}px`,
        }}
        className={clsx(
          "absolute z-30 w-fit min-w-[15rem] max-w-full select-none rounded-lg border border-zinc-500 bg-white shadow transition-all duration-300 ease-in-out dark:bg-zinc-800",
          {
            invisible: !isComponentVisible,
            visible: isComponentVisible,
          }
        )}
      >
        {/* {(search || multiple) && (
          <div className="rw-button-group !my-0 w-full rounded-none border-b border-zinc-500">
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
        )} */}

        <ul
          className="relative z-10 max-h-48 space-y-1 overflow-y-auto pt-0 text-gray-700 dark:text-gray-200 will-change-scroll"
          aria-labelledby="dropdownButton"
        >
          {!options || selectedOptions.filter((option) => {
            if (filterSelectedOptions) {
              return !option?.selected && option?.inSearch;
            }

            return option.inSearch;
          }).length == 0 ? (
            <li className="flex items-center py-2 px-4 text-zinc-500/70 dark:text-zinc-300/70">
              No options
            </li>
          ) : null}

          {selectedOptions.filter((option) => {
            if (filterSelectedOptions) {
              return !option?.selected && option?.inSearch;
            }

            return option.inSearch;
          }).map((option) => (
            <li
              key={`option-${option.value}`}
              onClick={(e) => handleOptionSelect(e, option)}
              aria-checked={option.selected}
              className={clsx("flex items-center py-2 px-4 last:rounded-b-lg", {
                "cursor-not-allowed text-zinc-500/50": option.disabled,
                "hover:bg-zinc-200 dark:hover:bg-zinc-600/90 dark:hover:text-white":
                  !option.disabled,
                "first:rounded-t-lg": !search && !multiple,
              })}
            >
              {"image" in option && !option.group && (
                <img
                  className="mr-2 h-6 w-6 rounded-full"
                  src={option.image}
                  alt={option.label}
                />
              )}

              <span className="grow">{option.label}</span>

              {option.selected && (
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
          ))}
        </ul>
      </div>
    </div>
  );
};

