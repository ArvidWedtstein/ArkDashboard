import { useState } from "react";

const Timeline = ({ events }: { events: any[] }) => {
  events = events.sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const [currentEvent, setCurrentEvent] = useState(events[0] || {});
  const [currentTab, setCurrentTab] = useState(0);
  const onChange = (e) => {
    // console.log(e.target.parentElement.dataset.tab);
    setCurrentTab(e.currentTarget.getAttribute("data-tab"));
    setCurrentEvent(events[e.currentTarget.getAttribute("data-tab")]);
    // document.querySelectorAll("div[data-tab-id]").forEach((tab: any, i) => {
    //   if (
    //     tab.getAttribute("data-tab-id") ===
    //     e.currentTarget.getAttribute("data-tab")
    //   ) {
    //     tab.style.display = "block";
    //   } else {
    //     tab.style.display = "none";
    //   }
    // });
  };
  // const { data, error } = await supabase
  // .storage
  // .from('avatars')
  // .list('folder', {
  //   limit: 100,
  //   offset: 0,
  //   sortBy: { column: 'name', order: 'asc' },
  // })

  // const { data, error } = await supabase
  // .storage
  // .from('avatars')
  // .createSignedUrls(['folder/avatar1.png', 'folder/avatar2.png'], 60)

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
    <section className="-mx-3">
      <div className="h-full w-full">
        <div className="events-wrapper bg-slate-600">
          <div className="events">
            <ol className="flex flex-row items-stretch justify-start space-x-3 overflow-x-auto p-3">
              {events.map((event, i) => (
                <li
                  className="w-full min-w-fit flex-1 rounded-md bg-slate-200 text-black dark:bg-neutral-800 dark:text-white"
                  data-tab={i}
                  onClick={onChange}
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
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="w-full bg-slate-200 p-1 dark:bg-gray-600">
          <div
            className="m-2 block rounded-md bg-slate-200  text-black dark:bg-neutral-800 dark:text-white"
          // data-tab-id="0"
          >
            <section className="body-font">
              <div className="container mx-auto flex flex-col items-center px-5 py-12 md:flex-row">
                <div className="mb-16 flex flex-col items-center text-center md:mb-0 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
                  <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 dark:text-zinc-200 sm:text-4xl">
                    {currentEvent.tribeName}
                    <br className="hidden lg:inline-block" />
                    {currentEvent.map &&
                      currentEvent.map.split(/(?=[A-Z])/).join(" ")}
                  </h1>
                  <p className="mb-8 leading-relaxed">
                    This time we played on{" "}
                    {currentEvent.server && currentEvent.server}
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
                    src={
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvC4tJUjp6TudN0t7kMxrGll3AQDUOPCncWSSogN5lgA&s"
                    }
                    alt="gf"
                  />
                </div>
              </div>
            </section>
            <section className="body-font mx-4 border-t border-gray-200 text-gray-700 dark:text-neutral-200">
              <div className="container mx-auto flex flex-wrap px-5 py-12">
                <div className="mb-10 w-full overflow-hidden rounded-lg lg:mb-0 lg:w-1/2">
                  {/* <Maps
                    className="h-full w-full object-cover object-center"
                    map={basespot.Map}
                    size={{ width: 500, height: 500 }}
                    pos={{ lat: 0, lon: 0 }}
                  /> */}
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
                        This spot is located at 69 Lat, 45 Lon
                      </p>
                    </div>
                  </div>
                  <div className="mb-10 flex flex-col items-center lg:items-start">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
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
                        We think that this basespot does fit about none players
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="body-font mx-4 border-t border-gray-200 text-gray-700 dark:text-neutral-200">
              <div className="container mx-auto px-5 py-24">
                <div className="mb-20 flex w-full flex-col text-center">
                  <h2 className="title-font mb-1 text-xs font-medium tracking-widest text-indigo-500">
                    Basespot Defense Setup
                  </h2>
                  <h1 className="title-font text-2xl font-medium text-gray-900 dark:text-neutral-200 sm:text-3xl">
                    Basespot Setup
                  </h1>
                </div>
                <div className="-m-4 flex flex-wrap">
                  <div className="p-4 md:w-1/3">
                    <div className="flex h-full flex-col rounded-lg bg-gray-100 p-8 dark:bg-gray-600">
                      <div className="mb-3 flex items-center">
                        <div className="mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                          </svg>
                        </div>
                        <h2 className="title-font text-lg font-medium text-gray-900 dark:text-neutral-200">
                          Defense Nr.1
                        </h2>
                      </div>
                      <div className="flex-grow">
                        <p className="text-base leading-relaxed">
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Nulla, voluptatum?
                        </p>
                        <img
                          className="rounded object-cover object-center"
                          src={
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvC4tJUjp6TudN0t7kMxrGll3AQDUOPCncWSSogN5lgA&s"
                          }
                          alt="test"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div
            className="m-2 hidden rounded-md bg-slate-200 text-black dark:bg-neutral-800 dark:text-white"
            data-tab-id="1"
          >
            test<br></br>test test test2
          </div>
          <div
            className="m-2 hidden rounded-md bg-slate-200 text-black dark:bg-neutral-800 dark:text-white"
            data-tab-id="2"
          >
            test<br></br>test test test3
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
