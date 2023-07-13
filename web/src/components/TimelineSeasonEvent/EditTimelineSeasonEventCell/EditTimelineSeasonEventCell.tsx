import type {
  EditTimelineSeasonEventById,
  UpdateTimelineSeasonEventInput,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TimelineSeasonEventForm from 'src/components/TimelineSeasonEvent/TimelineSeasonEventForm'

export const QUERY = gql`
  query EditTimelineSeasonEventById($id: String!) {
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
const UPDATE_TIMELINE_SEASON_EVENT_MUTATION = gql`
  mutation UpdateTimelineSeasonEventMutation(
    $id: String!
    $input: UpdateTimelineSeasonEventInput!
  ) {
    updateTimelineSeasonEvent(id: $id, input: $input) {
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

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  timelineSeasonEvent,
}: CellSuccessProps<EditTimelineSeasonEventById>) => {
  const [updateTimelineSeasonEvent, { loading, error }] = useMutation(
    UPDATE_TIMELINE_SEASON_EVENT_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineSeasonEvent updated')
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateTimelineSeasonEventInput,
    id: EditTimelineSeasonEventById['timelineSeasonEvent']['id']
  ) => {
    updateTimelineSeasonEvent({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Event {timelineSeasonEvent?.title}
        </h2>
      </header>
      <div className="rw-segment-main">
        <TimelineSeasonEventForm
          timelineSeasonEvent={timelineSeasonEvent}
          timeline_season_id={timelineSeasonEvent?.timeline_season_id}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
