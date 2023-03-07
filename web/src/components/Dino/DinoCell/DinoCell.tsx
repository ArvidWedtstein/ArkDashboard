import type { FindDinoById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Dino from 'src/components/Dino/Dino'

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
      water_movement
      admin_note
      base_points
      method
      knockout
      non_violent_food_affinity_mult
      non_violent_food_rate_mult
      taming_interval
      base_taming_time
      exp_per_kill_adj
      disable_tame
      x_variant
      # rideable
      # mounted_weaponry
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Dino not found</div>


export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ dino }: CellSuccessProps<FindDinoById>) => {
  return <Dino dino={dino} />
}
