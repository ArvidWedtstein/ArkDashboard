import type { FindTimelineBasespotById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import TimelineBasespot from 'src/components/TimelineBasespot/TimelineBasespot'
import { supabase } from 'src/App'

export const QUERY = gql`
  query FindTimelineBasespotById($id: BigInt!) {
    timelineBasespot: timelineBasespot(id: $id) {
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
        latitude
        longitude
      }
    }
  }
`

export const afterQuery = (data) => {
  return data.timelineBasespot.basespot_id !== null ? {
    ...data,
    timelineBasespot: {
      ...data.timelineBasespot,
      location: {
        lat: data.timelineBasespot.basespot.latitude,
        lon: data.timelineBasespot.basespot.longitude,
      },
    },
  } : data
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>TimelineBasespot not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ timelineBasespot }: CellSuccessProps<FindTimelineBasespotById>) => {
  return <TimelineBasespot timelineBasespot={timelineBasespot} />
}
