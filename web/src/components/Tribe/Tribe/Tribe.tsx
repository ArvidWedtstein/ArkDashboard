
import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag, } from 'src/lib/formatters'

import type { DeleteTribeMutationVariables, FindTribeById } from 'types/graphql'

const DELETE_TRIBE_MUTATION = gql`
  mutation DeleteTribeMutation($id: Int!) {
    deleteTribe(id: $id) {
      id
    }
  }
`

interface Props {
  tribe: NonNullable<FindTribeById['tribe']>
}

const Tribe = ({ tribe }: Props) => {
  const [deleteTribe] = useMutation(DELETE_TRIBE_MUTATION, {
    onCompleted: () => {
      toast.success('Tribe deleted')
      navigate(routes.tribes())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteTribeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete tribe ' + id + '?')) {
      deleteTribe({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Tribe {tribe.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{tribe.id}</td>
            </tr><tr>
              <th>Name</th>
              <td>{tribe.name}</td>
            </tr><tr>
              <th>Description</th>
              <td>{tribe.description}</td>
            </tr><tr>
              <th>Created at</th>
              <td>{timeTag(tribe.created_at)}</td>
            </tr><tr>
              <th>Updated at</th>
              <td>{timeTag(tribe.updated_at)}</td>
            </tr><tr>
              <th>Created by</th>
              <td>{tribe.Profile.full_name}</td>
            </tr><tr>
              <th>Updated by</th>
              <td>{tribe.updatedBy}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editTribe({ id: tribe.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(tribe.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Tribe
