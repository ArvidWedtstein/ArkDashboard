import { useAuth } from "@redwoodjs/auth";
import { useCallback, useEffect, useState } from "react";
import { Maps } from "src/components/Maps";
import { getDateDiff } from "src/lib/formatters";
import ImagePreview from "../ImagePreview/ImagePreview";

type TimelineSettings = {
  snap?: boolean;
};
const Timeline = ({
  events,
  options = { snap: false },
}: {
  events: any[];
  options?: TimelineSettings;
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentModalImage, setCurrentModalImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const onChange = useCallback(
    (page: number) => {
      setCurrentPage(page);

      if (!events[page]) return;
    },
    [currentPage]
  );

  return (
    <section className="-mx-3">
      <div className="h-full w-full">
        <div className="events-wrapper bg-slate-600">
          <div className="events">
            <div
              className={`flex touch-pan-x select-none flex-row items-stretch justify-start space-x-3 overflow-x-auto p-3 will-change-scroll ${
                options.snap && "snap-x snap-mandatory"
              }`}
            >
              {events.map((event, i) => (
                <div
                  key={i}
                  className={`w-full min-w-fit flex-1 rounded-md border-2 border-transparent bg-slate-200 text-black dark:bg-neutral-800 dark:text-white ${
                    currentPage === i && "border-red-500"
                  } ${options.snap && "snap-center snap-always"}`}
                  data-tab={i}
                  onClick={() => onChange(i)}
                  aria-controls="tabs-0"
                >
                  <div className="flex h-16 w-full rounded-t-md bg-[url(https://mosscm.com/wp-content/uploads/2017/11/news-dallas-skyline.jpg)] bg-cover bg-center"></div>
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
                          <p className="text-sm font-normal">{event.server}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ImagePreview
          isOpen={isOpenModal}
          setIsOpen={setIsOpenModal}
          image={currentModalImage}
        />
        <div className="w-full bg-slate-200 p-1 dark:bg-gray-600">
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
                  <div className="mb-10 w-full overflow-hidden lg:mb-0 lg:w-1/2">
                    <p>
                      We started playing on{" "}
                      {new Date(events[currentPage].startDate).toLocaleString()}
                      .
                    </p>
                    <p>
                      {!events[currentPage].endDate &&
                      !events[currentPage].raided_by
                        ? ""
                        : `Got raided `}
                      {events[currentPage].endDate &&
                        `on
                        ${new Date(
                          events[currentPage].endDate
                        ).toLocaleString()}
                        `}
                      {events[currentPage].raided_by &&
                        `by ${events[currentPage].raided_by}.`}
                    </p>
                    {events[currentPage].startDate &&
                      events[currentPage].endDate && (
                        <p>
                          Base lasted{" "}
                          {
                            getDateDiff(
                              events[currentPage].startDate,
                              events[currentPage].endDate
                            ).dateString
                          }
                        </p>
                      )}
                  </div>
                </div>
              </section>
              <section className="body-font mx-4 border-t border-gray-200 text-gray-700 dark:text-neutral-200">
                <div className="container mx-auto flex flex-wrap px-5 py-12">
                  <div className="mb-10 w-full overflow-hidden rounded-lg lg:mb-0 lg:w-1/2">
                    <Maps
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
                          {events[currentPage].location.lat} Lat,{" "}
                          {events[currentPage].location.lon} Lon
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
                        <div className="flex h-full flex-col rounded-lg bg-gray-100 p-8 dark:bg-gray-600">
                          <div className="mb-3 flex items-center">
                            {/* <div className="mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
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
                            </div> */}
                            <h2 className="title-font text-lg font-medium text-gray-900 dark:text-neutral-200">
                              {/* Defense Nr.1 */}
                            </h2>
                          </div>
                          <div className="flex-grow">
                            <p className="text-base leading-relaxed"></p>
                            <img
                              onClick={() => {
                                setCurrentModalImage(
                                  `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${img}`
                                );
                                setIsOpenModal(true);
                              }}
                              className="cursor-pointer rounded object-cover object-center"
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
        </div>
      </div>
    </section>
  );
};

export default Timeline;
