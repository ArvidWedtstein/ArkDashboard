import { routes } from "@redwoodjs/router";
import { Link } from "@redwoodjs/router";
import clsx from "clsx";
import { useMemo, useState } from "react";
import {
  addToDate,
  adjustCalendarDate,
  getDaysBetweenDates,
  getISOWeek,
  groupBy,
  toLocalPeriod,
  toLocaleISODate,
} from "src/lib/formatters";
import Ripple from "../Ripple/Ripple";
import { Lookup } from "../Lookup/Lookup";

type ViewType = "day" | "week" | "month" | "year";
type GanttData<T> = Record<string, { elements: T[]; color?: string[] }>;
type GanttProps<T> = {
  data?: T[];
  group?: keyof T;
  dateStartKey?: keyof T;
  dateEndKey?: keyof T;
  labelKey?: keyof T;
};
const Gantt = <T extends Record<string, unknown>>({
  data,
  group,
  dateStartKey,
  dateEndKey,
  labelKey,
}: GanttProps<T>) => {
  const formatDate = (options?: Intl.DateTimeFormatOptions) => {
    const dateFormatter = new Intl.DateTimeFormat(
      navigator && navigator.language,
      options
    );

    return {
      formatRange: dateFormatter.formatRange,
      format: dateFormatter.format,
    };
  };

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

  const calendar = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, monthIndex) => {
      const firstDayOfMonth = new Date(dateInfo.year, monthIndex, 1);
      const lastDayOfMonth = new Date(dateInfo.year, monthIndex + 1, 0);
      const currentDate = adjustCalendarDate(firstDayOfMonth, "start", "week");

      const weeks = Array.from(
        {
          length: Math.ceil(
            getDaysBetweenDates(firstDayOfMonth, lastDayOfMonth).length / 7
          ),
        },
        (_, weekIndex) => {
          return {
            week: getISOWeek(addToDate(currentDate, weekIndex * 7, "day")),
            dates: Array.from({ length: 7 }, (_, index) => {
              let date = addToDate(currentDate, weekIndex * 7 + index, "day");
              return {
                date,
                hours: Array.from({ length: 24 }, (_, hourIndex) => {
                  return new Date(date.getTime() + hourIndex * 60 * 60 * 1000);
                }),
                isOutsideCurrentMonth:
                  date.getMonth() !== monthIndex ||
                  date.getFullYear() !== dateInfo.year,
              };
            }),
          };
        }
      );

      return {
        month: monthIndex,
        year: dateInfo.year,
        days: getDaysBetweenDates(firstDayOfMonth, lastDayOfMonth).length,
        weeks,
      };
    });

    return months;
  }, [dateInfo.year, dateInfo.month]);

  const getGridColumns = () => {
    if (viewType === "day") {
      return 24;
    } else if (viewType === "week") {
      const relevantMonth = calendar.find(
        (y) => y.year === dateInfo.year && y.month === dateInfo.month
      );
      const relevantWeek = relevantMonth.weeks.find(
        (week) => week.week === dateInfo.week
      );
      return relevantWeek ? relevantWeek.dates.length : 7;
    } else if (viewType === "month") {
      return calendar[dateInfo.month].days;
    } else if (viewType === "year") {
      return calendar.length; // 12 months
    }
  };

  const navigate = (change: -1 | 1, type: ViewType = "week") => {
    const newDate = addToDate(
      new Date(dateInfo.year, dateInfo.month, dateInfo.day),
      change,
      type
    );

    setDateInfo((prevDateInfo) => ({
      ...prevDateInfo,
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
    }));
  };

  const ganttData = useMemo(() => {
    const groupedData = groupBy(data, group.toString());
    const generatedData = Object.entries(groupedData).map(([k, v]) => {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      const hexOpacity = Math.floor((50 / 100) * 255)
        .toString(16)
        .padStart(2, "0");
      return {
        [k]: {
          elements: v,
          color: [
            `#${randomColor}${hexOpacity}`,
            `#${(
              parseInt(randomColor, 16) + Math.floor(Math.random() * 128)
            ).toString(16)}${hexOpacity}`,
          ],
        },
      };
    });

    return generatedData.reduce((acc, cur) => {
      return {
        ...acc,
        ...cur,
      };
    }, {});
  }, [data, group]);

  const [viewType, setViewType] = useState<ViewType>("week");

  const { overlappingElements, overlappingCount } = useMemo(() => {
    const overlappingElements: Record<string, T[][]> = {};

    const dateFormats: Record<string, string> = {
      day: "yyyy-MM-dd-HH",
      week: "yyyy-MM-dd",
      month: "yyyy-MM-dd",
      year: "yyyy-MM",
    };
    const dateFormat = dateFormats[viewType];

    for (const key in ganttData) {
      if (ganttData.hasOwnProperty(key)) {
        const groupData = ganttData[key].elements.filter((season) => {
          const startYear = new Date(
            season[dateStartKey].toString()
          ).getFullYear();
          const endYear = new Date(season[dateEndKey].toString()).getFullYear();
          return startYear === dateInfo.year || endYear === dateInfo.year;
        });

        const overlappingGroupElements: T[][] = [];
        const processed: Set<string> = new Set();

        groupData.forEach((seasonA, i) => {
          if (!processed.has(seasonA["id"].toString())) {
            const overlaps: T[] = [seasonA];

            groupData.forEach((seasonB, j) => {
              if (i !== j) {
                const startA = new Date(
                  new Date(seasonA[dateStartKey].toString())
                    .toISOString()
                    .slice(0, dateFormat.length)
                ).getTime();
                const startB = new Date(
                  new Date(seasonB[dateStartKey].toString())
                    .toISOString()
                    .slice(0, dateFormat.length)
                ).getTime();
                const endA = new Date(
                  new Date(seasonA[dateEndKey].toString())
                    .toISOString()
                    .slice(0, dateFormat.length)
                ).getTime();
                const endB = new Date(
                  new Date(seasonB[dateEndKey].toString())
                    .toISOString()
                    .slice(0, dateFormat.length)
                ).getTime();

                if (!(endA < startB || endB < startA)) {
                  overlaps.push(seasonB);
                  processed.add(seasonB.id.toString());
                }
              }
            });

            if (overlaps.length > 1) {
              overlappingGroupElements.push(overlaps);
            }
          }
        });

        if (overlappingGroupElements.length > 0) {
          overlappingElements[key] = overlappingGroupElements;
        }
      }
    }

    const maxOverlapCount = Object.values(overlappingElements).reduce(
      (max, group) => {
        return Math.max(max, group.flat().length);
      },
      0
    );

    return { overlappingElements, overlappingCount: maxOverlapCount };
  }, [ganttData, viewType, dateInfo, dateStartKey, dateEndKey]);

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
                                  key={hour.toISOString() + hourIndex}
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
                gridTemplateRows: `repeat(${Object.keys(ganttData).length * overlappingCount
                  }, minmax(3.5rem, 1fr))`,
              }}
              role="rowgroup"
            >
              <div className="row-end-1 h-7" role="row" />
              {Object.keys(ganttData).map((entry, index) => (
                <React.Fragment key={`row-${index}`}>
                  <div
                    className="flex items-center"
                    role="row"
                  >
                    <div className="sticky left-0 -ml-20 w-20 border border-transparent pr-2 text-right align-middle text-xs uppercase">
                      {entry}
                    </div>
                  </div>
                  {Array.from({ length: overlappingCount - 1 }).map((_, i) => (
                    <div className="flex items-center" role="row" key={`row-sub-${index + i}`}>
                    </div>
                  ))}
                </React.Fragment>
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
                      key={`column-${index}`}
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
              aria-label={`Chart elements`}
              className="col-start-1 col-end-2 row-start-1 -mr-px grid border-l border-r border-b border-black/20 dark:border-white/20 dark:text-white"
              style={{
                gridTemplateRows: `1.75rem repeat(${Object.keys(ganttData).length * overlappingCount
                  }, minmax(0px, 1fr)) auto`,
                gridTemplateColumns: `repeat(${getGridColumns()}, minmax(0px, 1fr))`,
              }}
            >
              {Object.entries(ganttData)
                .map(([k, v]) => ({
                  label: k,
                  colors: v.color,
                  data: v.elements.filter((item) => {
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
                          gridRow: `${groupIndex * overlappingCount + 2 + extra
                            } / span 1`,
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
                            background: `linear-gradient(to right, ${data.colors.join(
                              " 30%, "
                            )})`,
                            borderColor: `${data.colors[0].substring(0, 7)}`,
                          }}
                        >
                          <span>{item[labelKey].toString()}</span>
                          <time>
                            {formatDate({ dateStyle: "short" }).formatRange(
                              new Date(item[dateStartKey].toString()),
                              new Date(item[dateEndKey].toString())
                            )}
                          </time>
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

export default Gantt;
