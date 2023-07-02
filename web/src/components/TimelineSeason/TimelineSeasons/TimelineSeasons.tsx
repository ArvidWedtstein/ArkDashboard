import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { QUERY } from "src/components/TimelineSeason/TimelineSeasonsCell";
import { groupBy, timeTag, truncate } from "src/lib/formatters";

import type {
  DeleteTimelineSeasonMutationVariables,
  FindTimelineSeasons,
} from "types/graphql";

const DELETE_TIMELINE_SEASON_MUTATION = gql`
  mutation DeleteTimelineSeasonMutation($id: String!) {
    deleteTimelineSeason(id: $id) {
      id
    }
  }
`;

const TimelineSeasonsList = ({ timelineSeasons }: FindTimelineSeasons) => {
  const [deleteTimelineSeason] = useMutation(DELETE_TIMELINE_SEASON_MUTATION, {
    onCompleted: () => {
      toast.success("TimelineSeason deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  });

  const onDeleteClick = (id: DeleteTimelineSeasonMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete timelineSeason " + id + "?")) {
      deleteTimelineSeason({ variables: { id } });
    }
  };

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
  };

  return (
    <article className="rw-segment overflow-x-auto">
      <Link
        className="rw-button rw-button-green-outline m-3"
        to={routes.newTimelineSeason()}
      >
        New Season
      </Link>
      {/* <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">TimelineSeasons</h2>
        <Link
          to={routes.newTimelineSeason()}
          className="rw-button rw-button-green"
        >
          <div className="rw-button-icon">+</div> New TimelineSeason
        </Link>
      </header> */}

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

      {/* <div className="grid max-h-[350px] grid-cols-[70px,repeat(7,150px)] grid-rows-[auto,repeat(16,50px)] overflow-scroll">
        <div className="sticky top-0 z-10 col-start-[1] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200"></div>
        <div className="sticky top-0 z-10 col-start-[2] row-start-[1] border-b border-slate-100 bg-white bg-clip-padding py-2 text-center text-sm font-medium text-slate-900 dark:border-black/10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 dark:text-slate-200">
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
        </div>
        {Object.entries(groupBy(timelineSeasons, 'server')).map(([server, seasons], i) => (
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
        ))}
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
          <span className="text-xs text-blue-600 dark:text-sky-100">
            5 AM
          </span>
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
      </div> */}
    </article>
  );
};

export default TimelineSeasonsList;
