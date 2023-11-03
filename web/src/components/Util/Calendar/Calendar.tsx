import clsx from "clsx";
import { useEffect, useState } from "react";
import { getISOWeek, groupBy, timeTag, toLocalPeriod } from "src/lib/formatters";

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
  const [days, setDays] = useState<Date[]>([]);

  const getDaysArray = (s: Date, e: Date) => {
    let a = []
    for (
      let d = new Date(s);
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
  useEffect(() => {
    const [startCurrWeek, endCurrWeek] = getDatesInWeek(
      currentYear,
      currentWeek
    );
    setDays([
      ...getDaysArray(startCurrWeek, endCurrWeek),
    ]);

    document.getElementById(`week-${currentWeek}-day-7`)?.scrollIntoView();
  }, [currentYear, currentWeek]);

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

      if (currentWeek !== 1) setCurrentWeek((prev) => prev - 1);
    } else {
      if (currentWeek === getWeeksInYear(currentYear)) {
        setCurrentWeek(1);
        setCurrentYear((prev) => prev + 1);
        week = 1;
      } else {

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

      if (currentWeek !== getWeeksInYear(currentYear)) setCurrentWeek((prev) => prev + 1);
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
        <div className="sticky top-0 z-10 col-start-[1] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-neutral-600 dark:to-neutral-700 dark:text-slate-200">
          {days && days.length > 0 ? `Week ${getISOWeek(days[0])}` : ''}
        </div>
        {days.map((date, i) => (
          <div
            key={`day-${i}`}
            id={`week-${getISOWeek(date)}-day-${(i % 7) + 1}`}
            className={clsx(
              "sticky top-0 z-10 row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-neutral-600 dark:to-neutral-700 dark:text-slate-200",
              `col-start-[${i + 2}]`
            )}
          >
            {date.toLocaleDateString(
              navigator && navigator.language,
              { month: "long", day: "2-digit" }
            )}
          </div>
        ))}
        {Object.entries(
          groupBy(
            data, //.filter((event) => event.cluster === "6man"),
            group
          )
        ).map(([key, groupedValues], i) => (
          <React.Fragment key={key}>
            <div
              className={`sticky left-0 col-start-[1] row-start-[${i + 2
                }] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-zinc-400 dark:border-slate-200/5 dark:bg-neutral-800`}
            >
              {key}
            </div>
            {Array.from({ length: 7 }, (_, index) => index + 1).map((_, j) => (
              <CalendarDay
                id={`server-${i}-day-${j + 1}`}
                key={`day-${j}`}
                className={`row-start-[${i + 2}] col-start-[${j + 2}]`}
              />
            ))}

            {/* TODO: subgrid/filter for cluster? */}
            {/* TODO: fix bug event not showing on new year */}
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
                const weekDays = getDaysArray(startCurrWeek, endCurrWeek);

                // if (item.season == "3" && item.cluster == '6man') console.log(dayFromDate(startCurrWeek), dayFromDate(endCurrWeek), seasonDays.some(
                //   (d: Date) =>
                //     (dayFromDate(d) >= dayFromDate(startCurrWeek) &&
                //       dayFromDate(d) <= dayFromDate(endCurrWeek)) &&
                //     new Date(item[dateStartKey]).getFullYear() === currentYear &&
                //     new Date(item[dateEndKey]).getFullYear() === currentYear
                // ))

                // return seasonDays.some(
                //   (d: Date) =>
                //     dayFromDate(d) >= dayFromDate(startCurrWeek) &&
                //     dayFromDate(d) <= dayFromDate(endCurrWeek) &&
                //     new Date(item[dateStartKey]).getFullYear() === currentYear &&
                //     new Date(item[dateEndKey]).getFullYear() === currentYear
                // );
                return seasonDays.some(
                  (d: Date) =>
                    weekDays.some(
                      (w: Date) =>
                        dayFromDate(d) === dayFromDate(w) &&
                        new Date(item[dateStartKey]).getFullYear() ===
                        currentYear &&
                        new Date(item[dateEndKey]).getFullYear() ===
                        currentYear
                    )
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
                        : new Date(event[dateEndKey]).getDay() + 2
                      }`,
                  }}
                  className={clsx(
                    `row-start-[${i + 2
                    }] relative m-1 flex flex-col rounded-lg border border-blue-700/10 bg-blue-400/20 p-1 dark:border-sky-500 dark:bg-sky-600/50`,
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
                  {(getCurrentWeekNumber(new Date(event[dateStartKey])) ==
                    currentWeek || getCurrentWeekNumber(new Date(event[dateEndKey])) ==
                    currentWeek) && (
                      <>
                        <span className={`text-xs text-blue-600 dark:text-sky-100 ${getCurrentWeekNumber(new Date(event[dateStartKey])) ==
                          currentWeek ? 'text-left' : 'text-right'}`}>
                          {timeTag(event[dateStartKey])} -{" "}
                          {timeTag(event[dateEndKey])}
                        </span>
                        <span className={`text-xs font-medium text-blue-600 dark:text-sky-100 ${getCurrentWeekNumber(new Date(event[dateStartKey])) ==
                          currentWeek ? 'text-left' : 'text-right'}`}>
                          {event.season} {event.cluster}
                        </span>
                        <span className={`text-xs text-blue-600 dark:text-sky-100 ${getCurrentWeekNumber(new Date(event[dateStartKey])) ==
                          currentWeek ? 'text-left' : 'text-right'}`}>
                          Ragnarok, NA
                        </span>
                      </>)}
                </div>
              ))}
          </React.Fragment>
        ))}
      </div>
      <div className="flex opacity-100 transition-opacity duration-200 dark:text-white text-black mt-3">
        <button
          className="relative -mr-3 box-border inline-flex flex-[0_0_auto] cursor-pointer select-none appearance-none items-center hover:bg-black/10 dark:hover:bg-white/10 justify-center rounded-full bg-transparent p-2 text-center align-middle text-2xl"
          aria-label="Previous month"
          onClick={() => changeWeek("prev")}
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
          className="relative -ml-3 box-border inline-flex flex-[0_0_auto] cursor-pointer select-none hover:bg-black/10 dark:hover:bg-white/10 appearance-none items-center justify-center rounded-full bg-transparent p-2 text-center align-middle text-2xl"
          aria-label="Next month"
          onClick={() => changeWeek("next")}
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
  );
};

const CalendarDay = ({ className, id }) => {
  return (
    <div
      id={id}
      className={clsx(
        `border-b border-r border-slate-100 dark:border-slate-200/5`,
        className
      )}
    ></div>
  )
}

export default Calendar;

