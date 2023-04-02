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
//       water_movement
//       admin_note
//       base_points
//       method
//       knockout
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
  query ($id: String!) {
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
      water_movement
      admin_note
      base_points
      method
      knockout
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
      DinoStat {
        item_id
        Item {
          name
          id
          image
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
      gather_efficiency:
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
export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Dino not found</div>;

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
);

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
