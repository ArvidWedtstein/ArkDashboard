import type { FindDinoById } from "types/graphql";

import { CellSuccessProps, CellFailureProps, MetaTags } from "@redwoodjs/web";

import Dino from "src/components/Dino/Dino";

export const QUERY = gql`
  query FindDinoById($id: String!, $ids: [BigInt!]!) {
    dino: dino(id: $id) {
      id
      name
      synonyms
      description
      taming_notice
      base_stats
      exp_per_kill
      can_destroy
      egg_min
      egg_max
      torpor_depetion_per_second
      maturation_time
      torpor_immune
      incubation_time
      affinity_needed
      aff_inc
      flee_threshold
      hitboxes
      food_consumption_base
      food_consumption_mult
      taming_method
      taming_ineffectiveness
      disable_mult
      non_violent_food_rate_mult
      taming_interval
      tamable
      base_taming_time
      variants
      mounted_weaponry
      ridable
      movement
      carryable_by
      image
      type
      multipliers
      DinoStat {
        Item {
          name
          id
          image
          stats
          food
          affinity
          ItemRecipe_ItemRecipe_crafted_item_idToItem {
            id
            yields
            crafting_station_id
            Item_ItemRecipe_crafting_station_idToItem {
              name
              image
            }
            ItemRecipeItem {
              id
              amount
              Item {
                id
                name
                image
              }
            }
          }
        }
        value
        rank
        type
      }
    }
    itemsByIds(ids: $ids) {
      id
      name
      image
      stats
      torpor
      torpor_duration
      damage
      visible
    }
  }
`;

export const beforeQuery = (props) => {
  return {
    variables: {
      id: props.id,
      ids: [
        745, 748, 1038, 362, 784, 376, 731, 1342, 139, 434, 848, 451, 1041, 121,
        123, 713, 719,
      ],
    },
    fetchPolicy: "cache-and-network",
  };
};


{/* {timelineSeasonBasespot.TimelineBasespotDino.length > 0 && (
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
                {timelineSeasonBasespot.TimelineBasespotDino.map((dino, i) => (
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
                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/DinoIcon/${dino.Dino.icon}`}
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
                            {timelineSeasonBasespot.tribe_name}
                          </p>
                          <p className="font-semibold text-green-500">
                            Tamed ({dino.level_wild})
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-4 place-content-center gap-1 text-center font-medium">
                        {renderDinoCardStat('stamina', dino)}
                        {renderDinoCardStat('weight', dino)}
                        {renderDinoCardStat('oxygen', dino)}
                        {renderDinoCardStat('melee_damage', dino)}
                        {renderDinoCardStat('food', dino)}
                        {renderDinoCardStat('movement_speed', dino)}
                      </div>
                      <div className="relative mt-3 h-8 w-full border border-[#97FBFF] bg-[#646665] text-center">
                        <div className="relative flex h-full w-full items-center border-2 border-[#0D2836]">
                          <div className="h-full w-full bg-gradient-to-t from-[#A30100] to-red-500"></div>
                          <span className="absolute w-full items-center text-base font-semibold">
                            {formatNumber(
                              dino.wild_health *
                              dino.Dino.base_stats["h"]["w"] +
                              dino.health * dino.Dino.base_stats["h"]["t"] +
                              dino.Dino.base_stats["h"]["b"],
                              { notation: "compact" }
                            )}
                            /
                            {formatNumber(
                              dino.wild_health *
                              dino.Dino.base_stats["h"]["w"] +
                              dino.health * dino.Dino.base_stats["h"]["t"] +
                              dino.Dino.base_stats["h"]["b"],
                              { notation: "compact" }
                            )}{" "}
                            Health ({dino.wild_health}-{dino.health})
                          </span>
                        </div>
                      </div>
                      <div className="relative mt-2 h-8 w-full border border-[#97FBFF] bg-[#646665] text-center">
                        <div className="relative flex h-full w-full items-center border-2 border-[#0D2836]">
                          <div className="h-full w-full bg-gradient-to-t from-[#009136] to-green-500"></div>
                          <span className="absolute w-full items-center text-base font-semibold">
                            {formatNumber(
                              dino.wild_food * dino.Dino.base_stats["f"]["w"] +
                              dino.food * dino.Dino.base_stats["f"]["t"] +
                              dino.Dino.base_stats["f"]["b"],
                              { notation: "compact" }
                            )}
                            /
                            {formatNumber(
                              dino.wild_food * dino.Dino.base_stats["f"]["w"] +
                              dino.food * dino.Dino.base_stats["f"]["t"] +
                              dino.Dino.base_stats["f"]["b"],
                              { notation: "compact" }
                            )}{" "}
                            Food ({dino.wild_food}-{dino.food})
                          </span>
                        </div>
                      </div>
                      <div className="relative mt-2 h-8 w-full border border-[#97FBFF] bg-[#646665] text-center">
                        <div className="relative flex h-full w-full items-center border-2 border-[#0D2836]">
                          <div className="h-full w-full bg-gradient-to-t from-[#A340B7] to-fuchsia-500"></div>
                          <span className="absolute w-full items-center text-base font-semibold">
                            0 / 0
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )} */}
// const renderDinoCardStat = (stat: 'stamina' | 'melee_damage' | 'movement_speed' | 'health' | 'food' | 'weight' | 'oxygen', dino: ArrayElement<FindTimelineBasespotById["timelineBasespot"]["TimelineBasespotDino"]>) => {
//     let char = stat[0]
//     if (stat === 'melee_damage') char = 'd'
//     return (
//       <>
//         <p className="inline-flex space-x-2">
//           <img
//             className="h-6 w-6"
//             src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${stat}.webp`}
//             alt=""
//           />
//           <span>
//             {formatNumber(
//               dino[`wild_${stat}`] *
//               dino.Dino.base_stats[char]["w"] +
//               dino[stat] *
//               dino.Dino.base_stats[char]["t"] +
//               dino.Dino.base_stats[char]["b"],
//               { notation: "compact" }
//             )}
//             {stat === 'movement_speed' || stat === 'melee_damage' && '%'}
//           </span>
//         </p>
//         <p className="text-center">
//           ({dino[`wild_${stat}`]}-{dino[stat]})
//         </p>
//       </>
//     )
//   }

