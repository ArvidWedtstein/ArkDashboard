import { FieldError } from "@redwoodjs/forms";
import clsx from "clsx";
import { format, isValid, parse } from "date-fns";
import { CSSProperties, MouseEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useComponentVisible from "src/components/useComponentVisible";
import {
  addToDate,
  adjustCalendarDate,
  getDaysBetweenDates,
  getISOWeek,
  getWeekdays,
  toLocaleISODate,
} from "src/lib/formatters";

function toLocalPeriod(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
}

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
  displayWeekNumber = false,
  showDaysOutsideCurrentMonth = true,
  fixedWeekNumber,
  views = ["day", "year"],
  disabled = false,
  readOnly = false,
  disableClearable,
  defaultValue = new Date(),
  firstDayOfWeek = 1,
  margin = "normal",
  btnClassName,
  label,
  name,
  helperText,
  required,
  InputProps,
  onChange,
}: DatePickerProps) => {
  const { ref, setIsComponentVisible, isComponentVisible } =
    useComponentVisible(false);

  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [activeSegment, setActiveSegment] = useState(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    defaultValue ? new Date(defaultValue) : null
  );
  const [internalValue, setInternalValue] = useState<string>("");
  const [period, setPeriod] = useState<string>(() =>
    toLocalPeriod(defaultValue)
  );
  const [currentView, setCurrentView] = useState<ViewType>(
    views.includes("day") ? "day" : views[0] || "day"
  );

  const updateLayout = () => {
    if (!ref?.current) return;

    const spaceingToButton = 4;
    const btn = (ref.current.firstChild as HTMLDivElement)
      .children[0] as HTMLDivElement;
    const menu = ref.current.lastChild as HTMLDivElement;

    const btnBounds = btn.getBoundingClientRect();
    const menuBounds = menu.getBoundingClientRect();

    let dropdownLeft = btnBounds.left;
    let dropdownTop = btnBounds.top + btnBounds.height + spaceingToButton;

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

  const days = getWeekdays(firstDayOfWeek);

  const useCalendarDateRange = (
    period: string | Date,
    weekStartsOn: number = 0
  ) => {
    const [first, setFirst] = useState(() =>
      adjustCalendarDate(
        adjustCalendarDate(new Date(period), "start", "month"),
        "start",
        "week",
        weekStartsOn
      )
    );
    const [last, setLast] = useState(() =>
      adjustCalendarDate(new Date(period), "end", "month")
    );

    useEffect(() => {
      setFirst(
        adjustCalendarDate(
          adjustCalendarDate(new Date(period), "start", "month"),
          "start",
          "week",
          weekStartsOn
        )
      );
      setLast(adjustCalendarDate(new Date(period), "end", "month"));
    }, [period, weekStartsOn]);

    return [first, last];
  };

  const onSelectDate = (e: MouseEvent<HTMLButtonElement>, date: Date) => {
    if (readOnly) return;
    setSelectedDate(date);

    if (date.getMonth() !== Number(period.substring(5)) - 1) {
      if (date.getMonth() < Number(period.substring(5)) - 1) {
        navigateMonth(-1);
      } else {
        navigateMonth(1);
      }
    }

    onChange?.(date);
  };

  const [firstDay, lastDay] = useCalendarDateRange(period, firstDayOfWeek);

  const daysOfMonth = Array.from(
    {
      length:
        !!fixedWeekNumber && fixedWeekNumber > 0
          ? fixedWeekNumber
          : getDaysBetweenDates(firstDay, lastDay).length / 7 + 1,
    },
    (_, weekIndex) => {
      return Array.from({ length: 7 }, (_day, index) => {
        return addToDate(firstDay, weekIndex * 7 + index, "day");
      });
    }
  );

  const years = Array.from(
    { length: 2100 - 1900 + 1 },
    (_, index) => 1900 + index
  );

  const months = Array.from({ length: 12 }, (_, index) => index + 1).map(
    (month) => {
      return new Date(`${Number(period.substring(0, 4))}-${month}`);
    }
  );

  const navigateMonth = (change: -1 | 1) => {
    const newDate = addToDate(new Date(period), change, "month");

    setPeriod(toLocalPeriod(newDate));
  };

  const selectYear = (year: number) => {
    if (readOnly) return;

    const newDate = new Date(`${year}-${Number(period.substring(5))}`);
    setPeriod(toLocalPeriod(newDate));
    setCurrentView(views.includes("month") ? "month" : "day");
  };

  const selectMonth = (month: number) => {
    if (readOnly) return;

    const newDate = new Date(`${Number(period.substring(0, 4))}-${month}`);
    setPeriod(toLocalPeriod(newDate));
    setCurrentView(views.includes("day") ? "day" : "year");
  };

  const selectView = (view: ViewType) => {
    setCurrentView(view);
  };

  const toggleOpen = (
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>
  ) => {
    e.stopPropagation();

    if (!disabled) {
      setIsComponentVisible(!isComponentVisible);

      if (!isComponentVisible) {
        updateLayout();
      }
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

  const updateSegment = (inputText, segment, newValue) => {
    const formattedValue = applyDateMask(inputText);
    const segmentIndex = {
      month: [0, 2],
      day: [3, 5],
      year: [6, 10],
    }[segment];

    if (segmentIndex) {
      const chars = formattedValue.split("");
      chars.splice(
        segmentIndex[0],
        segmentIndex[1] - segmentIndex[0] + 1,
        newValue
      );
      return chars.join("");
    }

    return formattedValue;
  };

  const handleInputChange = (e) => {
    const inputText: string = e.target.value;

    const parsedDate = parse(inputText, "MM/dd/yyyy", new Date());
    let updatedValue = applyDateMask(inputText);

    console.log(
      "updatedValue",
      updateSegment(updatedValue, activeSegment, e.target.key)
    );
    setInternalValue(updatedValue);
    console.log(updatedValue);
    if (
      parsedDate &&
      parsedDate instanceof Date &&
      !isNaN(parsedDate.getTime())
    ) {
      console.log("parsedDate", parsedDate);
      setSelectedDate(parsedDate);
    }
  };

  const formatAndSetDate = (value) => {
    setInternalValue(value);

    if (value.length === 10) {
      const parsedDate = parse(value, "MM/dd/yyyy", new Date());

      if (isValid(parsedDate)) {
        setSelectedDate(parsedDate);
      }
    }
  };

  const handleBlur = (e) => {
    if (selectedDate) {
      setInternalValue(format(selectedDate, "MM/dd/yyyy"));
    }
  };

  const handleClick = (e) => {
    const position = e.target.selectionStart;
    console.log("position", position);
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

  return (
    <>
      <div
        className={clsx(
          "relative flex w-fit min-w-[10rem] items-center text-black dark:text-white"
        )}
        ref={ref}
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
        >
          {(label || name) && (
            <label
              className={clsx(
                "pointer-events-none absolute left-0 top-0 z-10 block max-w-[calc(100%-24px)] origin-top-left translate-x-3.5 translate-y-4 scale-100 transform overflow-hidden text-ellipsis text-base font-normal leading-6 transition duration-200",
                {
                  "!pointer-events-auto !max-w-[calc(133%-32px)] !-translate-y-2 !translate-x-3.5 !scale-75 !select-none":
                    isComponentVisible,
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
                  "top-0": isComponentVisible,
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
                    "!max-w-full": isComponentVisible && label,
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
        {createPortal(
          <div
            role="menu"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              position: "absolute",
            }}
            className={clsx(
              "z-30 w-fit min-w-[15rem] max-w-full select-none overflow-hidden rounded-lg border border-zinc-500 bg-white shadow transition-colors duration-300 ease-in-out dark:bg-zinc-800",
              {
                invisible: !isComponentVisible,
                visible: isComponentVisible,
              }
            )}
          >
            <div
              className="mx-auto flex h-fit max-h-[334px] w-80 flex-col overflow-hidden"
              aria-labelledby="dropdownButton"
            >
              <div className="mb-2 mt-4 flex max-h-8 min-h-[2rem] items-center justify-center pr-3 pl-6 text-white">
                <div
                  className="mr-auto flex cursor-pointer items-center justify-center overflow-hidden text-base font-medium"
                  role="presentation"
                  aria-live="polite"
                  onClick={() =>
                    currentView === "year" || currentView === "month"
                      ? selectView("day")
                      : views.includes("year") || views.includes("month")
                      ? selectView(views.includes("year") ? "year" : "month")
                      : selectView("day")
                  }
                >
                  <div className="relative block">
                    <div
                      className={
                        "mr-1.5 opacity-100 transition-opacity duration-200"
                      }
                    >
                      {new Date(period).toLocaleDateString(
                        navigator && navigator.language,
                        { month: "long", year: "numeric" }
                      )}
                    </div>
                  </div>

                  {!disabled && (
                    <button
                      onClick={() =>
                        currentView === "year" || currentView === "month"
                          ? selectView("day")
                          : views.includes("year") || views.includes("month")
                          ? selectView(
                              views.includes("year") ? "year" : "month"
                            )
                          : selectView("day")
                      }
                      className="relative mr-auto box-border inline-flex cursor-pointer select-none appearance-none items-center justify-center rounded-full bg-transparent p-1 text-center align-middle text-lg"
                      aria-label={
                        currentView === "year"
                          ? "year view is open, switch to calendar view"
                          : "calendar view is open, switch to year view"
                      }
                    >
                      <svg
                        className={clsx(
                          "inline-block h-6 w-6 flex-shrink-0 select-none fill-current text-2xl transition-transform duration-300 will-change-transform",
                          {
                            "rotate-180 transform":
                              currentView === "year" || currentView === "month",
                          }
                        )}
                        focusable="false"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        data-testid="ArrowDropDownIcon"
                      >
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex opacity-100 transition-opacity duration-200">
                  <button
                    className="relative -mr-3 box-border inline-flex flex-[0_0_auto] cursor-pointer select-none appearance-none items-center justify-center rounded-full bg-transparent p-2 text-center align-middle text-2xl"
                    aria-label="Previous month"
                    onClick={() => navigateMonth(-1)}
                    disabled={disabled}
                  >
                    <svg
                      className="inline-block h-5 w-5 shrink-0 select-none fill-current transition-colors"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      data-testid="ArrowLeftIcon"
                    >
                      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                    </svg>
                  </button>
                  <div className="w-6" />
                  <button
                    className="relative -ml-3 box-border inline-flex flex-[0_0_auto] cursor-pointer select-none appearance-none items-center justify-center rounded-full bg-transparent p-2 text-center align-middle text-2xl"
                    aria-label="Next month"
                    onClick={() => navigateMonth(1)}
                    disabled={disabled}
                  >
                    <svg
                      className="inline-block h-5 w-5 shrink-0 select-none fill-current transition-colors"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      data-testid="ArrowRightIcon"
                    >
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="relative block">
                {currentView === "year" && (
                  <div
                    className="relative box-border flex h-full max-h-[280px] w-full flex-wrap overflow-y-auto px-1"
                    style={{ alignContent: "stretch" }}
                    role="radiogroup"
                  >
                    {years.map((year) => (
                      <div
                        className="flex basis-1/4 items-center justify-center"
                        key={year}
                      >
                        <button
                          role="radio"
                          type="button"
                          className={clsx(
                            "my-2 h-9 w-[72px] cursor-pointer rounded-[18px] bg-transparent text-base font-normal leading-7 text-black dark:text-white",
                            {
                              "bg-pea-400 hover:bg-pea-500 text-white/80 hover:will-change-[background-color] dark:text-black/80":
                                year === Number(period.substring(0, 4)),
                            }
                          )}
                          tabIndex={-1}
                          aria-checked={Number(period.substring(0, 4)) === year}
                          onClick={() => selectYear(year)}
                        >
                          {year}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {currentView === "month" && (
                  <div
                    className="relative box-border flex h-full max-h-[280px] w-full flex-wrap overflow-y-auto px-1"
                    style={{ alignContent: "stretch" }}
                    role="radiogroup"
                  >
                    {months.map((month, index) => (
                      <div
                        className="flex basis-1/3 items-center justify-center"
                        key={index}
                      >
                        <button
                          role="radio"
                          type="button"
                          className={clsx(
                            "my-2 h-9 w-[72px] cursor-pointer rounded-[18px] bg-transparent text-base font-normal leading-7 text-black dark:text-white",
                            {
                              "bg-pea-400 hover:bg-pea-500 text-white/80 hover:will-change-[background-color] dark:text-black/80":
                                month.getMonth() ===
                                Number(period.substring(5)) - 1,
                            }
                          )}
                          tabIndex={-1}
                          aria-checked={
                            month.getMonth() === Number(period.substring(5)) - 1
                          }
                          onClick={() => selectMonth(month.getMonth() + 1)}
                          aria-label={month.toLocaleDateString(
                            navigator && navigator.language,
                            { month: "long" }
                          )}
                        >
                          {month.toLocaleDateString(
                            navigator && navigator.language,
                            {
                              month: "short",
                            }
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {currentView === "day" && (
                  <div className="opacity-100">
                    <div
                      className="flex items-center justify-center"
                      role="row"
                    >
                      {displayWeekNumber && (
                        <span
                          role="columnheader"
                          className="mx-0.5 flex h-10 w-9 items-center justify-center text-center text-xs font-normal text-white/50"
                          aria-label={"Week number"}
                        >
                          #
                        </span>
                      )}
                      {days.map((day: Date, index) => (
                        <span
                          key={`weekday-${index}`}
                          className="mx-0.5 flex h-10 w-9 items-center justify-center text-center text-xs font-normal leading-[1.66] tracking-[0.03333em] text-white/70"
                          role="columnheader"
                          aria-label={day.toLocaleDateString(
                            navigator && navigator.language,
                            { weekday: "long" }
                          )}
                        >
                          {day.toLocaleDateString(
                            navigator && navigator.language,
                            {
                              weekday: "narrow",
                              localeMatcher: "best fit",
                            }
                          )}
                        </span>
                      ))}
                    </div>
                    <div
                      className="relative block min-h-[240px] overflow-x-hidden "
                      role="presentation"
                    >
                      <div
                        className={clsx(
                          "absolute top-0 right-0 left-0 overflow-hidden"
                        )}
                        role="rowgroup"
                      >
                        {daysOfMonth.map((week, index) => {
                          return (
                            <div
                              className="my-0.5 mx-0 flex justify-center"
                              role="row"
                              aria-rowindex={index + 1}
                            >
                              {displayWeekNumber && (
                                <p
                                  className="font-montserrat relative mx-0.5 box-border inline-flex h-9 w-9 select-none appearance-none items-center justify-center align-middle text-xs leading-[1.66] tracking-[0.03333em] text-white/50 outline-0"
                                  role="rowheader"
                                  aria-label={`Week ${getISOWeek(week[0])}`}
                                >
                                  {getISOWeek(week[0])}.
                                </p>
                              )}
                              {week.map((day, j) => {
                                return (
                                  <button
                                    className={clsx(
                                      "font-montserrat hover:bg-pea-300/10 relative mx-0.5 box-border inline-flex h-9 w-9 select-none appearance-none items-center justify-center rounded-full bg-transparent p-0 align-middle text-xs leading-[1.66] tracking-[0.03333em] text-white outline-0 transition-colors duration-200",
                                      {
                                        "text-white/70":
                                          day.getMonth() !==
                                          Number(period.substring(5)) - 1,
                                        invisible:
                                          !showDaysOutsideCurrentMonth &&
                                          day.getMonth() !==
                                            Number(period.substring(5)) - 1,
                                        "border border-white/70":
                                          toLocaleISODate(new Date()) ===
                                            toLocaleISODate(day) &&
                                          toLocaleISODate(day) !=
                                            toLocaleISODate(selectedDate),
                                        "bg-pea-400 hover:bg-pea-500 font-medium text-black/80 hover:will-change-[background-color]":
                                          toLocaleISODate(day) ===
                                          toLocaleISODate(selectedDate),
                                      }
                                    )}
                                    type="button"
                                    role="gridcell"
                                    aria-disabled="false"
                                    tabIndex={-1}
                                    aria-colindex={j + 1}
                                    disabled={disabled}
                                    aria-selected={
                                      toLocaleISODate(selectedDate) ===
                                      toLocaleISODate(day)
                                    }
                                    data-timestamp={day.getTime()}
                                    onClick={(e) => onSelectDate(e, day)}
                                    aria-current={
                                      toLocaleISODate(new Date()) ===
                                      toLocaleISODate(day)
                                        ? "date"
                                        : undefined
                                    }
                                  >
                                    {day.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </>
  );
};

export default DatePicker;

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
