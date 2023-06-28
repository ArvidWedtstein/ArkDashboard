import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

import type {
  DeleteTimelineSeasonEventMutationVariables,
  FindTimelineSeasonEventById,
} from 'types/graphql'

const DELETE_TIMELINE_SEASON_EVENT_MUTATION = gql`
  mutation DeleteTimelineSeasonEventMutation($id: String!) {
    deleteTimelineSeasonEvent(id: $id) {
      id
    }
  }
`

interface Props {
  timelineSeasonEvent: NonNullable<
    FindTimelineSeasonEventById['timelineSeasonEvent']
  >
}

const TimelineSeasonEvent = ({ timelineSeasonEvent }: Props) => {
  const [deleteTimelineSeasonEvent] = useMutation(
    DELETE_TIMELINE_SEASON_EVENT_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineSeasonEvent deleted')
        navigate(routes.timelineSeasonEvents())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onDeleteClick = (
    id: DeleteTimelineSeasonEventMutationVariables['id']
  ) => {
    if (
      confirm('Are you sure you want to delete timelineSeasonEvent ' + id + '?')
    ) {
      deleteTimelineSeasonEvent({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            TimelineSeasonEvent {timelineSeasonEvent.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{timelineSeasonEvent.id}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(timelineSeasonEvent.created_at)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(timelineSeasonEvent.updated_at)}</td>
            </tr>
            <tr>
              <th>Timeline season id</th>
              <td>{timelineSeasonEvent.timeline_season_id}</td>
            </tr>
            <tr>
              <th>Title</th>
              <td>{timelineSeasonEvent.title}</td>
            </tr>
            <tr>
              <th>Content</th>
              <td>{timelineSeasonEvent.content}</td>
            </tr>
            <tr>
              <th>Map id</th>
              <td>{timelineSeasonEvent.map_id}</td>
            </tr>
            <tr>
              <th>Latitude</th>
              <td>{timelineSeasonEvent.latitude}</td>
            </tr>
            <tr>
              <th>Longitude</th>
              <td>{timelineSeasonEvent.longitude}</td>
            </tr>
            <tr>
              <th>Images</th>
              <td>{timelineSeasonEvent.images}</td>
            </tr>
            <tr>
              <th>Created by</th>
              <td>{timelineSeasonEvent.created_by}</td>
            </tr>
            <tr>
              <th>Tags</th>
              <td>{timelineSeasonEvent.tags}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editTimelineSeasonEvent({ id: timelineSeasonEvent.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(timelineSeasonEvent.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default TimelineSeasonEvent
