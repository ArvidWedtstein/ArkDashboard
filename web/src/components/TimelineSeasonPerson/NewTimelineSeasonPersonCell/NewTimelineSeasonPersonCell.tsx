import type {
  CreateTimelineSeasonPersonInput,
  NewTimelineSeasonPerson,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TimelineSeasonPersonForm from 'src/components/TimelineSeasonPerson/TimelineSeasonPersonForm'

export const QUERY = gql`
  query NewTimelineSeasonPerson {
    profiles {
      id,
      username
    }
  }
`
const CREATE_TIMELINE_SEASON_PERSON_MUTATION = gql`
  mutation CreateTimelineSeasonPersonMutation(
    $input: CreateTimelineSeasonPersonInput!
  ) {
    createTimelineSeasonPerson(input: $input) {
      id
    }
  }
`

export const beforeQuery = (props: { timeline_season_id: string }) => {
  return { variables: props };
}

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  profiles,
  queryResult,
}: CellSuccessProps<NewTimelineSeasonPerson>) => {
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
          timeline_season_id={queryResult.variables.timeline_season_id}
          profiles={profiles}
          onSave={onSave}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}
