import { Link, routes } from "@redwoodjs/router";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import Calendar from "src/components/Util/Calendar/Calendar";
import DateCalendar from "src/components/Util/DateCalendar/DateCalendar";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import {
  addToDate,
  adjustCalendarDate,
  getDaysBetweenDates,
  getDateUnit,
  toLocalPeriod,
  toLocaleISODate,
  getISOWeek,
} from "src/lib/formatters";

import type { FindTimelineSeasons } from "types/graphql";

const GanttChart = ({
  tasks,
}: {
  tasks: { id: number | string; name?: string; start: Date; end: Date }[];
}) => {
  const [ganttTasks, setGanttTasks] = useState(tasks);
  const [viewType, setViewType] = useState<"day" | "week" | "year" | "month">(
    "week"
  );
  const [period, setPeriod] = useState<string>(() => toLocalPeriod(new Date()));
  const [period2, setPeriod2] = useState(() => ({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
    week: getISOWeek(new Date()),
  }));
  const chartRef = useRef(null);
  const dragInfo = useRef(null);
  const firstDayOfWeek = 1;

  const calendarHeader = getDateUnit(
    viewType === "year" ? "month" : "weekday",
    firstDayOfWeek
  );

  const chartStartDate = new Date("2023-10-30T00:00:00"); // Define your chart's start date
  const chartEndDate = new Date("2023-10-30T23:59:59"); // Define your chart's end date

  const calculatePosition = (start: Date) => {
    const timeDiff = +start - +chartStartDate;
    const totalDuration = +chartEndDate - +chartStartDate;
    const position = (timeDiff / totalDuration) * 100;
    return position + "%";
  };

  const calculateWidth = (start: Date, end: Date) => {
    const totalDuration = +chartEndDate - +chartStartDate;
    const taskDuration = +end - +start;
    const width = (taskDuration / totalDuration) * 100;
    return width + "%";
  };

  const handleTaskDragStart = (e: React.DragEvent<HTMLLIElement>, taskId) => {
    e.dataTransfer.setData("taskId", taskId);

    console.log(e, taskId);
    dragInfo.current = { taskId, initialX: e.clientX };
  };

  const handleTaskDrag = (e) => {
    e.preventDefault();
    if (!dragInfo.current) return;
    const { taskId, initialX } = dragInfo.current;
    const deltaX = e.clientX - initialX;

    console.log(e, taskId);
    // Calculate the new start and end dates based on deltaX
    // Update ganttTasks and re-render
  };

  const handleTaskDragEnd = (e) => {
    console.log(dragInfo.current);
    dragInfo.current = null;
    // Handle the end of the drag operation (e.g., update data on server)
  };
  const useCalendarDateRange = (
    period: string | Date,
    weekStartsOn: number = 0,
    type: "month" | "year" | "week" | "day" = "month"
  ) => {
    const [first, setFirst] = useState(() =>
      adjustCalendarDate(
        adjustCalendarDate(new Date(period), "start", type),
        "start",
        "week",
        weekStartsOn
      )
    );
    const [last, setLast] = useState(() =>
      adjustCalendarDate(new Date(period), "end", type)
    );

    useEffect(() => {
      setFirst(
        adjustCalendarDate(
          adjustCalendarDate(new Date(period), "start", type),
          "start",
          "week",
          weekStartsOn
        )
      );

      setLast(adjustCalendarDate(new Date(period), "end", type));
    }, [period, weekStartsOn, type]);
    if (type === "year") console.log("USERANGE", first, last, type);
    return [first, last];
  };

  const [firstDay, lastDay] = useCalendarDateRange(
    period,
    firstDayOfWeek,
    viewType === "day" || viewType === "week" || viewType === "month"
      ? "month"
      : "year"
  );

  const weeks = Array.from(
    {
      length: Math.ceil(getDaysBetweenDates(firstDay, lastDay).length / 7),
    },
    (_, weekIndex) => {
      return Array.from({ length: 7 }, (_day, index) => {
        return addToDate(firstDay, weekIndex * 7 + index, "day");
      });
    }
  );

  const calendar = Array.from({ length: 12 }, (_, monthIndex) => {
    const firstDayOfMonth = new Date(
      new Date(period).getFullYear(),
      monthIndex,
      1
    );
    const lastDayOfMonth = new Date(
      new Date(period).getFullYear(),
      monthIndex + 1,
      0
    );
    let currentDate = adjustCalendarDate(firstDayOfMonth, "start", "week");

    return {
      month: monthIndex,
      year: new Date(period).getFullYear(),
      days: getDaysBetweenDates(firstDayOfMonth, lastDayOfMonth).length,
      weeks: Array.from(
        {
          length: Math.ceil(
            getDaysBetweenDates(firstDayOfMonth, lastDayOfMonth).length / 7
          ),
        },
        (_, weekIndex) => {
          return {
            week: getISOWeek(addToDate(currentDate, weekIndex * 7, "day")),
            dates: Array.from({ length: 7 }, (_day, index) => {
              let date = addToDate(currentDate, weekIndex * 7 + index, "day");
              return {
                date,
                isOutsideCurrentMonth: date.getMonth() !== monthIndex,
              };
            }),
          };
        }
      ),
    };
  });

  const navigate = (
    change: -1 | 1,
    type: "month" | "year" | "day" | "week" = "week"
  ) => {
    const newDate = addToDate(new Date(period), change, type);

    setPeriod(toLocalPeriod(newDate));

    console.log(toLocalPeriod(newDate), type);
  };

  // console.log("CALENDAR", calendar, viewType);
  // console.log(weeks2, getDaysBetweenDates(firstDay, lastDay).length, Math.ceil(getDaysBetweenDates(firstDay, lastDay).length / 31), (getDaysBetweenDates(firstDay, lastDay).length / 7 + 1) / 12)
  return (
    <div
      className="gantt-chart relative p-4 text-black dark:text-white"
      ref={chartRef}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleTaskDrag(e)}
    >
      <div role="menubar" className="mb-2 inline-flex space-x-2">
        <Lookup
          size="small"
          margin="none"
          disableClearable
          readOnly
          enforceOption
          defaultValue={["week"]}
          options={[
            { label: "Day View", value: "day" },
            { label: "Week View", value: "week" },
            { label: "Month View", value: "month" },
            { label: "Year View", value: "year" },
          ]}
          onSelect={(val) => {
            console.log(val);
            if (val.length > 0) {
              setViewType(val[0].value.toString() as "week" | "month" | "year");
            }
          }}
        />
        <button
          type="button"
          className="relative -mr-3 box-border inline-flex flex-[0_0_auto] cursor-pointer select-none appearance-none items-center justify-center rounded-full bg-transparent p-2 text-center align-middle text-2xl hover:bg-black/10 dark:hover:bg-white/10"
          aria-label="Previous month"
          onClick={() => navigate(-1, viewType)}
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
        <button
          type="button"
          className="relative -ml-3 box-border inline-flex flex-[0_0_auto] cursor-pointer select-none appearance-none items-center justify-center rounded-full bg-transparent p-2 text-center align-middle text-2xl hover:bg-black/10 dark:hover:bg-white/10"
          aria-label="Next month"
          onClick={() => navigate(1, viewType)}
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
      <div className="flex flex-none flex-col">
        <div
          className={
            "sticky top-0 z-30 flex-none bg-zinc-300 shadow-lg dark:bg-neutral-800 dark:text-white"
          }
        >
          <div
            className={
              "-mr-px grid divide-x text-sm leading-6 dark:divide-white/20 dark:border-white/20"
            }
            style={{
              gridTemplateColumns: `repeat(${
                viewType === "year"
                  ? calendar.length
                  : viewType === "month"
                  ? calendar.filter(
                      (y) =>
                        y.year === new Date(period).getFullYear() &&
                        (viewType === "month"
                          ? y.month === new Date(period).getMonth()
                          : true)
                    )[0].days
                  : viewType === "week"
                  ? calendar
                      .filter(
                        (y) =>
                          y.year === new Date(period).getFullYear() &&
                          y.month === new Date(period).getMonth()
                      )[0]
                      .weeks.filter((week) =>
                        viewType === "week"
                          ? week.week === getISOWeek(new Date())
                          : true
                      )[0].dates.length
                  : 7
              }, minmax(0, 1fr))`,
            }}
          >
            <div className="col-end-1 w-14" />

            {calendar
              .filter(
                (y) =>
                  y.year === new Date(period).getFullYear() &&
                  (viewType === "month"
                    ? y.month === new Date(period).getMonth()
                    : true)
              )
              .map((month, monthIndex) => {
                return month.weeks
                  .filter((week, i) =>
                    viewType === "week"
                      ? week.week === getISOWeek(new Date())
                      : viewType === "year"
                      ? i === 0
                      : true
                  )
                  .map((week, weekIndex) => {
                    return week.dates
                      .filter((_, i) =>
                        viewType === "year" ? i === week.dates.length - 1 : true
                      )
                      .map(({ date, isOutsideCurrentMonth }, dateIndex) => {
                        if (viewType === "month" && isOutsideCurrentMonth)
                          return null;

                        return (
                          <div
                            className="flex items-center justify-center py-3"
                            key={date.toISOString()}
                          >
                            <span
                              className={clsx(
                                "flex items-center justify-center",
                                {
                                  "bg-pea-500 h-8 w-8 justify-center rounded-full font-semibold text-white":
                                    date.getMonth() === new Date().getMonth() &&
                                    viewType === "year",
                                }
                              )}
                            >
                              {viewType === "month"
                                ? ""
                                : viewType === "year"
                                ? date.toLocaleDateString(
                                    navigator && navigator.language,
                                    {
                                      month: "short",
                                    }
                                  )
                                : date.toLocaleDateString(
                                    navigator && navigator.language,
                                    {
                                      weekday: "short",
                                    }
                                  )}

                              {(viewType === "week" || viewType == "month") && (
                                <span
                                  className={clsx(
                                    "ml-1.5 flex items-center justify-center font-semibold",
                                    {
                                      // 'text-red-500': day.getDay() === 0 || day.getDay() === 6,
                                      "bg-pea-500 h-8 w-8 rounded-full text-white":
                                        toLocaleISODate(date) ===
                                        toLocaleISODate(new Date()),
                                    }
                                  )}
                                >
                                  {date.toLocaleDateString(
                                    navigator && navigator.language,
                                    {
                                      day: "numeric",
                                    }
                                  )}
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      });
                  });
              })}
          </div>
        </div>

        <div className="flex flex-auto text-xs leading-6">
          <div className="sticky left-0 z-10 w-14 flex-none bg-zinc-300 dark:bg-neutral-800" />
          <div className="grid flex-auto grid-cols-1 grid-rows-1">
            <div
              className="col-start-1 col-end-2 row-start-1 grid divide-y dark:divide-white/20 dark:text-white"
              style={{
                gridTemplateRows: `repeat(${tasks.length}, minmax(3.5rem, 1fr))`,
              }}
              role="rowgroup"
            >
              <div className="row-end-1 h-7" role="row" />
              {tasks.map((task, index) => (
                <div
                  className="flex items-center"
                  key={`row-${index}`}
                  role="row"
                >
                  <div className="sticky left-0 z-20 -ml-14 w-14 pr-2 text-right text-xs">
                    {task.name}
                  </div>
                </div>
              ))}
            </div>
            <div
              className="col-start-1 col-end-2 row-start-1 grid grid-rows-1 divide-x dark:divide-white/20"
              style={{
                gridTemplateColumns: `repeat(${
                  viewType === "year"
                    ? calendar.length
                    : calendar.filter(
                        (y) =>
                          y.year === new Date(period).getFullYear() &&
                          (viewType === "month"
                            ? y.month === new Date(period).getMonth()
                            : true)
                      )[0].days
                })`,
              }}
            >
              {Array.from(
                {
                  length:
                    viewType === "year"
                      ? calendar.length
                      : viewType === "month"
                      ? calendar.filter(
                          (y) =>
                            y.year === new Date(period).getFullYear() &&
                            (viewType === "month"
                              ? y.month === new Date(period).getMonth()
                              : true)
                        )[0].days
                      : viewType === "week"
                      ? calendar
                          .filter(
                            (y) =>
                              y.year === new Date(period).getFullYear() &&
                              y.month === new Date(period).getMonth()
                          )[0]
                          .weeks.filter((week) =>
                            viewType === "week"
                              ? week.week === getISOWeek(new Date())
                              : true
                          )[0].dates.length
                      : 7,
                },
                (_, index) => {
                  return (
                    <div
                      style={{
                        gridColumnStart: index + 1,
                      }}
                      className="row-[1/-1]"
                    />
                  );
                }
              )}
            </div>
            <ol
              className="col-start-1 col-end-2 row-start-1 grid grid-cols-7 border-l border-r border-b dark:border-white/20 dark:text-white"
              style={{
                gridTemplateRows: `1.75rem repeat(${tasks.length}, minmax(0px, 1fr)) auto`,
                gridTemplateColumns: `repeat(${
                  viewType === "year"
                    ? calendar.length
                    : viewType === "month"
                    ? calendar.filter(
                        (y) =>
                          y.year === new Date(period).getFullYear() &&
                          (viewType === "month"
                            ? y.month === new Date(period).getMonth()
                            : true)
                      )[0].days
                    : viewType === "week"
                    ? calendar
                        .filter(
                          (y) =>
                            y.year === new Date(period).getFullYear() &&
                            y.month === new Date(period).getMonth()
                        )[0]
                        .weeks.filter((week) =>
                          viewType === "week"
                            ? week.week === getISOWeek(new Date())
                            : true
                        )[0].dates.length
                    : 7
                }, minmax(0px, 1fr))`,
              }}
            >
              {ganttTasks.map((task, i) => (
                <li
                  key={task.id}
                  className="relative mt-px flex"
                  style={{
                    gridRow: `${i + 2} / ${i + 3}`,
                    gridColumnStart:
                      viewType === "week"
                        ? task.start.getDay()
                        : viewType === "month"
                        ? task.start.getDate()
                        : viewType === "year"
                        ? task.start.getMonth() + 1
                        : 1,
                    gridColumnEnd:
                      viewType === "week"
                        ? task.end.getDay()
                        : viewType === "month"
                        ? task.end.getDate()
                        : viewType === "year"
                        ? task.end.getMonth() + 1
                        : 7,
                  }}
                  draggable
                  onDragStart={(e) => handleTaskDragStart(e, task.id)}
                  onDragEnd={handleTaskDragEnd}
                >
                  <p className="bg-pea-400/80 absolute inset-1 flex flex-col overflow-y-auto rounded-lg p-2">
                    {task.name}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineSeasonsList = ({ timelineSeasons }: FindTimelineSeasons) => {
  const dateformatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "utc",
    dateStyle: "long",
  });

  const servers = {
    "Elite Ark": {
      icon: "https://eliteark.com/wp-content/uploads/2022/06/cropped-0_ark-logo.thumb_.png.36427f75c51aff4ecec55bba50fd194d.png",
      badge: "rw-badge-blue-outline",
    },
    "Bloody Ark": {
      icon: "https://preview.redd.it/cdje2wcsmr521.png?width=313&format=png&auto=webp&s=bf1e8347b8dcd066bcf3aace6a461b61e804570b",
      badge: "rw-badge-red-outline",
    },

    Arkosic: {
      icon: "https://steamuserimages-a.akamaihd.net/ugc/2023839858710970915/3E075CEE248A0C9F9069EC7D12894F597E74A2CF/?imw=200&imh=200&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
      badge: "rw-badge-green-outline",
    },
    "Mesa Ark": {
      icon: "https://mesa-ark.com/images/MESA_Icon.png",
      badge: "rw-badge-green-outline",
    },
  };

  return (
    <article className="rw-segment overflow-x-auto">
      <header className="rw-segment-header">
        <h2 className="rw-heading text-xl">Timeline Seasons</h2>
        <Link
          to={routes.newTimelineSeason()}
          className="rw-button rw-button-green-outline my-3"
        >
          New Timeline Season
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="rw-button-icon-end"
          >
            <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
          </svg>
        </Link>
      </header>

      <Calendar
        data={timelineSeasons}
        group="server"
        dateStartKey="season_start_date"
        dateEndKey="season_end_date"
      />

      <GanttChart
        tasks={[
          {
            id: 1,
            name: "test1",
            start: new Date("2023-5-30"),
            end: new Date("2023-11-30"),
          },
          {
            id: 2,
            name: "test2",
            start: new Date("2023-12-15"),
            end: new Date("2024-02-30"),
          },
          {
            id: 3,
            name: "test3",
            start: new Date("2023-11-23"),
            end: new Date("2023-11-23"),
          },
          {
            id: 4,
            name: "test4",
            start: new Date(),
            end: new Date("2023-11-30"),
          },
          {
            id: 5,
            name: "test5",
            start: new Date(),
            end: new Date("2023-11-30"),
          },
        ]}
      />

      <ol className="relative mx-2 border-l border-zinc-500">
        {timelineSeasons.map(
          ({
            id,
            season,
            season_start_date,
            season_end_date,
            cluster,
            server,
            tribe_name,
          }) => (
            <li className="not-last:mb-10 ml-4" key={id}>
              <div className="absolute -left-1.5 mt-1.5  h-3 w-3 rounded-full border border-white bg-zinc-500 dark:border-gray-900"></div>
              <time className="mb-1 text-sm font-normal leading-none text-gray-500">
                {dateformatter.formatRange(
                  new Date(season_start_date),
                  new Date(season_end_date)
                )}
              </time>
              <div className="block items-center rounded-lg p-3 sm:flex ">
                {servers[server] && (
                  <img
                    className="mb-3 mr-3 h-16 w-16 rounded-lg sm:mb-0"
                    src={servers[server]?.icon}
                    alt="image"
                  />
                )}

                <div className="text-gray-600 dark:text-gray-300">
                  <div className="text-base font-normal">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {server}{" "}
                      {cluster && (
                        <span className={`rw-badge ${servers[server]?.badge}`}>
                          {cluster}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="text-sm font-normal">
                    {season && `Season ${season},`} {tribe_name}
                  </div>
                  <span className="inline-flex items-center text-xs font-normal text-gray-500 dark:text-gray-400">
                    <svg
                      aria-hidden="true"
                      className="mr-1 h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {/* <svg aria-hidden="true" className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"></path><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path></svg> */}
                    Public
                  </span>
                </div>
              </div>
              <Link
                to={routes.timelineSeason({ id })}
                className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
              >
                Learn more
                <svg
                  className="ml-2 h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Link>
            </li>
          )
        )}
      </ol>
    </article>
  );
};

export default TimelineSeasonsList;
