import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Tribe/TribesCell/TribesCell'
import { timeTag, truncate } from 'src/lib/formatters'

import type { DeleteTribeMutationVariables, FindTribes } from 'types/graphql'

const DELETE_TRIBE_MUTATION = gql`
  mutation DeleteTribeMutation($id: Int!) {
    deleteTribe(id: $id) {
      id
    }
  }
`

const TribesList = ({ tribes }: FindTribes) => {
  const [deleteTribe] = useMutation(DELETE_TRIBE_MUTATION, {
    onCompleted: () => {
      toast.success('Tribe deleted')
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

  const onDeleteClick = (id: DeleteTribeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete tribe ' + id + '?')) {
      deleteTribe({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="table-auto">
        <thead>
          <tr>
            {/* <th>Id</th> */}
            <th>Name</th>
            <th>Description</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Created by</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {tribes.map((tribe) => (
            <tr key={tribe.id}>
              {/* <td>{truncate(tribe.id)}</td> */}
              <td>{truncate(tribe.name)}</td>
              <td>{truncate(tribe.description)}</td>
              <td>{timeTag(tribe.createdAt)}</td>
              <td>{timeTag(tribe.updatedAt)}</td>
              <td>{truncate(tribe.createdBy)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.tribe({ id: tribe.id })}
                    title={'Show tribe ' + tribe.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editTribe({ id: tribe.id })}
                    title={'Edit tribe ' + tribe.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete tribe ' + tribe.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(tribe.id)}
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

export default TribesList
