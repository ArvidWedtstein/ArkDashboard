import { useMutation } from "@apollo/client";
import { toast } from "@redwoodjs/web/dist/toast";
import { QUERY } from "src/components/TimelineSeasonEvent/TimelineSeasonEventsCell";
import { groupBy } from "src/lib/formatters";

import type {
  DeleteTimelineSeasonEventMutationVariables,
  FindTimelineSeasonEvents,
} from "types/graphql";
import TimelineSeasonEventForm from "../TimelineSeasonEventForm/TimelineSeasonEventForm";
import NewTimelineSeasonEventCell from "../NewTimelineSeasonEventCell";
import { Fragment } from "react";
import Button from "src/components/Util/Button/Button";

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
    <div className="max-h-[36rem] flex-auto overflow-y-auto rounded-lg border border-zinc-500 bg-white px-4 text-zinc-700 dark:bg-zinc-800 dark:text-white">
      <ul className="relative w-full border-l border-zinc-600 py-3 dark:border-zinc-300">
        {timelineSeasonEvents &&
          Object.entries(groupBy(timelineSeasonEvents, "created_at")).map(
            ([date, timeGroup], i) => (
              <Fragment key={`date-${i}`}>
                <li key={`date-${i}`} className="my-2 ml-3">
                  {new Date(date).toLocaleDateString("en-GB", {
                    dateStyle: "medium",
                  })}
                </li>
                {timeGroup.map(
                  ({ id, title, content, tags, created_at, images }, idx) => (
                    <li
                      className="group mb-10 ml-4 border-y border-transparent p-2 hover:border-y-zinc-600"
                      key={`date-event-${idx}`}
                    >
                      <span className="absolute -left-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-600 dark:bg-zinc-300">
                        {tags && tags.includes("raid") && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            className="text-pea-800 h-3 w-3 dark:text-black"
                            fill="currentColor"
                          >
                            <path d="M312.5 148.7l102.8-102.8l61.12-10.37l-10.37 61.12l-102.8 102.8c-6.246 6.246-6.246 16.38 0 22.62c6.246 6.246 16.37 6.246 22.62 0l110.1-110.1l15.87-93.75c1.625-11.25-8.25-19.5-18.12-18.13l-93.74 15.88l-110.1 110.1c-6.248 6.246-6.248 16.38 0 22.62C296.2 154.1 306.3 154.1 312.5 148.7zM288.6 362c6.246-6.246 6.246-16.37 0-22.62L45.89 96.68l-10.37-61.12l61.12 10.37l242.7 242.7c6.246 6.25 16.37 6.25 22.62 0c6.246-6.246 6.246-16.37 0-22.62l-249.9-249.1l-93.74-15.88C7.027-1.459-1.222 8.416 .1531 18.29l15.87 93.75l249.9 249.1C272.2 368.3 282.3 368.3 288.6 362zM211.3 403.3l7.978-7.976c6.25-6.25 6.25-16.37 0-22.62c-6.25-6.25-16.37-6.25-22.62 0L188.7 380.7l-57.37-57.37l7.978-7.977c6.25-6.25 6.25-16.37 0-22.62c-6.25-6.25-16.37-6.25-22.62 0L108.7 300.7L84.7 276.7C81.59 273.5 77.53 271.1 73.47 271.1c-4.074 0-8.148 1.559-11.25 4.672L27.74 311.3c-5.336 5.336-6.205 13.77-1.986 19.98l34.38 57.09l-50.82 50.88c-12.4 12.39-12.41 32.5-.0332 44.91l18.52 18.57C33.97 508.9 42.13 512 50.29 512c8.139 0 16.28-3.09 22.46-9.269l50.79-50.86l57.21 34.37c2.641 1.797 5.686 2.668 8.723 2.668c4.102 0 8.191-1.59 11.26-4.656l34.62-34.5c6.188-6.168 6.197-16.27 .0195-22.44L211.3 403.3zM187.1 452.7l-68.48-41.15l-68.13 68.54l-18.5-18.27l68.49-68.57l-41.14-68.32l14.19-14.24l127.8 127.8L187.1 452.7zM502.7 439.3l-50.86-50.8l34.37-57.21c1.797-2.641 2.668-5.684 2.668-8.723c0-4.102-1.59-8.191-4.656-11.25l-34.5-34.62c-6.168-6.187-16.27-6.195-22.44-.0234l-150.7 150.7c-3.102 3.102-4.652 7.168-4.652 11.23c0 4.07 1.559 8.144 4.672 11.25l34.61 34.48c5.336 5.336 13.77 6.207 19.98 1.984l57.09-34.37l50.88 50.82c12.39 12.4 32.5 12.41 44.91 .0313l18.57-18.52c6.203-6.18 9.305-14.34 9.305-22.49C511.1 453.6 508.9 445.4 502.7 439.3zM461.8 480.1l-68.57-68.49l-68.32 41.14l-14.24-14.19l127.8-127.8l14.2 14.25l-41.15 68.48l68.54 68.13L461.8 480.1z" />
                          </svg>
                        )}
                        {tags && tags.includes("dino") && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 640 512"
                            className="text-pea-800 h-3 w-3 dark:text-black"
                            fill="currentColor"
                          >
                            <path d="M528 248c-8.875 0-16 7.125-16 16s7.125 16 16 16S544 272.9 544 264S536.9 248 528 248zM619 179l-47.88-17.5C524.4 144.4 523.5 144 513.3 144C484.9 144 460 162.3 451.5 188.4l-1.25 4.5C395 199.6 352 246.9 352 304v72C352 398 333.1 416 312 416c-22 0-40-18-40-40v-240C272 61 211 0 136 0S0 61 0 136v223.5c0 43.63 5.375 84.5 17 128.6C20.75 502.3 33.5 512 48 512s27.25-9.75 31-23.88C90.63 444 96 403.1 96 359.5V136C96 114 113.1 96 136 96C157.1 96 176 114 176 136v240C176 451 237 512 312 512S448 451 448 376V304c0-4.125 1.625-7.875 4.125-10.75C461.6 318.9 485.8 336 512 336c11.38 0 12.5-.375 59.13-17.5L619 301C631.6 296.4 640 284.5 640 271.2V209C640 195.6 631.6 183.6 619 179zM608 271C520 303.1 519.3 304 513.3 304H512c-13.38 0-25.75-9.125-30-22.25L474.4 256H464C437.5 256 416 277.5 416 304v72C416 433.4 369.4 480 312 480S208 433.4 208 376v-240C208 96.25 175.8 64 136 64S64 96.25 64 136v223.5C64 401.5 58.63 439.6 48 480C37.38 439.6 32 401.5 32 359.5V136C32 78.63 78.63 32 136 32S240 78.63 240 136v240C240 415.8 272.3 448 312 448S384 415.8 384 376V304C384 259.9 419.9 224 464 224h10.38l7.625-25.75C486.3 185.1 498.6 176 512 176h1.25C519.3 176 520 176.9 608 209V271zM528 232c8.875 0 16-7.125 16-16s-7.125-16-16-16S512 207.1 512 216S519.1 232 528 232z" />
                          </svg>
                        )}
                        {tags && tags.includes("basespot") && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 640 512"
                            className="text-pea-800 h-3 w-3 dark:text-black"
                            fill="currentColor"
                          >
                            <path d="M320 128c0 8.844 7.156 16 16 16S352 136.7 352 127.8V16.01c0-8.844-7.156-16-16-16h-320c-8.844 0-16 7.156-16 16V208c0 4.25 1.688 8.312 4.688 11.31L64 278.6V496C64 504.8 71.16 512 80 512S96 504.8 96 496v-224c0-4.25-1.688-8.312-4.688-11.31L32 201.4V32h80v64c0 8.844 7.156 16 16 16S144 104.8 144 96V32h64v64c0 8.844 7.156 16 16 16S240 104.8 240 96V32H320V128zM176 144C149.5 144 128 165.5 128 192v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V192C224 165.5 202.5 144 176 144zM192 224H160V192c0-8.822 7.178-16 16-16S192 183.2 192 192V224zM490.7 255.1h-85.32C393.6 255.1 384 265.5 384 277.3v85.26c0 11.88 9.633 21.38 21.39 21.38h85.32c11.76 0 21.39-9.625 21.39-21.38V277.3C512.1 265.6 502.6 255.1 490.7 255.1zM480.1 351.1h-64.05l-.0205-63.98h64.01L480.1 351.1zM622.9 242.8l-151.4-137.7C464.8 99.03 456.4 96 447.1 96s-16.83 3.031-23.48 9.084L273.1 242.7C262.2 252.6 256 266.7 256 281.4V448c0 35.35 28.65 64 64 64h255.1c35.35 0 63.1-28.56 64-63.9L640 281.2C640 266.6 633.8 252.6 622.9 242.8zM607.1 448c-.002 17.6-14.4 32-32 32H320c-17.67 0-32-14.33-32-32V281.4c0-5.738 2.42-11.21 6.666-15.07l153.3-138.4l153.4 138.4C605.6 270.2 608 275.7 608 281.4L607.1 448z" />
                          </svg>
                        )}
                      </span>
                      <h3 className="flex items-center align-middle text-xs text-gray-900 dark:text-white">
                        {new Date(created_at).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        <div className="ml-auto space-x-1">
                          <button
                            className="rw-badge rw-badge-gray invisible hover:text-white group-hover:visible"
                            onClick={() => setOpenModal(id, "editevent")}
                          >
                            Edit
                          </button>
                          <button
                            className="rw-badge rw-badge-red invisible hover:text-white group-hover:visible"
                            onClick={() => onDeleteClick(id, title)}
                          >
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
                                  className="aspect-square h-16 rounded ring-1 ring-transparent hover:cursor-pointer hover:ring-zinc-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenModal(
                                      `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineeventimages/${url}`,
                                      "previewimage"
                                    );
                                  }}
                                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineeventimages/${url}`}
                                />
                              </div>
                            ))}
                      </div>
                      <div className="mt-1 flex h-fit flex-wrap space-x-1">
                        {tags &&
                          tags.split(",").map((tag, index) => (
                            <span
                              className="rw-badge rw-badge-gray"
                              key={`event-${id}-tag-${index}`}
                            >
                              #{tag}
                            </span>
                          ))}
                      </div>
                    </li>
                  )
                )}
              </Fragment>
            )
          )}
      </ul>
      <div className="shadow-lg border border-zinc-500 rounded-lg ">
        <NewTimelineSeasonEventCell timeline_season_id={timelineSeasonEvents[0].id} />
      </div>
    </div>
  );
};

export default TimelineSeasonEventsList;
