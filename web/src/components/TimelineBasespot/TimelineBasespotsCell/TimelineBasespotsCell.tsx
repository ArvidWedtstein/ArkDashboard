import type { FindTimelineBasespots } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import TimelineBasespots from 'src/components/TimelineBasespot/TimelineBasespots'

export const QUERY = gql`
  query FindTimelineBasespots {
    timelineBasespots {
      id
      created_at
      updated_at
      timeline_id
      startDate
      endDate
      basespot_id
      tribeName
      map
      server
      region
      season
      cluster
      location
      players
      created_by
      raided_by
      raidcomment
      Map {
        name
      }
      basespot {
        name
      }
      # basespot {
      #   id
      #   name
      # }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No timelineBasespots yet. '}
      <Link
        to={routes.newTimelineBasespot()}
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

export const Success = ({ timelineBasespots }: CellSuccessProps<FindTimelineBasespots>) => {
  return <TimelineBasespots timelineBasespots={timelineBasespots} />
}
