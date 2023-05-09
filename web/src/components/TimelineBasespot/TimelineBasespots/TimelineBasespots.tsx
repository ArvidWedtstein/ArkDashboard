import { set } from "@redwoodjs/forms";
import { Link, back, navigate, routes, useParams } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";

import { QUERY } from "src/components/TimelineBasespot/TimelineBasespotsCell";
import ImageContainer from "src/components/Util/ImageContainer/ImageContainer";
import {
  arrRandNoRep,
  getDateDiff,
  groupBy,
  isDate,
  jsonTruncate,
  timeTag,
  truncate,
} from "src/lib/formatters";

import type {
  DeleteTimelineBasespotMutationVariables,
  FindTimelineBasespots,
} from "types/graphql";

const DELETE_TIMELINE_BASESPOT_MUTATION = gql`
  mutation DeleteTimelineBasespotMutation($id: BigInt!) {
    deleteTimelineBasespot(id: $id) {
      id
    }
  }
`;

const TimelineBasespotsList = ({
  timelineBasespots,
}: FindTimelineBasespots) => {
  const [grid, setGrid] = useState([]);
  const [radio, changeRadio] = useState("server");
  useEffect(() => {
    if (grid.length < 9) {
      for (let i = 0; i < 9; i++) {
        const date = new Date(new Date().setDate(1));
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });

        grid.push({
          label: monthName,
          date,
        });
      }
      setGrid((prev) => prev.reverse());
    }
  }, []);

  const groupedEvents = useMemo(() => {
    return timelineBasespots.reduce((acc, x) => {
      let keyValue = new Date(x.start_date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      acc[keyValue] = acc[keyValue] ? [...acc[keyValue], x] : [x];
      return acc;
    }, {});
  }, [timelineBasespots]);

  const setRadio = useCallback(
    (e) => {
      changeRadio(e);
    },
    [radio]
  );

  const mapImages = {
    2: [
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/62a15c04-bef2-45a2-a06a-c984d81c3c0b/dd391pu-a40aaf7b-b8e7-4d6d-b49d-aa97f4ad61d0.jpg",
    ],
    3: [
      "https://cdn.akamai.steamstatic.com/steam/apps/473850/ss_f13c4990d4609d3fc89174f71858835a9f09aaa3.1920x1080.jpg?t=1508277712",
    ],
    7: ["https://wallpapercave.com/wp/wp10504822.jpg"],
    4: [
      "https://cdn.survivetheark.com/uploads/monthly_2016_10/large.580b5a9c3b586_Ragnarok02.jpg.6cfa8b30a81187caace6fecc1e9f0c31.jpg",
      "https://survivetheark.com/index.php?/gallery/image/20889-ragnarok/&do=download",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJJmqrzhtbVQJCChwuL510y_vCKfy1XIHCnQ&usqp=CAU",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRBdPB6lPmw7GEpebf9vKTd7pESyh1NZUuSw&usqp=CAU",
    ],
    5: [
      "https://cdn.images.express.co.uk/img/dynamic/143/590x/ARK-Survival-Evolved-849382.jpg",
      "https://i.ytimg.com/vi/JD2pw7olqTI/maxresdefault.jpg",
      "https://mcdn.wallpapersafari.com/medium/11/10/HqzA26.jpg",
      "https://external-preview.redd.it/kNGv5THQAMo1KkSV0kh3rb3zVkv1sQ5JfcVhxYQU3M8.png?format=pjpg&auto=webp&s=b586ca457104b002c9f132e84dcc8819236d6d40",
      "https://cdn.survivetheark.com/uploads/monthly_2018_01/large.ARK-Wallpaper-Aberration-Flowers_by_pollti_1024x576.jpg.ccd6f6278b7e536b56095df031fbac12.jpg",
    ],
    6: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/887380/ss_3c2c1d7c027c8beb54d2065afe3200e457c2867c.1920x1080.jpg?t=1594677636",
    ],
    1: [
      "https://i.pinimg.com/originals/0b/95/09/0b9509ddce658e3209ece1957053b27e.jpg",
      "https://pbs.twimg.com/media/D9h39iwX4AUrWAh.jpg:large",
      "https://i.redd.it/du3kqr863aa31.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFKZIiTnhO5yYY1yA15nQ2UnH3W-v-PU9Mfw&usqp=CAU",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Zs3mrwKB_uGiZns4R7I8iZ8gpzMtWJ1EFA&usqp=CAU",
    ],
    8: [
      "https://cdn.akamai.steamstatic.com/steam/apps/1646700/ss_c939dd546237cba9352807d4deebd79c4e29e547.1920x1080.jpg?t=1622514386",
    ],
    10: [
      "https://cdn2.unrealengine.com/egs-crystalislesarkexpansionmap-studiowildcard-dlc-g1a-05-1920x1080-119682147.jpg?h=720&resize=1&w=1280",
      "https://c4.wallpaperflare.com/wallpaper/218/915/795/video-games-cherry-blossom-ark-survival-evolved-ark-wallpaper-preview.jpg",
      "https://i.redd.it/845iigipfgg61.png",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmcFNjX9A0w07KkV3pTfnpMl_uIGTqq0nphQ&usqp=CAU",
      "https://www.rencorner.com/uploads/monthly_2020_06/20200619191942_1.jpg.4546a3de96d1223171467b33a4f15cab.jpg",
    ],
    11: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1887560/ss_331869adb5f0c98e3f13b48189e280f8a0ba1616.1920x1080.jpg?t=1655054447",
    ],
    12: [
      "https://dicendpads.com/wp-content/uploads/2021/12/Ark-Lost-Island.png",
      "https://c4.wallpaperflare.com/wallpaper/745/402/370/ark-survival-evolved-video-games-the-island-sunlight-jungle-wallpaper-preview.jpg",
      "https://c4.wallpaperflare.com/wallpaper/958/368/11/video-game-ark-survival-evolved-ark-survival-evolved-jungle-wallpaper-thumb.jpg",
    ],
    9: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1646720/ss_5cad67b512285163143cfe21513face50c0a00f6.1920x1080.jpg?t=1622744444",
      "https://wallpapercave.com/wp/wp9285176.png",
      "https://cdn.survivetheark.com/images/gen2/wallpaper/ARK_Genesis2_Promo_Canoe.jpg",
      "https://wallpapercave.com/wp/wp6293505.png",
      "https://wallpapercave.com/wp/wp6293166.jpg",
      "https://wallpapercave.com/wp/wp9285339.jpg",
    ],
  };
  const servers = {
    "Elite Ark":
      "https://eliteark.com/wp-content/uploads/2022/06/cropped-0_ark-logo.thumb_.png.36427f75c51aff4ecec55bba50fd194d.png",
    "Bloody Ark":
      "https://preview.redd.it/cdje2wcsmr521.png?width=313&format=png&auto=webp&s=bf1e8347b8dcd066bcf3aace6a461b61e804570b",
    Arkosic:
      "https://steamuserimages-a.akamaihd.net/ugc/2023839858710970915/3E075CEE248A0C9F9069EC7D12894F597E74A2CF/?imw=200&imh=200&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
  };

  const [isActive, setIsActive] = useState(0);

  const setActive = useCallback(
    (e, index) => {
      e.currentTarget.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
      setIsActive(index);

      return;
    },
    [isActive, setIsActive]
  );

  const getEventCellStyle = (day, server) => {
    const colors = [
      "#FFB6C1",
      "#FFC0CB",
      "#FF69B4",
      "#FF1493",
      "#DB7093",
      "#C71585",
      "#E6E6FA",
      "#D8BFD8",
      "#DDA0DD",
      "#DA70D6",
      "#EE82EE",
      "#FF00FF",
      "#BA55D3",
      "#9370DB",
      "#663399",
    ];
    const event = timelineBasespots.find((event) => {
      const startDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);

      return (
        new Date(startDate).toLocaleString("default", {
          year: "numeric",
          month: "numeric",
        }) <=
          new Date(day).toLocaleString("default", {
            year: "numeric",
            month: "numeric",
          }) &&
        new Date(day).toLocaleString("default", {
          year: "numeric",
          month: "numeric",
        }) <=
          new Date(endDate).toLocaleString("default", {
            year: "numeric",
            month: "numeric",
          }) &&
        event[radio] === server
      );
    });

    if (event && event != null) {
      const { id, start_date, end_date } = event;
      const startDay = new Date(start_date).getMonth();
      const endDay = new Date(end_date).getMonth();
      const daysSpan = endDay - startDay + 1;
      const mineStart = startDay === day.getMonth();
      const mineEnd = endDay === day.getMonth();

      const style = {
        background: colors[id % colors.length],
        borderLeft:
          mineStart && timelineBasespots.indexOf(event) === isActive
            ? "1px solid #fff"
            : mineEnd && !mineStart
            ? `3px solid ${colors[id % colors.length]}`
            : 0,
        borderRight:
          mineEnd && timelineBasespots.indexOf(event) === isActive
            ? "1px solid #fff"
            : mineStart && !mineEnd
            ? `3px solid ${colors[id % colors.length]}`
            : 0,
        borderTop:
          (mineEnd || mineStart) &&
          timelineBasespots.indexOf(event) === isActive
            ? "1px solid #fff"
            : 0,
        borderBottom:
          (mineEnd || mineStart) &&
          timelineBasespots.indexOf(event) === isActive
            ? "1px solid #fff"
            : 0,

        borderTopLeftRadius: mineStart ? "0.25rem" : 0,
        borderBottomLeftRadius: mineStart ? "0.25rem" : 0,
        borderTopRightRadius: mineEnd ? "0.25rem" : 0,
        borderBottomRightRadius: mineEnd ? "0.25rem" : 0,
        marginTop: "3px",
        gridColumnStart: mineStart ? "auto" : "span 1",
        gridColumnEnd: mineEnd ? "auto" : `span ${daysSpan}`,
      };

      return {
        style,
        onClick: (e) => {
          setIsActive(timelineBasespots.indexOf(event));
          // navigate(routes.timelineBasespot({ id: id.toString() }));
        },
      };
    }

    return null;
  };
  return (
    <div>
      <section className="relative m-auto flex h-full w-full px-10 ">
        <div className="flex w-full flex-wrap items-center justify-center">
          <div className="relative h-fit w-full p-10 md:h-fit md:w-[55%]">
            <div className="grid grid-cols-1 grid-rows-1">
              {timelineBasespots.map((timelineBasespot, index) => (
                <div
                  key={`basespot-image-${index}`}
                  className={clsx("block w-full transition-all duration-500", {
                    block: isActive === index,
                    hidden: isActive !== index,
                  })}
                >
                  <ImageContainer
                    className={clsx(
                      "block !w-full rounded-lg transition-opacity duration-300 ease-in-out motion-reduce:transform-none motion-reduce:transition-none",
                      {
                        "animate-fade-in opacity-100": isActive === index,
                        "opacity-0": isActive !== index,
                      }
                    )}
                    src={arrRandNoRep(mapImages[timelineBasespot.map])}
                  />
                  <Link
                    to={routes.timelineBasespot({
                      id: timelineBasespot.id.toString(),
                    })}
                    className="rw-button rw-button-green-outline float-right mt-2 transition"
                    onClick={(e) => {}}
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[45%] w-full p-10 md:h-auto md:w-[45%]">
            <div className="pb-3">
              <h2 className="text-4xl font-bold leading-8 text-gray-800 dark:text-stone-200">
                Timeline
                <br />
              </h2>
              <p className="mt-4 text-base font-light leading-6 text-gray-800 dark:text-stone-400">
                Basespots over the last{" "}
                {
                  getDateDiff(
                    new Date(timelineBasespots[0].start_date),
                    new Date(
                      timelineBasespots[timelineBasespots.length - 1].start_date
                    )
                  ).years
                }{" "}
                years
              </p>
            </div>
            <div className="rw-segment max-h-[300px] overflow-y-auto scroll-smooth transition-all duration-300">
              {timelineBasespots.map(
                (
                  { tribe_name, start_date, season, cluster, region, server },
                  index
                ) => (
                  <div
                    key={`timelinebasespot-${index}`}
                    className="pl-4 transition-all duration-300"
                    onClick={(e) => setActive(e, index)}
                  >
                    <div className="relative my-10 min-h-[28px] pr-5">
                      <div
                        className={clsx(
                          "absolute top-0 -left-4 inline-block h-full w-1 overflow-hidden rounded-sm will-change-transform",
                          {
                            "bg-gray-500 ": isActive !== index,
                          }
                        )}
                      >
                        <div
                          className={clsx(
                            "absolute top-0 left-0 inline-block h-full w-full origin-top scale-x-100 transform transition-transform duration-300 ease-linear",
                            {
                              "animate-fill-up bg-pea-500 scale-y-100":
                                isActive === index,
                              "scale-y-0": isActive !== index,
                            }
                          )}
                        ></div>
                      </div>

                      <div
                        className={clsx(
                          "cursor-pointer transition-all duration-300 ease-linear hover:opacity-100",
                          {
                            "text-gray-400 opacity-60": isActive !== index,
                            "text-white opacity-100": isActive === index,
                          }
                        )}
                      >
                        <h3 className="inline-flex w-full items-center justify-between text-xl">
                          <span>{tribe_name}</span>
                          <div className="inline-flex space-x-1 self-end">
                            <span className="">S{season || "?"}</span>
                            <img
                              src={servers[server]}
                              className="w-8 rounded-full"
                            />
                          </div>
                        </h3>
                      </div>

                      <div
                        className={clsx(
                          "origin-top overflow-hidden transition-all duration-300 ease-in will-change-transform",
                          {
                            "animate-fade-in !h-full": isActive === index,
                            "!h-0": isActive !== index,
                          }
                        )}
                      >
                        <p className="mt-3 text-base font-light leading-6 text-[#3c4043] dark:text-stone-400">
                          {season && (
                            <abbr title={`Season ${season}`}>S{season}</abbr>
                          )}
                          {` ${cluster || ""} ${region || ""}`}

                          {(cluster || region || season) && ", "}
                          {server}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="rw-table-wrapper-responsive">
        <select
          className="rw-input"
          onChange={(e) => setRadio(e.currentTarget.value)}
          defaultValue={"server"}
        >
          <option value="server">Server</option>
          <option value="season">Season</option>
          <option value="cluster">Cluster</option>
          <option value="region">Region</option>
        </select>

        <table className="mx-auto w-full table-auto text-sm">
          <tbody className="rounded-lg text-center">
            {Object.keys(groupBy(timelineBasespots, radio)).map((server) => (
              <tr
                className="table-row border-b border-black dark:border-stone-300 dark:border-opacity-50"
                key={server}
              >
                <td className="table-cell min-w-fit px-3 py-2 font-bold text-gray-800 dark:text-white">
                  {server}
                </td>
                {grid.map((m) => {
                  const events = groupedEvents[m.label] || [];
                  const filteredEvents = events.filter(
                    (d) => d[radio] === server
                  );

                  return (
                    <td
                      className="table-cell border-l border-black px-3 py-2 text-gray-800 dark:border-stone-300 dark:text-white"
                      key={m.label + "-" + server}
                    >
                      {filteredEvents.length > 0 ? (
                        <div className="z-10 flex flex-col">
                          {filteredEvents.map((event) => {
                            const shouldRenderEvent =
                              new Date(event.start_date).getMonth() <=
                                new Date(m.date).getMonth() &&
                              new Date(m.date).getMonth() <=
                                new Date(event.end_date).getMonth();

                            if (shouldRenderEvent) {
                              return (
                                <div key={event.id} className="relative">
                                  <div
                                    className="-mx-3 h-auto cursor-pointer text-left text-white"
                                    {...getEventCellStyle(m.date, server)}
                                    title={`${event.server} Season ${event.season}`}
                                  >
                                    <Link
                                      className="ml-1"
                                      to={routes.timelineBasespot({
                                        id: event.id.toString(),
                                      })}
                                    >{`${event.server} S${
                                      event.season ? event.season : "?"
                                    }`}</Link>
                                  </div>
                                </div>
                              );
                            }

                            return null;
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <div className="">
                            <div
                              className="-mx-3 h-fit text-transparent"
                              {...getEventCellStyle(m.date, server)}
                            >
                              -
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="table-row p-2 last:border-t">
              <td className="border-l border-black px-3 py-2 text-gray-800 dark:border-stone-300 dark:text-white"></td>
              {grid.map((m) => (
                <td
                  className="border-l border-black px-3 py-2  text-gray-800 text-opacity-50 dark:border-stone-300 dark:text-white"
                  key={m.label}
                >
                  <span>{m.label}</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimelineBasespotsList;
