import { Link, navigate, routes, useParams } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { QUERY } from "src/components/TimelineBasespot/TimelineBasespotsCell";
import {
  arrRandNoRep,
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
  const [deleteTimelineBasespot] = useMutation(
    DELETE_TIMELINE_BASESPOT_MUTATION,
    {
      onCompleted: () => {
        toast.success("TimelineBasespot deleted");
      },
      onError: (error) => {
        toast.error(error.message);
      },
      // This refetches the query on the list page. Read more about other ways to
      // update the cache over here:
      // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
      refetchQueries: [{ query: QUERY }],
      awaitRefetchQueries: true,
    }
  );

  const onDeleteClick = (id: DeleteTimelineBasespotMutationVariables["id"]) => {
    if (
      confirm("Are you sure you want to delete timelineBasespot " + id + "?")
    ) {
      deleteTimelineBasespot({ variables: { id } });
    }
  };
  const [grid, setGrid] = useState([]);
  useEffect(() => {
    if (grid.length < 9) {
      for (let i = 0; i < 9; i++) {
        const date = new Date(new Date().setDate(1));
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleString("default", { month: "short" });

        setGrid((prev) => [
          ...prev,
          {
            label: monthName,
            value: [650, 2350, 1000, 1350, 600, 1650, 2600, 650, 1950][i],
          },
        ]);
      }
      setGrid((prev) => prev.reverse());
    }
  }, []);

  const generateSmoothLine = useMemo(() => {
    return function (coords) {
      if (coords.length < 2) {
        return "";
      }

      let path = `M${coords[0].x},${coords[0].y}`;

      for (let i = 0; i < coords.length - 1; i++) {
        let p0 = i > 0 ? coords[i - 1] : coords[i];
        let p1 = coords[i];
        let p2 = coords[i + 1];
        let p3 = i < coords.length - 2 ? coords[i + 2] : p2;

        for (let t = 0; t < 1; t += 0.1) {
          let x =
            0.5 *
            (2 * p1.x +
              (-p0.x + p2.x) * t +
              (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t * t +
              (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t * t * t);
          let y =
            0.5 *
            (2 * p1.y +
              (-p0.y + p2.y) * t +
              (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t * t +
              (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t * t * t);
          path += `L${x},${y}`;
        }
      }

      path += `L${coords[coords.length - 1].x},${coords[coords.length - 1].y}`;

      return path;
    };
  }, []);
  const path = useMemo(() => {
    if (grid.length === 0) return "";

    const xGap = 71.125;
    const xOffset = 65;

    const points = [];
    for (let i = 0; i < grid.length; i++) {
      points.push({ x: xOffset + i * xGap, y: 220 - grid[i].value / 13 });
    }

    return generateSmoothLine(points);
  }, [grid]);
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
    eliteark:
      "https://eliteark.com/wp-content/uploads/2022/06/cropped-0_ark-logo.thumb_.png.36427f75c51aff4ecec55bba50fd194d.png",
    bloodyark:
      "https://preview.redd.it/cdje2wcsmr521.png?width=313&format=png&auto=webp&s=bf1e8347b8dcd066bcf3aace6a461b61e804570b",
    arkosic:
      "https://steamuserimages-a.akamaihd.net/ugc/2023839858710970915/3E075CEE248A0C9F9069EC7D12894F597E74A2CF/?imw=200&imh=200&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
  };

  // const imgTrack = useRef(null);
  // const handleOnDown = useCallback((e) => {
  //   imgTrack.current.dataset.mouseDownAt = parseFloat(e.clientX);
  // }, []);

  // const handleOnUp = useCallback(() => {
  //   imgTrack.current.dataset.mouseDownAt = "0";
  //   imgTrack.current.dataset.prevPercentage =
  //     imgTrack.current.dataset.percentage;
  // }, []);

  // const handleOnMove = (e) => {
  //   if (imgTrack.current.dataset.mouseDownAt === "0") return;
  //   const mouseDelta =
  //       parseFloat(imgTrack.current.dataset.mouseDownAt) -
  //       parseFloat(e.clientX),
  //     maxDelta = Number(imgTrack.current.clientWidth) / 2;

  //   const percentage = (Number(mouseDelta) / Number(maxDelta)) * -100,
  //     nextPercentageUnconstrained =
  //       parseFloat(imgTrack.current.dataset.prevPercentage) + percentage,
  //     nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

  //   imgTrack.current.dataset.percentage = nextPercentage;

  //   imgTrack.current.animate(
  //     {
  //       transform: `translate(${nextPercentage}%, -50%)`,
  //     },
  //     { duration: 1200, fill: "forwards" }
  //   );

  //   for (const image of imgTrack.current.getElementsByClassName("image")) {
  //     image.animate(
  //       {
  //         backgroundPosition: `${100 + nextPercentage}% center`,
  //       },
  //       { duration: 1200, fill: "forwards" }
  //     );
  //   }
  // };

  // const handleScroll = (e) => {
  //   if (imgTrack.current.dataset.mouseDownAt === "0") return;
  //   const mouseDelta =
  //       parseFloat(imgTrack.current.dataset.mouseDownAt) -
  //       parseFloat(e.delta[0]),
  //     maxDelta = Number(imgTrack.current.clientWidth) / 2;

  //   const percentage = (Number(mouseDelta) / Number(maxDelta)) * -100,
  //     nextPercentageUnconstrained =
  //       parseFloat(imgTrack.current.dataset.prevPercentage) + percentage,
  //     nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

  //   imgTrack.current.dataset.percentage = nextPercentage;

  //   imgTrack.current.animate(
  //     {
  //       transform: `translate(${nextPercentage}%, -50%)`,
  //     },
  //     { duration: 1200, fill: "forwards" }
  //   );

  //   for (const image of imgTrack.current.getElementsByClassName("image")) {
  //     image.animate(
  //       {
  //         backgroundPosition: `${100 + nextPercentage}% center`,
  //       },
  //       { duration: 1200, fill: "forwards" }
  //     );
  //   }
  // };

  const [isActive, setIsActive] = useState(0);

  const setActive = useCallback((e, index) => {
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
    setIsActive(index);

    return;
  }, []);
  return (
    <div>
      <section className="relative m-auto flex h-full w-full px-10 ">
        <div className="flex flex-wrap items-center justify-center">
          <div className="h-fit w-full p-10 md:h-[auto] md:w-[55%]">
            <div className="grid grid-cols-1 grid-rows-1 ">
              {timelineBasespots.map((timelineBasespot, index) => (
                <div
                  key={`basespot-image-${index}`}
                  className={clsx("transition-all duration-500", {
                    block: isActive === index,
                    hidden: isActive !== index,
                  })}
                >
                  <img
                    className={clsx(
                      "block w-full transition-opacity duration-300 ease-in-out",
                      {
                        "animate-fade-in opacity-100": isActive === index,
                        "opacity-0": isActive !== index,
                      }
                    )}
                    src={arrRandNoRep(mapImages[timelineBasespot.map])}
                    alt=""
                  />
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
                Basespots over the last {10} years
              </p>
            </div>
            <div className="rw-segment max-h-[300px] overflow-y-auto scroll-smooth transition-all duration-300">
              {timelineBasespots.map((timelineBasespot, index) => (
                <div
                  key={`basespot-${index}`}
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
                          "text-[#3c4043] opacity-60": isActive !== index,
                          "text-white opacity-100": isActive === index,
                        }
                      )}
                    >
                      <h3 className={clsx("text-xl")}>
                        {timelineBasespot.tribe_name}
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
                        S{timelineBasespot.season} {timelineBasespot.cluster}{" "}
                        {timelineBasespot.region}, {timelineBasespot.server}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* <div className="rw-segment relative">
        <section className="rw-segment h-[40rem]">
          <div
            ref={imgTrack}
            style={{ transform: "translate(0%, -50%)" }}
            className="absolute left-1/2 top-1/2 flex h-full min-w-[100vw] cursor-grab touch-pan-x select-none flex-row items-stretch space-x-3 overflow-x-auto p-3 will-change-scroll"
            id="image-track"
            data-mouse-down-at="0"
            data-prev-percentage="0"
            onMouseDown={handleOnDown}
            onMouseUp={handleOnUp}
            onMouseMove={handleOnMove}
            onMouseLeave={handleOnUp}
            onTouchStart={(e) => handleOnDown(e.touches[0])}
            onTouchEnd={handleOnUp}
            onTouchMove={(e) => handleOnMove(e.touches[0])}
            onTouchCancel={handleOnUp}
            onScroll={handleScroll}
          >
            {timelineBasespots.length > 0 &&
              timelineBasespots.map((timelineBasespot, i) => (
                <div
                  key={i}
                  aria-controls={`tab-${i}`}
                  className="image relative flex min-w-[50vmin] flex-1 flex-col rounded object-cover transition-all duration-300 after:absolute after:left-0 after:top-0 after:block after:h-full after:w-full after:rounded after:bg-gradient-to-b after:from-transparent after:to-black after:content-['']"
                  draggable="false"
                  style={{
                    backgroundImage: `url(${arrRandNoRep(
                      mapImages[timelineBasespot.map]
                    )})`,
                    backgroundSize: "cover",
                    objectPosition: "100% center",
                  }}
                >
                  <div className="z-10 flex h-full flex-col items-start justify-end px-8 py-4 text-stone-200">
                    <p className="text-xl font-bold uppercase">
                      {timelineBasespot.tribe_name}
                    </p>
                    <p className="text-base font-light">
                      {timelineBasespot.Map.name}{" "}
                      {timelineBasespot.basespot_id
                        ? `- ${timelineBasespot.basespot.name}`
                        : ""}
                    </p>
                    <hr className="my-2 h-[1px] w-full rounded border-0 bg-gray-100 dark:bg-stone-200" />
                    <div className="flex w-full flex-row items-center justify-between space-x-6 overflow-y-hidden">
                      <div className="flex flex-col items-start">
                        <p className="text-md font-light">
                          {new Date(
                            timelineBasespot.start_date
                          ).toLocaleDateString("no-NO", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xl font-normal">Started</p>
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="text-md font-light">
                          {timelineBasespot.season
                            ? `Season ${timelineBasespot.season}`
                            : "ㅤ"}
                        </p>
                        <p className="text-xl font-normal">
                          {timelineBasespot.server}
                          <img
                            src={
                              servers[
                                timelineBasespot.server
                                  .toLowerCase()
                                  .replaceAll(" ", "")
                              ]
                            }
                            className="ml-1 inline-block h-6 w-6 rounded-full"
                          />
                          {timelineBasespot.cluster && (
                            <span className="ml-2 rounded bg-gray-100 px-2.5 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              {timelineBasespot.cluster}
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          navigate(
                            routes.timelineBasespot({
                              id: timelineBasespot.id.toString(),
                            })
                          )
                        }
                        className="rw-button rw-button-gray-outline !mr-2"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div> */}
      {/* <div className="w-fit p-2 text-white">
        <div className="h-60 rounded-lg sm:h-80">
          <div className="flex h-full flex-col p-4">
            <div className="">
              <div className="flex items-center">
                <div className="flex-grow"></div>
                <div className="ml-2">Last {grid.length} Months</div>
              </div>
              {grid.length > 0 && (
                <div className="ml-5 font-bold capitalize">
                  {grid[0].label} - {grid[grid.length - 1].label}
                </div>
              )}
            </div>
            <div className="flex-grow">
              <div className="recharts-responsive-container h-full w-full">
                <div className="recharts-wrapper relative h-[300px] w-[700px]">
                  <svg
                    className="recharts-surface"
                    width="700"
                    height="300"
                    viewBox="0 0 700 300"
                    version="1.1"
                  >
                    <defs>
                      <linearGradient
                        id="paint0_linear"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop stopColor="#6B8DE3"></stop>
                        <stop offset="1" stopColor="#7D1C8D"></stop>
                      </linearGradient>
                      <linearGradient
                        id="line_linear_gradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop stopColor="#5bcd85"></stop>
                        <stop offset="1" stopColor="#34b364"></stop>
                      </linearGradient>
                    </defs>
                    <g className="recharts-cartesian-grid">
                      <g className="recharts-cartesian-grid-vertical">
                        {grid.map((_, index) => (
                          <line
                            key={`gridline-${index}`}
                            strokeWidth="6"
                            stroke="#252525"
                            fill="none"
                            x={65 + 71.125 * index}
                            y="5"
                            width="569"
                            height="200"
                            x1={65 + 71.125 * index}
                            y1="5"
                            x2={65 + 71.125 * index}
                            y2="220"
                          />
                        ))}
                      </g>
                    </g>
                    <g className="recharts-layer recharts-cartesian-axis recharts-xAxis xAxis">
                      <g className="recharts-cartesian-axis-ticks">
                        {grid.map((month, index) => (
                          <g
                            className="recharts-layer recharts-cartesian-axis-tick"
                            key={`month-${index}`}
                          >
                            <text
                              width="569"
                              height="30"
                              x={65 + 71.125 * index}
                              y="230"
                              stroke="none"
                              fill="#666"
                              className="recharts-text recharts-cartesian-axis-tick-value capitalize"
                              textAnchor="middle"
                            >
                              <tspan x={65 + 71.125 * index} dy="0.71em">
                                {month.label}
                              </tspan>
                            </text>
                          </g>
                        ))}
                      </g>
                    </g>
                    <g className="recharts-layer recharts-cartesian-axis recharts-yAxis yAxis">
                      <g className="recharts-cartesian-axis-ticks">
                        {[0, 650, 1300, 1950, 2600].map((tick, index) => (
                          <g
                            className="recharts-layer recharts-cartesian-axis-tick"
                            key={`value-${index}`}
                          >
                            <text
                              width="60"
                              height="200"
                              x="49"
                              y={220 - tick / 13}
                              stroke="none"
                              fill="#666"
                              className="recharts-text recharts-cartesian-axis-tick-value"
                              textAnchor="end"
                            >
                              <tspan x="49" dy="0.355em">
                                {tick}
                              </tspan>
                            </text>
                          </g>
                        ))}
                      </g>
                    </g>
                    <g className="recharts-layer recharts-line">
                      <path
                        stroke="#dddddd"
                        strokeWidth="3"
                        strokeDasharray="8 8"
                        fill="none"
                        width="600"
                        height="300"
                        className="recharts-curve recharts-line-curve z-0"
                        d={path}
                      />
                    </g>
                    <g className="recharts-layer recharts-line">
                      <path
                        // stroke="none"
                        stroke="url(#line_linear_gradient)"
                        strokeWidth="4"
                        fill="none"
                        width="600"
                        height="300"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="recharts-curve recharts-line-curve"
                        d={path}
                        // d="M65,48.787215407603554
                        // C88.70833333333333,52.08354278566151,
                        // 112.41666666666667,55.37987016371946,
                        // 136.125,155.37987016371946
                        // C159.83333333333334,55.37987016371946,
                        // 183.54166666666666,55.31375355528897,
                        // 207.25,15.31375355528897
                        // C230.95833333333334,55.31375355528897,
                        // 254.66666666666666,63.1456317307987,
                        // 278.375,78.80938808181816
                        // C302.0833333333333,94.47314443283761,
                        // 325.7916666666667,159.37017169008817,
                        // 349.5,159.37017169008817
                        // C373.2083333333333,159.37017169008817,
                        // 396.9166666666667,99.76602814025466,
                        // 420.625,99.76602814025466
                        // C444.3333333333333,99.76602814025466,
                        // 468.0416666666667,129.98249279188164,
                        // 491.75,129.98249279188164
                        // C515.4583333333334,129.98249279188164,
                        // 539.1666666666666,23.2724149434207,
                        // 562.875,23.2724149434207
                        // C586.5833333333334,23.2724149434207,
                        // 610.2916666666666,53.6005700527309,
                        // 634,183.9287251620411"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default TimelineBasespotsList;