export const Loading = () => (
  <div role="status" className="flex animate-pulse flex-col space-y-8">
    <div className="flex">
      <div className="aspect-square h-96 rounded-lg bg-zinc-200 dark:bg-zinc-600" />
      <div className="flex w-full flex-col flex-wrap py-6 text-center lg:flex-grow lg:w-1/2 lg:pl-12 lg:text-left">
        <div className="flex flex-col space-y-2.5">
          <div className="flex w-full items-center space-x-2">
            <div className="h-2.5 w-64 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
          <div className="flex w-full items-center space-x-2">
            <div className="h-2.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
          <div className="flex w-full items-center space-x-2">
            <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-80 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
          <div className="flex w-full items-center space-x-2">
            <div className="h-2.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
          <div className="flex w-full items-center space-x-2">
            <div className="h-2.5 w-32 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <div className="flex w-full items-center space-x-2">
            <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-80 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
          <div className="flex w-full items-center space-x-2">
            <div className="h-2.5 w-60 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-40 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-row gap-x-3 w-full">
        <div className="h-5 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-5 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-5 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <div className="h-2.5 w-36 rounded-full bg-zinc-200 dark:bg-zinc-700 mt-5" />
      <div className="flex flex-row gap-x-3 w-full">
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <div className="h-2.5 w-36 rounded-full bg-zinc-200 dark:bg-zinc-700 mt-5" />
      <div className="flex flex-row gap-x-3 w-full">
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <div className="h-2.5 w-52 rounded-full bg-zinc-200 dark:bg-zinc-700 mt-5" />
      <div className="flex flex-row gap-x-3 w-full">
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-28 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);

export const Empty = () => <div>Dino not found</div>;

export const Failure = ({ error }: CellFailureProps) => {
  return (
    <div className="rw-cell-error flex items-center space-x-3">
      <svg
        className="h-12 w-12 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d="M256 304c4.406 0 8-3.578 8-8v-176c0-4.422-3.594-8-8-8S248 115.6 248 120v176C248 300.4 251.6 304 256 304zM256 352c-8.836 0-16 7.164-16 16S247.2 384 256 384s16-7.164 16-16S264.8 352 256 352zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 496c-132.3 0-240-107.7-240-240S123.7 16 256 16s240 107.7 240 240S388.3 496 256 496z" />
      </svg>
      <div className="flex flex-col">
        <p className="text-lg font-bold leading-snug">
          Some unexpected shit happend
        </p>
        <p className="text-sm">{error?.message}</p>
      </div>
    </div>
  );
};

export const Success = ({
  dino,
  itemsByIds,
}: CellSuccessProps<FindDinoById>) => {
  return (
    <>
      <MetaTags title={dino.name} description={dino.description} />
      <Dino dino={dino} itemsByIds={itemsByIds} />
    </>
  );
};
