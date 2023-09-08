import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import clsx from "clsx";
import { useContext, useLayoutEffect, useState } from "react";
import { useAuth } from "src/auth";
import TimelineSeasonPeopleCell from "src/components/TimelineSeasonPerson/TimelineSeasonPeopleCell";
import ImageContainer from "src/components/Util/ImageContainer/ImageContainer";
import Map from "src/components/Util/Map/Map";
import { ModalContext, Modal } from "src/components/Util/Modal/Modal";
import Slideshow from "src/components/Util/Slideshow/Slideshow";
import Toast from "src/components/Util/Toast/Toast";

import { formatBytes, getDateDiff, pluralize, timeTag } from "src/lib/formatters";

import type {
  DeleteTimelineSeasonBasespotMutationVariables,
  FindTimelineSeasonBasespotById,
} from "types/graphql";

const DELETE_TIMELINE_SEASON_BASESPOT_MUTATION = gql`
  mutation DeleteTimelineSeasonBasespotMutation($id: BigInt!) {
    deleteTimelineSeasonBasespot(id: $id) {
      id
    }
  }
`;

interface Props {
  timelineSeasonBasespot: NonNullable<
    FindTimelineSeasonBasespotById["timelineSeasonBasespot"]
  >;
}

const TimelineSeasonBasespot = ({ timelineSeasonBasespot }: Props) => {
  const {
    isAuthenticated,
    client: supabase,
    hasRole,
    error: authError,
    currentUser,
  } = useAuth();
  const [deleteTimelineSeasonBasespot] = useMutation(
    DELETE_TIMELINE_SEASON_BASESPOT_MUTATION,
    {
      onCompleted: () => {
        toast.success("TimelineSeasonBasespot deleted");
        navigate(routes.timelineSeasonBasespots());
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const onDeleteClick = (
    id: DeleteTimelineSeasonBasespotMutationVariables["id"]
  ) => {
    toast.custom((t) => (
      <Toast
        t={t}
        title={`You're about to delete basespot ${id}`}
        message={`Are you sure you want to delete basespot ${id}?`}
        primaryAction={() => {
          toast.promise(
            deleteTimelineSeasonBasespot({ variables: { id } }),
            {
              loading: "deleting basespot from season...",
              success: `Successfully deleted basespot`,
              error: `Failed to delete basespot`,
            }
          );
        }}
        actionType="OkCancel"
      />
    ));
  };
  const [images, setImages] = useState([]);
  const [currentModalImage, setCurrentModalImage] = useState(null);

  // !TODO: consider switching to useEffect?
  useLayoutEffect(() => {
    supabase.storage
      .from("timelineimages")
      .list(timelineSeasonBasespot.id?.toString())
      .then(({ data, error }) => {
        if (error) throw error;
        if (data) {
          setImages(data.filter((f) => f.name !== ".emptyFolderPlaceholder"));
        }
      });
  }, []);

  const convertToDate = (dateString: string): Date => {
    const year = parseInt(dateString.substring(0, 4));
    const month = parseInt(dateString.substring(4, 6)) - 1; // subtract 1 to account for zero-based month numbering
    const day = parseInt(dateString.substring(6, 8));
    const hour = parseInt(dateString.substring(8, 10));
    const minute = parseInt(dateString.substring(10, 12));
    const second = parseInt(dateString.substring(12, 14));

    return new Date(year, month, day, hour, minute, second);
  };

  const { openModal } = useContext(ModalContext);
  return (
    <article className="rw-segment">
      <Modal image={currentModalImage} />

      <div className="m-2 block rounded-md text-white">
        <section className="body-font container mx-auto flex flex-col items-center px-5 py-12 md:flex-row">
          <div className="mb-16 flex flex-col items-center space-y-2 text-center md:mb-0 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
            <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 dark:text-zinc-200 sm:text-4xl">
              {timelineSeasonBasespot.TimelineSeason.tribe_name}
            </h1>
            <p className="leading-relaxed">
              This time we played on
              {` ${timelineSeasonBasespot?.TimelineSeason.server} ${timelineSeasonBasespot.TimelineSeason?.cluster} Season ${timelineSeasonBasespot.TimelineSeason.season}`}
            </p>
            <div className="flex flex-wrap justify-start space-x-1 md:space-y-1 xl:space-y-0">
              {isAuthenticated && (
                <>
                  {hasRole("timeline_update") ||
                    (currentUser &&
                      currentUser.permissions.some(
                        (p) => p === "timeline_update"
                      ) && (
                        <Link
                          to={routes.editTimelineSeasonBasespot({
                            id: timelineSeasonBasespot.id,
                          })}
                          className="rw-button rw-button-gray-outline"
                        >
                          Edit
                        </Link>
                      ))}
                  {hasRole("timeline_delete") ||
                    (currentUser &&
                      currentUser.permissions.some(
                        (p) => p === "timeline_delete"
                      ) && (
                        <button
                          onClick={() =>
                            onDeleteClick(timelineSeasonBasespot.id)
                          }
                          className="rw-button rw-button-red-outline"
                        >
                          Delete
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="rw-button-icon-end"
                          >
                            <path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                          </svg>
                        </button>
                      ))}
                </>
              )}
            </div>
          </div>
          {images.length > 0 && (
            <div className="w-5/6 md:w-1/2 lg:w-full lg:max-w-lg">
              <ImageContainer
                className="aspect-video w-full rounded-lg object-cover object-center"
                src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineSeasonBasespot.id}/${images[0].name}`}
                caption={timeTag(timelineSeasonBasespot.start_date)}
              />
            </div>
          )}
        </section>

        <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-gray-200 dark:text-neutral-200">
          <div className="container mx-auto flex flex-wrap px-5 py-12">
            <div className="mb-10 w-full overflow-hidden text-base lg:mb-0 lg:w-1/2">
              <p>
                Started playing on {timeTag(timelineSeasonBasespot.start_date)}.
              </p>
              {timelineSeasonBasespot?.TimelineSeason?.TimelineSeasonEvent &&
                timelineSeasonBasespot?.TimelineSeason?.TimelineSeasonEvent
                  .length > 0 && (
                  <p>
                    Base lasted{" "}
                    {
                      getDateDiff(
                        new Date(timelineSeasonBasespot.start_date),
                        new Date(timelineSeasonBasespot.end_date)
                      ).dateString
                    }
                  </p>
                )}
            </div>
          </div>
        </section>

        {timelineSeasonBasespot?.TimelineSeason?.TimelineSeasonEvent?.length > 0 && (
          <section className="body-font relative mx-4 border-t border-gray-700 text-stone-300 dark:border-gray-200">
            <h1
              id="event-heading"
              className="title-font mt-8 text-center text-xl font-medium text-gray-900 dark:text-neutral-200 sm:text-3xl"
            >
              {pluralize(
                timelineSeasonBasespot.TimelineSeason.TimelineSeasonEvent.length,
                "Event",
                "s",
                false
              )}
            </h1>

            <Slideshow
              className="mb-6"
              aria-labelledby="event-heading"
              border={false}
              controls={true}
              autoPlay={false}
              slides={timelineSeasonBasespot.TimelineSeason.TimelineSeasonEvent.map(
                ({
                  id,
                  title,
                  content,
                  created_at,
                  tags,
                }) => {
                  return {
                    tabColor: `bg-pea-500`,
                    content: (
                      <div key={id} className="flex justify-center px-5 py-12">
                        <div className="text-center lg:w-3/4 xl:w-1/2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            className="mb-8 inline-block h-8 w-8 text-black dark:text-white"
                            viewBox="0 0 975.036 975.036"
                          >
                            <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                          </svg>

                          <p className="text-black dark:text-white text-lg leading-relaxed">
                            {content &&
                              content.split("\n").map((w, idx) => (
                                <span
                                  className="block"
                                  key={`event-comment-${idx}`}
                                >
                                  {w.replace("\\n", "")}
                                </span>
                              ))}
                          </p>

                          <span className="bg-pea-500 mt-8 inline-block h-1 w-10 rounded" />
                          <h2 className="text-lg dark:text-gray-200 text-zinc-600 title-font font-medium tracking-wider my-4">
                            {title}
                          </h2>
                          <p className="text-gray-500">
                            {timeTag(created_at)}
                          </p>
                          <p className="inline-flex gap-x-1">
                            {tags && tags.split(',').map(t => <span key={`tag-${t}-${id}`} className="rw-badge rw-badge-gray">#{t}</span>)}
                          </p>
                        </div>
                      </div>
                    ),
                  };
                }
              )}
            />
          </section>
        )}

        <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-gray-200 dark:text-neutral-200">
          <div className="container mx-auto flex flex-wrap px-5 py-12">
            <div className="mb-10 w-full overflow-hidden rounded-lg lg:mb-0 lg:w-1/2">
              {timelineSeasonBasespot.map_id && (
                <Map
                  disable_map={true}
                  className="h-full w-fit object-cover object-center"
                  map_id={timelineSeasonBasespot.map_id}
                  size={{ width: 500, height: 500 }}
                  pos={[
                    {
                      lat: timelineSeasonBasespot.Basespot
                        ? timelineSeasonBasespot.Basespot.latitude
                        : timelineSeasonBasespot.latitude,
                      lon: timelineSeasonBasespot.Basespot
                        ? timelineSeasonBasespot.Basespot.longitude
                        : timelineSeasonBasespot.longitude,
                      name: timelineSeasonBasespot?.Basespot?.name,
                    },
                  ]}
                  interactive={true}
                />
              )}
            </div>
            <div className="-mb-10 flex flex-col flex-wrap text-center lg:w-1/2 lg:py-6 lg:pl-12 lg:text-left">
              <div className="mb-10 flex flex-col items-center lg:items-start">
                <div className="dark:bg-pea-50 text-pea-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    fill="currentColor"
                    className="h-6 w-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <path d="M560.02 32c-1.96 0-3.98.37-5.96 1.16L384.01 96H384L212 35.28A64.252 64.252 0 0 0 191.76 32c-6.69 0-13.37 1.05-19.81 3.14L20.12 87.95A32.006 32.006 0 0 0 0 117.66v346.32C0 473.17 7.53 480 15.99 480c1.96 0 3.97-.37 5.96-1.16L192 416l172 60.71a63.98 63.98 0 0 0 40.05.15l151.83-52.81A31.996 31.996 0 0 0 576 394.34V48.02c0-9.19-7.53-16.02-15.98-16.02zM224 90.42l128 45.19v285.97l-128-45.19V90.42zM48 418.05V129.07l128-44.53v286.2l-.64.23L48 418.05zm480-35.13l-128 44.53V141.26l.64-.24L528 93.95v288.97z" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-neutral-200">
                    Coordinates
                  </h2>
                  <p className="text-base leading-relaxed">
                    Our base is located at:{" "}
                    {timelineSeasonBasespot.Basespot
                      ? timelineSeasonBasespot.Basespot.latitude
                      : timelineSeasonBasespot.latitude}{" "}
                    <abbr title="Latitude">Lat</abbr>,{" "}
                    {timelineSeasonBasespot.Basespot
                      ? timelineSeasonBasespot.Basespot.longitude
                      : timelineSeasonBasespot.longitude}{" "}
                    <abbr title="Longitude">Lon</abbr> on the map{" "}
                    <Link
                      to={routes.map({
                        id: timelineSeasonBasespot.map_id,
                      })}
                    >
                      {timelineSeasonBasespot?.Map?.name}
                    </Link>
                  </p>
                </div>
              </div>
              {timelineSeasonBasespot.Basespot && (
                <div className="mb-10 flex flex-col items-center lg:items-start">
                  <div className="dark:bg-pea-50 text-pea-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 288 512"
                      fill="currentColor"
                      className="h-6 w-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M112 316.94v156.69l22.02 33.02c4.75 7.12 15.22 7.12 19.97 0L176 473.63V316.94c-10.39 1.92-21.06 3.06-32 3.06s-21.61-1.14-32-3.06zM144 0C64.47 0 0 64.47 0 144s64.47 144 144 144 144-64.47 144-144S223.53 0 144 0zm0 76c-37.5 0-68 30.5-68 68 0 6.62-5.38 12-12 12s-12-5.38-12-12c0-50.73 41.28-92 92-92 6.62 0 12 5.38 12 12s-5.38 12-12 12z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-neutral-200">
                      Base
                    </h2>
                    <p className="text-base leading-relaxed">
                      Our basespot was{" "}
                      <Link
                        to={routes.basespot({
                          id: timelineSeasonBasespot.Basespot.id,
                        })}
                        className="rw-link"
                      >
                        {timelineSeasonBasespot.Basespot.name}
                      </Link>
                    </p>
                  </div>
                </div>
              )}
              <div className="mb-10 flex flex-col items-center lg:items-start justify-start">
                <div className="flex flex-col">
                  <div className="dark:bg-pea-50 text-pea-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-200">
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
                  <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-neutral-200">
                    Players
                  </h2>
                </div>
                <div className="-mx-8">
                  <TimelineSeasonPeopleCell timeline_season_id={timelineSeasonBasespot.TimelineSeason.id} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-gray-200 dark:text-neutral-200">
          <div className="container mx-auto px-5 py-24">
            <div className="mb-20 flex w-full flex-col text-center">
              <h2 className="title-font text-pea-500 mb-1 text-xs font-medium tracking-widest">
                Images & Screenshots taken during this base
              </h2>
              <h1 className="title-font text-2xl font-medium text-gray-900 dark:text-neutral-200 sm:text-3xl">
                Images
              </h1>
            </div>

            <div className="flex flex-wrap gap-5">
              {images.map((img, i) => (
                <div
                  key={`image-${i}`}
                  className={clsx("block", {
                    "basis-1/2": i % 4 === 0,
                    "basis-[23%]": i % 4 !== 0,
                  })}
                >
                  <div className="flex h-full justify-between">
                    <button
                      className={
                        "group relative flex h-auto w-full overflow-hidden rounded-xl"
                      }
                      onClick={() => {
                        setCurrentModalImage(
                          `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineSeasonBasespot.id}/${img.name}`
                        );
                        openModal();
                      }}
                    >
                      <img
                        className="h-full w-full object-cover transition-all duration-200 ease-in group-hover:scale-110"
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineSeasonBasespot.id}/${img.name}`}
                        alt=""
                      />
                      <div
                        className="absolute flex h-full w-full flex-col items-end justify-end p-3"
                        style={{
                          background:
                            "linear-gradient(0deg, #001022cc 0%, #f0f4fd33 90%)",
                        }}
                      >
                        <div className="flex w-full justify-between text-left">
                          <div className="w-full">
                            <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-white">
                              {img.name}
                            </p>
                            {img.metadata?.size && (
                              <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-white">
                                {formatBytes(img.metadata.size)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="absolute right-3 top-3 z-10 rounded-[10px] bg-[#8b9ca380] py-1 px-3 text-sm text-white">
                        {convertToDate(
                          img.name.replace("_1.jpg", "")
                        ).toLocaleString("de", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }) === "Invalid Date"
                          ? new Date(img.created_at).toLocaleString("de", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                          : convertToDate(
                            img.name.replace("_1.jpg", "")
                          ).toLocaleString("de", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </article>
  );
};

export default TimelineSeasonBasespot;
