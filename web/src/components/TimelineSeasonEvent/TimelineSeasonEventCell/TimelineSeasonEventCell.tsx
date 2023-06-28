import type { FindTimelineSeasonEventById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import TimelineSeasonEvent from 'src/components/TimelineSeasonEvent/TimelineSeasonEvent'

export const QUERY = gql`
  query FindTimelineSeasonEventById($id: String!) {
    timelineSeasonEvent: timelineSeasonEvent(id: $id) {
      id
      created_at
      updated_at
      timeline_season_id
      title
      content
      map_id
      latitude
      longitude
      images
      created_by
      tags
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>TimelineSeasonEvent not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  timelineSeasonEvent,
}: CellSuccessProps<FindTimelineSeasonEventById>) => {
  return <TimelineSeasonEvent timelineSeasonEvent={timelineSeasonEvent} />
}
