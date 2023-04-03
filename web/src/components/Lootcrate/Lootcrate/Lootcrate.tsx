
import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { checkboxInputTag, jsonDisplay, timeTag,  } from 'src/lib/formatters'

import type { DeleteLootcrateMutationVariables, FindLootcrateById } from 'types/graphql'

const DELETE_LOOTCRATE_MUTATION = gql`
  mutation DeleteLootcrateMutation($id: String!) {
    deleteLootcrate(id: $id) {
      id
    }
  }
`

interface Props {
  lootcrate: NonNullable<FindLootcrateById['lootcrate']>
}

const Lootcrate = ({ lootcrate }: Props) => {
  const [deleteLootcrate] = useMutation(DELETE_LOOTCRATE_MUTATION, {
    onCompleted: () => {
      toast.success('Lootcrate deleted')
      navigate(routes.lootcrates())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteLootcrateMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete lootcrate ' + id + '?')) {
      deleteLootcrate({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Lootcrate {lootcrate.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{lootcrate.id}</td>
            </tr><tr>
              <th>Created at</th>
              <td>{timeTag(lootcrate.created_at)}</td>
            </tr><tr>
              <th>Updated at</th>
              <td>{timeTag(lootcrate.updated_at)}</td>
            </tr><tr>
              <th>Blueprint</th>
              <td>{lootcrate.blueprint}</td>
            </tr><tr>
              <th>Name</th>
              <td>{lootcrate.name}</td>
            </tr><tr>
              <th>Map</th>
              <td>{lootcrate.map}</td>
            </tr><tr>
              <th>Level requirement</th>
              <td>{jsonDisplay(lootcrate.level_requirement)}</td>
            </tr><tr>
              <th>Decay time</th>
              <td>{jsonDisplay(lootcrate.decay_time)}</td>
            </tr><tr>
              <th>No repeat in sets</th>
              <td>{checkboxInputTag(lootcrate.no_repeat_in_sets)}</td>
            </tr><tr>
              <th>Quality multiplier</th>
              <td>{jsonDisplay(lootcrate.quality_multiplier)}</td>
            </tr><tr>
              <th>Set qty</th>
              <td>{jsonDisplay(lootcrate.set_qty)}</td>
            </tr><tr>
              <th>Color</th>
              <td>{lootcrate.color}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editLootcrate({ id: lootcrate.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(lootcrate.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Lootcrate
