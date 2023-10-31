import { FieldError, RegisterOptions, useController } from "@redwoodjs/forms";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { ArrayElement } from "src/lib/formatters";
import clsx from "clsx";
import Popper from "../Popper/Popper";
import ClickAwayListener from "../ClickAwayListener/ClickAwayListener";

type value = string | object | number | null | undefined;

interface ILookup {
  defaultValue?: string[];
  value?: string[];
  label?: string;
  name?: string;
  className?: string;
  btnClassName?: string;
  disabled?: boolean;
  helperText?: string;
  disableClearable?: boolean;
  readOnly?: boolean;
  filterlookupOptions?: boolean;
  multiple?: boolean;
  required?: boolean;
  selectOnFocus?: boolean;
  closeOnSelect?: boolean;
  inputValue?: string;
  validation?: RegisterOptions;
  margin?: "none" | "dense" | "normal";
  size?: "small" | "medium";
  options: {
    label: string;
    // TODO: fix return type
    value: string | object | number;
    image?: string;
    disabled?: boolean;
    [key: string]: string | object | number | boolean | undefined;
  }[];
  groupBy?: (option: ILookup["options"][0]) => string;
  renderTags?: (lookupOptions: Readonly<ILookup["options"]>) => React.ReactNode;
  onInputChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    newInputValue: string
  ) => void;
  onSelect?: (options: ILookup["options"]) => void;
  filterFn?: (
    option: { label: string; value: value; image?: string },
    searchTerm: string
  ) => boolean;
  InputProps?: {
    style?: CSSProperties;
  };
  placeholder?: string;
}

