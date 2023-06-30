import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TimelineSeasonPersonForm from 'src/components/TimelineSeasonPerson/TimelineSeasonPersonForm'

import type { CreateTimelineSeasonPersonInput } from 'types/graphql'

const CREATE_TIMELINE_SEASON_PERSON_MUTATION = gql`
  mutation CreateTimelineSeasonPersonMutation(
    $input: CreateTimelineSeasonPersonInput!
  ) {
    createTimelineSeasonPerson(input: $input) {
      id
    }
  }
`

const NewTimelineSeasonPerson = ({ timeline_season_id }: { timeline_season_id: string }) => {
  const [createTimelineSeasonPerson, { loading, error }] = useMutation(
    CREATE_TIMELINE_SEASON_PERSON_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineSeasonPerson created')
        navigate(routes.timelineSeasonPeople())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateTimelineSeasonPersonInput) => {
    createTimelineSeasonPerson({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <div className="rw-segment-main">
        <TimelineSeasonPersonForm
          timeline_season_id={timeline_season_id}
          onSave={onSave}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}

export default NewTimelineSeasonPerson
