import type { EditDinoById, UpdateDinoInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import DinoForm from 'src/components/Dino/DinoForm'

export const QUERY = gql`
  query EditDinoById($id: String!) {
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
      attack
      mounted_weaponry
      ridable
      flyer_dino
      water_dino
    }
  }
`
const UPDATE_DINO_MUTATION = gql`
  mutation UpdateDinoMutation($id: String!, $input: UpdateDinoInput!) {
    updateDino(id: $id, input: $input) {
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
      attack
      mounted_weaponry
      ridable
      flyer_dino
      water_dino
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ dino }: CellSuccessProps<EditDinoById>) => {
  const [updateDino, { loading, error }] = useMutation(
    UPDATE_DINO_MUTATION,
    {
      onCompleted: () => {
        toast.success('Dino updated')
        navigate(routes.dinos())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateDinoInput,
    id: EditDinoById['dino']['id']
  ) => {
    updateDino({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit Dino {dino?.name}</h2>
      </header>
      <div className="rw-segment-main">
        <DinoForm dino={dino} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
