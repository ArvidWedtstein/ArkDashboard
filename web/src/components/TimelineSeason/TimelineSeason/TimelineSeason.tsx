import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

import type {
  DeleteTimelineSeasonMutationVariables,
  FindTimelineSeasonById,
} from 'types/graphql'

const DELETE_TIMELINE_SEASON_MUTATION = gql`
  mutation DeleteTimelineSeasonMutation($id: String!) {
    deleteTimelineSeason(id: $id) {
      id
    }
  }
`

interface Props {
  timelineSeason: NonNullable<FindTimelineSeasonById['timelineSeason']>
}

const TimelineSeason = ({ timelineSeason }: Props) => {
  const [deleteTimelineSeason] = useMutation(DELETE_TIMELINE_SEASON_MUTATION, {
    onCompleted: () => {
      toast.success('TimelineSeason deleted')
      navigate(routes.timelineSeasons())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteTimelineSeasonMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete timelineSeason ' + id + '?')) {
      deleteTimelineSeason({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            TimelineSeason {timelineSeason.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{timelineSeason.id}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(timelineSeason.created_at)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(timelineSeason.updated_at)}</td>
            </tr>
            <tr>
              <th>Server</th>
              <td>{timelineSeason.server}</td>
            </tr>
            <tr>
              <th>Season</th>
              <td>{timelineSeason.season}</td>
            </tr>
            <tr>
              <th>Tribe name</th>
              <td>{timelineSeason.tribe_name}</td>
            </tr>
            <tr>
              <th>Season start date</th>
              <td>{timeTag(timelineSeason.season_start_date)}</td>
            </tr>
            <tr>
              <th>Season end date</th>
              <td>{timeTag(timelineSeason.season_end_date)}</td>
            </tr>
            <tr>
              <th>Cluster</th>
              <td>{timelineSeason.cluster}</td>
            </tr>
            <tr>
              <th>Timeline id</th>
              <td>{timelineSeason.timeline_id}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editTimelineSeason({ id: timelineSeason.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(timelineSeason.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default TimelineSeason
