import { FieldError } from "@redwoodjs/forms/dist";
import clsx from "clsx";
import { CSSProperties, Fragment, useRef, useState } from "react";

import DateCalendar from "../DateCalendar/DateCalendar";
import Popper from "../Popper/Popper";
import ClickAwayListener from "../ClickAwayListener/ClickAwayListener";
import { FormControl, InputBase, InputLabel } from "../Input/Input";
import Button from "../Button/Button";

type ViewType = "year" | "month" | "day";
type InputFieldProps = {
  margin?: "none" | "dense" | "normal";
  label?: string;
  helperText?: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  btnClassName?: string;
  InputProps?: {
    style?: CSSProperties;
  };
};
type DatePickerProps = {
  displayWeekNumber?: boolean;
  showDaysOutsideCurrentMonth?: boolean;
  fixedWeekNumber?: number;
  views?: ViewType[];
  disabled?: boolean;
  readOnly?: boolean;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  firstDayOfWeek?: number;
  variant?: 'filled' | 'outlined' | 'standard';
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "DEFAULT";
  margin?: "none" | "dense" | "normal";
  size?: "small" | "medium" | "large";
} & InputFieldProps;

const DatePicker = ({
  views = ["day", "year"],
  disabled = false,
  readOnly = false,
  defaultValue = new Date(),
  margin = "normal",
  btnClassName,
  label,
  name,
  helperText,
  required,
  InputProps,
  placeholder,
  variant = 'outlined',
  color = "DEFAULT",
  size = "medium",
  onChange,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const [activeSegment, setActiveSegment] = useState(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    defaultValue ? new Date(defaultValue) : null
  );
  const [internalValue, setInternalValue] = useState<string>("");

  const toggleOpen = (
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    if (!disabled) {
      setOpen(!open);
    }
  };

  const borders = {
    primary: `border-blue-400`,
    secondary: `border-zinc-500`,
    success: `border-pea-500`,
    error: `border-red-500`,
    warning: `border-amber-400`,
    disabled: `dark:border-white/30 border-black/30`,
    DEFAULT: `group-hover:border-black group-hover:dark:border-white border-black/20 dark:border-white/20`
  }

  const handleInputChange = (e) => {
    const inputText: string = e.target.value;

    const parsedDate = new Date(inputText);

    setInternalValue(inputText);
    if (
      parsedDate &&
      parsedDate instanceof Date &&
      !isNaN(parsedDate.getTime())
    ) {
      setInternalValue(parsedDate.toLocaleDateString(navigator && navigator.language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }))
      setSelectedDate(parsedDate);
    }
  };

  const handleBlur = (e) => {
    if (selectedDate) {
      setInternalValue(new Date(selectedDate).toDateString());
    }
  };

  const handleClick = (e) => {
    // if (internalValue.length === 0) {
    //   setInternalValue("MM/DD/YYYY");
    //   setActiveSegment("month");
    //   e.target.setSelectionRange(0, 2);

    //   return;
    // }
    // const position = e.target.selectionStart;

    // if (position < 2) {
    //   setActiveSegment("month");
    //   e.target.setSelectionRange(0, 2);
    // } else if (position >= 3 && position <= 5) {
    //   setActiveSegment("day");
    //   e.target.setSelectionRange(3, 5);
    // } else if (position >= 6 && position < 10) {
    //   setActiveSegment("year");
    //   e.target.setSelectionRange(6, 10);
    // } else {
    //   setActiveSegment("month");
    //   e.target.setSelectionRange(0, 2);
    // }
  };

  const handleClose = (event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <div
        className={"group relative flex w-fit min-w-[10rem] items-center text-black dark:text-white"}
      >
        <FormControl
          ref={anchorRef}
          margin={margin}
          disabled={disabled}
          size={size}
          variant={variant}
          color={color}
          required={required}
          className={btnClassName}
        // onClick={handleClick}
        >
          <InputLabel
            children={label ?? name}
            shrink={open
              ||
              internalValue.length > 0
              // || (Array.isArray(value) && value.length > 0)
            }
          />

          <InputBase
            {...InputProps}
            renderSuffix={(state) => (
              variant === 'outlined' ? (
                <fieldset aria-hidden className={clsx(`border transition-colors ease-in duration-75 absolute text-left ${borders[disabled || state.disabled ? 'disabled' : state.focused ? color : 'DEFAULT']} bottom-0 left-0 right-0 -top-[5px] m-0 px-2 rounded-[inherit] min-w-0 overflow-hidden pointer-events-none`)}>
                  <legend className={clsx("w-auto overflow-hidden block invisible text-xs p-0 h-[11px] whitespace-nowrap transition-all", {
                    "max-w-full": state.focused || state.filled,
                    "max-w-[0.01px]": !state.focused && !state.filled
                  })}>
                    {label && label !== "" && (
                      <span className={"px-[5px] inline-block opacity-0 visible"}>
                        {state.required ? (
                          <React.Fragment>
                            {label}
                            &thinsp;{'*'}
                          </React.Fragment>
                        ) : (
                          label
                        )}
                      </span>
                    )}
                  </legend>
                </fieldset>
              ) : null
            )}
            value={internalValue}
            placeholder={placeholder}
            inputProps={{
              spellCheck: false,
              "aria-activedescendant": open ? "" : null,
              onChange: handleInputChange,
              onBlur: handleBlur,
            }}
            endAdornment={(
              <Button
                variant="icon"
                color={"DEFAULT"}
                className="-mr-0.5 !p-2"
                tabIndex={0}
                onClick={(e) => toggleOpen(e)}
                aria-label={`Choose date${selectedDate
                  ? `, selected date is ${selectedDate.toLocaleDateString(
                    navigator && navigator.language,
                    {
                      dateStyle: "long",
                    }
                  )}`
                  : ""
                  }`}
                disabled={disabled}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4">
                  <path d="M384 64h-32V16C352 7.164 344.8 0 336 0S320 7.164 320 16V64H128V16C128 7.164 120.8 0 112 0S96 7.164 96 16V64H64C28.65 64 0 92.65 0 128v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V128C448 92.65 419.3 64 384 64zM32 224h96v64H32V224zM160 288V224h128v64H160zM288 320v64H160v-64H288zM32 320h96v64H32V320zM64 480c-17.67 0-32-14.33-32-32v-31.1h96V480H64zM160 480v-63.1h128V480H160zM416 448c0 17.67-14.33 32-32 32h-64v-63.1h96V448zM416 384h-96v-64h96V384zM416 288h-96V224h96V288zM416 192H32V128c0-17.67 14.33-32 32-32h320c17.67 0 32 14.33 32 32V192z" />
                </svg>
              </Button>
            )}
          />

          {/* {helperText && (
            <p id={helperText && id ? `${id}-helper-text` : undefined} className="rw-helper-text" {...HelperTextProps}>
              {helperText}
            </p>
          )} */}
        </FormControl>

        {/* Menu */}
        <Popper anchorEl={anchorRef?.current} open={open} paddingToAnchor={4}>
          <ClickAwayListener
            onClickAway={handleClose}
          >
            <div
              className={
                "z-30 w-fit min-w-[15rem] max-w-full select-none overflow-hidden rounded-lg border border-zinc-500 bg-white shadow transition-colors duration-300 ease-in-out dark:bg-zinc-800"
              }
            >
              <DateCalendar
                views={views}
                onChange={(date) => {
                  console.log(date)
                  setSelectedDate(date);
                  // TODO: format date
                  setInternalValue(date.toLocaleDateString(navigator && navigator.language, {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }));
                  setOpen(false);
                }}
              />
            </div>
          </ClickAwayListener>
        </Popper>
      </div >
      <div
        className={clsx(
          "relative flex w-fit min-w-[10rem] items-center text-black dark:text-white"
        )}
      >
        <div
          className={clsx(
            "group relative mx-0 inline-flex min-w-0 flex-col p-0 text-black dark:text-white",
            {
              "pointer-events-none text-black/50 dark:text-white/50": disabled,
              "mt-2 mb-1": margin === "dense",
              "mt-4 mb-2": margin === "normal",
              "mt-0 mb-0": margin == "none",
            }
          )}
        // ref={anchorRef}
        >
          {(label || name) && (
            <label
              className={clsx(
                "pointer-events-none absolute left-0 top-0 z-10 block max-w-[calc(100%-24px)] origin-top-left translate-x-3.5 translate-y-4 scale-100 transform overflow-hidden text-ellipsis text-base font-normal leading-6 transition duration-200",
                {
                  "!pointer-events-auto !max-w-[calc(133%-32px)] !-translate-y-2 !translate-x-3.5 !scale-75 !select-none":
                    open ||
                    // lookupOptions.filter((o) => o != null && o.selected).length >
                    //   0 ||
                    // searchTerm.length > 0 ||
                    internalValue.length > 0,
                }
              )}
              htmlFor={`input-${name}`}
            >
              {label ?? name} {required && " *"}
            </label>
          )}
          <div
            className={clsx(
              "relative box-border inline-flex cursor-text items-center rounded pr-3.5 text-base font-normal leading-6 text-black dark:text-white",
              btnClassName
            )}
          >
            <input
              aria-invalid="false"
              id={`input-${name}`}
              type="text"
              inputMode="numeric"
              value={internalValue}
              onBlur={handleBlur}
              onChange={handleInputChange}
              onClick={handleClick}
              // onKeyDown={handleKeyDown}
              placeholder={`MM/DD/YYYY`}
              className={
                "peer m-0 box-content block h-6 w-full min-w-0 grow rounded border-0 bg-transparent py-4 pr-0 pl-3.5 font-[inherit] text-base text-current focus:outline-none disabled:pointer-events-none"
              }
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              autoComplete="off"
            />

            {internalValue != "" && (
              <div
                aria-details="InputAdornment-End"
                className="ml-2 -mr-2 flex h-[0.01em] max-h-8 items-center whitespace-nowrap text-black dark:text-white"
              >
                <button
                  type="button"
                  tabIndex={0}
                  title="Clear value"
                  disabled={disabled}
                  onClick={(e) => {
                    setSelectedDate(null);
                    setInternalValue("");
                  }}
                  className={clsx(
                    "relative box-border inline-flex flex-[0_0_auto] select-none appearance-none items-center justify-center rounded-full p-2 align-middle opacity-0 transition-colors duration-75 hover:bg-white/10 group-hover:opacity-100 peer-hover:opacity-100 peer-focus:opacity-100"
                  )}
                >
                  <svg
                    className="inline-block h-5 w-5 shrink-0 select-none fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    focusable="false"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
            )}
            <div
              aria-details="InputAdornment-End"
              className="ml-2 flex h-[0.01em] max-h-8 items-center whitespace-nowrap text-black dark:text-white"
            >
              <button
                type="button"
                tabIndex={0}
                onClick={toggleOpen}
                aria-label={`Choose date${selectedDate
                  ? `, selected date is ${selectedDate.toLocaleDateString(
                    navigator && navigator.language,
                    {
                      dateStyle: "long",
                    }
                  )}`
                  : ""
                  }`}
                disabled={disabled}
                className="relative -mr-3 box-border inline-flex flex-[0_0_auto] select-none appearance-none items-center justify-center rounded-full p-2 hover:bg-white/10"
              >
                {/* TODO: insert date icon */}
                <svg
                  className="inline-block h-5 w-5 shrink-0 select-none fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  focusable="false"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
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
                "pointer-events-none absolute m-0 min-w-0 overflow-hidden rounded border border-zinc-500 px-2 text-left transition duration-75 group-hover:border-2 group-hover:border-zinc-300 peer-invalid:!border-red-500 peer-focus:border-2 peer-focus:border-zinc-300 peer-disabled:border peer-disabled:border-zinc-500",
                {
                  "top-0": open,
                  // || lookupOptions.filter((o) => o != null && o.selected)
                  //   .length > 0 ||
                  // searchTerm.length > 0 ||
                  // internalValue.length > 0,
                }
              )}
            >
              <legend
                style={{ float: "unset", height: "11px" }}
                className={clsx(
                  "invisible block w-auto max-w-[.01px] overflow-hidden whitespace-nowrap !p-0 !text-xs transition-all duration-75",
                  {
                    "!max-w-full": open && label,
                    // || lookupOptions.filter((o) => o != null && o.selected)
                    //   .length > 0 ||
                    // searchTerm.length > 0 ||
                    // internalValue.length > 0,
                  }
                )}
              >
                {(label || name) && (
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
        {/* <Popper anchorEl={anchorRef.current} open={open}>
          <ClickAwayListener onClickAway={handleClose}>
            <div
              className={
                "z-30 w-fit min-w-[15rem] max-w-full select-none overflow-hidden rounded-lg border border-zinc-500 bg-white shadow transition-colors duration-300 ease-in-out dark:bg-zinc-800"
              }
            >
              <DateCalendar
                views={views}
                onChange={(date) => {
                  setSelectedDate(date);
                  setInternalValue(date.toDateString());
                  setOpen(false);
                }}
              />
            </div>
          </ClickAwayListener>
        </Popper> */}
      </div>
    </>
  );
};

export default DatePicker;
