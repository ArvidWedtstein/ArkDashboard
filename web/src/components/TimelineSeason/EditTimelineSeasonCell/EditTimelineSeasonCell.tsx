import type {
  EditTimelineSeasonById,
  UpdateTimelineSeasonInput,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TimelineSeasonForm from 'src/components/TimelineSeason/TimelineSeasonForm'

export const QUERY = gql`
  query EditTimelineSeasonById($id: String!) {
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
      timeline_id
    }
  }
`
const UPDATE_TIMELINE_SEASON_MUTATION = gql`
  mutation UpdateTimelineSeasonMutation(
    $id: String!
    $input: UpdateTimelineSeasonInput!
  ) {
    updateTimelineSeason(id: $id, input: $input) {
      id
      created_at
      updated_at
      server
      season
      tribe_name
      season_start_date
      season_end_date
      cluster
      timeline_id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  timelineSeason,
}: CellSuccessProps<EditTimelineSeasonById>) => {
  const [updateTimelineSeason, { loading, error }] = useMutation(
    UPDATE_TIMELINE_SEASON_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineSeason updated')
        navigate(routes.timelineSeasons())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateTimelineSeasonInput,
    id: EditTimelineSeasonById['timelineSeason']['id']
  ) => {
    updateTimelineSeason({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit TimelineSeason {timelineSeason?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <TimelineSeasonForm
          timelineSeason={timelineSeason}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
