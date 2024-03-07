import clsx from "clsx";
import { MouseEvent, cloneElement, useEffect, useState } from "react";
import {
  addToDate,
  adjustCalendarDate,
  getISOWeek,
  getDateUnit,
  toLocalPeriod,
  toLocaleISODate,
  getDateDiff,
} from "src/lib/formatters";
import Button from "../Button/Button";
import { TransitionGroup, CSSTransition, Transition } from 'react-transition-group';

type ViewType = "year" | "month" | "day";
type DateCalendarProps = {
  displayWeekNumber?: boolean;
  showDaysOutsideCurrentMonth?: boolean;
  fixedWeekNumber?: number;
  views?: ViewType[];
  disabled?: boolean;
  readOnly?: boolean;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  firstDayOfWeek?: number;
};
const DateCalendar = ({
  displayWeekNumber = false,
  showDaysOutsideCurrentMonth = true,
  fixedWeekNumber,
  views = ["day", "year"],
  disabled = false,
  readOnly = false,
  defaultValue,
  firstDayOfWeek = 1,
  onChange,
}: DateCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    defaultValue ? new Date(defaultValue) : null
  );
  const [selectedRange, setSelectedRange] = useState<Date[] | null>([
    new Date("2023-10-30"),
    new Date("2023-10-30"),
  ]); // [new Date('2023-10-10'), new Date()]
  const [period, setPeriod] = useState<string>(() =>
    toLocalPeriod(defaultValue)
  );
  const [currentView, setCurrentView] = useState<ViewType>(
    views.includes("day") ? "day" : views[0] || "day"
  );

  const [state, setState] = useState<{ slideDirection: 'left' | 'right' }>({
    slideDirection: 'left',
  });

  const days = getDateUnit("weekday", firstDayOfWeek);

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
    onChange?.(date);

    if (date.getMonth() !== Number(period.substring(5)) - 1) {
      if (date.getMonth() < Number(period.substring(5)) - 1) {
        navigateMonth(-1);
      } else {
        navigateMonth(1);
      }
    }
  };

  const [firstDay, lastDay] = useCalendarDateRange(period, firstDayOfWeek);

  const daysOfMonth = Array.from(
    {
      length:
        !!fixedWeekNumber && fixedWeekNumber > 0
          ? fixedWeekNumber
          : getDateDiff(firstDay, lastDay).dates.length / 7 + 1,
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
    setState({ slideDirection: change === 1 ? 'left' : 'right' })
  };

  const selectYear = (year: number) => {
    if (readOnly) return;
    const newDate = new Date(`${year}-${period.split('-')[1]}`);
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

  const childFactoryCreator = (slideDirection: 'left' | 'right') => (child) => {
    return cloneElement(child, {
      classNames: slideDirection,
    });
  };

  return (
    <div
      className="flex h-fit max-h-[360px] w-80 flex-col overflow-hidden"
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
              className={"mr-1.5 opacity-100 transition-opacity duration-200"}
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
                    ? selectView(views.includes("year") ? "year" : "month")
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
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex opacity-100 transition-opacity duration-200">
          <Button
            variant="icon"
            color="DEFAULT"
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
          </Button>

          <Button
            variant="icon"
            color="DEFAULT"
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
          </Button>
        </div>
      </div>
      <TransitionGroup
        className="relative block"
        aria-label="TransitionGroup"
      >
        {currentView === "year" && (
          <CSSTransition
            timeout={200}
            classNames="item"
          >
            <div
              className="relative box-border flex h-full max-h-[280px] w-full flex-wrap overflow-y-auto px-1 fadetransition"
              style={{ alignContent: "stretch" }}
              role="radiogroup"
            >
              {years.map((year, yearIndex) => (
                <div
                  className="flex basis-1/4 items-center justify-center"
                  key={`year-${year}-${yearIndex}`}
                >
                  <button
                    role="radio"
                    type="button"
                    className={clsx(
                      "my-2 h-9 w-[72px] cursor-pointer rounded-[18px] bg-transparent text-base font-normal leading-7 text-black hover:bg-black/10 dark:text-white dark:hover:bg-white/10",
                      {
                        "bg-success-400 hover:bg-success-500 text-white/80 hover:will-change-[background-color] dark:text-black/80":
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
          </CSSTransition>
        )}


        {currentView === "month" && (
          <CSSTransition
            timeout={200}
            classNames="item"
          >
            <div
              className="relative box-border flex h-full max-h-[280px] w-full flex-wrap overflow-y-auto px-1 fadetransition"
              style={{ alignContent: "stretch" }}
              role="radiogroup"
            >
              {months.map((month, index) => (
                <div
                  className="flex basis-1/3 items-center justify-center"
                  key={`month-${index}`}
                >
                  <button
                    role="radio"
                    type="button"
                    className={clsx(
                      "my-2 h-9 w-[72px] cursor-pointer rounded-[18px] bg-transparent text-base font-normal leading-7 text-black hover:bg-black/10 dark:text-white dark:hover:bg-white/10",
                      {
                        "bg-success-400 hover:bg-success-500 text-white/80 hover:will-change-[background-color] dark:text-black/80":
                          month.getMonth() === Number(period.substring(5)) - 1,
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
                    {month.toLocaleDateString(navigator && navigator.language, {
                      month: "short",
                    })}
                  </button>
                </div>
              ))}
            </div>
          </CSSTransition>
        )}


        {currentView === "day" && (
          <CSSTransition
            timeout={200}
            classNames="item"
          >
            <div className="fadetransition">
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
                    {day.toLocaleDateString(navigator && navigator.language, {
                      weekday: "narrow",
                      localeMatcher: "best fit",
                    })}
                  </span>
                ))}
              </div>
              <TransitionGroup
                className="relative block min-h-[15rem] overflow-x-hidden"
                childFactory={childFactoryCreator(state.slideDirection)}
                role="presentation"
              >
                <CSSTransition
                  mountOnEnter
                  unmountOnExit
                  key={period}
                  classNames={state.slideDirection}
                  timeout={1000}
                >
                  <div
                    className="slide absolute left-0 top-0 right-0 overflow-hidden"
                    role="rowgroup"
                  >
                    {daysOfMonth.map((week, index) => {
                      return (
                        <div
                          className="my-0.5 mx-0 flex justify-center"
                          role="row"
                          key={`row-${index + 1}`}
                          aria-rowindex={index + 1}
                          aria-label="WeekContainer"
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
                              <div
                                key={`day-${day?.toISOString()}-${j}`}
                                className={clsx(
                                  "relative mx-0.5 inline-flex shrink-0",
                                  {
                                    "rounded-l-full":
                                      toLocaleISODate(selectedRange[0]) ===
                                      toLocaleISODate(day),
                                    "rounded-r-full":
                                      toLocaleISODate(selectedRange[1]) ===
                                      toLocaleISODate(day),
                                    // "bg-success-300/10":
                                    //   toLocaleISODate(selectedRange[0]) <=
                                    //   toLocaleISODate(day) &&
                                    //   toLocaleISODate(selectedRange[1]) >=
                                    //   toLocaleISODate(day), // Range select
                                  }
                                )}
                                title={`${toLocaleISODate(
                                  selectedRange[0]
                                )}-${toLocaleISODate(selectedRange[1])}`}
                              >
                                <button
                                  className={clsx(
                                    "font-montserrat hover:bg-success-300/10 relative box-border inline-flex h-9 w-9 select-none appearance-none items-center justify-center rounded-full bg-transparent p-0 align-middle text-xs leading-[1.66] tracking-[0.03333em] text-white outline-0 transition-colors duration-200",
                                    {
                                      "text-white/70":
                                        day.getMonth() !==
                                        Number(period.substring(5)) - 1,
                                      "invisible":
                                        !showDaysOutsideCurrentMonth &&
                                        day.getMonth() !==
                                        Number(period.substring(5)) - 1,
                                      "border border-white/70":
                                        toLocaleISODate(new Date()) ===
                                        toLocaleISODate(day) &&
                                        toLocaleISODate(day) !=
                                        toLocaleISODate(selectedDate),
                                      "bg-success-400 hover:!bg-success-500 font-medium text-black/80 hover:will-change-[background-color]":
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
                                {/* <Badge content="s" /> */}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </CSSTransition>
              </TransitionGroup>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </div >
  );
};

export default DateCalendar;
