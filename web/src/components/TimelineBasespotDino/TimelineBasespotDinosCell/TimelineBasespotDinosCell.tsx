import type { FindTimelineBasespotDinos } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import TimelineBasespotDinos from 'src/components/TimelineBasespotDino/TimelineBasespotDinos'

export const QUERY = gql`
  query FindTimelineBasespotDinos {
    timelineBasespotDinos {
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

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No timelineBasespotDinos yet. '}
      <Link
        to={routes.newTimelineBasespotDino()}
        className="rw-link"
      >
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ timelineBasespotDinos }: CellSuccessProps<FindTimelineBasespotDinos>) => {
  return <TimelineBasespotDinos timelineBasespotDinos={timelineBasespotDinos} />
}