// TODO: fix error styles
export const Lookup = ({
  options,
  label,
  name,
  defaultValue,
  value,
  className,
  btnClassName,
  placeholder,
  inputValue,
  helperText,
  validation,
  margin = "normal",
  size = "medium",
  selectOnFocus = false,
  disabled = false,
  readOnly = false,
  required = false,
  disableClearable = false,
  multiple = false,
  closeOnSelect = true,
  filterlookupOptions = false,
  InputProps,
  groupBy,
  renderTags,
  onSelect,
  onInputChange,
  filterFn,
}: ILookup) => {
  const anchorEl = useRef(null);
  const [open, setOpen] = useState(false);
  // Convert this to store all options instead and set selected to the ones that are selected
  interface ILookupOptions extends ArrayElement<ILookup["options"]> {
    selected: boolean;
    inSearch: boolean;
  }
  const [lookupOptions, setLookupOptions] = useState<ILookupOptions[]>([]);

  const { field } =
    !!name &&
    useController({
      name: name,
      defaultValue: defaultValue || value,
      rules: validation,
    });
  const [searchTerm, setSearchTerm] = useState<string>(inputValue || "");
  const [internalValue, setInternalValue] = useState<string>("");

  useEffect(() => {
    setLookupOptions((prev) =>
      prev.map((option) => {
        if (searchTerm && filterFn) {
          return {
            ...option,
            inSearch: filterFn(option, searchTerm),
          };
        }

        return {
          ...option,
          inSearch:
            !searchTerm ||
            option.label.toLowerCase().includes(searchTerm.toLowerCase()),
        };
      })
    );
  }, [options, searchTerm, filterFn]);

  // Update selectedOption when defaultValue changes
  useEffect(() => {
    setSearchTerm("");
    setInternalValue("");
    const valuesToSelect: string[] =
      (value ?? defaultValue)
        ?.map((s) => s?.trim())
        .slice(0, multiple ? undefined : 1) || [];

    const selected: ILookupOptions[] = options.map((option) => {
      const isSelected = valuesToSelect.includes(option.value.toString());

      return {
        ...option,
        selected: isSelected,
        inSearch:
          !searchTerm ||
          option.label.toLowerCase().includes(searchTerm.toLowerCase()),
      };
    });

    setLookupOptions(selected);
    !!name && field.onChange(multiple ? valuesToSelect : valuesToSelect[0]);
    setInternalValue(
      multiple
        ? ""
        : options?.find((e) => e.value === valuesToSelect[0])?.label ?? ""
    );
  }, [defaultValue, value]);

  const handleOptionSelect = useCallback(
    (
      event: React.MouseEvent<HTMLLIElement> | React.MouseEvent<SVGSVGElement>,
      option: ArrayElement<ILookup["options"]>
    ) => {
      event.preventDefault();

      if (!option || option.disabled) return;

      const isSelected = lookupOptions.some(
        (o) => o?.value === option.value && o?.selected
      );

      const updateOptions = lookupOptions.map((o) => {
        if (o?.value === option.value) {
          return {
            ...o,
            selected: !isSelected,
          };
        }

        return multiple ? o : { ...o, selected: false };
      });

      setLookupOptions(updateOptions);

      if (!!name) {
        field.onChange(
          multiple
            ? updateOptions
              .filter((f) => f != null && f.selected)
              .map((o) => o?.value)
            : option.value
        );
      }

      onSelect?.(multiple ? updateOptions : [option]);

      if (closeOnSelect && !isSelected) {
        setOpen(false);
      }

      setSearchTerm("");
      setInternalValue(multiple ? "" : option.label);
    },
    [lookupOptions, multiple, onSelect]
  );

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value || "");
    setInternalValue(event.target.value || "");
    onInputChange?.(event, event.target.value);
  };

  const handleClearSelection = () => {
    setLookupOptions((prev) => prev.map((o) => ({ ...o, selected: false })));
    setSearchTerm("");
    setInternalValue("");
    onSelect?.([]);
    name && field.onChange([]);
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent> | React.SyntheticEvent) => {
    if (
      anchorEl.current &&
      anchorEl.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const toggleLookup = (
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    if (!disabled) {
      setOpen(!open);

      const input = anchorEl.current.querySelector("input");
      if (e.currentTarget.type == "button") input?.focus();

      if (!open) {
        if (selectOnFocus) {
          input?.select();
        }

        // TODO: fix this / check if it really is needed
        setSearchTerm("");
      }
    }
  };

  const renderOption = (
    option: ILookupOptions,
    index: number
  ): React.JSX.Element => {
    return (
      <li
        key={`option-${option.value}-${index}`}
        onClick={(e) => handleOptionSelect(e, option)}
        aria-checked={option.selected}
        aria-disabled={option.disabled}
        // TODO: add check if group is over or under
        className={clsx("flex items-center last:rounded-b-lg", {
          "cursor-not-allowed text-zinc-500/50": option.disabled,
          "px-2 py-1": size === 'small',
          "py-2 px-4": size === 'medium',
          "first:rounded-t-lg": index == 0 && !groupBy,
          "hover:bg-zinc-200 dark:hover:bg-zinc-600/90 dark:hover:text-white":
            !option.disabled,
        })}
      >
        {"image" in option && (
          <img className="mr-2 h-6 w-6" src={option.image} alt={option.label} />
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
    );
  };

  return (
    <div
      className={clsx(
        "relative flex w-fit min-w-[10rem] items-center text-black dark:text-white",
        className
      )}
    >
      <div
        className={clsx(
          "relative mx-0 inline-flex w-full min-w-0 flex-col p-0 align-top text-black dark:text-white",
          {
            "pointer-events-none text-black/50 dark:text-white/50": disabled,
            "mt-2 mb-1": margin === "dense",
            "mt-4 mb-2": margin === "normal",
            "mt-0 mb-0": margin == "none",
          }
        )}
        ref={anchorEl}
      >
        <label
          className={clsx(
            "pointer-events-none absolute left-0 top-0 z-10 block max-w-[calc(100%-24px)] origin-top-left translate-x-3.5 translate-y-4 scale-100 transform overflow-hidden text-ellipsis font-normal leading-6 transition duration-200",
            {
              "!pointer-events-auto !max-w-[calc(133%-32px)] !-translate-y-2 !translate-x-3.5 !scale-75 !select-none":
                open ||
                lookupOptions.filter((o) => o != null && o.selected).length >
                0 ||
                searchTerm.length > 0 ||
                internalValue.length > 0,
              "text-sm": size == "small",
              "text-base": size == "medium",
            }
          )}
          htmlFor={`input-${name}`}
        >
          {label ?? name} {required && " *"}
        </label>
        <div
          className={clsx(
            "relative box-border inline-flex w-full cursor-text flex-wrap items-center rounded font-normal leading-6",
            btnClassName,
            {
              "pr-10":
                !disableClearable &&
                lookupOptions.filter((d) => d != null && d.selected).length ==
                0,
              "pr-12":
                !disableClearable &&
                lookupOptions.filter((d) => d != null && d.selected).length > 0,
              "text-sm": size == "small",
              "text-base": size == "medium",
            }
          )}
        >
          {/* Chips */}
          {renderTags != null
            ? renderTags(lookupOptions.filter((o) => o != null && o.selected))
            : multiple &&
            lookupOptions.filter((o) => o != null && o.selected).length > 0 &&
            lookupOptions
              .filter((o) => o != null && o.selected)
              .map((option) => (
                <div
                  role="button"
                  className="relative m-0.5 box-border inline-flex h-8 max-w-[calc(100%-6px)] select-none appearance-none items-center justify-center whitespace-nowrap rounded-2xl bg-white/10 align-middle text-xs outline-0"
                >
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap px-3">
                    {option.label}
                  </span>
                  {!readOnly && (
                    <svg
                      onClick={(e) => handleOptionSelect(e, option)}
                      className="mr-1 -ml-1.5 inline-block h-4 w-4 shrink-0 select-none fill-current text-base text-white/60 transition-colors hover:text-white/40"
                      viewBox="0 0 24 24"
                      focusable="false"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                    </svg>
                  )}
                </div>
              ))}

          <input
            aria-invalid="false"
            id={`input-${name}`}
            type="text"
            className={
              clsx("peer m-0 box-content block h-6 w-0 min-w-[30px] grow rounded-[inherit] border-0 bg-transparent font-[inherit] focus:outline-none disabled:pointer-events-none", {
                "pl-2 py-1 pr-1 text-sm": size == "small",
                "py-4 px-3 text-base": size === "medium",
              })
            }
            disabled={disabled}
            value={internalValue}
            readOnly={readOnly}
            required={required}
            placeholder={placeholder}
            onChange={handleInputChange}
            onClick={toggleLookup}
            role="combobox"
          />

          <div className="absolute right-2 top-[calc(50%-14px)] whitespace-nowrap text-black/70 dark:text-white/70">
            {!disableClearable &&
              lookupOptions.filter((d) => d != null && d.selected).length >
              0 && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="relative -mr-0.5 box-border inline-flex appearance-none items-center justify-center rounded-full p-1 align-middle transition-colors duration-75 hover:bg-white/10 peer-hover:visible peer-focus:visible"
                >
                  <svg
                    className="h-4 w-4 shrink-0 select-none fill-current"
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
              className="relative -mr-0.5 inline-flex select-none appearance-none items-center justify-center rounded-full p-1 align-middle transition-colors duration-75 hover:bg-white/10"
            >
              <svg
                className={clsx(
                  "h-4 w-4 transition-transform duration-75 will-change-transform",
                  {
                    "shrink-0": !open,
                    "shrink-0 rotate-180": open,
                  }
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={"M19 9l-7 7-7-7"}
                />
              </svg>
            </button>
          </div>
          <fieldset
            aria-hidden="true"
            style={{
              ...InputProps?.style,
              inset: "-5px 0px 0px",
            }}
            className={clsx(
              "pointer-events-none absolute m-0 min-w-0 overflow-hidden rounded-[inherit] border border-zinc-500 px-2 text-left transition duration-75 peer-invalid:!border-red-500 peer-hover:border-2 peer-hover:border-zinc-300 peer-focus:border-2 peer-focus:border-zinc-300 peer-disabled:border peer-disabled:border-zinc-500",
              {
                "top-0":
                  open ||
                  lookupOptions.filter((o) => o != null && o.selected).length >
                  0 ||
                  searchTerm.length > 0 ||
                  internalValue.length > 0,
              }
            )}
          >
            <legend
              style={{ float: "unset", height: "11px" }}
              className={clsx(
                "invisible block w-auto max-w-[.01px] overflow-hidden whitespace-nowrap !p-0 !text-xs transition-all duration-75",
                {
                  "!max-w-full":
                    open ||
                    lookupOptions.filter((o) => o != null && o.selected)
                      .length > 0 ||
                    searchTerm.length > 0 ||
                    internalValue.length > 0,
                }
              )}
            >
              {(label ?? name) && (
                <span className="visible inline-block px-1 opacity-0">
                  {label ?? name} {required && " *"}
                </span>
              )}
            </legend>
          </fieldset>
        </div>

        {!!name && <FieldError name={name} className="rw-field-error" />}
        {helperText && (
          <p
            id={`${name}-helper-text`}
            className="mx-3 mt-0.5 mb-0 text-left text-xs font-normal leading-5 tracking-wide text-black/70 dark:text-white/70"
          >
            {helperText}
          </p>
        )}
      </div>

      {/* Dropdown Menu */}
      <Popper anchorEl={anchorEl.current} open={open} paddingToAnchor={4}>
        <ClickAwayListener onClickAway={handleClose}>
          <div
            role="menu"
            className={
              clsx("z-30 w-fit max-w-full select-none overflow-hidden rounded-lg border border-zinc-500 bg-white shadow transition-colors duration-300 ease-in-out dark:bg-zinc-800", {
                "min-w-[10rem]": size === 'small',
                "min-w-[15rem]": size === 'medium',
              })
            }
          >
            <ul
              className="relative max-h-48 space-y-1 overflow-y-auto pt-0 text-gray-700 will-change-scroll dark:text-gray-200"
              aria-labelledby="dropdownButton"
              role="listbox"
            >
              {!options ||
                (lookupOptions.filter((option) => {
                  if (filterlookupOptions) {
                    return !option?.selected && option?.inSearch;
                  }

                  return option.inSearch;
                }).length == 0 && (
                    <li className="flex items-center py-2 px-4 text-zinc-500/70 dark:text-zinc-300/70">
                      No options
                    </li>
                  ))}

              {groupBy
                ? Object.entries(
                  lookupOptions
                    .filter((option) => {
                      if (filterlookupOptions) {
                        return !option?.selected && option?.inSearch;
                      }

                      return option.inSearch;
                    })
                    .reduce((acc, obj) => {
                      let groupKey: any = obj; // Use 'any' type for indexing

                      groupKey = groupBy(obj);

                      if (!acc.hasOwnProperty(groupKey)) {
                        acc[groupKey] = [];
                      }

                      acc[groupKey].push(obj);
                      return acc;
                    }, {})
                ).map(
                  ([groupTitle, groupedItems]: [
                    groupedTitle: string,
                    groupedItems: ILookupOptions[]
                  ]) => (
                    <li
                      className="overflow-hidden"
                      key={`group-${groupTitle}`}
                    >
                      <div className="px-2 py-1">{groupTitle}</div>
                      <ul>{groupedItems.map(renderOption)}</ul>
                    </li>
                  )
                )
                : lookupOptions
                  .filter((option) => {
                    if (filterlookupOptions) {
                      return !option?.selected && option?.inSearch;
                    }

                    return option.inSearch;
                  })
                  .map(renderOption)}
            </ul>
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};
