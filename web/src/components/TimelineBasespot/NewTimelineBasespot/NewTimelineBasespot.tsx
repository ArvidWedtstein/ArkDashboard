import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TimelineBasespotForm from 'src/components/TimelineBasespot/TimelineBasespotForm'

import type { CreateTimelineBasespotInput } from 'types/graphql'

const CREATE_TIMELINE_BASESPOT_MUTATION = gql`
  mutation CreateTimelineBasespotMutation($input: CreateTimelineBasespotInput!) {
    createTimelineBasespot(input: $input) {
      id
    }
  }
`

const NewTimelineBasespot = ({ id }) => {
  const [createTimelineBasespot, { loading, error }] = useMutation(
    CREATE_TIMELINE_BASESPOT_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineBasespot created')
        navigate(routes.timelineBasespots())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateTimelineBasespotInput) => {
    createTimelineBasespot({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New TimelineBasespot</h2>
      </header>
      <div className="rw-segment-main">
        <TimelineBasespotForm onSave={onSave} loading={loading} error={error} id={id} />
      </div>
    </div>
  )
}

export default NewTimelineBasespot
