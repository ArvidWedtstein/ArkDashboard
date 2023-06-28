import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TimelineSeasonBasespotForm from 'src/components/TimelineSeasonBasespot/TimelineSeasonBasespotForm'

import type { CreateTimelineSeasonBasespotInput } from 'types/graphql'

const CREATE_TIMELINE_SEASON_BASESPOT_MUTATION = gql`
  mutation CreateTimelineSeasonBasespotMutation(
    $input: CreateTimelineSeasonBasespotInput!
  ) {
    createTimelineSeasonBasespot(input: $input) {
      id
    }
  }
`

const NewTimelineSeasonBasespot = () => {
  const [createTimelineSeasonBasespot, { loading, error }] = useMutation(
    CREATE_TIMELINE_SEASON_BASESPOT_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineSeasonBasespot created')
        navigate(routes.timelineSeasonBasespots())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateTimelineSeasonBasespotInput) => {
    createTimelineSeasonBasespot({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          New TimelineSeasonBasespot
        </h2>
      </header>
      <div className="rw-segment-main">
        <TimelineSeasonBasespotForm
          onSave={onSave}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}

export default NewTimelineSeasonBasespot
