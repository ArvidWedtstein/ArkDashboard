
import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag,  } from 'src/lib/formatters'

import type { DeleteTimelineBasespotDinoMutationVariables, FindTimelineBasespotDinoById } from 'types/graphql'

const DELETE_TIMELINE_BASESPOT_DINO_MUTATION = gql`
  mutation DeleteTimelineBasespotDinoMutation($id: String!) {
    deleteTimelineBasespotDino(id: $id) {
      id
    }
  }
`

interface Props {
  timelineBasespotDino: NonNullable<FindTimelineBasespotDinoById['timelineBasespotDino']>
}

const TimelineBasespotDino = ({ timelineBasespotDino }: Props) => {
  const [deleteTimelineBasespotDino] = useMutation(DELETE_TIMELINE_BASESPOT_DINO_MUTATION, {
    onCompleted: () => {
      toast.success('TimelineBasespotDino deleted')
      navigate(routes.timelineBasespotDinos())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteTimelineBasespotDinoMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete timelineBasespotDino ' + id + '?')) {
      deleteTimelineBasespotDino({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            TimelineBasespotDino {timelineBasespotDino.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{timelineBasespotDino.id}</td>
            </tr><tr>
              <th>Created at</th>
              <td>{timeTag(timelineBasespotDino.created_at)}</td>
            </tr><tr>
              <th>Updated at</th>
              <td>{timeTag(timelineBasespotDino.updated_at)}</td>
            </tr><tr>
              <th>Timelinebasespot id</th>
              <td>{timelineBasespotDino.timelinebasespot_id}</td>
            </tr><tr>
              <th>Dino id</th>
              <td>{timelineBasespotDino.dino_id}</td>
            </tr><tr>
              <th>Name</th>
              <td>{timelineBasespotDino.name}</td>
            </tr><tr>
              <th>Birth date</th>
              <td>{timeTag(timelineBasespotDino.birth_date)}</td>
            </tr><tr>
              <th>Death date</th>
              <td>{timeTag(timelineBasespotDino.death_date)}</td>
            </tr><tr>
              <th>Death cause</th>
              <td>{timelineBasespotDino.death_cause}</td>
            </tr><tr>
              <th>Level wild</th>
              <td>{timelineBasespotDino.level_wild}</td>
            </tr><tr>
              <th>Level</th>
              <td>{timelineBasespotDino.level}</td>
            </tr><tr>
              <th>Health</th>
              <td>{timelineBasespotDino.health}</td>
            </tr><tr>
              <th>Stamina</th>
              <td>{timelineBasespotDino.stamina}</td>
            </tr><tr>
              <th>Oxygen</th>
              <td>{timelineBasespotDino.oxygen}</td>
            </tr><tr>
              <th>Food</th>
              <td>{timelineBasespotDino.food}</td>
            </tr><tr>
              <th>Weight</th>
              <td>{timelineBasespotDino.weight}</td>
            </tr><tr>
              <th>Melee damage</th>
              <td>{timelineBasespotDino.melee_damage}</td>
            </tr><tr>
              <th>Movement speed</th>
              <td>{timelineBasespotDino.movement_speed}</td>
            </tr><tr>
              <th>Torpor</th>
              <td>{timelineBasespotDino.torpor}</td>
            </tr><tr>
              <th>Gender</th>
              <td>{timelineBasespotDino.gender}</td>
            </tr><tr>
              <th>Wild health</th>
              <td>{timelineBasespotDino.wild_health}</td>
            </tr><tr>
              <th>Wild stamina</th>
              <td>{timelineBasespotDino.wild_stamina}</td>
            </tr><tr>
              <th>Wild oxygen</th>
              <td>{timelineBasespotDino.wild_oxygen}</td>
            </tr><tr>
              <th>Wild food</th>
              <td>{timelineBasespotDino.wild_food}</td>
            </tr><tr>
              <th>Wild weight</th>
              <td>{timelineBasespotDino.wild_weight}</td>
            </tr><tr>
              <th>Wild melee damage</th>
              <td>{timelineBasespotDino.wild_melee_damage}</td>
            </tr><tr>
              <th>Wild movement speed</th>
              <td>{timelineBasespotDino.wild_movement_speed}</td>
            </tr><tr>
              <th>Wild torpor</th>
              <td>{timelineBasespotDino.wild_torpor}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editTimelineBasespotDino({ id: timelineBasespotDino.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(timelineBasespotDino.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default TimelineBasespotDino
