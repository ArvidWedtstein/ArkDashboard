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

const timelineBasespots = [{ "id": 1, "created_at": "2022-12-28T13:39:51+00:00", "updated_at": "2023-03-05T13:46:38.117918+00:00", "timeline_id": "76e83e7e-0e05-4c70-a3ab-3ec8a30d1c87", "startDate": "2021-07-02T00:00:00+00:00", "endDate": null, "basespot_id": null, "tribeName": "DinkleDonk", "map": 5, "server": "Bloody Ark", "region": "NA", "season": "13", "cluster": "PVP", "location": { "lat": 44, "lon": 65 }, "players": ["SussyBaka", "Sevul", "Ravioli", "Bass_Gamer"], "created_by": "7a2878d1-4f61-456d-bcb6-edc707383ea8", "raided_by": null, "raidcomment": null, "Map": { id: 1, name: 'Valguero' } }]
export const Failure = ({ error }: CellFailureProps) => (
  // <div className="rw-cell-error">{error?.message}</div>
  <TimelineBasespots timelineBasespots={timelineBasespots} />
)

export const Success = ({ timelineBasespots }: CellSuccessProps<FindTimelineBasespots>) => {
  return <TimelineBasespots timelineBasespots={timelineBasespots} />
}
