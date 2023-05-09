import { useAuth } from "@redwoodjs/auth";
import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "src/App";
import Counter from "src/components/Util/Counter/Counter";
import { Map } from "src/components/Util/Map/Map";
import { Modal, RefModal } from "src/components/Util/Modal/Modal";
import Slideshow from "src/components/Util/Slideshow/Slideshow";

import {
  formatBytes,
  getDateDiff,
  nmbFormat,
  pluralize,
  timeTag,
  truncate,
} from "src/lib/formatters";

import type {
  DeleteTimelineBasespotMutationVariables,
  FindTimelineBasespotById,
} from "types/graphql";

const DELETE_TIMELINE_BASESPOT_MUTATION = gql`
  mutation DeleteTimelineBasespotMutation($id: BigInt!) {
    deleteTimelineBasespot(id: $id) {
      id
    }
  }
`;

const RAID_TIMELINE_BASESPOT_MUTATION = gql`
  mutation RaidTimelineBasespotMutation(
    $id: BigInt!
    $input: RaidTimelineBasespotInput!
  ) {
    raidTimelineBasespot(id: $id, input: $input) {
      id
      end_date
      raid_comment
      raided_by
    }
  }
`;

interface Props {
  timelineBasespot: NonNullable<FindTimelineBasespotById["timelineBasespot"]>;
}

