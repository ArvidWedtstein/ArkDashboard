import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TimelineBasespotDinoForm from 'src/components/TimelineBasespotDino/TimelineBasespotDinoForm'

import type { CreateTimelineBasespotDinoInput } from 'types/graphql'

const CREATE_TIMELINE_BASESPOT_DINO_MUTATION = gql`
  mutation CreateTimelineBasespotDinoMutation($input: CreateTimelineBasespotDinoInput!) {
    createTimelineBasespotDino(input: $input) {
      id
    }
  }
`

const NewTimelineBasespotDino = () => {
  const [createTimelineBasespotDino, { loading, error }] = useMutation(
    CREATE_TIMELINE_BASESPOT_DINO_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineBasespotDino created')
        navigate(routes.timelineBasespotDinos())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateTimelineBasespotDinoInput) => {
    createTimelineBasespotDino({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New TimelineBasespotDino</h2>
      </header>
      <div className="rw-segment-main">
        <TimelineBasespotDinoForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewTimelineBasespotDino
