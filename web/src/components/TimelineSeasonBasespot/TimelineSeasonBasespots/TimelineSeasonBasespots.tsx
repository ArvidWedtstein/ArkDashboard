import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import Table from 'src/components/Util/Table/Table'

import { QUERY } from 'src/components/TimelineSeasonBasespot/TimelineSeasonBasespotsCell'
import { timeTag, truncate } from 'src/lib/formatters'

import type {
  DeleteTimelineSeasonBasespotMutationVariables,
  FindTimelineSeasonBasespots,
} from 'types/graphql'

const DELETE_TIMELINE_SEASON_BASESPOT_MUTATION = gql`
  mutation DeleteTimelineSeasonBasespotMutation($id: BigInt!) {
    deleteTimelineSeasonBasespot(id: $id) {
      id
    }
  }
`

const TimelineSeasonBasespotsList = ({
  timelineSeasonBasespots,
}: FindTimelineSeasonBasespots) => {
  const [deleteTimelineSeasonBasespot] = useMutation(
    DELETE_TIMELINE_SEASON_BASESPOT_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineSeasonBasespot deleted')
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
    id: DeleteTimelineSeasonBasespotMutationVariables['id']
  ) => {
    if (
      confirm(
        'Are you sure you want to delete timelineSeasonBasespot ' + id + '?'
      )
    ) {
      deleteTimelineSeasonBasespot({ variables: { id } })
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
            <th>Start date</th>
            <th>End date</th>
            <th>Basespot id</th>
            <th>Map</th>
            <th>Created by</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Timeline season id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {timelineSeasonBasespots.map((timelineSeasonBasespot) => (
            <tr key={timelineSeasonBasespot.id}>
              <td>{truncate(timelineSeasonBasespot.id)}</td>
              <td>{timeTag(timelineSeasonBasespot.created_at)}</td>
              <td>{timeTag(timelineSeasonBasespot.updated_at)}</td>
              <td>{timeTag(timelineSeasonBasespot.start_date)}</td>
              <td>{timeTag(timelineSeasonBasespot.end_date)}</td>
              <td>{truncate(timelineSeasonBasespot.basespot_id)}</td>
              <td>{truncate(timelineSeasonBasespot.map)}</td>
              <td>{truncate(timelineSeasonBasespot.created_by)}</td>
              <td>{truncate(timelineSeasonBasespot.latitude)}</td>
              <td>{truncate(timelineSeasonBasespot.longitude)}</td>
              <td>{truncate(timelineSeasonBasespot.timeline_season_id)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.timelineSeasonBasespot({
                      id: timelineSeasonBasespot.id,
                    })}
                    title={
                      'Show timelineSeasonBasespot ' +
                      timelineSeasonBasespot.id +
                      ' detail'
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editTimelineSeasonBasespot({
                      id: timelineSeasonBasespot.id,
                    })}
                    title={
                      'Edit timelineSeasonBasespot ' + timelineSeasonBasespot.id
                    }
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={
                      'Delete timelineSeasonBasespot ' +
                      timelineSeasonBasespot.id
                    }
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(timelineSeasonBasespot.id)}
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

export default TimelineSeasonBasespotsList
