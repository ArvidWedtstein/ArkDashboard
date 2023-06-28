import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TimelineSeasonEventForm from 'src/components/TimelineSeasonEvent/TimelineSeasonEventForm'

import type { CreateTimelineSeasonEventInput } from 'types/graphql'

const CREATE_TIMELINE_SEASON_EVENT_MUTATION = gql`
  mutation CreateTimelineSeasonEventMutation(
    $input: CreateTimelineSeasonEventInput!
  ) {
    createTimelineSeasonEvent(input: $input) {
      id
    }
  }
`

const NewTimelineSeasonEvent = () => {
  const [createTimelineSeasonEvent, { loading, error }] = useMutation(
    CREATE_TIMELINE_SEASON_EVENT_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineSeasonEvent created')
        navigate(routes.timelineSeasonEvents())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateTimelineSeasonEventInput) => {
    createTimelineSeasonEvent({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          New TimelineSeasonEvent
        </h2>
      </header>
      <div className="rw-segment-main">
        <TimelineSeasonEventForm
          onSave={onSave}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}

export default NewTimelineSeasonEvent
