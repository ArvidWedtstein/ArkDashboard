import type { EditTimelineBasespotDinoById, UpdateTimelineBasespotDinoInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TimelineBasespotDinoForm from 'src/components/TimelineBasespotDino/TimelineBasespotDinoForm'

export const QUERY = gql`
  query EditTimelineBasespotDinoById($id: String!) {
    timelineBasespotDino: timelineBasespotDino(id: $id) {
      id
      created_at
      updated_at
      timelinebasespot_id
      dino_id
      name
      birth_date
      death_date
      death_cause
      level_wild
      level
      health
      stamina
      oxygen
      food
      weight
      melee_damage
      movement_speed
      torpor
      gender
      wild_health
      wild_stamina
      wild_oxygen
      wild_food
      wild_weight
      wild_melee_damage
      wild_movement_speed
      wild_torpor
    }
  }
`
const UPDATE_TIMELINE_BASESPOT_DINO_MUTATION = gql`
  mutation UpdateTimelineBasespotDinoMutation($id: String!, $input: UpdateTimelineBasespotDinoInput!) {
    updateTimelineBasespotDino(id: $id, input: $input) {
      id
      created_at
      updated_at
      timelinebasespot_id
      dino_id
      name
      birth_date
      death_date
      death_cause
      level_wild
      level
      health
      stamina
      oxygen
      food
      weight
      melee_damage
      movement_speed
      torpor
      gender
      wild_health
      wild_stamina
      wild_oxygen
      wild_food
      wild_weight
      wild_melee_damage
      wild_movement_speed
      wild_torpor
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ timelineBasespotDino }: CellSuccessProps<EditTimelineBasespotDinoById>) => {
  const [updateTimelineBasespotDino, { loading, error }] = useMutation(
    UPDATE_TIMELINE_BASESPOT_DINO_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineBasespotDino updated')
        navigate(routes.timelineBasespotDinos())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateTimelineBasespotDinoInput,
    id: EditTimelineBasespotDinoById['timelineBasespotDino']['id']
  ) => {
    updateTimelineBasespotDino({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit TimelineBasespotDino {timelineBasespotDino?.id}</h2>
      </header>
      <div className="rw-segment-main">
        <TimelineBasespotDinoForm timelineBasespotDino={timelineBasespotDino} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
