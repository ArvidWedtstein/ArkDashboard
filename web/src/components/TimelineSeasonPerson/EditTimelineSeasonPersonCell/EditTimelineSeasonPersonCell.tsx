import type {
  EditTimelineSeasonPersonById,
  UpdateTimelineSeasonPersonInput,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TimelineSeasonPersonForm from 'src/components/TimelineSeasonPerson/TimelineSeasonPersonForm'

export const QUERY = gql`
  query EditTimelineSeasonPersonById($id: String!) {
    timelineSeasonPerson: timelineSeasonPerson(id: $id) {
      id
      created_at
      updated_at
      user_id
      ingame_name
      timeline_season_id
    }
  }
`
const UPDATE_TIMELINE_SEASON_PERSON_MUTATION = gql`
  mutation UpdateTimelineSeasonPersonMutation(
    $id: String!
    $input: UpdateTimelineSeasonPersonInput!
  ) {
    updateTimelineSeasonPerson(id: $id, input: $input) {
      id
      created_at
      updated_at
      user_id
      ingame_name
      timeline_season_id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  timelineSeasonPerson,
}: CellSuccessProps<EditTimelineSeasonPersonById>) => {
  const [updateTimelineSeasonPerson, { loading, error }] = useMutation(
    UPDATE_TIMELINE_SEASON_PERSON_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineSeasonPerson updated')
        navigate(routes.timelineSeasonPeople())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateTimelineSeasonPersonInput,
    id: EditTimelineSeasonPersonById['timelineSeasonPerson']['id']
  ) => {
    updateTimelineSeasonPerson({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit TimelineSeasonPerson {timelineSeasonPerson?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <TimelineSeasonPersonForm
          timelineSeasonPerson={timelineSeasonPerson}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}