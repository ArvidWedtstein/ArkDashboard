import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useEffect, useState } from "react";
import { useAuth } from "src/auth";

import { QUERY } from "src/components/TimelineSeasonEvent/TimelineSeasonEventsCell";
import { timeTag, truncate, groupBy } from "src/lib/formatters";

import type {
  DeleteTimelineSeasonEventMutationVariables,
  FindTimelineSeasonEvents,
} from "types/graphql";

const DELETE_TIMELINE_SEASON_EVENT_MUTATION = gql`
  mutation DeleteTimelineSeasonEventMutation($id: String!) {
    deleteTimelineSeasonEvent(id: $id) {
      id
    }
  }
`;

const TimelineSeasonEventsList = ({
  timelineSeasonEvents,
}: FindTimelineSeasonEvents) => {
  // const [deleteTimelineSeasonEvent] = useMutation(
  //   DELETE_TIMELINE_SEASON_EVENT_MUTATION,
  //   {
  //     onCompleted: () => {
  //       toast.success('TimelineSeasonEvent deleted')
  //     },
  //     onError: (error) => {
  //       toast.error(error.message)
  //     },
  //     // This refetches the query on the list page. Read more about other ways to
  //     // update the cache over here:
  //     // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
  //     refetchQueries: [{ query: QUERY }],
  //     awaitRefetchQueries: true,
  //   }
  // )

  // const onDeleteClick = (
  //   id: DeleteTimelineSeasonEventMutationVariables['id']
  // ) => {
  //   if (
  //     confirm('Are you sure you want to delete timelineSeasonEvent ' + id + '?')
  //   ) {
  //     deleteTimelineSeasonEvent({ variables: { id } })
  //   }
  // }

  return (
    <div className="bg-background relative mt-3 max-h-96 overflow-y-auto rounded-lg border border-zinc-500 px-4 text-zinc-700 dark:bg-zinc-800 dark:text-white">
      <ul className="relative w-full border-l border-zinc-600 py-3 dark:border-zinc-300">
        {timelineSeasonEvents &&
          Object.entries(groupBy(timelineSeasonEvents, "created_at")).map(
            ([date, timeGroup], i) => (
              <React.Fragment key={`date-${i}`}>
                <li key={`date-${i}`} className="my-3 ml-3">
                  {new Date(date).toLocaleDateString("en-GB", {
                    dateStyle: "medium",
                  })}
                </li>
                {timeGroup.map(
                  ({ id, title, content, tags, created_at, images }, idx) => (
                    <li className="mb-10 ml-6" key={`date-event-${idx}`}>
                      <span className="absolute -left-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-zinc-600 dark:bg-zinc-300">
                        {/* <svg aria-hidden="true" className="w-3 h-3 text-blue-800 dark:text-black" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                  </svg> */}
                      </span>
                      <h3 className="-ml-2 mt-2 mb-1 flex items-center text-xs text-gray-900 dark:text-white">
                        {new Date(created_at).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {idx == 0 && i === 0 && (
                          <span className="mr-2 ml-3 rounded bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            Latest
                          </span>
                        )}
                      </h3>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="mb-4 text-sm font-normal text-zinc-600 dark:text-gray-400">
                        {content}
                      </p>
                      <div className="flex h-fit space-x-2">
                        {images &&
                          images
                            .split(", ")
                            .slice(0, 3)
                            .map((url, index) => (
                              <div
                                className="flex"
                                key={`event-${id}-image-${index}`}
                              >
                                <img
                                  className="aspect-square h-16 rounded"
                                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineeventimages/${url}`}
                                />
                              </div>
                            ))}
                      </div>
                    </li>
                  )
                )}
              </React.Fragment>
            )
          )}
      </ul>
    </div>
  );
};

export default TimelineSeasonEventsList;
