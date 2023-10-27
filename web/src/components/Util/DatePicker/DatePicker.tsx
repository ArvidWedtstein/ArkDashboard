import clsx from "clsx";
import { MouseEvent, useEffect, useState } from "react";
import { addToDate, adjustCalendarDate, getDaysBetweenDates, getISOWeek, getWeekdays, toLocaleISODate } from "src/lib/formatters";


function toLocalPeriod(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
}

type ViewType = "year" | "month" | "day";
type DatePickerProps = {
  displayWeekNumber?: boolean;
  showDaysOutsideCurrentMonth?: boolean;
  fixedWeekNumber?: number;
  views?: ViewType[];
  disabled?: boolean;
  readOnly?: boolean;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
}
const DatePicker = ({
  displayWeekNumber = false,
  showDaysOutsideCurrentMonth = true,
  fixedWeekNumber,
  views = ["day", "year"],
  disabled = false,
  readOnly = false,
  defaultValue = new Date(),
  onChange,
}: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(defaultValue);
  const [period, setPeriod] = useState<string>(() => toLocalPeriod(defaultValue));
  const [currentView, setCurrentView] = useState<ViewType>(views.includes('day') ? 'day' : views[0] || 'day');


  const firstDayOfWeek = 1;
  const days = getWeekdays(firstDayOfWeek)

  const useCalendarDateRange = (period: string | Date, weekStartsOn: number = 0) => {
    const [first, setFirst] = useState(() => adjustCalendarDate(adjustCalendarDate(new Date(period), 'start', 'month'), 'start', 'week', weekStartsOn));
    const [last, setLast] = useState(() => adjustCalendarDate(new Date(period), 'end', 'month'));

    useEffect(() => {
      setFirst(adjustCalendarDate(adjustCalendarDate(new Date(period), 'start', 'month'), 'start', 'week', weekStartsOn));
      setLast(adjustCalendarDate(new Date(period), 'end', 'month'));
    }, [period, weekStartsOn]);

    return [first, last];
  }

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
  }

  const [firstDay, lastDay] = useCalendarDateRange(period, firstDayOfWeek);

  const daysOfMonth = Array.from({ length: !!fixedWeekNumber && fixedWeekNumber > 0 ? fixedWeekNumber : getDaysBetweenDates(firstDay, lastDay).length / 7 + 1 }, (_, weekIndex) => {
    return Array.from({ length: 7 }, (_day, index) => {
      return addToDate(firstDay, weekIndex * 7 + index, 'day');
    });
  });

  const years = Array.from({ length: 2100 - 1900 + 1 }, (_, index) => 1900 + index);

  const months = Array.from({ length: 12 }, (_, index) => index + 1).map((month) => {
    return new Date(`${Number(period.substring(0, 4))}-${month}`);
  });

  const navigateMonth = (change: -1 | 1) => {
    const newDate = addToDate(new Date(period), change, 'month');

    setPeriod(toLocalPeriod(newDate));

  }

  const selectYear = (year: number) => {
    if (readOnly) return;

    const newDate = new Date(`${year}-${Number(period.substring(5))}`);
    setPeriod(toLocalPeriod(newDate));
    setCurrentView(views.includes('month') ? 'month' : 'day');
  }

  const selectMonth = (month: number) => {
    if (readOnly) return;

    const newDate = new Date(`${Number(period.substring(0, 4))}-${month}`);
    setPeriod(toLocalPeriod(newDate));
    setCurrentView(views.includes('day') ? 'day' : 'year');
  }

  const selectView = (view: ViewType) => {
    setCurrentView(view);
  }

  return (
    <div className="overflow-hidden w-80 max-h-[334px] mx-auto flex flex-col">
      <div className="flex items-center justify-center max-h-8 min-h-[2rem] pr-3 pl-6 mb-2 mt-3 text-white">
        <div
          className="flex overflow-hidden items-center justify-center cursor-pointer text-base mr-auto font-medium"
          role="presentation"
          aria-live="polite"
          onClick={() => currentView === 'year' || currentView === 'month' ? selectView('day') : (views.includes('year') || views.includes('month')) ? selectView(views.includes('year') ? 'year' : 'month') : selectView('day')}
        >
          <div className="block relative">
            <div className={"opacity-100 transition-opacity duration-200 mr-1.5"}>
              {new Date(period).toLocaleDateString((navigator && navigator.language), { month: 'long', year: 'numeric' })}
            </div>
          </div>

          {!disabled && (
            <button
              onClick={() => currentView === 'year' || currentView === 'month' ? selectView('day') : (views.includes('year') || views.includes('month')) ? selectView(views.includes('year') ? 'year' : 'month') : selectView('day')}
              className="inline-flex items-center justify-center box-border cursor-pointer relative select-none mr-auto bg-transparent align-middle appearance-none text-lg p-1 rounded-full text-center"
              aria-label={currentView === 'year' ? 'year view is open, switch to calendar view' : 'calendar view is open, switch to year view'}
            >
              <svg className={clsx("w-6 h-6 inline-block will-change-transform text-2xl flex-shrink-0 fill-current select-none transition-transform duration-300", {
                "transform rotate-180": currentView === 'year' || currentView === 'month',
              })} focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowDropDownIcon">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex opacity-100 transition-opacity duration-200">
          <button
            className="inline-flex items-center justify-center box-border cursor-pointer relative select-none appearance-none flex-[0_0_auto] text-2xl p-2 text-center -mr-3 bg-transparent rounded-full align-middle"
            aria-label="Previous month"
            onClick={() => navigateMonth(-1)}
            disabled={disabled}
          >
            <svg className="w-4 h-4 fill-current inline-block select-none shrink-0 transition-colors" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowLeftIcon">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
            </svg>
          </button>
          <div className="w-6" />
          <button
            className="inline-flex items-center justify-center box-border cursor-pointer relative select-none appearance-none flex-[0_0_auto] text-2xl p-2 text-center -mr-3 bg-transparent rounded-full align-middle"
            aria-label="Next month"
            onClick={() => navigateMonth(1)}
            disabled={disabled}
          >
            <svg className="w-4 h-4 fill-current inline-block select-none shrink-0 transition-colors" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowRightIcon">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="block relative">
        {currentView === 'year' && (
          <div className="flex flex-wrap px-1 w-full box-border h-full relative max-h-[280px] overflow-y-auto" style={{ alignContent: 'stretch' }} role="radiogroup">
            {years.map((year) => (
              <div className="basis-1/3 flex items-center justify-center" key={year}>
                <button
                  role="radio"
                  type="button"
                  className={clsx("bg-transparent h-9 my-2 text-base leading-7 cursor-pointer font-normal rounded-[18px] w-[72px] text-black dark:text-white", {
                    "dark:text-black/80 text-white/80 bg-pea-400 hover:bg-pea-500 hover:will-change-[background-color]": year === Number(period.substring(0, 4)),
                  })}
                  tabIndex={-1}
                  aria-checked={Number(period.substring(0, 4)) === year}
                  onClick={() => selectYear(year)}
                // aria-label={"Year"}
                >
                  {year}
                </button>
              </div>
            ))}
          </div>
        )}
        {currentView === 'month' && (
          <div className="flex flex-wrap px-1 w-full box-border h-full relative max-h-[280px] overflow-y-auto" style={{ alignContent: 'stretch' }} role="radiogroup">
            {months.map((month, index) => (
              <div className="basis-1/3 flex items-center justify-center" key={index}>
                <button
                  role="radio"
                  type="button"
                  className={clsx("bg-transparent h-9 my-2 text-base leading-7 cursor-pointer font-normal rounded-[18px] w-[72px] text-black dark:text-white", {
                    "dark:text-black/80 text-white/80 bg-pea-400 hover:bg-pea-500 hover:will-change-[background-color]": month.getMonth() === Number(period.substring(5)) - 1,
                  })}
                  tabIndex={-1}
                  aria-checked={month.getMonth() === Number(period.substring(5)) - 1}
                  onClick={() => selectMonth(month.getMonth() + 1)}
                  aria-label={month.toLocaleDateString((navigator && navigator.language), { month: 'long' })}
                >
                  {month.toLocaleDateString((navigator && navigator.language), { month: 'short' })}
                </button>
              </div>
            ))}
          </div>
        )}
        {currentView === 'day' && (
          <div className="opacity-100">
            <div className="flex items-center justify-center" role="row">
              {displayWeekNumber && (
                <span
                  role="columnheader"
                  className="w-9 h-10 flex items-center justify-center mx-0.5 text-center text-xs font-normal text-white/50"
                  aria-label={"Week number"}
                >
                  #
                </span>
              )}
              {days.map((day: Date, index) => (
                <span
                  key={`weekday-${index}`}
                  className="w-9 h-10 flex items-center justify-center mx-0.5 text-center text-xs font-normal text-white/70 tracking-[0.03333em] leading-[1.66]"
                  role="columnheader"
                  aria-label={day.toLocaleDateString((navigator && navigator.language), { weekday: 'long' })}
                >
                  {day.toLocaleDateString((navigator && navigator.language), { weekday: 'narrow', localeMatcher: 'best fit' })}
                </span>
              ))}
            </div>
            <div className="block relative overflow-x-hidden min-h-[240px] " role="presentation">
              <div className={clsx("overflow-hidden absolute top-0 right-0 left-0")} role="rowgroup">
                {daysOfMonth.map((week, index) => {
                  return (
                    <div className="my-0.5 mx-0 flex justify-center" role="row" aria-rowindex={index + 1}>
                      {displayWeekNumber && (
                        <p
                          className="inline-flex justify-center items-center relative select-none appearance-none outline-0 font-montserrat tracking-[0.03333em] box-border text-xs align-middle leading-[1.66] w-9 h-9 text-white/50 mx-0.5"
                          role="rowheader"
                          aria-label={`Week ${getISOWeek(week[0])}`}
                        >
                          {getISOWeek(week[0])}.
                        </p>
                      )}
                      {week.map((day, j) => {
                        return (
                          <button
                            className={clsx("inline-flex justify-center items-center relative select-none appearance-none outline-0 font-montserrat hover:bg-pea-300/10 box-border align-middle text-xs leading-[1.66] tracking-[0.03333em] p-0 w-9 h-9 rounded-full bg-transparent mx-0.5 text-white transition-colors duration-200", {
                              "text-white/70": day.getMonth() !== Number(period.substring(5)) - 1,
                              "invisible": !showDaysOutsideCurrentMonth && day.getMonth() !== Number(period.substring(5)) - 1,
                              "border border-white/70": toLocaleISODate(new Date()) === toLocaleISODate(day) && toLocaleISODate(day) != toLocaleISODate(selectedDate),
                              "text-black/80 font-medium bg-pea-400 hover:bg-pea-500 hover:will-change-[background-color]": toLocaleISODate(day) === toLocaleISODate(selectedDate),
                            })}
                            type="button"
                            role="gridcell"
                            aria-disabled="false"
                            tabIndex={-1}
                            aria-colindex={j + 1}
                            disabled={disabled}
                            aria-selected={toLocaleISODate(selectedDate) === toLocaleISODate(day)}
                            data-timestamp={day.getTime()}
                            onClick={(e) => onSelectDate(e, day)}
                            aria-current={toLocaleISODate(new Date()) === toLocaleISODate(day) ? "date" : undefined}
                          >
                            {day.getDate()}
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker




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