import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

import type {
  DeleteTimelineSeasonBasespotMutationVariables,
  FindTimelineSeasonBasespotById,
} from 'types/graphql'

const DELETE_TIMELINE_SEASON_BASESPOT_MUTATION = gql`
  mutation DeleteTimelineSeasonBasespotMutation($id: BigInt!) {
    deleteTimelineSeasonBasespot(id: $id) {
      id
    }
  }
`

interface Props {
  timelineSeasonBasespot: NonNullable<
    FindTimelineSeasonBasespotById['timelineSeasonBasespot']
  >
}

const TimelineSeasonBasespot = ({ timelineSeasonBasespot }: Props) => {
  const [deleteTimelineSeasonBasespot] = useMutation(
    DELETE_TIMELINE_SEASON_BASESPOT_MUTATION,
    {
      onCompleted: () => {
        toast.success('TimelineSeasonBasespot deleted')
        navigate(routes.timelineSeasonBasespots())
      },
      onError: (error) => {
        toast.error(error.message)
      },
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
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            TimelineSeasonBasespot {timelineSeasonBasespot.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{timelineSeasonBasespot.id}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(timelineSeasonBasespot.created_at)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(timelineSeasonBasespot.updated_at)}</td>
            </tr>
            <tr>
              <th>Start date</th>
              <td>{timeTag(timelineSeasonBasespot.start_date)}</td>
            </tr>
            <tr>
              <th>End date</th>
              <td>{timeTag(timelineSeasonBasespot.end_date)}</td>
            </tr>
            <tr>
              <th>Basespot id</th>
              <td>{timelineSeasonBasespot.basespot_id}</td>
            </tr>
            <tr>
              <th>Map</th>
              <td>{timelineSeasonBasespot.map}</td>
            </tr>
            <tr>
              <th>Created by</th>
              <td>{timelineSeasonBasespot.created_by}</td>
            </tr>
            <tr>
              <th>Latitude</th>
              <td>{timelineSeasonBasespot.latitude}</td>
            </tr>
            <tr>
              <th>Longitude</th>
              <td>{timelineSeasonBasespot.longitude}</td>
            </tr>
            <tr>
              <th>Timeline season id</th>
              <td>{timelineSeasonBasespot.timeline_season_id}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editTimelineSeasonBasespot({
            id: timelineSeasonBasespot.id,
          })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(timelineSeasonBasespot.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default TimelineSeasonBasespot
