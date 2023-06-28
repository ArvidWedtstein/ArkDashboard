import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import Table from 'src/components/Util/Table/Table'

import { QUERY } from 'src/components/TimelineSeason/TimelineSeasonsCell'
import { timeTag, truncate } from 'src/lib/formatters'

import type {
  DeleteTimelineSeasonMutationVariables,
  FindTimelineSeasons,
} from 'types/graphql'

const DELETE_TIMELINE_SEASON_MUTATION = gql`
  mutation DeleteTimelineSeasonMutation($id: String!) {
    deleteTimelineSeason(id: $id) {
      id
    }
  }
`

const TimelineSeasonsList = ({ timelineSeasons }: FindTimelineSeasons) => {
  const [deleteTimelineSeason] = useMutation(DELETE_TIMELINE_SEASON_MUTATION, {
    onCompleted: () => {
      toast.success('TimelineSeason deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteTimelineSeasonMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete timelineSeason ' + id + '?')) {
      deleteTimelineSeason({ variables: { id } })
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
            <th>Server</th>
            <th>Season</th>
            <th>Tribe name</th>
            <th>Season start date</th>
            <th>Season end date</th>
            <th>Cluster</th>
            <th>Timeline id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {timelineSeasons.map((timelineSeason) => (
            <tr key={timelineSeason.id}>
              <td>{truncate(timelineSeason.id)}</td>
              <td>{timeTag(timelineSeason.created_at)}</td>
              <td>{timeTag(timelineSeason.updated_at)}</td>
              <td>{truncate(timelineSeason.server)}</td>
              <td>{truncate(timelineSeason.season)}</td>
              <td>{truncate(timelineSeason.tribe_name)}</td>
              <td>{timeTag(timelineSeason.season_start_date)}</td>
              <td>{timeTag(timelineSeason.season_end_date)}</td>
              <td>{truncate(timelineSeason.cluster)}</td>
              <td>{truncate(timelineSeason.timeline_id)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.timelineSeason({ id: timelineSeason.id })}
                    title={
                      'Show timelineSeason ' + timelineSeason.id + ' detail'
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editTimelineSeason({ id: timelineSeason.id })}
                    title={'Edit timelineSeason ' + timelineSeason.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete timelineSeason ' + timelineSeason.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(timelineSeason.id)}
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

export default TimelineSeasonsList
