import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Basespot/BasespotsCell'
import { timeTag, truncate } from 'src/lib/formatters'

import type { DeleteBasespotMutationVariables, FindBasespots } from 'types/graphql'

const DELETE_BASESPOT_MUTATION = gql`
  mutation DeleteBasespotMutation($id: Int!) {
    deleteBasespot(id: $id) {
      id
    }
  }
`

const BasespotsList = ({ basespots }: FindBasespots) => {
  const [deleteBasespot] = useMutation(DELETE_BASESPOT_MUTATION, {
    onCompleted: () => {
      toast.success('Basespot deleted')
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

  const onDeleteClick = (id: DeleteBasespotMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete basespot ' + id + '?')) {
      deleteBasespot({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Image</th>
            <th>Created at</th>
            <th>Map</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {basespots.map((basespot) => (
            <tr key={basespot.id}>
              <td>{truncate(basespot.id)}</td>
              <td>{truncate(basespot.name)}</td>
              <td>{truncate(basespot.description)}</td>
              <td>{truncate(basespot.latitude)}</td>
              <td>{truncate(basespot.longitude)}</td>
              <td>{truncate(basespot.image)}</td>
              <td>{timeTag(basespot.createdAt)}</td>
              <td>{truncate(basespot.Map)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.basespot({ id: basespot.id })}
                    title={'Show basespot ' + basespot.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editBasespot({ id: basespot.id })}
                    title={'Edit basespot ' + basespot.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete basespot ' + basespot.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(basespot.id)}
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

export default BasespotsList
