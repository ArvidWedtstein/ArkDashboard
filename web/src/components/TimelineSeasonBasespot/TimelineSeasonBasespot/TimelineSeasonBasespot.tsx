import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import clsx from "clsx";
import { useLayoutEffect, useState } from "react";
import { useAuth } from "src/auth";
import TimelineSeasonPeopleCell from "src/components/TimelineSeasonPerson/TimelineSeasonPeopleCell";
import Badge from "src/components/Util/Badge/Badge";
import Button, { ButtonGroup } from "src/components/Util/Button/Button";
import ImageContainer from "src/components/Util/ImageContainer/ImageContainer";
import Map from "src/components/Util/Map/Map";
import { Modal, useModal } from "src/components/Util/Modal/Modal";
import Slideshow from "src/components/Util/Slideshow/Slideshow";
import Text from "src/components/Util/Text/Text";
import Toast from "src/components/Util/Toast/Toast";

import {
  formatBytes,
  getDateDiff,
  pluralize,
  relativeDate,
  timeTag,
} from "src/lib/formatters";

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
    client: supabase,
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
          toast.promise(deleteTimelineSeasonBasespot({ variables: { id } }), {
            loading: "deleting basespot from season...",
            success: `Successfully deleted basespot`,
            error: `Failed to delete basespot`,
          });
        }}
        actionType="OkCancel"
      />
    ));
  };

  type Bucket = {
    id: string;
    name: string;
    owner: string;
    file_size_limit?: number;
    allowed_mime_types?: string[];
    created_at: string;
    updated_at: string;
    public: boolean;
  };
  type FileObject = {
    name: string;
    bucket_id: string;
    owner: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: Record<string, any>;
    buckets: Bucket;
  };
  const [images, setImages] = useState<FileObject[]>([]);
  const [currentModalImage, setCurrentModalImage] = useState({
    url: "",
    mimetype: "",
  });

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

  const { openModal } = useModal();

  return (
    <article className="rw-segment">
      <Modal
        title="Preview"
        content={
          <>
            <Button
              size="small"
              color="secondary"
              variant="outlined"
              onClick={() => {
                fetch(currentModalImage.url)
                  .then(response => response.blob())
                  .then(blob => {
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = 'Arkdashboard.jpg';
                    link.click();
                  })
                  .catch(console.error);
              }}
            >
              <span className="sr-only">Download</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-5" fill="currentColor">
                <path d="M571.8 238.8C574.5 228.9 576 218.6 576 208C576 146.1 525.9 96 464 96c-16.75 0-32.88 3.625-48 10.75C384.4 61.75 331.8 32 272 32C177.6 32 100.2 106.4 96.2 200.1C39.2 220.1 0 274.3 0 336C0 415.6 64.38 480 144 480H512c70.75 0 128-57.25 128-128C640 305 614.3 261.3 571.8 238.8zM507.5 448H149.5c-58.31 0-110.9-42.16-116.9-100.2C26.79 291.2 63.27 241.9 114.3 227.1c8.367-2.291 13.78-10.26 13.73-18.94C128 208.7 128 208.4 128 208C127.1 147.3 165.1 91.38 222.7 72.19c71.47-23.82 139.2 6.727 172.3 60.89c5.984 9.803 18.35 11.99 28.22 6.111c16.88-10.06 37.78-14.07 59.94-8.988c26.85 6.154 49.45 27 57.26 53.41c5.799 19.61 4.307 38.74-2.508 55.16c-4.137 9.969 2.061 20.75 11.98 24.1c37.34 15.97 62.42 55.06 57.5 99.25C601.9 412.3 557.1 448 507.5 448zM388.7 292.7L336 345.4V176C336 167.2 328.8 160 320 160S304 167.2 304 176v169.4L251.3 292.7c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62l80 80C311.8 398.4 315.9 400 320 400s8.188-1.562 11.31-4.688l80-80c6.25-6.25 6.25-16.38 0-22.62S394.9 286.4 388.7 292.7z" />
              </svg>

            </Button>
          </>
        }
        image={currentModalImage.url}
        mimetype={currentModalImage.mimetype}
      />

      <div className="m-2 block rounded-md dark:text-white text-black">
        <section className="flex flex-col items-center px-5 py-12 md:flex-row w-full">
          <div className="flex flex-col items-center md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
            <Text variant="h4">
              {timelineSeasonBasespot.TimelineSeason.tribe_name}
            </Text>
            <Text variant="subtitle1" gutterBottom>
              This time we played on
              {` ${timelineSeasonBasespot?.TimelineSeason.server} ${timelineSeasonBasespot.TimelineSeason?.cluster} Season ${timelineSeasonBasespot.TimelineSeason.season}`}
            </Text>

            <ButtonGroup>
              <Button
                permission="timeline_update"
                color="secondary"
                variant="outlined"
                to={routes.editTimelineSeasonBasespot({
                  id: timelineSeasonBasespot.id,
                })}
                startIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M493.2 56.26l-37.51-37.51C443.2 6.252 426.8 0 410.5 0c-16.38 0-32.76 6.25-45.26 18.75L45.11 338.9c-8.568 8.566-14.53 19.39-17.18 31.21l-27.61 122.8C-1.7 502.1 6.158 512 15.95 512c1.047 0 2.116-.1034 3.198-.3202c0 0 84.61-17.95 122.8-26.93c11.54-2.717 21.87-8.523 30.25-16.9l321.2-321.2C518.3 121.7 518.2 81.26 493.2 56.26zM149.5 445.2c-4.219 4.219-9.252 7.039-14.96 8.383c-24.68 5.811-69.64 15.55-97.46 21.52l22.04-98.01c1.332-5.918 4.303-11.31 8.594-15.6l247.6-247.6l82.76 82.76L149.5 445.2zM470.7 124l-50.03 50.02l-82.76-82.76l49.93-49.93C393.9 35.33 401.9 32 410.5 32s16.58 3.33 22.63 9.375l37.51 37.51C483.1 91.37 483.1 111.6 470.7 124z" />
                  </svg>
                }
              >
                Edit
              </Button>
              <Button
                permission="timeline_delete"
                color="error"
                variant="outlined"
                onClick={() => onDeleteClick(timelineSeasonBasespot.id)}
                startIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
                  </svg>
                }
              >
                Delete
              </Button>
            </ButtonGroup>
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

        <section className="mx-4 border-t border-zinc-700 text-zinc-700 dark:border-white/20 dark:text-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full divide-x-0 md:divide-x divide-y md:divide-y-0 dark:divide-white/30 divide-black/30 text-center p-12">
            <div className="relative flex flex-col justify-center items-center divide-y divide-current space-y-1">
              <Text variant="h6">
                Played
              </Text>

              <Text variant="h6" className="px-4">
                {relativeDate(timelineSeasonBasespot.start_date)}
              </Text>
            </div>

            {timelineSeasonBasespot?.TimelineSeason?.TimelineSeasonEvent &&
              timelineSeasonBasespot?.TimelineSeason?.TimelineSeasonEvent
                .length > 0 && (
                <div className="relative flex flex-col justify-center items-center divide-y divide-current space-y-1">
                  <Text variant="h6">
                    Lasted
                  </Text>

                  <Text variant="h6" className="px-4">
                    {getDateDiff(
                      new Date(timelineSeasonBasespot.start_date),
                      new Date(timelineSeasonBasespot.end_date)
                    ).dateString}
                  </Text>
                </div>
              )}
          </div>
        </section>


        <div className="rw-divide px-4 my-4">
          <Text variant="h6" className="mx-2">{pluralize(timelineSeasonBasespot.TimelineSeason.TimelineSeasonEvent.length, "Event", "s", false)}</Text>
        </div>

        {timelineSeasonBasespot?.TimelineSeason?.TimelineSeasonEvent?.length >
          0 && (
            <section className="body-font relative mx-4 text-stone-300">
              <Slideshow
                className="mb-6"
                aria-labelledby="event-heading"
                controls={true}
                autoPlay={false}
                slides={timelineSeasonBasespot.TimelineSeason.TimelineSeasonEvent.map(
                  ({ id, title, content, created_at, tags }) => {
                    return {
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

                            <p className="text-lg leading-relaxed text-black dark:text-white whitespace-pre-wrap">
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

                            <span className="bg-success-500 mt-8 inline-block h-1 w-10 rounded" />
                            <h2 className="title-font my-4 text-lg font-medium tracking-wider text-zinc-600 dark:text-gray-200">
                              {title}
                            </h2>
                            <p className="text-gray-500">{timeTag(created_at)}</p>
                            <p className="inline-flex gap-x-1">
                              {tags &&
                                tags.split(",").map((t) => <Badge key={`badge-${t}`} color="secondary" variant="outlined" content={`#${t}`} standalone />)}
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

        <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-white/20 dark:text-neutral-200">
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
            <div className="flex flex-col flex-wrap border-l border-black/20 text-center dark:border-white/20 lg:w-1/2 lg:py-6 lg:pl-12 lg:text-left">
              <div className="mb-10 flex flex-col items-center lg:items-start">
                <div className="dark:bg-success-50 text-success-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-200">
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
                    <Button
                      variant="text"
                      to={routes.map({
                        id: timelineSeasonBasespot.map_id,
                      })}
                      color="success"
                    >
                      {timelineSeasonBasespot?.Map?.name}
                    </Button>
                  </p>
                </div>
              </div>
              {timelineSeasonBasespot.Basespot && (
                <div className="mb-10 flex flex-col items-center lg:items-start">
                  <div className="dark:bg-success-50 text-success-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-200">
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
                      Our basespot was
                      <Button
                        variant="text"
                        to={routes.basespot({
                          id: timelineSeasonBasespot.Basespot.id,
                        })}
                        color="success"
                      >
                        {timelineSeasonBasespot.Basespot.name}
                      </Button>
                    </p>
                  </div>
                </div>
              )}
              <div className="mb-10 flex flex-col items-center justify-start lg:items-start">
                <div className="flex flex-col">
                  <div className="dark:bg-success-50 text-success-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-200">
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
                <div className="flex">
                  {timelineSeasonBasespot.TimelineSeason.TimelineSeasonPerson?.map(({ id, ingame_name, permission, Profile, user_id }) => (
                    <div className="relative flex-none py-6 px-3" key={id}>
                      <div className="flex flex-col items-center justify-center gap-3">
                        <img
                          className="relative h-16 w-16 rounded-full transition duration-150 ease-in-out"
                          src={
                            Profile?.avatar_url
                              ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${Profile.avatar_url}`
                              : `https://ui-avatars.com/api/?name=${ingame_name}`
                          }
                        />
                        <div className="inline-flex gap-x-1 items-center justify-center">
                          <strong className="text-xs font-medium text-slate-900 dark:text-slate-200" title={`Role: ${permission}`}>
                            {Profile ? (
                              <Link to={routes.profile({ id: user_id })}>
                                {Profile.username || ingame_name}
                              </Link>
                            ) : (
                              ingame_name
                            )}
                          </strong>
                          {permission == 'guest' && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-3 h-3" fill="currentColor"><path d="M315.1 271l-70.56-112.1C232.8 139.3 212.5 128 190.3 128H129.7c-22.22 0-42.53 11.25-54.28 30.09L4.873 271c-9.375 14.98-4.812 34.72 10.16 44.09c15 9.375 34.75 4.812 44.09-10.19l28.88-46.18L87.1 480c0 17.67 14.33 32 32 32c17.67 0 31.1-14.33 31.1-32l0-144h16V480c0 17.67 14.33 32 32 32c17.67 0 32-14.33 32-32V258.8l28.88 46.2C266.9 314.7 277.4 320 288 320c5.781 0 11.66-1.562 16.94-4.859C319.9 305.8 324.5 286 315.1 271zM160 96c26.5 0 48-21.5 48-48S186.5 0 160 0C133.5 0 112 21.5 112 48S133.5 96 160 96z" /></svg>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="rw-divide px-4 my-4">
          <div className="flex flex-col px-4 border-x dark:border-white/20 border-black/20">
            <Text variant="h6">{pluralize(images.length, 'Image', 's', false)}</Text>
            <Text variant="caption" className="text-success-500">Images & Screenshots taken during this base</Text>
          </div>
        </div>
        {images.length > 0 && (
          <section className="body-font mx-4 text-gray-700 dark:text-neutral-200">
            <div className="container mx-auto px-5 py-24">
              <div className="flex flex-wrap gap-3">
                {images.map((img, i) => (
                  <div
                    key={`image-${i}`}
                    className={clsx("block", {
                      "basis-1/2": i % 4 === 0,
                      "basis-[23%]": i % 4 !== 0,
                    })}
                  >
                    <div className="flex h-full justify-between dark:text-white">
                      <button
                        className={
                          "group relative flex h-auto w-full overflow-hidden rounded-lg"
                        }
                        onClick={() => {
                          setCurrentModalImage({
                            url: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineSeasonBasespot.id}/${img.name}`,
                            mimetype: img.metadata.mimetype,
                          });
                          openModal();
                        }}
                      >
                        {img.metadata.mimetype.startsWith("image") ? (
                          <img
                            className="h-full w-full object-cover transition-all duration-200 ease-in group-hover:scale-110"
                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineSeasonBasespot.id}/${img.name}`}
                            alt=""
                          />
                        ) : (
                          <video
                            className="h-full w-full object-cover transition-all duration-200 ease-in"
                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineSeasonBasespot.id}/${img.name}`}
                            autoPlay={false}
                            controls={false}
                            disableRemotePlayback={true}
                          />
                        )}
                        <div
                          className={clsx(
                            "absolute flex h-full w-full flex-col items-end justify-end p-3",
                            {
                              "!bg-none":
                                img.metadata.mimetype.startsWith("video"),
                            }
                          )}
                          style={{
                            background:
                              "linear-gradient(0deg, #001022cc 0%, #f0f4fd33 90%)",
                          }}
                        >
                          <div className="flex w-full justify-between text-left">
                            <div
                              className={clsx(
                                "w-full transition-transform ease-in-out",
                                {
                                  "group-hover:translate-y-10":
                                    img.metadata.mimetype.startsWith("video"),
                                }
                              )}
                            >
                              <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                                {img.name}
                              </p>
                              {img.metadata?.size && (
                                <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                                  {formatBytes(img.metadata.size)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="absolute right-3 top-3">
                          <Badge content={<span>
                            {convertToDate(
                              img.name.replace("_1.jpg", "")
                            ).toLocaleString("de", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }) === "Invalid Date"
                              ? new Date(img.created_at).toLocaleString("de", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              }).toString()
                              : convertToDate(
                                img.name.replace("_1.jpg", "")
                              ).toLocaleString("de", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              }).toString()}
                          </span>} className={clsx({
                            "group-hover:-translate-y-10":
                              img.metadata.mimetype.startsWith("video")
                          })} standalone variant="outlined" color="secondary" />
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </article>
  );
};

export default TimelineSeasonBasespot;
