import clsx from "clsx";
import { useEffect, useState } from "react";
import { getWeekDates } from "src/lib/formatters";

const Calendar = () => {
  const getCurrentWeekNumber = (date: Date): number => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;

    const elapsedMilliseconds = date.getTime() - startOfYear.getTime();
    const elapsedWeeks = Math.floor(elapsedMilliseconds / millisecondsPerWeek);

    return elapsedWeeks + 1; // Adding 1 to make the first week number 1 instead of 0
  };
  const [currentWeek, setCurrentWeek] = useState<number>(
    getCurrentWeekNumber(new Date())
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

    if (weekNumber < startWeekNumber || weekNumber > startWeekNumber + 52) {
      throw new Error("Invalid week number");
    }

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
      2023,
      getCurrentWeekNumber(new Date()) - 1
    );
    const [startCurrWeek, endCurrWeek] = getDatesInWeek(
      2023,
      getCurrentWeekNumber(new Date())
    );
    const [startNextWeek, endNextWeek] = getDatesInWeek(
      2023,
      getCurrentWeekNumber(new Date()) + 1
    );
    setDays([
      ...getDaysArray(startPrevWeek, endPrevWeek),
      ...getDaysArray(startCurrWeek, endCurrWeek),
      ...getDaysArray(startNextWeek, endNextWeek),
    ]);

    document
      .getElementById(`day-${getCurrentWeekNumber(new Date()) + 1}`)
      ?.scrollIntoView();
  }, []);

  const changeWeek = (direction: "prev" | "next") => {
    const [startPrevWeek, endPrevWeek] = getDatesInWeek(2023, currentWeek - 1);
    const [startCurrWeek, endCurrWeek] = getDatesInWeek(2023, currentWeek);
    const [startNextWeek, endNextWeek] = getDatesInWeek(2023, currentWeek + 1);
    if (direction === "prev") {
      setDays((prev) => [
        ...getDaysArray(startPrevWeek, endPrevWeek),
        ...prev.slice(0, -7),
      ]);

      document.getElementById(`day-${currentWeek - 1}-1`)?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "end",
      });

      setCurrentWeek((prev) => prev - 1);
    } else {
      setDays((prev) => [
        ...prev.slice(7),
        ...getDaysArray(startNextWeek, endNextWeek),
      ]);

      document.getElementById(`day-${currentWeek + 1}-7`)?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "end",
      });

      setCurrentWeek((prev) => prev + 1);
    }
  };
  return (
    <div>
      <div className="grid max-h-[350px] grid-cols-[70px,repeat(21,150px)] grid-rows-[auto,repeat(16,50px)] overflow-y-auto scroll-smooth">
        <div className="sticky top-0 z-10 col-start-[1] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200"></div>
        {days.map((date, i) => (
          <div
            key={`day-${i}`}
            id={`day-${getCurrentWeekNumber(date)}-${(i % 7) + 1}`}
            className={clsx(
              "sticky top-0 z-10 row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200",
              `col-start-[${i + 2}]`
            )}
          >
            {date.toDateString()}
          </div>
        ))}
        {/* <div className="sticky top-0 z-10 col-start-[2] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200">
        Sun
      </div>
      <div className="sticky top-0 z-10 col-start-[3] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200">
        Mon
      </div>
      <div className="sticky top-0 z-10 col-start-[4] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200">
        Tue
      </div>
      <div className="sticky top-0 z-10 col-start-[5] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200">
        Wed
      </div>
      <div className="sticky top-0 z-10 col-start-[6] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200">
        Thu
      </div>
      <div className="sticky top-0 z-10 col-start-[7] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200">
        Fri
      </div>
      <div className="sticky top-0 z-10 col-start-[8] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200">
        Sat
      </div> */}
        {/* {Object.entries(groupBy(timelineSeasons, 'server')).map(([server, seasons], i) => (
          <React.Fragment key={server}>
            <div className={`sticky left-0 col-start-[1] row-start-[${i + 2}] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800`}>
              {server}
            </div>
            <div className={`col-start-[2] row-start-[${i + 2}] border-b border-r border-slate-100 dark:border-slate-200/5`}></div>
            <div className={`col-start-[3] row-start-[${i + 2}] border-b border-r border-slate-100 dark:border-slate-200/5`}></div>
            <div className={`col-start-[4] row-start-[${i + 2}] border-b border-r border-slate-100 dark:border-slate-200/5`}></div>
            <div className={`col-start-[5] row-start-[${i + 2}] border-b border-r border-slate-100 dark:border-slate-200/5`}></div>
            <div className={`col-start-[6] row-start-[${i + 2}] border-b border-r border-slate-100 dark:border-slate-200/5`}></div>
            <div className={`col-start-[7] row-start-[${i + 2}] border-b border-r border-slate-100 dark:border-slate-200/5`}></div>
            <div className={`col-start-[8] row-start-[${i + 2}] border-b border-slate-100 dark:border-slate-200/5`}></div>
          </React.Fragment>
        ))} */}
        <div className="sticky left-0 col-start-[1] row-start-[2] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
          5 AM
        </div>
        <div className="col-start-[2] row-start-[2] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[3] row-start-[2] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[4] row-start-[2] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[5] row-start-[2] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[6] row-start-[2] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[7] row-start-[2] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[8] row-start-[2] border-b border-slate-100 dark:border-slate-200/5"></div>
        <div className="sticky left-0 col-start-[1] row-start-[3] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
          6 AM
        </div>
        <div className="col-start-[2] row-start-[3] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[3] row-start-[3] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[4] row-start-[3] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[5] row-start-[3] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[6] row-start-[3] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[7] row-start-[3] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[8] row-start-[3] border-b border-slate-100 dark:border-slate-200/5"></div>
        <div className="sticky left-0 col-start-[1] row-start-[4] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
          7 AM
        </div>
        <div className="col-start-[2] row-start-[4] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[3] row-start-[4] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[4] row-start-[4] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[5] row-start-[4] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[6] row-start-[4] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[7] row-start-[4] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[8] row-start-[4] border-b border-slate-100 dark:border-slate-200/5"></div>
        <div className="sticky left-0 col-start-[1] row-start-[5] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
          8 AM
        </div>
        <div className="col-start-[2] row-start-[5] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[3] row-start-[5] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[4] row-start-[5] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[5] row-start-[5] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[6] row-start-[5] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[7] row-start-[5] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[8] row-start-[5] border-b border-slate-100 dark:border-slate-200/5"></div>
        <div className="sticky left-0 col-start-[1] row-start-[6] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
          9 AM
        </div>
        <div className="col-start-[2] row-start-[6] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[3] row-start-[6] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[4] row-start-[6] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[5] row-start-[6] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[6] row-start-[6] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[7] row-start-[6] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[8] row-start-[6] border-b border-slate-100 dark:border-slate-200/5"></div>
        <div className="sticky left-0 col-start-[1] row-start-[7] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
          10 AM
        </div>
        <div className="col-start-[2] row-start-[7] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[3] row-start-[7] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[4] row-start-[7] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[5] row-start-[7] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[6] row-start-[7] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[7] row-start-[7] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[8] row-start-[7] border-b border-slate-100 dark:border-slate-200/5"></div>
        <div className="sticky left-0 col-start-[1] row-start-[8] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
          11 AM
        </div>
        <div className="col-start-[2] row-start-[8] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[3] row-start-[8] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[4] row-start-[8] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[5] row-start-[8] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[6] row-start-[8] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[7] row-start-[8] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[8] row-start-[8] border-b border-slate-100 dark:border-slate-200/5"></div>
        <div className="sticky left-0 col-start-[1] row-start-[9] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
          12 PM
        </div>
        <div className="col-start-[2] row-start-[9] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[3] row-start-[9] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[4] row-start-[9] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[5] row-start-[9] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[6] row-start-[9] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[7] row-start-[9] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[8] row-start-[9] border-b border-slate-100 dark:border-slate-200/5"></div>
        <div className="sticky left-0 col-start-[1] row-start-[10] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
          1 PM
        </div>
        <div className="col-start-[2] row-start-[10] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[3] row-start-[10] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[4] row-start-[10] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[5] row-start-[10] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[6] row-start-[10] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[7] row-start-[10] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[8] row-start-[10] border-b border-slate-100 dark:border-slate-200/5"></div>
        <div className="sticky left-0 col-start-[1] row-start-[11] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
          2 PM
        </div>
        <div className="col-start-[2] row-start-[11] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[3] row-start-[11] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[4] row-start-[11] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[5] row-start-[11] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[6] row-start-[11] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[7] row-start-[11] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[8] row-start-[11] border-b border-slate-100 dark:border-slate-200/5"></div>
        <div className="sticky left-0 col-start-[1] row-start-[12] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
          3 PM
        </div>
        <div className="col-start-[2] row-start-[12] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[3] row-start-[12] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[4] row-start-[12] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[5] row-start-[12] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[6] row-start-[12] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[7] row-start-[12] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[8] row-start-[12] border-b border-slate-100 dark:border-slate-200/5"></div>
        <div className="sticky left-0 col-start-[1] row-start-[13] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
          4 PM
        </div>
        <div className="col-start-[2] row-start-[13] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[3] row-start-[13] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[4] row-start-[13] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[5] row-start-[13] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[6] row-start-[13] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[7] row-start-[13] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[8] row-start-[13] border-b border-slate-100 dark:border-slate-200/5"></div>
        <div className="sticky left-0 col-start-[1] row-start-[14] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
          5 PM
        </div>
        <div className="col-start-[2] row-start-[14] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[3] row-start-[14] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[4] row-start-[14] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[5] row-start-[14] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[6] row-start-[14] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[7] row-start-[14] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[8] row-start-[14] border-b border-slate-100 dark:border-slate-200/5"></div>
        <div className="sticky left-0 col-start-[1] row-start-[15] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
          6 PM
        </div>
        <div className="col-start-[2] row-start-[15] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[3] row-start-[15] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[4] row-start-[15] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[5] row-start-[15] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[6] row-start-[15] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[7] row-start-[15] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[8] row-start-[15] border-b border-slate-100 dark:border-slate-200/5"></div>
        <div className="sticky left-0 col-start-[1] row-start-[16] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
          7 PM
        </div>
        <div className="col-start-[2] row-start-[16] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[3] row-start-[16] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[4] row-start-[16] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[5] row-start-[16] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[6] row-start-[16] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[7] row-start-[16] border-b border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[8] row-start-[16] border-b border-slate-100 dark:border-slate-200/5"></div>
        <div className="sticky left-0 col-start-[1] row-start-[17] border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400 dark:border-slate-200/5 dark:bg-slate-800">
          8 PM
        </div>
        <div className="col-start-[2] row-start-[17] border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[3] row-start-[17] border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[4] row-start-[17] border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[5] row-start-[17] border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[6] row-start-[17] border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[7] row-start-[17] border-r border-slate-100 dark:border-slate-200/5"></div>
        <div className="col-start-[8] row-start-[17]"></div>
        <div className="col-start-3 row-span-2 row-start-[2] m-1 flex flex-col rounded-lg border border-blue-700/10 bg-blue-400/20 p-1 dark:border-sky-500 dark:bg-sky-600/50">
          <span className="text-xs text-blue-600 dark:text-sky-100">5 AM</span>
          <span className="text-xs font-medium text-blue-600 dark:text-sky-100">
            Base raid
          </span>
          <span className="text-xs text-blue-600 dark:text-sky-100">
            Ragnarok, NA
          </span>
        </div>
        <div className="col-start-[4] row-span-4 row-start-[3] m-1 flex flex-col rounded-lg border border-purple-700/10 bg-purple-400/20 p-1 dark:border-fuchsia-500 dark:bg-fuchsia-600/50">
          <span className="text-xs text-purple-600 dark:text-fuchsia-100">
            6 AM
          </span>
          <span className="text-xs font-medium text-purple-600 dark:text-fuchsia-100">
            Breakfast
          </span>
          <span className="text-xs text-purple-600 dark:text-fuchsia-100">
            Mel's Diner
          </span>
        </div>
        <div className="col-start-[7] row-span-3 row-start-[14] m-1 flex flex-col rounded-lg border border-pink-700/10 bg-pink-400/20 p-1 dark:border-indigo-500 dark:bg-indigo-600/50">
          <span className="text-xs text-pink-600 dark:text-indigo-100">
            5 PM
          </span>
          <span className="text-xs font-medium text-pink-600 dark:text-indigo-100">
            🎉 Party party 🎉
          </span>
          <span className="text-xs text-pink-600 dark:text-indigo-100">
            We like to party!
          </span>
        </div>
      </div>
      <div className="flex">
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
