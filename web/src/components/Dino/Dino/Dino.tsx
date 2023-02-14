
import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { checkboxInputTag, jsonDisplay, timeTag,  } from 'src/lib/formatters'

import type { DeleteDinoMutationVariables, FindDinoById } from 'types/graphql'

const DELETE_DINO_MUTATION = gql`
  mutation DeleteDinoMutation($id: String!) {
    deleteDino(id: $id) {
      id
    }
  }
`

interface Props {
  dino: NonNullable<FindDinoById['dino']>
}

const Dino = ({ dino }: Props) => {
  const [deleteDino] = useMutation(DELETE_DINO_MUTATION, {
    onCompleted: () => {
      toast.success('Dino deleted')
      navigate(routes.dinos())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteDinoMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete dino ' + id + '?')) {
      deleteDino({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Dino {dino.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{dino.id}</td>
            </tr><tr>
              <th>Created at</th>
              <td>{timeTag(dino.created_at)}</td>
            </tr><tr>
              <th>Name</th>
              <td>{dino.name}</td>
            </tr><tr>
              <th>Synonyms</th>
              <td>{dino.synonyms}</td>
            </tr><tr>
              <th>Description</th>
              <td>{dino.description}</td>
            </tr><tr>
              <th>Taming notice</th>
              <td>{dino.taming_notice}</td>
            </tr><tr>
              <th>Can destroy</th>
              <td>{dino.can_destroy}</td>
            </tr><tr>
              <th>Immobilized by</th>
              <td>{dino.immobilized_by}</td>
            </tr><tr>
              <th>Base stats</th>
              <td>{jsonDisplay(dino.base_stats)}</td>
            </tr><tr>
              <th>Gather eff</th>
              <td>{jsonDisplay(dino.gather_eff)}</td>
            </tr><tr>
              <th>Exp per kill</th>
              <td>{dino.exp_per_kill}</td>
            </tr><tr>
              <th>Fits through</th>
              <td>{dino.fits_through}</td>
            </tr><tr>
              <th>Egg min</th>
              <td>{dino.egg_min}</td>
            </tr><tr>
              <th>Egg max</th>
              <td>{dino.egg_max}</td>
            </tr><tr>
              <th>Tdps</th>
              <td>{dino.tdps}</td>
            </tr><tr>
              <th>Eats</th>
              <td>{dino.eats}</td>
            </tr><tr>
              <th>Maturation time</th>
              <td>{dino.maturation_time}</td>
            </tr><tr>
              <th>Weight reduction</th>
              <td>{jsonDisplay(dino.weight_reduction)}</td>
            </tr><tr>
              <th>Incubation time</th>
              <td>{dino.incubation_time}</td>
            </tr><tr>
              <th>Affinity needed</th>
              <td>{dino.affinity_needed}</td>
            </tr><tr>
              <th>Aff inc</th>
              <td>{dino.aff_inc}</td>
            </tr><tr>
              <th>Flee threshold</th>
              <td>{dino.flee_threshold}</td>
            </tr><tr>
              <th>Hitboxes</th>
              <td>{jsonDisplay(dino.hitboxes)}</td>
            </tr><tr>
              <th>Drops</th>
              <td>{dino.drops}</td>
            </tr><tr>
              <th>Food consumption base</th>
              <td>{dino.food_consumption_base}</td>
            </tr><tr>
              <th>Food consumption mult</th>
              <td>{dino.food_consumption_mult}</td>
            </tr><tr>
              <th>Disable ko</th>
              <td>{checkboxInputTag(dino.disable_ko)}</td>
            </tr><tr>
              <th>Violent tame</th>
              <td>{checkboxInputTag(dino.violent_tame)}</td>
            </tr><tr>
              <th>Taming bonus attr</th>
              <td>{dino.taming_bonus_attr}</td>
            </tr><tr>
              <th>Disable food</th>
              <td>{checkboxInputTag(dino.disable_food)}</td>
            </tr><tr>
              <th>Disable mult</th>
              <td>{checkboxInputTag(dino.disable_mult)}</td>
            </tr><tr>
              <th>Water movement</th>
              <td>{checkboxInputTag(dino.water_movement)}</td>
            </tr><tr>
              <th>Admin note</th>
              <td>{dino.admin_note}</td>
            </tr><tr>
              <th>Base points</th>
              <td>{dino.base_points}</td>
            </tr><tr>
              <th>Method</th>
              <td>{dino.method}</td>
            </tr><tr>
              <th>Knockout</th>
              <td>{dino.knockout}</td>
            </tr><tr>
              <th>Non violent food affinity mult</th>
              <td>{dino.non_violent_food_affinity_mult}</td>
            </tr><tr>
              <th>Non violent food rate mult</th>
              <td>{dino.non_violent_food_rate_mult}</td>
            </tr><tr>
              <th>Taming interval</th>
              <td>{dino.taming_interval}</td>
            </tr><tr>
              <th>Base taming time</th>
              <td>{dino.base_taming_time}</td>
            </tr><tr>
              <th>Exp per kill adj</th>
              <td>{dino.exp_per_kill_adj}</td>
            </tr><tr>
              <th>Disable tame</th>
              <td>{checkboxInputTag(dino.disable_tame)}</td>
            </tr><tr>
              <th>X variant</th>
              <td>{checkboxInputTag(dino.x_variant)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editDino({ id: dino.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(dino.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Dino
