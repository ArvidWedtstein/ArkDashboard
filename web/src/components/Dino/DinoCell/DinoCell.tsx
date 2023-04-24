import type { FindDinoById, FindItems } from "types/graphql";

import { CellSuccessProps, CellFailureProps, MetaTags } from "@redwoodjs/web";

import Dino from "src/components/Dino/Dino";

// export const QUERY = gql`
//   query FindDinoById($id: String!) {
//     dino: dino(id: $id) {
//       id
//       created_at
//       name
//       synonyms
//       description
//       taming_notice
//       can_destroy
//       immobilized_by
//       base_stats
//       gather_eff
//       exp_per_kill
//       fits_through
//       egg_min
//       egg_max
//       tdps
//       eats
//       maturation_time
//       weight_reduction
//       incubation_time
//       affinity_needed
//       aff_inc
//       flee_threshold
//       hitboxes
//       drops
//       food_consumption_base
//       food_consumption_mult
//       disable_ko
//       violent_tame
//       taming_bonus_attr
//       disable_food
//       disable_mult
//       admin_note
//       base_points
//       non_violent_food_affinity_mult
//       non_violent_food_rate_mult
//       taming_interval
//       base_taming_time
//       disable_tame
//       x_variant
//       attack
//       mounted_weaponry
//       ridable
//       flyer_dino
//       water_dino
//       movement
//       type
//       carryable_by
//     }
//   }
// `

// TODO: Optimize this query
// Does not need to fetch every single item
export const QUERY = gql`
  query FindDinoById($id: String!) {
    dino: dino(id: $id) {
      id
      created_at
      name
      synonyms
      description
      taming_notice
      can_destroy
      immobilized_by
      base_stats
      gather_eff
      exp_per_kill
      fits_through
      egg_min
      egg_max
      tdps
      eats
      maturation_time
      weight_reduction
      incubation_time
      affinity_needed
      aff_inc
      flee_threshold
      hitboxes
      drops
      food_consumption_base
      food_consumption_mult
      disable_ko
      violent_tame
      taming_bonus_attr
      disable_food
      disable_mult
      admin_note
      base_points
      non_violent_food_affinity_mult
      non_violent_food_rate_mult
      taming_interval
      base_taming_time
      disable_tame
      x_variant
      attack
      mounted_weaponry
      ridable
      flyer_dino
      water_dino
      movement
      type
      carryable_by
      image
      icon
      DinoStat {
        item_id
        Item {
          name
          id
          image
          stats
        }
        value
        rank
        type
      }
    }
  }
`;
export const afterQuery = (data) => {
  return {
    dino: {
      ...data.dino,
      weight_reduction:
        data.dino.DinoStat &&
        data.dino.DinoStat.filter((d) => d.type == "weight_reduction"),
      gather_eff:
        data.dino.DinoStat &&
        data.dino.DinoStat.filter((d) => d.type == "gather_efficiency"),
      eats:
        data.dino.DinoStat &&
        data.dino.DinoStat.filter((d) => d.type == "food"),
      drops:
        data.dino.DinoStat &&
        data.dino.DinoStat.filter((d) => d.type == "drops"),
      fits_through:
        data.dino.DinoStat &&
        data.dino.DinoStat.filter((d) => d.type == "fits_through"),
      immobilized_by:
        data.dino.DinoStat &&
        data.dino.DinoStat.filter((d) => d.type == "immobilized_by"),
    },
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
}: CellSuccessProps<FindDinoById> & CellSuccessProps<FindItems>) => {
  return (
    <>
      <MetaTags title={dino.name} description={dino.description} />
      <Dino dino={dino} />
    </>
  );
};
