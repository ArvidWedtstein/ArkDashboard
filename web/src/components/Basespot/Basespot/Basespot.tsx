
import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag,  } from 'src/lib/formatters'

import type { DeleteBasespotMutationVariables, FindBasespotById } from 'types/graphql'

const DELETE_BASESPOT_MUTATION = gql`
  mutation DeleteBasespotMutation($id: Int!) {
    deleteBasespot(id: $id) {
      id
    }
  }
`

interface Props {
  basespot: NonNullable<FindBasespotById['basespot']>
}

const Basespot = ({ basespot }: Props) => {
  const [deleteBasespot] = useMutation(DELETE_BASESPOT_MUTATION, {
    onCompleted: () => {
      toast.success('Basespot deleted')
      navigate(routes.basespots())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteBasespotMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete basespot ' + id + '?')) {
      deleteBasespot({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Basespot {basespot.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{basespot.id}</td>
            </tr><tr>
              <th>Name</th>
              <td>{basespot.name}</td>
            </tr><tr>
              <th>Description</th>
              <td>{basespot.description}</td>
            </tr><tr>
              <th>Latitude</th>
              <td>{basespot.latitude}</td>
            </tr><tr>
              <th>Longitude</th>
              <td>{basespot.longitude}</td>
            </tr><tr>
              <th>Image</th>
              <td>{basespot.image}</td>
            </tr><tr>
              <th>Created at</th>
              <td>{timeTag(basespot.createdAt)}</td>
            </tr><tr>
              <th>Map</th>
              <td>{basespot.Map}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editBasespot({ id: basespot.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(basespot.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Basespot
