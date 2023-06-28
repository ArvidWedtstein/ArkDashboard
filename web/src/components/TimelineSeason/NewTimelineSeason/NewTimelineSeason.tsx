import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TimelineSeasonForm from 'src/components/TimelineSeason/TimelineSeasonForm'

import type { CreateTimelineSeasonInput } from 'types/graphql'

const CREATE_TIMELINE_SEASON_MUTATION = gql`
  mutation CreateTimelineSeasonMutation($input: CreateTimelineSeasonInput!) {
    createTimelineSeason(input: $input) {
      id
    }
  }
`

const NewTimelineSeason = () => {
  const [createTimelineSeason, { loading, error }] = useMutation(
    CREATE_TIMELINE_SEASON_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineSeason created')
        navigate(routes.timelineSeasons())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateTimelineSeasonInput) => {
    createTimelineSeason({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New TimelineSeason</h2>
      </header>
      <div className="rw-segment-main">
        <TimelineSeasonForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewTimelineSeason
