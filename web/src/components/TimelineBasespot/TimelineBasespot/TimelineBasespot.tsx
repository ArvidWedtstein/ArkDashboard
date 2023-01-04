
import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { jsonDisplay, timeTag,  } from 'src/lib/formatters'

import type { DeleteTimelineBasespotMutationVariables, FindTimelineBasespotById } from 'types/graphql'

const DELETE_TIMELINE_BASESPOT_MUTATION = gql`
  mutation DeleteTimelineBasespotMutation($id: BigInt!) {
    deleteTimelineBasespot(id: $id) {
      id
    }
  }
`

interface Props {
  timelineBasespot: NonNullable<FindTimelineBasespotById['timelineBasespot']>
}

const TimelineBasespot = ({ timelineBasespot }: Props) => {
  const [deleteTimelineBasespot] = useMutation(DELETE_TIMELINE_BASESPOT_MUTATION, {
    onCompleted: () => {
      toast.success('TimelineBasespot deleted')
      navigate(routes.timelineBasespots())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteTimelineBasespotMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete timelineBasespot ' + id + '?')) {
      deleteTimelineBasespot({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            TimelineBasespot {timelineBasespot.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{timelineBasespot.id}</td>
            </tr><tr>
              <th>Created at</th>
              <td>{timeTag(timelineBasespot.created_at)}</td>
            </tr><tr>
              <th>Updated at</th>
              <td>{timeTag(timelineBasespot.updated_at)}</td>
            </tr><tr>
              <th>Timeline id</th>
              <td>{timelineBasespot.timeline_id}</td>
            </tr><tr>
              <th>Start date</th>
              <td>{timeTag(timelineBasespot.startDate)}</td>
            </tr><tr>
              <th>End date</th>
              <td>{timeTag(timelineBasespot.endDate)}</td>
            </tr><tr>
              <th>Basespot id</th>
              <td>{timelineBasespot.basespot_id}</td>
            </tr><tr>
              <th>Tribe name</th>
              <td>{timelineBasespot.tribeName}</td>
            </tr><tr>
              <th>Map</th>
              <td>{timelineBasespot.map}</td>
            </tr><tr>
              <th>Server</th>
              <td>{timelineBasespot.server}</td>
            </tr><tr>
              <th>Region</th>
              <td>{timelineBasespot.region}</td>
            </tr><tr>
              <th>Season</th>
              <td>{timelineBasespot.season}</td>
            </tr><tr>
              <th>Cluster</th>
              <td>{timelineBasespot.cluster}</td>
            </tr><tr>
              <th>Location</th>
              <td>{jsonDisplay(timelineBasespot.location)}</td>
            </tr><tr>
              <th>Players</th>
              <td>{timelineBasespot.players}</td>
            </tr><tr>
              <th>Created by</th>
              <td>{timelineBasespot.created_by}</td>
            </tr><tr>
              <th>Raided by</th>
              <td>{timelineBasespot.raided_by}</td>
            </tr><tr>
              <th>Raidcomment</th>
              <td>{timelineBasespot.raidcomment}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editTimelineBasespot({ id: timelineBasespot.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(timelineBasespot.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default TimelineBasespot
