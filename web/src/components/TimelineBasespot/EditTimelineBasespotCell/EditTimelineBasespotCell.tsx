import type { EditTimelineBasespotById, UpdateTimelineBasespotInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TimelineBasespotForm from 'src/components/TimelineBasespot/TimelineBasespotForm'

export const QUERY = gql`
  query EditTimelineBasespotById($id: BigInt!) {
    timelineBasespot: timelineBasespot(id: $id) {
      id
      created_at
      updated_at
      timeline_id
      startDate
      endDate
      basespot_id
      tribeName
      map
      server
      region
      season
      cluster
      location
      players
      created_by
      raided_by
      raidcomment
    }
  }
`
const UPDATE_TIMELINE_BASESPOT_MUTATION = gql`
  mutation UpdateTimelineBasespotMutation($id: BigInt!, $input: UpdateTimelineBasespotInput!) {
    updateTimelineBasespot(id: $id, input: $input) {
      id
      created_at
      updated_at
      timeline_id
      startDate
      endDate
      basespot_id
      tribeName
      map
      server
      region
      season
      cluster
      location
      players
      created_by
      raided_by
      raidcomment
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ timelineBasespot }: CellSuccessProps<EditTimelineBasespotById>) => {
  const [updateTimelineBasespot, { loading, error }] = useMutation(
    UPDATE_TIMELINE_BASESPOT_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineBasespot updated')
        navigate(routes.timelineBasespots())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateTimelineBasespotInput,
    id: EditTimelineBasespotById['timelineBasespot']['id']
  ) => {
    updateTimelineBasespot({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit TimelineBasespot {timelineBasespot?.id}</h2>
      </header>
      <div className="rw-segment-main">
        <TimelineBasespotForm timelineBasespot={timelineBasespot} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
