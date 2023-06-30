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
      tdps
      maturation_time
      incubation_time
      affinity_needed
      aff_inc
      flee_threshold
      hitboxes
      food_consumption_base
      food_consumption_mult
      violent_tame
      taming_ineffectiveness
      disable_mult
      non_violent_food_rate_mult
      taming_interval
      tamable
      base_taming_time
      x_variant
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
export const Loading = () => (
  <div className="flex h-full w-full items-center justify-center bg-transparent">
    <span className="inline-block h-16 w-16 animate-spin rounded-full border-t-4 border-r-2 border-black border-transparent dark:border-white"></span>
  </div>
);

export const Empty = () => <div>Dino not found</div>;

export const Failure = ({ error }: CellFailureProps) => {
  return (
    <div className="rw-cell-error animate-fly-in flex items-center space-x-3">
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

// CellSuccessProps<FindDinoById> & CellSuccessProps<FindItems>
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
