import type { FindTimelineBasespotDinoById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import TimelineBasespotDino from 'src/components/TimelineBasespotDino/TimelineBasespotDino'

export const QUERY = gql`
  query FindTimelineBasespotDinoById($id: String!) {
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
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>TimelineBasespotDino not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ timelineBasespotDino }: CellSuccessProps<FindTimelineBasespotDinoById>) => {
  return <TimelineBasespotDino timelineBasespotDino={timelineBasespotDino} />
}
