import { Link, routes } from "@redwoodjs/router";
import clsx from "clsx";
import { useState } from "react";
import Calendar from "src/components/Util/Calendar/Calendar";
import { Lookup, Lookup2 } from "src/components/Util/Lookup/Lookup";
import Ripple from "src/components/Util/Ripple/Ripple";
import {
  addToDate,
  adjustCalendarDate,
  getDaysBetweenDates,
  toLocalPeriod,
  toLocaleISODate,
  getISOWeek,
  groupBy,
} from "src/lib/formatters";

import type { FindTimelineSeasons } from "types/graphql";

type ViewType = "day" | "week" | "month" | "year";
const GanttChart = <T extends Record<string, unknown>>({
  data,
  group,
  dateStartKey,
  dateEndKey,
}: {
  data?: T[];
  group?: keyof T;
  dateStartKey?: keyof T;
  dateEndKey?: keyof T;
}) => {
  const [ganttData, setGanttData] = useState(groupBy(data, group.toString()));
  const [viewType, setViewType] = useState<ViewType>("week");

  // generate light colors for each group as hex
  const colors = Object.keys(ganttData).reduce((acc, cur, i) => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const hexOpacity = Math.floor((50 / 100) * 255)
      .toString(16)
      .padStart(2, "0");
    return {
      ...acc,
      [cur]: [
        `#${randomColor}${hexOpacity}`,
        `#${(
          parseInt(randomColor, 16) + Math.floor(Math.random() * 128)
        ).toString(16)}${hexOpacity}`,
      ],
    };
  }, {});

  const [dateInfo, setDateInfo] = useState(() => ({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
    week: getISOWeek(new Date()),
    dateText:
      viewType === "year"
        ? new Date().getFullYear().toString()
        : viewType === "month"
        ? new Date().toLocaleDateString(navigator && navigator.language, {
            month: "short",
            year: "numeric",
          })
        : viewType === "week"
        ? `Week ${getISOWeek(new Date())}`
        : new Date().toLocaleDateString(navigator && navigator.language, {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
          }),
  }));
  const firstDayOfWeek = 1;

  interface TimelineSeason {
    __typename: string;
    id: string;
    server: string;
    season: string;
    tribe_name: string;
    season_start_date: string;
    season_end_date: string;
    cluster: string;
  }

  interface TimelineSeason {
    __typename: string;
    id: string;
    server: string;
    season: string;
    tribe_name: string;
    season_start_date: string;
    season_end_date: string;
    cluster: string;
  }

  function findMaxGroupLengthForYear(
    data: Record<string, TimelineSeason[]>,
    year: number
  ): number {
    let maxGroupLength = 0;

    for (const server in data) {
      const seasons = data[server]
        .filter(
          (season) => new Date(season.season_start_date).getFullYear() === year
        )
        .sort(
          (a, b) =>
            new Date(a.season_start_date).getTime() -
            new Date(b.season_start_date).getTime()
        );

      let currentGroup: TimelineSeason[] = [];
      let currentMaxGroupLength = 0;

      for (const season of seasons) {
        if (currentGroup.length === 0) {
          currentGroup.push(season);
        } else {
          const seasonStartDate = new Date(season.season_start_date);
          const seasonEndDate = new Date(season.season_end_date);
          const currentGroupStartDate = new Date(
            currentGroup[0].season_start_date
          );
          const currentGroupEndDate = new Date(
            currentGroup[currentGroup.length - 1].season_end_date
          );

          if (
            seasonStartDate <= currentGroupEndDate &&
            seasonEndDate >= currentGroupStartDate
          ) {
            currentGroup.push(season);
          } else {
            currentMaxGroupLength = Math.max(
              currentMaxGroupLength,
              currentGroup.length
            );
            currentGroup = [season];
          }
        }
      }

      if (currentGroup.length > 0) {
        currentMaxGroupLength = Math.max(
          currentMaxGroupLength,
          currentGroup.length
        );
      }

      maxGroupLength = Math.max(maxGroupLength, currentMaxGroupLength);
    }

    return maxGroupLength;
  }

  const calendar = Array.from({ length: 12 }, (_, monthIndex) => {
    const firstDayOfMonth = new Date(dateInfo.year, monthIndex, 1);
    const lastDayOfMonth = new Date(dateInfo.year, monthIndex + 1, 0);
    let currentDate = adjustCalendarDate(firstDayOfMonth, "start", "week");

    return {
      month: monthIndex,
      year: dateInfo.year,
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
                hours: Array.from({ length: 24 }, (_day, hourIndex) => {
                  return new Date(date.getTime() + hourIndex * 60 * 60 * 1000);
                }),
                isOutsideCurrentMonth:
                  date.getMonth() !== monthIndex ||
                  date.getFullYear() !== dateInfo.year,
              };
            }),
          };
        }
      ),
    };
  });

  const getGridColumns = () => {
    if (viewType === "year") {
      return calendar.length; // 12 months
    } else if (viewType === "month") {
      return calendar
        .filter(
          (y) =>
            y.year === dateInfo.year &&
            (viewType === "month" ? y.month === dateInfo.month : true)
        )
        .reduce((acc, cur) => acc + cur.days, 0);
    } else if (viewType === "week") {
      const relevantMonth = calendar.find(
        (y) => y.year === dateInfo.year && y.month === dateInfo.month
      );
      const relevantWeek = relevantMonth.weeks.find(
        (week) => week.week === dateInfo.week
      );
      return relevantWeek ? relevantWeek.dates.length : 7;
    } else if (viewType === "day") {
      return 24;
    }
  };

  const navigate = (change: -1 | 1, type: ViewType = "week") => {
    const newDate = addToDate(
      new Date(dateInfo.year, dateInfo.month, dateInfo.day),
      change,
      type
    );

    setDateInfo({
      year: newDate.getFullYear(),
      month: newDate.getMonth(),
      day: newDate.getDate(),
      week: getISOWeek(newDate),
      dateText:
        viewType === "year"
          ? newDate.getFullYear().toString()
          : viewType === "month"
          ? newDate.toLocaleDateString(navigator && navigator.language, {
              month: "short",
              year: "numeric",
            })
          : viewType === "week"
          ? `Week ${getISOWeek(newDate)}`
          : newDate.toLocaleDateString(navigator && navigator.language, {
              month: "2-digit",
              day: "2-digit",
              year: "2-digit",
            }),
    });
  };

  return (
    <div className="gantt-chart relative p-4 text-black dark:text-white">
      <div role="menubar" className="mb-2 inline-flex space-x-2">
        <Lookup
          size="small"
          margin="none"
          defaultValue={"week"}
          disableClearable
          isOptionEqualToValue={(option, value) => option.value === value.value}
          multiple={false}
          options={[
            { label: "Day View", value: "day" },
            { label: "Week View", value: "week" },
            { label: "Month View", value: "month" },
            { label: "Year View", value: "year" },
          ]}
          onChange={(_, { value }) => {
            if (value) {
              setViewType(value as ViewType);

              setDateInfo({
                ...dateInfo,
                dateText:
                  value === "year"
                    ? dateInfo.year.toString()
                    : value === "month"
                    ? new Date(
                        dateInfo.year,
                        dateInfo.month,
                        dateInfo.day
                      ).toLocaleDateString(navigator && navigator.language, {
                        month: "short",
                        year: "numeric",
                      })
                    : value === "week"
                    ? `Week ${dateInfo.week}`
                    : new Date(
                        dateInfo.year,
                        dateInfo.month,
                        dateInfo.day
                      ).toLocaleDateString(navigator && navigator.language, {
                        month: "2-digit",
                        day: "2-digit",
                        year: "2-digit",
                      }),
              });
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
          <Ripple center />
        </button>
        <button
          type="button"
          className="relative -ml-3  box-border inline-flex flex-[0_0_auto] cursor-pointer select-none appearance-none items-center justify-center rounded-full bg-transparent p-2 text-center align-middle text-2xl hover:bg-black/10 dark:hover:bg-white/10"
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
          <Ripple center />
        </button>
      </div>
      <div className="flex flex-none flex-col">
        <div
          aria-label="Calendar Header"
          className={
            "sticky top-0 z-30 flex-none bg-zinc-300 text-black shadow-lg dark:bg-neutral-800 dark:text-white"
          }
        >
          <div
            className={
              "-mr-px grid divide-x divide-black/20 border-r border-black/20 text-sm leading-6 dark:divide-white/20 dark:border-white/20"
            }
            style={{
              gridTemplateColumns: `repeat(${getGridColumns()}, minmax(0, 1fr))`,
            }}
          >
            <div className="col-end-1 flex w-20 items-center justify-center">
              <span className="whitespace-nowrap">{dateInfo.dateText}</span>
            </div>

            {calendar
              .filter(
                (y) =>
                  y.year === dateInfo.year &&
                  (viewType !== "year" ? y.month === dateInfo.month : true)
              )
              .map((month, monthIndex) => {
                return month.weeks
                  .filter((week, i) =>
                    viewType === "week" || viewType === "day"
                      ? week.week === dateInfo.week
                      : viewType === "year"
                      ? i === 0
                      : true
                  )
                  .map((week, weekIndex) => {
                    return week.dates
                      .filter((day, i) =>
                        viewType === "year"
                          ? i === week.dates.length - 1
                          : viewType === "day"
                          ? toLocaleISODate(day.date) ===
                            toLocaleISODate(
                              new Date(
                                dateInfo.year,
                                dateInfo.month,
                                dateInfo.day
                              )
                            )
                          : true
                      )
                      .map(
                        ({ date, hours, isOutsideCurrentMonth }, dateIndex) => {
                          return hours
                            .filter((_, i) =>
                              viewType !== "day" ? i === 0 : true
                            )
                            .map((hour, hourIndex) => {
                              if (viewType === "month" && isOutsideCurrentMonth)
                                return null;
                              return (
                                <div
                                  className="flex items-center justify-center py-3"
                                  key={hour.toISOString()}
                                >
                                  <span
                                    className={
                                      "flex items-center justify-center"
                                    }
                                  >
                                    {viewType === "week" &&
                                      date.toLocaleDateString(
                                        navigator && navigator.language,
                                        {
                                          weekday: "short",
                                        }
                                      )}

                                    <span
                                      className={clsx(
                                        "flex items-center justify-center",
                                        {
                                          "bg-pea-500 h-8 w-8 rounded-full text-white":
                                            (toLocaleISODate(date) ===
                                              toLocaleISODate(new Date()) &&
                                              (viewType === "week" ||
                                                viewType === "month")) ||
                                            (toLocalPeriod(date) ===
                                              toLocalPeriod(new Date()) &&
                                              viewType === "year"),
                                          "bg-pea-500 rounded-full px-1 text-white":
                                            viewType === "day" &&
                                            hour.toLocaleString(
                                              navigator && navigator.language,
                                              {
                                                hour: "2-digit",
                                                hourCycle: "h23",
                                              }
                                            ) ===
                                              new Date().toLocaleString(
                                                navigator && navigator.language,
                                                {
                                                  hour: "2-digit",
                                                  hourCycle: "h23",
                                                }
                                              ) &&
                                            toLocaleISODate(date) ===
                                              toLocaleISODate(new Date()),
                                          "font-semibold":
                                            viewType === "week" ||
                                            viewType === "month",
                                          "ml-1.5": viewType === "week",
                                        }
                                      )}
                                    >
                                      {viewType === "year"
                                        ? date.toLocaleDateString(
                                            navigator && navigator.language,
                                            {
                                              month: "short",
                                            }
                                          )
                                        : viewType === "day"
                                        ? hour.toLocaleString(
                                            navigator && navigator.language,
                                            {
                                              hour: "2-digit",
                                            }
                                          )
                                        : date.toLocaleDateString(
                                            navigator && navigator.language,
                                            {
                                              day: "numeric",
                                            }
                                          )}
                                    </span>
                                  </span>
                                </div>
                              );
                            });
                        }
                      );
                  });
              })}
          </div>
        </div>

        <div className="flex flex-auto text-xs leading-6">
          <div
            className="sticky left-0 w-20 flex-none bg-zinc-300 dark:bg-neutral-800"
            aria-label="Left bar"
          />
          <div className="grid flex-auto grid-cols-1 grid-rows-1">
            <div
              aria-label="Grid Rows"
              className="col-start-1 col-end-2 row-start-1 grid divide-y divide-black/20 text-black dark:divide-white/20 dark:text-white"
              style={{
                gridTemplateRows: `repeat(${
                  Object.keys(ganttData).length *
                  findMaxGroupLengthForYear(
                    ganttData as unknown as Record<string, TimelineSeason[]>,
                    dateInfo.year
                  )
                }, minmax(3.5rem, 1fr))`, // TODO: calculate this based on the number of items in the group
              }}
              role="rowgroup"
            >
              <div className="row-end-1 h-7" role="row" />
              {Object.keys(ganttData).map((entry, index) => (
                <>
                  <div
                    className="flex items-center"
                    key={`row-${index}`}
                    role="row"
                  >
                    <div className="sticky left-0 -ml-20 w-20 pr-2 text-right text-xs uppercase">
                      {entry}
                    </div>
                  </div>
                  <div className="" role="row" />
                </>
              ))}
            </div>
            <div
              aria-label="Grid Columns"
              className="col-start-1 col-end-2 row-start-1 grid grid-rows-1 divide-x divide-black/20 dark:divide-white/20"
              style={{
                gridTemplateColumns: `repeat(${getGridColumns()}, minmax(0, 1fr))`,
              }}
            >
              {Array.from(
                {
                  length: getGridColumns(),
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
              aria-label="Chart elements"
              className="col-start-1 col-end-2 row-start-1 -mr-px grid border-l border-r border-b border-black/20 dark:border-white/20 dark:text-white"
              style={{
                gridTemplateRows: `1.75rem repeat(${
                  Object.keys(ganttData).length *
                  findMaxGroupLengthForYear(
                    ganttData as unknown as Record<string, TimelineSeason[]>,
                    dateInfo.year
                  )
                }, minmax(0px, 1fr)) auto`, // TODO: calculate this based on the number of items in the group
                gridTemplateColumns: `repeat(${getGridColumns()}, minmax(0px, 1fr))`,
              }}
            >
              {Object.entries(ganttData)
                .map(([k, v]) => ({
                  label: k,
                  data: v.filter((item) => {
                    return viewType === "day"
                      ? toLocaleISODate(
                          new Date(item[dateStartKey].toString())
                        ) ===
                          toLocaleISODate(
                            new Date(
                              dateInfo.year,
                              dateInfo.month,
                              dateInfo.day
                            )
                          )
                      : viewType === "week"
                      ? (getISOWeek(new Date(item[dateStartKey].toString())) ===
                          dateInfo.week &&
                          new Date(
                            item[dateStartKey].toString()
                          ).getFullYear() === dateInfo.year) ||
                        (getISOWeek(new Date(item[dateEndKey].toString())) ===
                          dateInfo.week &&
                          new Date(
                            item[dateEndKey].toString()
                          ).getFullYear() === dateInfo.year)
                      : viewType === "month"
                      ? toLocalPeriod(
                          new Date(item[dateStartKey].toString())
                        ) ===
                          toLocalPeriod(
                            new Date(
                              dateInfo.year,
                              dateInfo.month,
                              dateInfo.day
                            )
                          ) ||
                        toLocalPeriod(new Date(item[dateEndKey].toString())) ===
                          toLocalPeriod(
                            new Date(
                              dateInfo.year,
                              dateInfo.month,
                              dateInfo.day
                            )
                          )
                      : viewType === "year"
                      ? new Date(
                          item[dateStartKey].toString()
                        ).getFullYear() === dateInfo.year ||
                        new Date(item[dateEndKey].toString()).getFullYear() ===
                          dateInfo.year
                      : true;
                  }),
                }))
                .map((data, groupIndex) => {
                  console.log(data, groupIndex);

                  return data.data.map((item, i) => {
                    const overlappingItems = data.data.filter((otherItem) => {
                      return (
                        new Date(otherItem[dateStartKey].toString()) <=
                          new Date(item[dateEndKey].toString()) &&
                        new Date(otherItem[dateEndKey].toString()) >=
                          new Date(item[dateStartKey].toString())
                      );
                    });
                    const extra =
                      overlappingItems.length > 1
                        ? overlappingItems.indexOf(item)
                        : 0;

                    return (
                      <li
                        key={`group-${groupIndex}-item-${i}`}
                        className="relative mt-px flex"
                        aria-label={`${data.label}-${groupIndex}-${data.label}`}
                        style={{
                          gridRow: `${
                            groupIndex *
                              findMaxGroupLengthForYear(
                                ganttData as unknown as Record<
                                  string,
                                  TimelineSeason[]
                                >,
                                dateInfo.year
                              ) +
                            2 +
                            extra
                          } / span 1`, // TODO: calculate this based on the number of items in the group
                          gridColumnStart:
                            viewType === "day"
                              ? new Date(
                                  item[dateStartKey].toString()
                                ).getHours() + 1
                              : viewType === "week"
                              ? new Date(item[dateStartKey].toString()).getDay()
                              : viewType === "month"
                              ? new Date(
                                  item[dateStartKey].toString()
                                ).getDate()
                              : viewType === "year"
                              ? new Date(
                                  item[dateStartKey].toString()
                                ).getFullYear() < dateInfo.year
                                ? 1
                                : new Date(
                                    item[dateStartKey].toString()
                                  ).getMonth() + 1
                              : 1,
                          gridColumnEnd:
                            (viewType === "day"
                              ? new Date(
                                  item[dateEndKey].toString()
                                ).getHours() + 1
                              : viewType === "week"
                              ? new Date(item[dateEndKey].toString()).getDay()
                              : viewType === "month"
                              ? new Date(item[dateEndKey].toString()).getDate()
                              : viewType === "year"
                              ? new Date(
                                  item[dateEndKey].toString()
                                ).getMonth() + 1
                              : 7) + 1,
                        }}
                      >
                        <Link
                          to={routes.timelineSeason({ id: item.id as string })}
                          className={clsx(
                            "absolute inset-1 flex flex-col overflow-y-auto border p-1 text-xs transition hover:ring-1 hover:ring-black/50 dark:hover:ring-white/50 " // dark:bg-sky-600/50 bg-blue-400/20 border border-blue-700/10 dark:border-sky-500
                          )}
                          style={{
                            borderRadius: "0.5rem",
                            background: `linear-gradient(to right, ${colors[
                              data.label
                            ].join(" 30%, ")})`,
                            borderColor: `${colors[data.label][0].substring(
                              0,
                              7
                            )}`,
                          }}
                        >
                          <span>{item["tribe_name"].toString()}</span>
                          {new Intl.DateTimeFormat(
                            navigator && navigator.language,
                            { dateStyle: "short" }
                          ).formatRange(
                            new Date(item[dateStartKey].toString()),
                            new Date(item[dateEndKey].toString())
                          )}
                        </Link>
                      </li>
                    );
                  });
                })}
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
        data={timelineSeasons}
        group="server"
        dateStartKey="season_start_date"
        dateEndKey="season_end_date"
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
              <div className="absolute -left-1.5 mt-1.5  h-3 w-3 rounded-full border border-white bg-zinc-500 dark:border-zinc-900"></div>
              <time className="mb-1 text-sm font-normal leading-none text-zinc-500">
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

                <div className="text-zinc-600 dark:text-zinc-300">
                  <div className="text-base font-normal">
                    <span className="font-medium text-zinc-900 dark:text-white">
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
                  <span className="inline-flex items-center text-xs font-normal text-zinc-500 dark:text-zinc-400">
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
                      />
                    </svg>
                    {/* <svg
                      aria-hidden="true"
                      className="mr-1 h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      ></path>
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg> */}
                    Public
                  </span>
                </div>
              </div>
              <Link
                to={routes.timelineSeason({ id })}
                className="relative inline-flex items-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:text-black focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white"
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
                  />
                </svg>
                <Ripple />
              </Link>
            </li>
          )
        )}
      </ol>
    </article>
  );
};

export default TimelineSeasonsList;
