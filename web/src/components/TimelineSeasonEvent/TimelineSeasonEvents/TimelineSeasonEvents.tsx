import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import Table from 'src/components/Util/Table/Table'

import { QUERY } from 'src/components/TimelineSeasonEvent/TimelineSeasonEventsCell'
import { timeTag, truncate } from 'src/lib/formatters'

import type {
  DeleteTimelineSeasonEventMutationVariables,
  FindTimelineSeasonEvents,
} from 'types/graphql'

const DELETE_TIMELINE_SEASON_EVENT_MUTATION = gql`
  mutation DeleteTimelineSeasonEventMutation($id: String!) {
    deleteTimelineSeasonEvent(id: $id) {
      id
    }
  }
`

const TimelineSeasonEventsList = ({
  timelineSeasonEvents,
}: FindTimelineSeasonEvents) => {
  const [deleteTimelineSeasonEvent] = useMutation(
    DELETE_TIMELINE_SEASON_EVENT_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineSeasonEvent deleted')
      },
      onError: (error) => {
        toast.error(error.message)
      },
      // This refetches the query on the list page. Read more about other ways to
      // update the cache over here:
      // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
      refetchQueries: [{ query: QUERY }],
      awaitRefetchQueries: true,
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
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Timeline season id</th>
            <th>Title</th>
            <th>Content</th>
            <th>Map id</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Images</th>
            <th>Created by</th>
            <th>Tags</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {timelineSeasonEvents.map((timelineSeasonEvent) => (
            <tr key={timelineSeasonEvent.id}>
              <td>{truncate(timelineSeasonEvent.id)}</td>
              <td>{timeTag(timelineSeasonEvent.created_at)}</td>
              <td>{timeTag(timelineSeasonEvent.updated_at)}</td>
              <td>{truncate(timelineSeasonEvent.timeline_season_id)}</td>
              <td>{truncate(timelineSeasonEvent.title)}</td>
              <td>{truncate(timelineSeasonEvent.content)}</td>
              <td>{truncate(timelineSeasonEvent.map_id)}</td>
              <td>{truncate(timelineSeasonEvent.latitude)}</td>
              <td>{truncate(timelineSeasonEvent.longitude)}</td>
              <td>{truncate(timelineSeasonEvent.images)}</td>
              <td>{truncate(timelineSeasonEvent.created_by)}</td>
              <td>{truncate(timelineSeasonEvent.tags)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.timelineSeasonEvent({
                      id: timelineSeasonEvent.id,
                    })}
                    title={
                      'Show timelineSeasonEvent ' +
                      timelineSeasonEvent.id +
                      ' detail'
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editTimelineSeasonEvent({
                      id: timelineSeasonEvent.id,
                    })}
                    title={'Edit timelineSeasonEvent ' + timelineSeasonEvent.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={
                      'Delete timelineSeasonEvent ' + timelineSeasonEvent.id
                    }
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(timelineSeasonEvent.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TimelineSeasonEventsList
