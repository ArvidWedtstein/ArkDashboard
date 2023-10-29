import { FieldError } from "@redwoodjs/forms";
import clsx from "clsx";
import { CSSProperties, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useComponentVisible from "src/components/useComponentVisible";

import DateCalendar from "../DateCalendar/DateCalendar";
import Popper from "../Popper/Popper";
import ClickAwayListener from "../ClickAwayListener/ClickAwayListener";

type ViewType = "year" | "month" | "day";
type InputFieldProps = {
  margin?: "none" | "dense" | "normal";
  label?: string;
  helperText?: string;
  name?: string;
  required?: boolean;
  disableClearable?: boolean;
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
} & InputFieldProps;

const DatePicker = ({
  views = ["day", "year"],
  disabled = false,
  readOnly = false,
  disableClearable,
  defaultValue = new Date(),
  margin = "normal",
  btnClassName,
  label,
  name,
  helperText,
  required,
  InputProps,
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

  const applyDateMask = (value) => {
    let maskedValue = value.replace(/\D/g, ""); // Remove non-numeric characters

    if (maskedValue.length >= 2) {
      maskedValue = maskedValue.slice(0, 2) + "/" + maskedValue.slice(2);
    }
    if (maskedValue.length >= 5) {
      maskedValue = maskedValue.slice(0, 5) + "/" + maskedValue.slice(5);
    }
    if (maskedValue.length > 10) {
      maskedValue = maskedValue.slice(0, 10);
    }

    return maskedValue;
  };

  const updateSegment = (inputText: string, segment, newValue) => {
    const formattedValue = applyDateMask(inputText);
    const segmentIndex = {
      month: [0, 2],
      day: [3, 5],
      year: [6, 10],
    }[segment];

    if (segmentIndex) {
      const chars: string[] = formattedValue.split("");
      console.log("OLDCHARS", formattedValue, segment, newValue);
      chars.splice(
        segmentIndex[0],
        segmentIndex[1] - segmentIndex[0] + 1,
        parseInt(newValue) < 10 ? `0${newValue}` : newValue
      );

      console.log("NEWCHARS", chars.join(""), segment);
      return chars.join("");
    }

    return formattedValue;
  };

  const handleInputChange = (e) => {
    const inputText: string = e.target.value;

    const parsedDate = new Date(inputText);
    let updatedValue = applyDateMask(inputText);

    let updatedVal = updateSegment(
      inputText,
      activeSegment,
      e.nativeEvent.data
    );
    setInternalValue(updatedValue);
    // setInternalValue(updatedValue);
    console.log(updatedVal, updatedValue);
    if (
      parsedDate &&
      parsedDate instanceof Date &&
      !isNaN(parsedDate.getTime())
    ) {
      console.log("parsedDate", parsedDate);
      setSelectedDate(parsedDate);
    }
  };

  const handleBlur = (e) => {
    if (selectedDate) {
      setInternalValue(new Date(selectedDate).toDateString());
    }
  };

  const handleClick = (e) => {
    if (internalValue.length === 0) {
      setInternalValue("MM/DD/YYYY");
      setActiveSegment("month");
      e.target.setSelectionRange(0, 2);

      return;
    }
    const position = e.target.selectionStart;

    if (position < 2) {
      setActiveSegment("month");
      e.target.setSelectionRange(0, 2);
    } else if (position >= 3 && position <= 5) {
      setActiveSegment("day");
      e.target.setSelectionRange(3, 5);
    } else if (position >= 6 && position < 10) {
      setActiveSegment("year");
      e.target.setSelectionRange(6, 10);
    } else {
      setActiveSegment("month");
      e.target.setSelectionRange(0, 2);
    }
  };

  const handleClose = () => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      const { selectionStart, selectionEnd, value } = e.target;
      console.log("position left", selectionStart, selectionEnd);
      if (selectionStart <= 3) {
        setActiveSegment("month");
        e.target.setSelectionRange(0, 2);
      } else if (selectionStart > 3 && selectionStart <= 6) {
        setActiveSegment("day");
        e.target.setSelectionRange(3, 5);
      } else if (selectionStart >= 6 && selectionStart < 10) {
        setActiveSegment("year");
        e.target.setSelectionRange(6, 10);
      } else {
        setActiveSegment("month");
        e.target.setSelectionRange(0, 2);
      }
    } else if (e.key === "ArrowRight") {
      const { selectionStart, selectionEnd, value } = e.target;
      console.log("position right", selectionStart, selectionEnd);

      console.log(e);
      if (selectionStart <= 2) {
        setActiveSegment("month");
        e.target.setSelectionRange(3, 5);
      } else if (selectionStart >= 3 && selectionStart <= 5) {
        setActiveSegment("day");
        e.target.setSelectionRange(6, 10);
      } else if (selectionStart >= 6 && selectionStart < 10) {
        setActiveSegment("year");
        e.target.setSelectionRange(6, 10);
      } else {
        setActiveSegment("month");
        e.target.setSelectionRange(0, 2);
      }
    }
  };

  return (
    <>
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
          ref={anchorRef}
        >
          {(label || name) && (
            <label
              className={clsx(
                "pointer-events-none absolute left-0 top-0 z-10 block max-w-[calc(100%-24px)] origin-top-left translate-x-3.5 translate-y-4 scale-100 transform overflow-hidden text-ellipsis text-base font-normal leading-6 transition duration-200",
                {
                  "!pointer-events-auto !max-w-[calc(133%-32px)] !-translate-y-2 !translate-x-3.5 !scale-75 !select-none":
                    open,
                  // ||
                  // lookupOptions.filter((o) => o != null && o.selected).length >
                  //   0 ||
                  // searchTerm.length > 0 ||
                  // internalValue.length > 0,
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
            {/* TODO: fix date section editing */}
            <input
              aria-invalid="false"
              id={`input-${name}`}
              type="text"
              inputMode="numeric"
              value={internalValue}
              onBlur={handleBlur}
              onChange={handleInputChange}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              placeholder={`MM/DD/YYYY`}
              className={
                "peer m-0 box-content block h-6 w-full min-w-0 grow rounded border-0 bg-transparent py-4 pr-0 pl-3.5 font-[inherit] text-base text-current focus:outline-none disabled:pointer-events-none"
              }
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              autoComplete="off"
            />

            {!disableClearable && internalValue != "" && (
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
                aria-label={`Choose date${
                  selectedDate
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
        <Popper anchorEl={anchorRef.current} open={open}>
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
        </Popper>
      </div>
    </>
  );
};

export default DatePicker;

export const CustomDatePicker = () => {
  const [date, setDate] = useState("DD/MM/YYYY"); // Set the default value
  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    const inputValue = event.target.value.replace(/[^0-9/]/g, "");
    let formattedDate = inputValue;

    if (inputValue.length >= 2) {
      formattedDate = `${inputValue.slice(0, 2)}`;
    }

    if (inputValue.length >= 4) {
      formattedDate = `${inputValue.slice(0, 2)}/${inputValue.slice(2, 4)}`;
    }

    if (inputValue.length > 4) {
      formattedDate = `${inputValue.slice(0, 2)}/${inputValue.slice(
        2,
        4
      )}/${inputValue.slice(4, 8)}`;
    }

    setDate(formattedDate);

    // Automatically move to the next section
    const segmentLengths = [2, 2, 4]; // DD, MM, YYYY
    const currentSegment = Math.min(
      segmentLengths.length - 1,
      formattedDate.split("/").length - 1
    );
    const cursorPosition = formattedDate
      .split("/")
      .slice(0, currentSegment + 1)
      .join("/").length;
    const nextCursorPosition = cursorPosition + segmentLengths[currentSegment];

    if (nextCursorPosition <= formattedDate.length) {
      inputRef.current.setSelectionRange(
        nextCursorPosition,
        nextCursorPosition
      );
    }
  };

  return (
    <div>
      <input
        type="text"
        ref={inputRef}
        value={date}
        onChange={handleInputChange}
      />
    </div>
  );
};

// OLD CODE
// const DatePicker = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const getNextMonth = () => {
//     const nextDate = new Date(currentDate);
//     nextDate.setMonth(nextDate.getMonth() + 1);
//     setCurrentDate(nextDate);
//   };

//   const getPrevMonth = () => {
//     const prevDate = new Date(currentDate);
//     prevDate.setMonth(prevDate.getMonth() - 1);
//     setCurrentDate(prevDate);
//   };

//   const renderCalendar = () => {
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth();

//     const startOfMonth = new Date(year, month, 1);
//     const endOfMonth = new Date(year, month + 1, 0);
//     const daysInMonth = endOfMonth.getDate();

//     const weeks = [];
//     let week = [];
//     let day = new Date(startOfMonth);

//     // Add empty cells for the days before the start of the month
//     // add empty cells for the days before the start of the year (if the week starts on a sunday)
//     if (startOfMonth.getDay() === 0) {
//       for (let i = 0; i < 6; i++) {
//         week.push(<div key={`empty-${i}`} className="flex-1 h-10"></div>);
//       }
//     } else {
//       for (let i = 0; i < startOfMonth.getDay() - 1; i++) {
//         week.push(<div key={`empty-${i}`} className="flex-1 h-10"></div>);
//       }
//     }

//     // Render the days of the month
//     for (let i = 1; i <= daysInMonth; i++) {
//       const weekday = new Date(year, month, i).toLocaleDateString('en-US', { weekday: 'short' });
//       week.push(
//         <div key={`day-${i}`} className="flex-1 flex flex-col items-center">
//           <div className="text-xs text-gray-500">{weekday}</div>
//           <div className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-zinc-300 select-none">
//             {i}
//           </div>
//         </div>
//       );

//       // Start a new week when reaching the end of the current week
//       if (day.getDay() === 0) {
//         weeks.push(<div key={`week-${day}`} className="flex">{week}</div>);
//         week = [];
//       }

//       day.setDate(day.getDate() + 1);
//     }

//     // Add empty cells for the days after the end of the month
//     // add empty cells for the days after the end of the year (if the week ends on a sunday)

//     if (endOfMonth.getDay() !== 0) {
//       for (let i = endOfMonth.getDay(); i < 7; i++) {
//         week.push(
//           <div key={`empty-${i}`} className="flex-1 h-10"></div>
//         );
//       }
//     } else {
//       for (let i = 0; i < 6; i++) {
//         week.push(<div key={`empty-${i}`} className="flex-1 h-10"></div>);
//       }
//     }

//     weeks.push(<div key={`week-${day}`} className="flex">{week}</div>);

//     return weeks;
//   };

//   const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

//   return (
//     <div className="max-w-md mx-auto">
//       <div className="flex justify-between mb-4">
//         <button className="rw-button rw-button-medium rw-button-green-outline" onClick={getPrevMonth}>
//           Previous Month
//         </button>
//         <div className="text-lg text-white">{monthYear}</div>
//         <button className="rw-button rw-button-medium rw-button-green-outline" onClick={getNextMonth}>
//           Next Month
//         </button>
//       </div>
//       <div className="bg-gray-200 p-4">
//         <div className="flex mb-2">
//           <div className="flex-1 text-center">Mon</div>
//           <div className="flex-1 text-center">Tue</div>
//           <div className="flex-1 text-center">Wed</div>
//           <div className="flex-1 text-center">Thu</div>
//           <div className="flex-1 text-center">Fri</div>
//           <div className="flex-1 text-center">Sat</div>
//           <div className="flex-1 text-center">Sun</div>
//         </div>
//         {renderCalendar()}
//       </div>
//     </div>
//   );
// };
