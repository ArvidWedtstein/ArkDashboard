import { useCallback, useEffect, useState } from "react";
import { getDateDiff, timeTag } from "src/lib/formatters";
import { RefModal, Modal } from "../Modal/Modal";
import { useParams } from "@redwoodjs/router";
import { Map } from "../Map/Map";
import useComponentVisible from "src/components/useComponentVisible";

type TimelineSettings = {
  snap?: boolean;
  arrowkeys?: boolean;
};
export const TimelineList = ({
  events,
  options = { snap: false, arrowkeys: false },
}: {
  events: any[];
  options?: TimelineSettings;
}) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const [currentModalImage, setCurrentModalImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  let { page } = useParams();

  useEffect(() => {
    if (!page || isNaN(parseInt(page))) return;
    setCurrentPage(parseInt(page) - 1);
  }, [page]);

  useEffect(() => {
    if (options.arrowkeys) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          setCurrentPage((prev) => prev - 1);
        } else if (e.key === "ArrowRight") {
          setCurrentPage((prev) => prev + 1);
        }
      });
    }
  }, []);

  const onChange = useCallback(
    (page: number) => {
      setCurrentPage(page);

      if (!events[page]) return;
    },
    [currentPage]
  );
  const mapImages = {
    TheIsland:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/62a15c04-bef2-45a2-a06a-c984d81c3c0b/dd391pu-a40aaf7b-b8e7-4d6d-b49d-aa97f4ad61d0.jpg",
    TheCenter:
      "https://cdn.akamai.steamstatic.com/steam/apps/473850/ss_f13c4990d4609d3fc89174f71858835a9f09aaa3.1920x1080.jpg?t=1508277712",
    ScorchedEarth: "https://wallpapercave.com/wp/wp10504822.jpg",
    Ragnarok:
      "https://cdn.survivetheark.com/uploads/monthly_2016_10/large.580b5a9c3b586_Ragnarok02.jpg.6cfa8b30a81187caace6fecc1e9f0c31.jpg",
    Abberation:
      "https://cdn.images.express.co.uk/img/dynamic/143/590x/ARK-Survival-Evolved-849382.jpg",
    Extinction:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/887380/ss_3c2c1d7c027c8beb54d2065afe3200e457c2867c.1920x1080.jpg?t=1594677636",
    Valguero:
      "https://i.pinimg.com/originals/0b/95/09/0b9509ddce658e3209ece1957053b27e.jpg",
    Gen1: "https://cdn.akamai.steamstatic.com/steam/apps/1646700/ss_c939dd546237cba9352807d4deebd79c4e29e547.1920x1080.jpg?t=1622514386",
    CrystalIsles:
      "https://cdn2.unrealengine.com/egs-crystalislesarkexpansionmap-studiowildcard-dlc-g1a-05-1920x1080-119682147.jpg?h=720&resize=1&w=1280",
    Fjordur:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1887560/ss_331869adb5f0c98e3f13b48189e280f8a0ba1616.1920x1080.jpg?t=1655054447",
    LostIsland:
      "https://dicendpads.com/wp-content/uploads/2021/12/Ark-Lost-Island.png",
    Gen2: "https://cdn.cloudflare.steamstatic.com/steam/apps/1646720/ss_5cad67b512285163143cfe21513face50c0a00f6.1920x1080.jpg?t=1622744444",
  };
  return (
    <section className="">
      <div className="h-full w-full">
        <div
          className={`flex cursor-grab touch-pan-x select-none flex-row items-stretch justify-start space-x-1 overflow-x-auto p-3 will-change-scroll ${
            options.snap && "snap-x snap-mandatory"
          }`}
        >
          {events.map((event, i) => (
            <>
              <div className="flex flex-col">
                <div
                  key={i}
                  className={`group w-full min-w-fit flex-1 rounded-md border border-gray-200 bg-slate-200 text-black before:absolute before:-top-1 before:-bottom-1 before:bg-red-600 before:p-1 before:content-none dark:bg-neutral-800 dark:text-white ${
                    currentPage === i && "border-pea-500"
                  } ${options.snap && "snap-center snap-always"}`}
                  data-tab={i}
                  onClick={() => onChange(i)}
                  aria-controls={`tab-${i}`}
                >
                  <div
                    className={`flex h-16 w-full rounded-t-md  bg-cover bg-center`}
                    style={{
                      backgroundImage: `url(${mapImages[event.map]})`,
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div className="flex min-h-[150px] flex-col items-start py-3 px-6">
                    <p className="text-xs">{event.map}</p>
                    <p className="text-sm font-bold uppercase">
                      {event.tribeName}
                    </p>
                    <hr className="bg-gray-150 mb-2 h-[1px] w-full rounded border-0 dark:bg-stone-200"></hr>
                    <div className="relative flex flex-row space-y-1">
                      <div className="mt-3 flex flex-row items-center space-x-6">
                        <div className="flex flex-col items-start">
                          <p className="text-xs font-light">
                            {new Date(event.startDate).toLocaleDateString(
                              "no-NO",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-sm font-normal">Started</p>
                        </div>
                        <div className="flex flex-col items-start">
                          <p className="text-xs font-light">
                            {event.season ? `Season ${event.season}` : "ㅤ"}
                          </p>
                          <p className="text-sm font-normal">
                            {event.server}
                            {event.cluster && (
                              <span className="ml-2 rounded bg-gray-100 px-2.5 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                {event.cluster}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <p className="italic text-center my-2 ">{new Date(event.startDate).getMonth()}</p>
                <div className="flex items-center">
                  <div className="hidden sm:flex w-0.5 bg-gray-200 h-6 dark:bg-gray-200"></div>
                  <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-200"></div>
                </div> */}
              </div>
              {(event.season && event.season) !==
                (i + 1 < events.length && events[i + 1].season
                  ? events[i + 1].season
                  : 0) && (
                <div className="w-full min-w-fit flex-1 rounded-md border-2 border-transparent"></div>
              )}
            </>
          ))}
        </div>
        <RefModal
          isOpen={isComponentVisible}
          setIsOpen={(open) => setIsComponentVisible(open)}
          ref={ref}
          image={currentModalImage}
        />
        <article className="w-full p-1">
          {events[currentPage] && (
            <div className="m-2 block rounded-md bg-slate-200  text-black dark:bg-neutral-800 dark:text-white">
              <section className="body-font">
                <div className="container mx-auto flex flex-col items-center px-5 py-12 md:flex-row">
                  <div className="mb-16 flex flex-col items-center text-center md:mb-0 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
                    <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 dark:text-zinc-200 sm:text-4xl">
                      {events[currentPage].tribeName}
                      <br className="hidden lg:inline-block" />
                      {events[currentPage].map &&
                        events[currentPage].map.split(/(?=[A-Z])/).join(" ")}
                    </h1>
                    <p className="leading-relaxed">
                      This time we played on{" "}
                      {events[currentPage].server && events[currentPage].server}
                      {events[currentPage].cluster &&
                        `, ${events[currentPage].cluster}`}{" "}
                      {events[currentPage].season &&
                        `, Season ${events[currentPage].season}`}
                    </p>
                    <div className="flex justify-center">
                      {/* <Link
                      to={routes.editBasespot({ id: basespot.id })}
                      className="inline-flex rounded border-0 bg-gray-200 py-2 px-6 text-lg text-gray-700 hover:bg-gray-300 focus:outline-none"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDeleteClick(basespot.id)}
                      className="ml-4 inline-flex rounded border-0 bg-red-500 py-2 px-6 text-lg text-white hover:bg-red-600 focus:outline-none"
                    >
                      Delete
                    </button> */}
                    </div>
                  </div>
                  <div className="w-5/6 md:w-1/2 lg:w-full lg:max-w-lg">
                    <img
                      className="rounded object-cover object-center"
                      src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${events[currentPage].images[0]}`}
                      alt={events[currentPage].tribeName}
                    />
                  </div>
                </div>
              </section>
              <section className="body-font mx-4 border-t border-gray-200 text-gray-700 dark:text-neutral-200">
                <div className="container mx-auto flex flex-wrap px-5 py-12">
                  <div className="mb-10 w-full overflow-hidden text-sm lg:mb-0 lg:w-1/2">
                    <p>
                      We started playing on{" "}
                      {timeTag(events[currentPage].startDate)}.
                    </p>
                    <p>
                      {!events[currentPage].endDate &&
                      !events[currentPage].raided_by
                        ? ""
                        : `Got raided `}
                      {events[currentPage].endDate && `on `}
                      {timeTag(events[currentPage].endDate)}
                      {events[currentPage].raided_by &&
                        `by ${events[currentPage].raided_by}.`}
                    </p>
                    {events[currentPage].startDate &&
                      events[currentPage].endDate && (
                        <p>
                          Base lasted{" "}
                          {
                            getDateDiff(
                              new Date(events[currentPage].startDate),
                              new Date(events[currentPage].endDate)
                            ).dateString
                          }
                        </p>
                      )}
                  </div>
                </div>
              </section>
              {/* <section className="body-font mx-4 border-t border-gray-200 text-stone-300">
                <div className="container mx-auto px-5 py-24">
                  <div className="mx-auto w-full text-center lg:w-3/4 xl:w-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="mb-8 inline-block h-8 w-8 text-white"
                      viewBox="0 0 975.036 975.036"
                    >
                      <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                    </svg>
                    <p className="text-lg leading-relaxed">
                      {events[currentPage].raidcomment}
                    </p>
                    <span className="mt-8 mb-6 inline-block h-1 w-10 rounded bg-indigo-500"></span>
                    <h2 className="title-font text-sm font-medium tracking-wider text-stone-400">
                      {events[currentPage].raided_by}
                    </h2>
                    <p className="text-gray-500">
                      {events[currentPage].cluster}
                    </p>
                  </div>
                </div>
              </section> */}
              <section className="body-font mx-4 border-t border-gray-200 text-gray-700 dark:text-neutral-200">
                <div className="container mx-auto flex flex-wrap px-5 py-12">
                  <div className="mb-10 w-full overflow-hidden rounded-lg lg:mb-0 lg:w-1/2">
                    <Map
                      className="h-full w-full object-cover object-center"
                      map={events[currentPage].map}
                      size={{ width: 500, height: 500 }}
                      pos={events[currentPage].location}
                    />
                  </div>
                  <div className="-mb-10 flex flex-col flex-wrap text-center lg:w-1/2 lg:py-6 lg:pl-12 lg:text-left">
                    <div className="mb-10 flex flex-col items-center lg:items-start">
                      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-6 w-6"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                      </div>
                      <div className="flex-grow">
                        <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-neutral-200">
                          Coordinates
                        </h2>
                        <p className="text-base leading-relaxed">
                          Our base was located at:{" "}
                          {events[currentPage].location.lat}{" "}
                          <abbr title="Latitude">Lat</abbr>,{" "}
                          {events[currentPage].location.lon}{" "}
                          <abbr title="Longitude">Lon</abbr>
                        </p>
                      </div>
                    </div>
                    {events[currentPage].basespot && (
                      <div className="mb-10 flex flex-col items-center lg:items-start">
                        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-6 w-6 fill-indigo-500"
                          >
                            <path d="M560.02 32c-1.96 0-3.98.37-5.96 1.16L384.01 96H384L212 35.28A64.252 64.252 0 0 0 191.76 32c-6.69 0-13.37 1.05-19.81 3.14L20.12 87.95A32.006 32.006 0 0 0 0 117.66v346.32C0 473.17 7.53 480 15.99 480c1.96 0 3.97-.37 5.96-1.16L192 416l172 60.71a63.98 63.98 0 0 0 40.05.15l151.83-52.81A31.996 31.996 0 0 0 576 394.34V48.02c0-9.19-7.53-16.02-15.98-16.02zM224 90.42l128 45.19v285.97l-128-45.19V90.42zM48 418.05V129.07l128-44.53v286.2l-.64.23L48 418.05zm480-35.13l-128 44.53V141.26l.64-.24L528 93.95v288.97z" />
                          </svg>
                        </div>
                        <div className="flex-grow">
                          <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-neutral-200">
                            Base
                          </h2>
                          <p className="text-base leading-relaxed">
                            Our basespot was {events[currentPage].basespot.name}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="mb-10 flex flex-col items-center lg:items-start">
                      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-6 w-6"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <div className="flex-grow">
                        <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-neutral-200">
                          Players
                        </h2>
                        <p className="text-base leading-relaxed">
                          This time{" "}
                          {events[currentPage].players.length < 3
                            ? events[currentPage].players.join(" and ")
                            : events[currentPage].players.join(", ")}{" "}
                          played
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="body-font mx-4 border-t border-gray-200 text-gray-700 dark:text-neutral-200">
                <div className="container mx-auto px-5 py-24">
                  <div className="mb-20 flex w-full flex-col text-center">
                    {/* <h2 className="title-font mb-1 text-xs font-medium tracking-widest text-indigo-500">
                      Images
                    </h2> */}
                    <h1 className="title-font text-2xl font-medium text-gray-900 dark:text-neutral-200 sm:text-3xl">
                      Images
                    </h1>
                  </div>
                  <div className="-m-4 flex flex-wrap">
                    {events[currentPage].images.map((img, i) => (
                      <div key={`img${i}`} className="p-4 md:w-1/3">
                        <div className="flex h-full flex-col rounded-lg bg-gray-100 p-0 dark:bg-gray-600">
                          {/* <div className="mb-3 flex items-center">
                            <div className="mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
                              <svg
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                              >
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                              </svg>
                            </div>
                            <h2 className="title-font text-lg font-medium text-gray-900 dark:text-neutral-200">
                              Defense Nr.1
                            </h2>
                          </div> */}
                          <div className="flex-grow">
                            <p className="text-base leading-relaxed"></p>
                            <img
                              onClick={() => {
                                setCurrentModalImage(
                                  `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${img}`
                                );
                                setIsComponentVisible(true);
                              }}
                              className="h-full w-full cursor-pointer rounded object-cover object-center"
                              src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${img}`}
                              alt={events[currentPage].map}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}
        </article>
      </div>
    </section>
  );
};
