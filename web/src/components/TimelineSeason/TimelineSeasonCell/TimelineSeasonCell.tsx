import type { FindTimelineSeasonById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import TimelineSeason from 'src/components/TimelineSeason/TimelineSeason'

export const QUERY = gql`
  query FindTimelineSeasonById($id: String!) {
    timelineSeason: timelineSeason(id: $id) {
      id
      created_at
      updated_at
      server
      season
      tribe_name
      season_start_date
      season_end_date
      cluster
      TimelineSeasonBasespot {
        id
        Map {
          name
        }
      }
      TimelineSeasonEvent {
        id
        title
        content
        tags
        created_at
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>TimelineSeason not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  timelineSeason,
}: CellSuccessProps<FindTimelineSeasonById>) => {
  return <TimelineSeason timelineSeason={timelineSeason} />
}
