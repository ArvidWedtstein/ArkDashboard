import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { supabase } from "src/App";
import { Map } from "src/components/Util/Map/Map";
import { RefModal } from "src/components/Util/Modal/Modal";

import { getDateDiff, nmbFormat, timeTag, truncate } from "src/lib/formatters";

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

interface Props {
  timelineBasespot: NonNullable<FindTimelineBasespotById["timelineBasespot"]>;
}

const TimelineBasespot = ({ timelineBasespot }: Props) => {
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

  const onDeleteClick = (id: DeleteTimelineBasespotMutationVariables["id"]) => {
    if (
      confirm("Are you sure you want to delete timelineBasespot " + id + "?")
    ) {
      deleteTimelineBasespot({ variables: { id } });
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

  return (
    <article className="rw-segment">
      <RefModal
        isOpen={isComponentVisible}
        onClose={() => setIsComponentVisible(false)}
        setIsOpen={(open) => setIsComponentVisible(open)}
        image={currentModalImage}
      />
      <div className="m-2 block rounded-md text-white">
        <section className="body-font">
          <div className="container mx-auto flex flex-col items-center px-5 py-12 md:flex-row">
            <div className="mb-16 flex flex-col items-center text-center md:mb-0 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
              <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 dark:text-zinc-200 sm:text-4xl">
                {timelineBasespot.tribeName}
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
                <button
                  onClick={() => onDeleteClick(timelineBasespot.id)}
                  className="rw-button rw-button-red-outline"
                >
                  Delete
                </button>
              </div>
            </div>
            {images.length > 0 && (
              <div className="w-5/6 md:w-1/2 lg:w-full lg:max-w-lg">
                <img
                  className="rounded-lg object-cover object-center"
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineBasespot.id}/${images[0].name}`}
                  alt={timelineBasespot.tribeName}
                />
              </div>
            )}
          </div>
        </section>
        <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-gray-200 dark:text-neutral-200">
          <div className="container mx-auto flex flex-wrap px-5 py-12">
            <div className="mb-10 w-full overflow-hidden text-sm lg:mb-0 lg:w-1/2">
              <p>
                We started playing on {timeTag(timelineBasespot.startDate)}.
              </p>
              <p>
                {!timelineBasespot.endDate && !timelineBasespot.raided_by
                  ? ""
                  : `Got raided `}
                {timelineBasespot.endDate && `on `}
                {timeTag(timelineBasespot.endDate)}
                {timelineBasespot.raided_by &&
                  `by ${timelineBasespot.raided_by}.`}
              </p>
              {timelineBasespot.startDate && timelineBasespot.endDate && (
                <p>
                  Base lasted
                  {
                    getDateDiff(
                      new Date(timelineBasespot.startDate),
                      new Date(timelineBasespot.endDate)
                    ).dateString
                  }
                </p>
              )}
            </div>
          </div>
        </section>
        {timelineBasespot.raidcomment && timelineBasespot.raided_by && (
          <section className="body-font mx-4 border-t border-gray-700 text-stone-300 dark:border-gray-200">
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
                  {timelineBasespot.raidcomment}
                </p>
                <span className="mt-8 mb-6 inline-block h-1 w-10 rounded bg-indigo-500"></span>
                <h2 className="title-font text-sm font-medium tracking-wider text-stone-400">
                  {timelineBasespot.raided_by}
                </h2>
                <p className="text-gray-500">{timelineBasespot.cluster}</p>
              </div>
            </div>
          </section>
        )}
        <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-gray-200 dark:text-neutral-200">
          <div className="container mx-auto flex flex-wrap px-5 py-12">
            <div className="mb-10 w-full overflow-hidden rounded-lg lg:mb-0 lg:w-1/2">
              <Map
                className="h-full w-full object-cover object-center"
                map={timelineBasespot.map.toString()}
                size={{ width: 500, height: 500 }}
                pos={[timelineBasespot.location as any]}
                interactive={true}
              />
            </div>
            <div className="-mb-10 flex flex-col flex-wrap text-center lg:w-1/2 lg:py-6 lg:pl-12 lg:text-left">
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
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div className="flex-grow">
                  <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-neutral-200">
                    Coordinates
                  </h2>
                  <p className="text-base leading-relaxed">
                    Our base was located at: {timelineBasespot.location["lat"]}{" "}
                    <abbr title="Latitude">Lat</abbr>,{" "}
                    {timelineBasespot.location["lon"]}{" "}
                    <abbr title="Longitude">Lon</abbr>
                  </p>
                </div>
              </div>
              {timelineBasespot.basespot && (
                <div className="mb-10 flex flex-col items-center lg:items-start">
                  <div className="bg-pea-50 text-pea-500 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="fill-pea-500 h-6 w-6"
                    >
                      <path d="M560.02 32c-1.96 0-3.98.37-5.96 1.16L384.01 96H384L212 35.28A64.252 64.252 0 0 0 191.76 32c-6.69 0-13.37 1.05-19.81 3.14L20.12 87.95A32.006 32.006 0 0 0 0 117.66v346.32C0 473.17 7.53 480 15.99 480c1.96 0 3.97-.37 5.96-1.16L192 416l172 60.71a63.98 63.98 0 0 0 40.05.15l151.83-52.81A31.996 31.996 0 0 0 576 394.34V48.02c0-9.19-7.53-16.02-15.98-16.02zM224 90.42l128 45.19v285.97l-128-45.19V90.42zM48 418.05V129.07l128-44.53v286.2l-.64.23L48 418.05zm480-35.13l-128 44.53V141.26l.64-.24L528 93.95v288.97z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h2 className="title-font mb-3 text-lg font-medium text-gray-900 dark:text-neutral-200">
                      Base
                    </h2>
                    <p className="text-base leading-relaxed">
                      Our basespot was {timelineBasespot.basespot.name}
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
                Images & Screenshots taken during this season
              </h2>
              <h1 className="title-font text-2xl font-medium text-gray-900 dark:text-neutral-200 sm:text-3xl">
                Images
              </h1>
            </div>
            <div className="-m-4 flex flex-wrap">
              {images.map((img, i) => (
                <div key={`img${i}`} className="p-4 md:w-1/3">
                  <div className="flex h-full flex-col rounded-lg bg-gray-100 p-0 dark:bg-gray-600">
                    <div className="m-3 mb-3 flex items-center">
                      <div className="bg-pea-500 mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          strokeWidth={2}
                          className="m-1 h-5 w-5 fill-current"
                        >
                          <path d="M464 96h-88l-12.38-32.88C356.6 44.38 338.8 32 318.8 32h-125.5c-20 0-38 12.38-45 31.12L136 96H48C21.5 96 0 117.5 0 144v288C0 458.5 21.5 480 48 480h416c26.5 0 48-21.5 48-48v-288C512 117.5 490.5 96 464 96zM496 432c0 17.64-14.36 32-32 32h-416c-17.64 0-32-14.36-32-32v-288c0-17.64 14.36-32 32-32h99.11l16.12-43.28C167.9 56.33 179.9 48 193.3 48h125.5c13.25 0 25.26 8.326 29.9 20.76L364.9 112H464c17.64 0 32 14.36 32 32V432zM256 176C194.2 176 144 226.2 144 288c0 61.76 50.24 112 112 112s112-50.24 112-112C368 226.2 317.8 176 256 176zM256 384c-53 0-96-43-96-96s43-96 96-96s96 43 96 96S309 384 256 384z" />
                        </svg>
                      </div>
                      <h2 className="title-font text-lg font-medium text-gray-900 dark:text-neutral-200">
                        {timeTag(img.created_at)}
                      </h2>
                    </div>
                    <div className="flex-grow">
                      <p className="text-base leading-relaxed"></p>
                      <img
                        onClick={() => {
                          setCurrentModalImage(
                            `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineBasespot.id}/${img.name}`
                          );
                          setIsComponentVisible(true);
                        }}
                        className="h-full w-full cursor-pointer rounded-b object-cover object-center"
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/${timelineBasespot.id}/${img.name}`}
                        alt={timelineBasespot.id.toString()}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="body-font mx-4 border-t border-gray-700 text-gray-700 dark:border-gray-200 dark:text-neutral-200">
          <div className="container mx-auto px-5 py-24">
            <div className="mb-20 flex w-full flex-col text-center">
              <h2 className="title-font text-pea-500 mb-1 text-xs font-medium tracking-widest">
                Dinos we had during this base
              </h2>
              <h1 className="title-font text-2xl font-medium text-gray-900 dark:text-neutral-200 sm:text-3xl">
                Dinos
              </h1>
            </div>
            <div className="-m-4 flex flex-wrap">
              {timelineBasespot.TimelineBasespotDino.map((dino, i) => (
                <div className="w-1/3 max-w-3xl p-2">
                  <div className="border border-[#97FBFF] bg-[#0D2836] p-4">
                    <div className="flex flex-row space-x-3">
                      <div className="h-28 w-28 overflow-hidden border border-[#97FBFF]">
                        <img
                          style={{
                            filter:
                              "invert(95%) sepia(69%) saturate(911%) hue-rotate(157deg) brightness(100%) contrast(103%)",
                          }}
                          className="h-full w-full object-cover object-center p-2"
                          src={`https://arkids.net/image/creature/120/${dino.Dino.name
                            .toLowerCase()
                            .replaceAll(" ", "-")
                            .replace("spinosaurus", "spinosaur")
                            .replaceAll("ö", "o")
                            .replaceAll("tek", "")
                            .replaceAll("paraceratherium", "paracer")
                            .replace("&", "")
                            .replace("prime", "")
                            .replace(",masteroftheocean", "")
                            .replace("insectswarm", "bladewasp")}.png`}
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
                          {timelineBasespot.tribeName}
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
                          {dino.wild_stamina * dino.Dino.base_stats["s"]["w"] +
                            dino.stamina * dino.Dino.base_stats["s"]["t"] +
                            dino.Dino.base_stats["s"]["b"]}
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
                          {dino.wild_weight * dino.Dino.base_stats["w"]["w"] +
                            dino.weight * dino.Dino.base_stats["w"]["t"] +
                            dino.Dino.base_stats["w"]["b"]}
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
                          {dino.wild_oxygen * dino.Dino.base_stats["o"]["w"] ||
                            0 + dino.oxygen * dino.Dino.base_stats["o"]["t"] ||
                            0 + dino.Dino.base_stats["o"]["b"] ||
                            0}
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
                            dino.melee_damage * dino.Dino.base_stats["d"]["t"] +
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
                            dino.wild_health * dino.Dino.base_stats["h"]["w"] +
                              dino.health * dino.Dino.base_stats["h"]["t"] +
                              dino.Dino.base_stats["h"]["b"]
                          )}
                          /
                          {nmbFormat(
                            dino.wild_health * dino.Dino.base_stats["h"]["w"] +
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
                            dino.wild_torpor * dino.Dino.base_stats["t"]["w"] +
                              dino.torpor * dino.Dino.base_stats["t"]["t"] +
                              dino.Dino.base_stats["t"]["b"]
                          )}
                          /
                          {nmbFormat(
                            dino.wild_torpor * dino.Dino.base_stats["t"]["w"] +
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
      </div>
    </article>
  );
};

export default TimelineBasespot;
