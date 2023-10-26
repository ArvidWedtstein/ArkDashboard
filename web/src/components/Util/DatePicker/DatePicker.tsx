import clsx from "clsx";
import { useEffect, useState } from "react";


function toLocalPeriod(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
}

type DatePickerProps = {
  displayWeekNumber?: boolean;
}
const DatePicker = ({ displayWeekNumber = false }: DatePickerProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [period, setPeriod] = useState<string>(() => toLocalPeriod(new Date()));

  const getWeekdays = (firstDayOfWeek = 1): Date[] => {
    const weekdays: Date[] = [];
    let date = new Date();

    // Set the date to the first day of the week (Monday)
    date.setDate(date.getDate() - ((date.getDay() - firstDayOfWeek + 7) % 7));

    // Get the weekdays (Monday to Sunday)
    for (let i = 0; i < 7; i++) {
      weekdays.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return weekdays;
  }
  const firstDayOfWeek = 1;
  const days = getWeekdays(firstDayOfWeek)

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  const addMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }
  // Function to get the first day of the week
  const startOfWeek = (date: Date, weekStartsOn = 0) => {
    const dayOfWeek = date.getUTCDay(); // Use getUTCDay for consistent results

    const diff = (dayOfWeek - weekStartsOn + 7) % 7;
    date.setUTCDate(date.getUTCDate() - diff);

    return date;
  }
  const startOfMonth = (date: Date): Date => {
    date.setDate(1);
    return date;
  }

  const getISOWeek = (date: Date): number => {
    const dayMs = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const daysSinceStart = Math.floor((+date - +startOfYear) / dayMs);
    const dayOfWeek = (date.getUTCDay() + 6) % 7; // Ensure Sunday (0) is 7 in ISO week
    const weekNumber = Math.ceil((daysSinceStart + 1 - dayOfWeek) / 7);

    return weekNumber;
  }

  function getFirstCalendarDate(period, weekStartsOn) {
    const dateObj = new Date(period);

    let firstDay = startOfWeek(startOfMonth(dateObj), weekStartsOn);

    return firstDay;
  }

  function getLastCalendarDate(period) {
    const dateObj = new Date(period);
    let lastDay = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);

    return lastDay;
  }
  function useCalendarDateRange(period, weekStartsOn) {
    const [first, setFirst] = useState(() => getFirstCalendarDate(period, weekStartsOn));
    const [last, setLast] = useState(() => getLastCalendarDate(period));

    useEffect(() => {
      setFirst(getFirstCalendarDate(period, weekStartsOn));
      setLast(getLastCalendarDate(period));
    }, [period, weekStartsOn]);

    return [first, last];
  }

  const onSelectDate = (date) => {
    // console.log("SELECTED DATE", date);
  }

  const [firstDay, lastDay] = useCalendarDateRange(period, firstDayOfWeek);


  function getDaysBetweenDates(currentDay, lastDay) {
    const daysArray = Array.from({ length: (lastDay - currentDay) / (24 * 60 * 60 * 1000) + 1 }, (_, index) => {
      return addDays(new Date(currentDay), index);
    });

    return daysArray;
  }

  const daysOfMonth = Array.from({ length: getDaysBetweenDates(firstDay, lastDay).length / 7 + 1 }, (_, weekIndex) => {
    return Array.from({ length: 7 }, (_day, index) => {
      return addDays(firstDay, weekIndex * 7 + index);
    });
  });
  const dateformatter = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  });

  const navigateMonth = (change: -1 | 1) => {
    const newDate = addMonths(new Date(period), change);

    setPeriod(toLocalPeriod(newDate));
  }

  return (
    <div className="overflow-hidden w-80 max-h-[334px] mx-auto flex flex-col">
      <div className="flex items-center justify-center max-h-8 min-h-[2rem] pr-3 pl-6 mb-2 mt-3 text-white">
        <div className="flex items-center justify-center cursor-pointer text-base mr-auto font-medium">
          <div className="block relative">
            <div className="opacity-100 transition-opacity duration-200 mr-1.5">
              {dateformatter.format(new Date(period))}
            </div>
          </div>
          <button className="inline-flex items-center justify-center box-border cursor-pointer relative select-none mr-auto bg-transparent align-middle appearance-none text-lg p-1 rounded-full text-center">
            <svg className="w-4 h-4 inline-block will-change-transform text-2xl flex-shrink-0 fill-current select-none" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowDropDownIcon">
              <path d="M7 10l5 5 5-5z"></path>
            </svg>
          </button>
        </div>
        <div className="flex opacity-100 transition-opacity duration-200">
          <button
            className="inline-flex items-center justify-center box-border cursor-pointer relative select-none appearance-none flex-[0_0_auto] text-2xl p-2 text-center -mr-3 bg-transparent rounded-full align-middle"
            aria-label="Previous month"
            onClick={() => navigateMonth(-1)}
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
          >
            <svg className="w-4 h-4 fill-current inline-block select-none shrink-0 transition-colors" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowRightIcon">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="block relative" role="grid">
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
        <div className="block relative overflow-x-hidden min-h-[240px]" role="presentation">
          <div className="overflow-hidden absolute top-0 right-0 left-0" role="rowgroup">
            {daysOfMonth.map((weekDay, index) => {
              return (
                <div className="my-0.5 mx-0 flex justify-center" role="row" aria-rowindex={index + 1}>
                  {displayWeekNumber && (
                    <p
                      className="inline-flex justify-center items-center relative select-none appearance-none outline-0 font-montserrat tracking-[0.03333em] box-border text-xs align-middle leading-[1.66] w-9 h-9 text-white/50 mx-0.5"
                      role="rowheader"
                      aria-label={`Week ${getISOWeek(weekDay[0])}`}
                    >
                      {getISOWeek(weekDay[0])}.
                    </p>
                  )}
                  {weekDay.map((day, j) => {
                    return (
                      <button
                        className={clsx("inline-flex justify-center items-center relative select-none appearance-none outline-0 font-montserrat hover:bg-pea-300/10 box-border align-middle text-xs leading-[1.66] tracking-[0.03333em] p-0 w-9 h-9 rounded-full bg-transparent mx-0.5 text-white transition-colors duration-200", {
                          "text-white/70": day.getMonth() !== Number(period.substring(5)) - 1,
                          "border border-white/70": toLocaleISODate(new Date()) === toLocaleISODate(day),
                          "text-black/80 font-medium bg-pea-400 hover:bg-pea-500 hover:will-change-[background-color]": toLocaleISODate(day) === toLocaleISODate(date),
                        })}
                        type="button"
                        role="gridcell"
                        aria-disabled="false"
                        tabIndex={-1}
                        aria-colindex={j + 1}
                        aria-selected={toLocaleISODate(date) === toLocaleISODate(day)}
                        data-timestamp={day.getTime()}
                        onClick={() => {
                          onSelectDate(day);
                          setDate(day);
                        }}
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
    </div>
  );
};

export default DatePicker

function toLocaleISODate(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1 + "").padStart(2, "0")}-${(date.getDate() + "").padStart(
    2,
    "0",
  )}`;
}
type CalendarDayProps = {
  absence?: string;
  date: Date;
  hourBankChange?: number;
  isOtherMonth?: boolean;
  locked?: boolean;
  onClick?: () => void;
  submitted?: Date | null;
  totHrs?: number;
};

function CalendarDay({
  absence = "",
  date,
  hourBankChange = 0,
  isOtherMonth,
  locked,
  onClick,
  submitted = null,
  totHrs = 0,
}: CalendarDayProps) {
  const headerElems: JSX.Element[] = [];
  const classNames = ["flex-[1_1_100%] border-t border-l border-stone-300 cursor-pointer h-20 p-1 overflow-hidden bg-white hover:bg-zinc-300 active:bg-zinc-400 active:shadow-md"];

  if (submitted !== null && totHrs > 0) {
    classNames.push("CalendarDay-submitted");
    headerElems.push(<button key={headerElems.length}>send</button>);
  }

  if (locked) {
    classNames.push("text-blue-500");
    if (date < new Date() && submitted == null) {
      headerElems.push(<button className="lock" key={headerElems.length}>lock</button>);
    }
  }

  if (hourBankChange < 0) {
    headerElems.push(<img className="mr-px w-3 h-3" src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/0.7151661999153041.PNG" alt="" key={headerElems.length} />);
  }

  headerElems.push(
    <span style={{ marginLeft: "auto" }} className={"text-sm"} key={headerElems.length}>
      {date.getDate()}
    </span>,
  );

  var today = new Date();
  if (toLocaleISODate(today) === toLocaleISODate(date)) {
    classNames.push("p-1 !border-2 border-zinc-500");
  }

  if (isOtherMonth) {
    classNames.push("text-stone-400");
  } else {
    // if (absence in absenceClassMap) {
    // 	classNames.push(absenceClassMap[absence]);
    // }
  }

  var data: JSX.Element | null = null;
  var hours = totHrs;
  if (hourBankChange < 0 && hours === 0) {
    hours = Math.abs(hourBankChange);
  }

  if (hours > 0) {
    classNames.push("text-gray-500");
    data = (
      <div className={"text-center leading-4 -mt-1 text-sm"}>
        <big className="block text-xl">{hours}</big>
        hours
      </div>
    );
  }

  return (
    <div className={classNames.join(" ")} onClick={onClick}>
      <div className={"flex"}>{headerElems}</div>
      {data}
    </div>
  );
}


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