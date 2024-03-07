import { FieldError, RegisterOptions } from "@redwoodjs/forms/dist";
import clsx from "clsx";
import { CSSProperties, Fragment, HTMLAttributes, useEffect, useRef, useState } from "react";

import DateCalendar from "../DateCalendar/DateCalendar";
import Popper from "../Popper/Popper";
import ClickAwayListener from "../ClickAwayListener/ClickAwayListener";
import { FormControl, InputBase, InputLabel } from "../Input/Input";
import Button from "../Button/Button";
import { isDate, toLocaleISODate } from "src/lib/formatters";

type ViewType = "year" | "month" | "day";
type InputFieldProps = {
  margin?: "none" | "dense" | "normal";
  label?: string;
  helperText?: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  InputProps?: {
    style?: CSSProperties;
  };
  HelperTextProps?: Partial<HTMLAttributes<HTMLParagraphElement>>;
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
  variant?: 'contained' | 'outlined' | 'standard';
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "DEFAULT";
  margin?: "none" | "dense" | "normal";
  size?: "small" | "medium" | "large";
  // validation?: RegisterOptions;
} & InputFieldProps;

const DatePicker = ({
  views = ["day", "year"],
  disabled = false,
  readOnly = false,
  defaultValue = new Date(),
  margin = "normal",
  label,
  name,
  helperText,
  required,
  InputProps,
  placeholder,
  variant = 'outlined',
  color = "DEFAULT",
  size = "medium",
  HelperTextProps,
  onChange,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    defaultValue && isDate(defaultValue) ? new Date(defaultValue) : null
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
    success: `border-success-500`,
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

    onChange?.(e)
  };

  const handleBlur = (e) => {
    // if (selectedDate) {
    //   setInternalValue(new Date(selectedDate).toDateString());
    // }
  };

  const handleClick = (e) => {
    setOpen(!open);
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

  useEffect(() => {
    setInternalValue(defaultValue.toLocaleDateString(navigator && navigator.language, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }));
  }, [defaultValue])

  return (
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
        onClick={handleClick}
        defaultValue={internalValue}
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
          readOnly={readOnly}
          {...InputProps}
          renderSuffix={(state) => (
            variant === 'outlined' ? (
              <fieldset aria-hidden className={clsx(`border transition-colors ease-in duration-75 absolute text-left ${borders[disabled || state.disabled ? 'disabled' : state.focused ? color : 'DEFAULT']} bottom-0 left-0 right-0 -top-[5px] m-0 px-2 rounded-[inherit] min-w-0 overflow-hidden pointer-events-none`)}>
                <legend className={clsx("w-auto overflow-hidden block invisible text-xs p-0 h-[11px] whitespace-nowrap transition-all", {
                  "max-w-full": open || state.focused || state.filled,
                  "max-w-[0.01px]": !state.focused && !state.filled && !open
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
              ignoreButtonGroupPosition
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
        {/* TODO: add formerror */}
        {helperText && (
          <p className="mt-0.5 text-left text-xs leading-6 tracking-wide text-black/60 dark:text-white/70" {...HelperTextProps}>
            {helperText}
          </p>
        )}
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
              defaultValue={selectedDate || new Date()}
              onChange={(date) => {
                setSelectedDate(date);
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
    </div>
  );
};

export default DatePicker;
