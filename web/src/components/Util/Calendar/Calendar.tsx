import clsx from "clsx";
import { useEffect, useState } from "react";
import { groupBy, timeTag } from "src/lib/formatters";

interface CalendarProps {
  data: any[];
  group: string;
  dateStartKey: string;
  dateEndKey: string;
}
const Calendar = ({ data, group, dateStartKey, dateEndKey }: CalendarProps) => {
  const getCurrentWeekNumber = (date: Date): number => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;

    const elapsedMilliseconds = date.getTime() - startOfYear.getTime();

    const elapsedWeeks = Math.ceil(elapsedMilliseconds / millisecondsPerWeek);
    return date.getDay() === 0 ? elapsedWeeks - 1 : elapsedWeeks;
  };
  const [currentWeek, setCurrentWeek] = useState<number>(
    getCurrentWeekNumber(new Date())
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const weeksInMonth = (year, month_number) => {
    let firstOfMonth = new Date(year, month_number - 1, 1);
    let day = firstOfMonth.getDay() || 6;
    day = day === 1 ? 0 : day;
    if (day) {
      day--;
    }
    let diff = 7 - day;
    let lastOfMonth = new Date(year, month_number, 0);
    let lastDate = lastOfMonth.getDate();
    if (lastOfMonth.getDay() === 1) {
      diff--;
    }
    let result = Math.ceil((lastDate - diff) / 7);
    return result + 1;
  };
  const getDaysArray = (s: Date, e: Date) => {
    for (
      var a = [], d = new Date(s);
      d <= new Date(e);
      d.setDate(d.getDate() + 1)
    ) {
      a.push(new Date(d));
    }
    return a;
  };

  const daysInYear = (year: number): number =>
    (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365;

  const getWeeksInYear = (year: number): number => {
    const firstDayOfYear = new Date(year, 0, 1);
    const lastDayOfYear = new Date(year, 11, 31);

    // Calculate the time difference in milliseconds
    const timeDifference = lastDayOfYear.getTime() - firstDayOfYear.getTime();

    // Convert milliseconds to weeks
    const weeks = Math.ceil(timeDifference / (1000 * 3600 * 24 * 7));

    return weeks;
  };

  const dateFromDay = (year: number, day: number) => {
    let date = new Date(year, 0);
    return new Date(date.setDate(day));
  };
  const dayFromDate = (date: Date) => {
    let start = new Date(date.getFullYear(), 0, 0);
    let diff = (date as any) - (start as any);
    let oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };
  const getDatesInWeek = (year: number, weekNumber: number): Date[] => {
    const startDate = new Date(year, 0, 1);
    const dayMilliseconds = 24 * 60 * 60 * 1000;
    const startDay = startDate.getDay();
    const offset = (startDay > 0 ? startDay - 1 : 6) * dayMilliseconds;
    const startDateWithOffset = new Date(startDate.getTime() - offset);
    const startWeekNumber = Math.ceil(
      (startDateWithOffset.getTime() - startDate.getTime()) /
      (7 * dayMilliseconds)
    );
    const startOfWeek = new Date(
      startDateWithOffset.getTime() +
      (weekNumber - startWeekNumber) * 7 * dayMilliseconds
    );

    const endOfWeek = new Date(startOfWeek.getTime() + 6 * dayMilliseconds);

    return [startOfWeek, endOfWeek];
  };

  const [days, setDays] = useState<Date[]>([]);
  useEffect(() => {
    const [startPrevWeek, endPrevWeek] = getDatesInWeek(
      currentYear,
      currentWeek - 1
    );
    const [startCurrWeek, endCurrWeek] = getDatesInWeek(
      currentYear,
      currentWeek
    );
    const [startNextWeek, endNextWeek] = getDatesInWeek(
      currentYear,
      currentWeek + 1
    );
    setDays([
      // ...getDaysArray(startPrevWeek, endPrevWeek),
      ...getDaysArray(startCurrWeek, endCurrWeek),
      // ...getDaysArray(startNextWeek, endNextWeek),
    ]);

    document.getElementById(`week-${currentWeek}-day-7`)?.scrollIntoView();
  }, []);

  const changeWeek = (direction: "prev" | "next") => {
    let week = currentWeek;

    if (direction === "prev") {
      if (currentWeek === 1) {
        setCurrentWeek(getWeeksInYear(currentYear - 1));
        setCurrentYear((prev) => prev - 1);
        week = getWeeksInYear(currentYear - 1);
      }
      const [startPrevWeek, endPrevWeek] = getDatesInWeek(
        currentYear,
        week - 1
      );
      // const [startPrevWeek, endPrevWeek] = getDatesInWeek(currentYear, week - 2);

      setDays((prev) => [
        ...getDaysArray(startPrevWeek, endPrevWeek),
        ...prev.slice(0, -7),
      ]);

      setCurrentWeek((prev) => prev - 1);
    } else {
      if (currentWeek === getWeeksInYear(currentYear)) {
        setCurrentWeek(1);
        setCurrentYear((prev) => prev + 1);
        week = 1;
      }
      const [startNextWeek, endNextWeek] = getDatesInWeek(
        currentYear,
        currentWeek + 1
      );
      // const [startNextWeek, endNextWeek] = getDatesInWeek(currentYear, currentWeek + 2);

      setDays((prev) => [
        ...prev.slice(7),
        ...getDaysArray(startNextWeek, endNextWeek),
      ]);

      setCurrentWeek((prev) => prev + 1);
    }
  };

  return (
    <div>
      <div
        className={clsx(
          "grid max-h-[400px] w-fit grid-cols-[70px,repeat(7,150px)] overflow-y-auto overflow-x-hidden scroll-smooth",
          `grid-rows-[auto,repeat(${Object.keys(groupBy(data, group)).length
          },100px)]`
        )}
      >
        <div className="sticky top-0 z-10 col-start-[1] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200"></div>
        {days.map((date, i) => (
          <div
            key={`day-${i}`}
            id={`week-${getCurrentWeekNumber(date)}-day-${(i % 7) + 1}`}
            className={clsx(
              "sticky top-0 z-10 row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200",
              `col-start-[${i + 2}]`
            )}
          >
            {date.toDateString()}
          </div>
        ))}
        {Object.entries(
          groupBy(
            data.filter((event) => event.cluster === "6man"),
            group
          )
        ).map(([key, groupedValues], i) => (
          <React.Fragment key={key}>
            <div
              className={`sticky left-0 col-start-[1] row-start-[${i + 2
                }] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800`}
            >
              {key}
            </div>
            <div
              className={clsx(
                `border-b border-r border-slate-100 dark:border-slate-200/5`,
                `row-start-[${i + 2}] col-start-[2]`
              )}
            ></div>
            <div
              className={clsx(
                `border-b border-r border-slate-100 dark:border-slate-200/5`,
                `row-start-[${i + 2}] col-start-[3]`
              )}
            ></div>
            <div
              className={clsx(
                `border-b border-r border-slate-100 dark:border-slate-200/5`,
                `row-start-[${i + 2}] col-start-[4]`
              )}
            ></div>
            <div
              className={clsx(
                `border-b border-r border-slate-100 dark:border-slate-200/5`,
                `row-start-[${i + 2}] col-start-[5]`
              )}
            ></div>
            <div
              className={clsx(
                `border-b border-r border-slate-100 dark:border-slate-200/5`,
                `row-start-[${i + 2}] col-start-[6]`
              )}
            ></div>
            <div
              className={clsx(
                `border-b border-r border-slate-100 dark:border-slate-200/5`,
                `row-start-[${i + 2}] col-start-[7]`
              )}
            ></div>
            <div
              className={clsx(
                `border-b border-r border-slate-100 dark:border-slate-200/5`,
                `row-start-[${i + 2}] col-start-[8]`
              )}
            ></div>
            {/* TODO: subgrid/filter for cluster? */}
            {groupedValues
              .filter((item) => {
                const [startCurrWeek, endCurrWeek] = getDatesInWeek(
                  currentYear,
                  currentWeek
                );
                const seasonDays = getDaysArray(
                  new Date(item[dateStartKey]),
                  new Date(item[dateEndKey])
                );
                return seasonDays.some(
                  (d: Date) =>
                    dayFromDate(d) >= dayFromDate(startCurrWeek) &&
                    dayFromDate(d) <= dayFromDate(endCurrWeek) &&
                    new Date(item[dateStartKey]).getFullYear() === currentYear
                );
              })
              .map((event, j) => (
                <div
                  key={`event-${j}`}
                  style={{
                    gridColumnStart: `${getCurrentWeekNumber(new Date(event[dateStartKey])) ==
                      currentWeek
                      ? new Date(event[dateStartKey]).getDay() + 1
                      : 2
                      }`,
                    gridColumnEnd: `${getCurrentWeekNumber(new Date(event[dateEndKey])) >
                      currentWeek
                      ? 9
                      : new Date(event[dateEndKey]).getDay() == 0
                        ? 9
                        : new Date(event[dateEndKey]).getDay() + 1
                      }`,
                  }}
                  className={clsx(
                    `row-start-[${i + 2
                    }] m-1 flex flex-col rounded-lg border border-blue-700/10 bg-blue-400/20 p-1 dark:border-sky-500 dark:bg-sky-600/50`,
                    // `col-start-[${
                    //   getCurrentWeekNumber(new Date(event[dateStartKey])) ==
                    //   currentWeek
                    //     ? new Date(event[dateStartKey]).getDay() + 1
                    //     : 2
                    // }] col-end-[${
                    //   getCurrentWeekNumber(new Date(event[dateEndKey])) >
                    //   currentWeek
                    //     ? 9
                    //     : 7 - (new Date(event[dateEndKey]).getDay() + 1)
                    // }] col-span-[${
                    //   (getCurrentWeekNumber(new Date(event[dateEndKey])) >
                    //   currentWeek
                    //     ? 9
                    //     : 7 - (new Date(event[dateEndKey]).getDay() + 1)) -
                    //   (getCurrentWeekNumber(new Date(event[dateStartKey])) ==
                    //   currentWeek
                    //     ? new Date(event[dateStartKey]).getDay() + 1
                    //     : 2)
                    // }]`,
                    {
                      "rounded-r-none":
                        getCurrentWeekNumber(new Date(event[dateEndKey])) >
                        currentWeek,
                      "rounded-l-none":
                        getCurrentWeekNumber(new Date(event[dateStartKey])) <
                        currentWeek,
                    }
                  )}
                >
                  <span className="text-xs text-blue-600 dark:text-sky-100">
                    {timeTag(event[dateStartKey])} -{" "}
                    {timeTag(event[dateEndKey])}
                  </span>
                  <span className="text-xs font-medium text-blue-600 dark:text-sky-100">
                    {event.season} {event.cluster}
                  </span>
                  <span className="text-xs text-blue-600 dark:text-sky-100">
                    Ragnarok, NA
                  </span>
                </div>
              ))}
          </React.Fragment>
        ))}
        {/* {data && data.map((event, i) => (
        ))} */}
        {/* <div className="col-start-[3] row-span-2 row-start-[2] m-1 flex flex-col rounded-lg border border-blue-700/10 bg-blue-400/20 p-1 dark:border-sky-500 dark:bg-sky-600/50">
          <span className="text-xs text-blue-600 dark:text-sky-100">5 AM</span>
          <span className="text-xs font-medium text-blue-600 dark:text-sky-100">
            Base raid
          </span>
          <span className="text-xs text-blue-600 dark:text-sky-100">
            Ragnarok, NA
          </span>
        </div> */}
        {/* <div className="col-start-[4] row-span-4 row-start-[3] m-1 flex flex-col rounded-lg border border-purple-700/10 bg-purple-400/20 p-1 dark:border-fuchsia-500 dark:bg-fuchsia-600/50">
          <span className="text-xs text-purple-600 dark:text-fuchsia-100">
            6 AM
          </span>
          <span className="text-xs font-medium text-purple-600 dark:text-fuchsia-100">
            Breakfast
          </span>
          <span className="text-xs text-purple-600 dark:text-fuchsia-100">
            Mel's Diner
          </span>
        </div> */}
        {/* <div className="col-span-6 col-start-[7] row-span-3 row-start-[14] m-1 flex flex-col rounded-lg border border-pink-700/10 bg-pink-400/20 p-1 dark:border-indigo-500 dark:bg-indigo-600/50">
          <span className="text-xs text-pink-600 dark:text-indigo-100">
            5 PM
          </span>
          <span className="text-xs font-medium text-pink-600 dark:text-indigo-100">
            🎉 Party party 🎉
          </span>
          <span className="text-xs text-pink-600 dark:text-indigo-100">
            We like to party!
          </span>
        </div> */}
      </div>
      <div className="rw-button-group rw-button-group-border">
        <button
          className="rw-button rw-button-green"
          onClick={() => changeWeek("prev")}
        >
          {"<"}
        </button>
        <button
          className="rw-button rw-button-green"
          onClick={() => changeWeek("next")}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Calendar;

