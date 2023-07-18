import { useMutation } from "@apollo/client";
import { toast } from "@redwoodjs/web/dist/toast";
import { QUERY } from "src/components/TimelineSeasonEvent/TimelineSeasonEventsCell";
import { groupBy } from "src/lib/formatters";

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
  setOpenModal,
}: FindTimelineSeasonEvents & { setOpenModal: (v, type) => void }) => {
  const [deleteTimelineSeasonEvent] = useMutation(
    DELETE_TIMELINE_SEASON_EVENT_MUTATION,
    {
      onCompleted: () => {
        toast.success("Event deleted");
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

  const onDeleteClick = (
    id: DeleteTimelineSeasonEventMutationVariables["id"],
    title: string
  ) => {
    if (confirm(`Are you sure you want to delete "${title}" event?`)) {
      deleteTimelineSeasonEvent({ variables: { id } });
    }
  };

  return (
    <div className="max-h-[36rem] flex-auto bg-background overflow-y-auto rounded-lg border border-zinc-500 px-4 text-zinc-700 dark:bg-zinc-800 dark:text-white">
      <ul className="relative w-full border-l border-zinc-600 py-3 dark:border-zinc-300">
        {timelineSeasonEvents &&
          Object.entries(groupBy(timelineSeasonEvents, "created_at")).map(
            ([date, timeGroup], i) => (
              <React.Fragment key={`date-${i}`}>
                <li key={`date-${i}`} className="my-2 ml-3">
                  {new Date(date).toLocaleDateString("en-GB", {
                    dateStyle: "medium",
                  })}
                </li>
                {timeGroup.map(
                  ({ id, title, content, tags, created_at, images }, idx) => (
                    <li
                      className="mb-10 ml-4 p-2 group border-y border-transparent hover:border-y-zinc-600"
                      key={`date-event-${idx}`}
                    >
                      <span className="absolute -left-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-zinc-600 dark:bg-zinc-300">
                        {/* <svg aria-hidden="true" className="w-3 h-3 text-blue-800 dark:text-black" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                  </svg> */}
                      </span>
                      <h3 className="flex items-center align-middle text-xs text-gray-900 dark:text-white">
                        {new Date(created_at).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {idx == 0 && i === 0 && (
                          <span className="ml-3 rw-badge rw-badge-blue">
                            Latest
                          </span>
                        )}
                        <div className="ml-auto space-x-1">
                          <button className="group-hover:visible invisible rw-badge rw-badge-gray hover:text-white" onClick={() => setOpenModal(id, 'editevent')}>
                            Edit
                          </button>
                          <button className="group-hover:visible invisible rw-badge rw-badge-red hover:text-white" onClick={() => onDeleteClick(id, title)}>
                            Delete
                          </button>
                        </div>
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
                                  className="aspect-square h-16 rounded hover:cursor-pointer ring-1 ring-transparent hover:ring-zinc-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenModal(`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineeventimages/${url}`, 'previewimage');
                                  }}
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
