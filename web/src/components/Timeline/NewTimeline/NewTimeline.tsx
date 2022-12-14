import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TimelineForm from 'src/components/Timeline/TimelineForm'

import type { CreateTimelineInput } from 'types/graphql'

const CREATE_TIMELINE_MUTATION = gql`
  mutation CreateTimelineMutation($input: CreateTimelineInput!) {
    createTimeline(input: $input) {
      id
    }
  }
`

const NewTimeline = () => {
  const [createTimeline, { loading, error }] = useMutation(
    CREATE_TIMELINE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Timeline created')
        navigate(routes.timelines())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateTimelineInput) => {
    createTimeline({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Timeline</h2>
      </header>
      <div className="rw-segment-main">
        <button onClick={() => { onSave({createdBy: ''})}} className="rw-button rw-button-green">Save</button>
      </div>
    </div>
  )
}

export default NewTimeline