const TimelineBasespot = ({ timelineBasespot }: Props) => {
  const { isAuthenticated } = useAuth();
  const [deleteTimelineBasespot] = useMutation(
    DELETE_TIMELINE_BASESPOT_MUTATION,
    {
      onCompleted: () => {
        toast.success("TimelineBasespot deleted");
        navigate(routes.timelineBasespots());
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
  const [raidTimelineBasespot] = useMutation(RAID_TIMELINE_BASESPOT_MUTATION, {
    onCompleted: () => {
      toast.success("TimelineBasespot raid initiated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteTimelineBasespotMutationVariables["id"]) => {
    if (
      confirm("Are you sure you want to delete timelineBasespot " + id + "?")
    ) {
      deleteTimelineBasespot({ variables: { id } });
    }
  };
  const [isRaided, setIsRaided] = useState(false);
  const initRaid = () => {
    if (confirm("Are you sure you are being raided?")) {
      setIsRaided(true);
      setIsComponentVisible(false);
    }
  };
  const [images, setImages] = useState([]);

  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const [currentModalImage, setCurrentModalImage] = useState(null);
  useEffect(() => {
    supabase.storage
      .from("timelineimages")
      .list(timelineBasespot.id.toString())
      .then(({ data, error }) => {
        if (error) throw error;
        if (data) {
          setImages(data);
        }
      });
  }, []);

  function convertToDate(dateString) {
    const year = dateString.substr(0, 4);
    const month = dateString.substr(4, 2) - 1; // subtract 1 to account for zero-based month numbering
    const day = dateString.substr(6, 2);
    const hour = dateString.substr(8, 2);
    const minute = dateString.substr(10, 2);
    const second = dateString.substr(12, 2);

    return new Date(year, month, day, hour, minute, second);
  }
  return (
    <article className="rw-segment">
      <RefModal
        isOpen={isComponentVisible}
        onClose={() => setIsComponentVisible(false)}
        setIsOpen={(open) => setIsComponentVisible(open)}
        image={currentModalImage}
      />
      <Modal
        isOpen={isRaided}
        onClose={() => setIsRaided(false)}
        form={
          <div className="flex flex-col items-center justify-center text-gray-700 dark:text-white">
            <h1 className="text-2xl font-bold">You are being raided!</h1>
            <p className="text-lg">
              Please fill out the form below to report the raid.
            </p>
            <label className="rw-label">Raided By</label>
            <input className="rw-input" type="text" name="raided_by" />

            <label className="rw-label">Raid Comment</label>
            <textarea className="rw-input" name="raid_comment" />

            <label className="rw-label">Raid Comment</label>
            <input type="datetime-local" className="rw-input" name="end_date" />
          </div>
        }
        formSubmit={(data) => {
          data.preventDefault();
          const formData = new FormData(data.currentTarget);
          raidTimelineBasespot({
            variables: {
              id: timelineBasespot.id,
              input: {
                end_date: formData.get("end_date") || new Date(),
                raid_comment: formData.get("raid_comment"),
                raided_by: formData.get("raided_by"),
              },
            },
          });
          setIsRaided(false);
        }}
      />

      <div className="m-2 block rounded-md text-white">
        <section className="body-font">
          <div className="container mx-auto flex flex-col items-center px-5 py-12 md:flex-row">
            <div className="mb-16 flex flex-col items-center text-center md:mb-0 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
              <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 dark:text-zinc-200 sm:text-4xl">
                {timelineBasespot.tribe_name}
              </h1>
              <p className="leading-relaxed">
                This time we played on{" "}
                {timelineBasespot.server && timelineBasespot.server}
                {timelineBasespot.cluster &&
                  `, ${timelineBasespot.cluster}`}{" "}
                {timelineBasespot.season &&
                  `, Season ${timelineBasespot.season}`}
              </p>
              <div className="mt-2 flex justify-center space-x-2">
                <Link
                  to={routes.editTimelineBasespot({
                    id: timelineBasespot.id.toString(),
                  })}
                  className="rw-button rw-button-gray-outline"
                >
                  Edit
                </Link>
                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => onDeleteClick(timelineBasespot.id)}
                      className="rw-button rw-button-red-outline inline-flex"
                    >
                      Delete
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        fill="currentColor"
                        className="rw-button-icon"
                      >
                        <path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                      </svg>
                    </button>
                    {
                      timelineBasespot.TimelineBasespotRaid.length > 0 &&
                      !timelineBasespot.TimelineBasespotRaid.find(
                        (f) => f.base_survived === false
                      ) && (
                        <button
                          className="rw-button rw-button-red-outline"
                          onClick={() => initRaid()}
                        >
                          Raid
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                            className="rw-button-icon"
                          >
                            <path d="M285.3 247.1c-3.093-4.635-8.161-7.134-13.32-7.134c-8.739 0-15.1 7.108-15.1 16.03c0 3.05 .8717 6.133 2.693 8.859l52.37 78.56l-76.12 25.38c-6.415 2.16-10.94 8.159-10.94 15.18c0 2.758 .7104 5.498 2.109 7.946l63.1 112C293.1 509.1 298.5 512 304 512c11.25 0 15.99-9.84 15.99-16.02c0-2.691-.6807-5.416-2.114-7.915L263.6 393l77.48-25.81c1.701-.5727 10.93-4.426 10.93-15.19c0-3.121-.9093-6.205-2.685-8.873L285.3 247.1zM575.1 256c0-4.435-1.831-8.841-5.423-12l-58.6-51.87c.002-.0938 0 .0938 0 0l.0247-144.1c0-8.844-7.156-16-15.1-16L400 32c-8.844 0-15.1 7.156-15.1 16l-.0014 31.37L298.6 4c-3.016-2.656-6.797-3.997-10.58-3.997c-3.781 0-7.563 1.34-10.58 3.997l-271.1 240C1.831 247.2 .0007 251.6 .0007 256c0 8.92 7.239 15.99 16.04 15.99c3.757 0 7.52-1.313 10.54-3.993l37.42-33.02V432c0 44.13 35.89 80 79.1 80h63.1c8.844 0 15.1-7.156 15.1-16S216.8 480 208 480h-63.1c-26.47 0-47.1-21.53-47.1-48v-224c0-.377-.1895-.6914-.2148-1.062L288 37.34l192.2 169.6C480.2 207.3 479.1 207.6 479.1 208v224c0 26.47-21.53 48-47.1 48h-31.1c-8.844 0-15.1 7.156-15.1 16s7.156 16 15.1 16h31.1c44.11 0 79.1-35.88 79.1-80V234.1L549.4 268C552.5 270.7 556.2 272 559.1 272C568.7 272 575.1 264.9 575.1 256zM479.1 164.1l-63.1-56.47V64h63.1V164.1z" />
                          </svg>
                        </button>
                      )}
                  </>
                )}


              </div>
            </div>
            {images.length > 0 && (
              <div className="w-5/6 md:w-1/2 lg:w-full lg:max-w-lg">
                <img
                  className="rounded-lg object-cover object-center"
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineBasespot.id}/${images[0].name}`}
                  alt={timelineBasespot.tribe_name}
                />
              </div>
            )}
          </div>
        </section>

        <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-gray-200 dark:text-neutral-200">
          <div className="container mx-auto flex flex-wrap px-5 py-12">
            <div className="mb-10 w-full overflow-hidden text-base lg:mb-0 lg:w-1/2">
              <p>Started playing on {timeTag(timelineBasespot.start_date)}.</p>
              {timelineBasespot.start_date &&
                timelineBasespot.TimelineBasespotRaid.length > 0 &&
                timelineBasespot.TimelineBasespotRaid.find(
                  (f) => f.base_survived === false
                ) && (
                  <p>
                    Base lasted{" "}
                    {
                      getDateDiff(
                        new Date(timelineBasespot.start_date),
                        new Date(
                          timelineBasespot.TimelineBasespotRaid.find(
                            (f) => f.base_survived === false
                          ).raid_end
                        )
                      ).dateString
                    }
                  </p>
                )}
            </div>
          </div>
        </section>

        {timelineBasespot.TimelineBasespotRaid.length > 0 && (
          <section className="body-font relative mx-4 border-t border-gray-700 text-stone-300 dark:border-gray-200">
            <h1
              id="raid-heading"
              className="title-font mt-8 text-center text-xl font-medium text-gray-900 dark:text-neutral-200 sm:text-3xl"
            >
              {pluralize(
                timelineBasespot.TimelineBasespotRaid.length,
                "Raid",
                "s",
                false
              )}
            </h1>

            <Slideshow
              className="mb-6"
              aria-labelledby="raid-heading"
              controls={true}
              autoPlay={false}
              slides={timelineBasespot.TimelineBasespotRaid.map(
                (
                  {
                    id,
                    raid_comment,
                    raid_start,
                    raid_end,
                    tribe_name,
                    base_survived,
                  },
                  index
                ) => {
                  return {
                    tabColor: `bg-pea-500`,
                    content: (
                      <div
                        key={id}
                        className="flex justify-center px-5 py-12"
                      >
                        <div className="text-center lg:w-3/4 xl:w-1/2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            className="mb-8 inline-block h-8 w-8 text-white"
                            viewBox="0 0 975.036 975.036"
                          >
                            <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                          </svg>
                          <p className="text-lg leading-relaxed">
                            {raid_comment.split("\n").map((w, idx) => (
                              <span className="block" key={`raid-comment-${idx}`}>
                                {w.replace("\\n", "")}
                              </span>
                            ))}
                          </p>

                          <span className="bg-pea-500 mt-8 mb-6 inline-block h-1 w-10 rounded" />
                          <h2 className="text-sm text-stone-400">
                            Raided by{" "}
                            <span className="title-font font-medium tracking-wider">
                              {tribe_name}
                            </span>
                          </h2>
                          <p className="text-gray-500">
                            {timeTag(raid_start)} - {timeTag(raid_end)}
                          </p>
                          <p className="text-gray-500">
                            {`Base ${base_survived ? "survived" : "did not survive"
                              }`}
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
              <Map
                className="h-full w-full object-cover object-center"
                map={timelineBasespot.map.toString()}
                size={{ width: 500, height: 500 }}
                pos={[
                  {
                    lat: timelineBasespot.latitude,
                    lon: timelineBasespot.longitude,
                  } as any,
                ]}
                interactive={true}
              />
            </div>
            <div className="-mb-10 flex flex-col flex-wrap text-center lg:w-1/2 lg:py-6 lg:pl-12 lg:text-left">
              <div className="mb-10 flex flex-col items-center lg:items-start">
                <div className="bg-pea-50 text-pea-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full">
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
                    Our base
                    {timelineBasespot.TimelineBasespotRaid.find(
                      (f) => !f.base_survived
                    )
                      ? " was "
                      : " is "}
                    located at: {timelineBasespot.latitude}{" "}
                    <abbr title="Latitude">Lat</abbr>,{" "}
                    {timelineBasespot.longitude}{" "}
                    <abbr title="Longitude">Lon</abbr>
                  </p>
                </div>
              </div>
              {timelineBasespot.basespot && (
                <div className="mb-10 flex flex-col items-center lg:items-start">
                  <div className="bg-pea-50 text-pea-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full">
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
                          id: timelineBasespot.basespot.id.toString(),
                        })}
                      >
                        {timelineBasespot.basespot.name}
                      </Link>
                    </p>
                  </div>
                </div>
              )}
              <div className="mb-10 flex flex-col items-center lg:items-start">
                <div className="bg-pea-50 text-pea-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full">
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
                    {timelineBasespot.players.length < 3
                      ? timelineBasespot.players.join(" and ")
                      : timelineBasespot.players.join(", ")}{" "}
                    played
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-gray-200 dark:text-neutral-200">
          <div className="container mx-auto px-5 py-24">
            <div className="mb-20 flex w-full flex-col text-center">
              <h2 className="title-font text-pea-500 mb-1 text-xs font-medium tracking-widest">
                Images & Screenshots taken during this basespot season
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
                      className={clsx(
                        "group relative flex h-auto w-full overflow-hidden rounded-xl"
                      )}
                      onClick={() => {
                        setCurrentModalImage(
                          `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineBasespot.id}/${img.name}`
                        );
                        setIsComponentVisible(true);
                        setIsRaided(false);
                      }}
                    >
                      <img
                        className="h-full w-full object-cover transition-all duration-200 ease-in group-hover:scale-110"
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineBasespot.id}/${img.name}`}
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
                            <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-white">
                              {formatBytes(img.metadata.size)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className="absolute right-3 top-3 z-10 rounded-[10px] bg-[#8b9ca380] py-1 px-3 text-sm text-white">
                        {/* {new Date(img.updated_at).toLocaleTimeString("de", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} */}
                        {/* <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                          fill="currentColor"
                          className="mr-1 inline-block h-4 w-4 text-white"
                        >
                          <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" />
                        </svg> */}
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

        {timelineBasespot.TimelineBasespotDino.length > 0 && (
          <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-gray-200 dark:text-neutral-200">
            <div className="container mx-auto px-5 py-24">
              <div className="mb-20 flex w-full flex-col text-center">
                <h2 className="title-font  text-pea-500 mb-1 text-xs font-medium tracking-widest">
                  Dinos we had during this base
                </h2>
                <h1 className="title-font text-2xl font-medium text-gray-900 dark:text-neutral-200 sm:text-3xl">
                  Dinos
                </h1>
              </div>
              <div className="-m-4 flex flex-wrap">
                {timelineBasespot.TimelineBasespotDino.map((dino, i) => (
                  <div
                    className="w-1/3 max-w-3xl p-2"
                    key={`timelinebasespotdino-${i}`}
                  >
                    <div className="border border-[#97FBFF] bg-[#0D2836] p-4">
                      <div className="flex flex-row space-x-3">
                        <div className="h-28 w-28 overflow-hidden border border-[#97FBFF]">
                          <img
                            style={{
                              filter:
                                "invert(95%) sepia(69%) saturate(911%) hue-rotate(157deg) brightness(100%) contrast(103%)",
                            }}
                            className="h-full w-full object-cover object-center p-2"
                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${dino.Dino.icon}`}
                            alt=""
                          />
                        </div>
                        <div className="flex flex-col items-start justify-start leading-snug">
                          <h1 className="mb-2 text-2xl font-semibold uppercase text-white">
                            {truncate(dino.name, 13)} {dino.level}
                          </h1>
                          <p
                            className={clsx({
                              "text-blue-500": dino.gender === "Male",
                              "text-pink-500": dino.gender === "Female",
                              "text-white": dino.gender === "N/A",
                            })}
                          >
                            {dino.gender}
                          </p>
                          <p
                            className="font-semibold text-green-500"
                            title={dino.death_cause}
                          >
                            {timelineBasespot.tribe_name}
                            {/* {timeTag(dino.birth_date)} - {timeTag(dino.death_date)} */}
                          </p>
                          <p className="font-semibold text-green-500">
                            Tamed ({dino.level_wild})
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-4 place-content-center gap-1 text-center font-medium">
                        <p className="inline-flex space-x-2">
                          <img
                            className="h-6 w-6"
                            src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/8/8d/Stamina.png"
                            alt=""
                          />
                          <span>
                            {nmbFormat(
                              dino.wild_stamina *
                              dino.Dino.base_stats["s"]["w"] +
                              dino.stamina * dino.Dino.base_stats["s"]["t"] +
                              dino.Dino.base_stats["s"]["b"]
                            )}
                          </span>
                        </p>
                        <p className="text-center">
                          ({dino.wild_stamina}-{dino.stamina})
                        </p>
                        <p className="inline-flex space-x-2">
                          <img
                            className="h-6 w-6"
                            src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/6/6f/Weight.png"
                            alt=""
                          />
                          <span>
                            {nmbFormat(
                              dino.wild_weight *
                              dino.Dino.base_stats["w"]["w"] +
                              dino.weight * dino.Dino.base_stats["w"]["t"] +
                              dino.Dino.base_stats["w"]["b"]
                            )}
                          </span>
                        </p>
                        <p className="text-center">
                          ({dino.wild_weight}-{dino.weight})
                        </p>
                        <p className="inline-flex space-x-2">
                          <img
                            className="h-6 w-6"
                            src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/1/19/Oxygen.png"
                            alt=""
                          />
                          <span>
                            {nmbFormat(
                              dino.wild_oxygen *
                              dino.Dino.base_stats["o"]["w"] +
                              dino.oxygen * dino.Dino.base_stats["o"]["t"] +
                              dino.Dino.base_stats["o"]["b"]
                            )}
                          </span>
                        </p>
                        <p className="text-center">
                          ({dino.wild_oxygen}-{dino.oxygen})
                        </p>
                        <p className="inline-flex space-x-2">
                          <img
                            className="h-6 w-6"
                            src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/0/01/Melee_Damage.png"
                            alt=""
                          />
                          <span>
                            {dino.wild_melee_damage *
                              dino.Dino.base_stats["d"]["w"] +
                              dino.melee_damage *
                              dino.Dino.base_stats["d"]["t"] +
                              dino.Dino.base_stats["d"]["b"]}
                            %
                          </span>
                        </p>
                        <p className="text-center">
                          ({dino.wild_melee_damage}-{dino.melee_damage})
                        </p>
                        <p className="inline-flex space-x-2">
                          <img
                            className="h-6 w-6"
                            src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/c/c6/Food.png"
                            alt=""
                          />
                          <span>
                            {nmbFormat(
                              dino.wild_food * dino.Dino.base_stats["f"]["w"] +
                              dino.food * dino.Dino.base_stats["f"]["t"] +
                              dino.Dino.base_stats["f"]["b"]
                            )}
                          </span>
                        </p>
                        <p className="text-center">
                          ({dino.wild_food}-{dino.food})
                        </p>
                        <p className="inline-flex space-x-2">
                          <img
                            className="h-6 w-6"
                            src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/e/e1/Movement_Speed.png"
                            alt=""
                          />
                          <span>
                            {nmbFormat(
                              dino.wild_movement_speed *
                              dino.Dino.base_stats["m"]["w"] +
                              dino.movement_speed *
                              dino.Dino.base_stats["m"]["t"] +
                              dino.Dino.base_stats["m"]["b"]
                            )}
                            %
                          </span>
                        </p>
                        <p className="text-center">
                          ({dino.wild_movement_speed}-{dino.movement_speed})
                        </p>
                      </div>
                      <div className="relative mt-3 h-8 w-full border border-[#97FBFF] bg-[#646665] text-center">
                        <div className="relative flex h-full w-full items-center border-2 border-[#0D2836]">
                          <div className="h-full w-full bg-gradient-to-t from-[#A30100] to-red-500"></div>
                          <span className="absolute w-full items-center text-base font-semibold">
                            {nmbFormat(
                              dino.wild_health *
                              dino.Dino.base_stats["h"]["w"] +
                              dino.health * dino.Dino.base_stats["h"]["t"] +
                              dino.Dino.base_stats["h"]["b"]
                            )}
                            /
                            {nmbFormat(
                              dino.wild_health *
                              dino.Dino.base_stats["h"]["w"] +
                              dino.health * dino.Dino.base_stats["h"]["t"] +
                              dino.Dino.base_stats["h"]["b"]
                            )}{" "}
                            Health ({dino.wild_health}-{dino.health})
                          </span>
                        </div>
                      </div>
                      <div className="relative mt-2 h-8 w-full border border-[#97FBFF] bg-[#646665] text-center">
                        <div className="relative flex h-full w-full items-center border-2 border-[#0D2836]">
                          <div className="h-full w-full bg-gradient-to-t from-[#009136] to-green-500"></div>
                          <span className="absolute w-full items-center text-base font-semibold">
                            {nmbFormat(
                              dino.wild_food * dino.Dino.base_stats["f"]["w"] +
                              dino.food * dino.Dino.base_stats["f"]["t"] +
                              dino.Dino.base_stats["f"]["b"]
                            )}
                            /
                            {nmbFormat(
                              dino.wild_food * dino.Dino.base_stats["f"]["w"] +
                              dino.food * dino.Dino.base_stats["f"]["t"] +
                              dino.Dino.base_stats["f"]["b"]
                            )}{" "}
                            Food ({dino.wild_food}-{dino.food})
                          </span>
                        </div>
                      </div>
                      <div className="relative mt-2 h-8 w-full border border-[#97FBFF] bg-[#646665] text-center">
                        <div className="relative flex h-full w-full items-center border-2 border-[#0D2836]">
                          <div className="h-full w-full bg-gradient-to-t from-[#A340B7] to-fuchsia-500"></div>
                          <span className="absolute w-full items-center text-base font-semibold">
                            {nmbFormat(
                              dino.wild_torpor *
                              dino.Dino.base_stats["t"]["w"] +
                              dino.torpor * dino.Dino.base_stats["t"]["t"] +
                              dino.Dino.base_stats["t"]["b"]
                            )}
                            /
                            {nmbFormat(
                              dino.wild_torpor *
                              dino.Dino.base_stats["t"]["w"] +
                              dino.torpor * dino.Dino.base_stats["t"]["t"] +
                              dino.Dino.base_stats["t"]["b"]
                            )}{" "}
                            Torpor ({dino.wild_torpor}-{dino.torpor})
                          </span>
                        </div>
                      </div>
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

export default TimelineBasespot;
