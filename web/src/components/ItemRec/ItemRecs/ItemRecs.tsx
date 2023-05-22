import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/ItemRec/ItemRecsCell'
import { timeTag, truncate } from 'src/lib/formatters'

import type {
  DeleteItemRecMutationVariables,
  FindItemRecs,
} from 'types/graphql'

const DELETE_ITEM_REC_MUTATION = gql`
  mutation DeleteItemRecMutation($id: String!) {
    deleteItemRec(id: $id) {
      id
    }
  }
`

const ItemRecsList = ({ itemRecs }: FindItemRecs) => {
  const [deleteItemRec] = useMutation(DELETE_ITEM_REC_MUTATION, {
    onCompleted: () => {
      toast.success('ItemRec deleted')
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

  const onDeleteClick = (id: DeleteItemRecMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete itemRec ' + id + '?')) {
      deleteItemRec({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Crafted item id</th>
            <th>Crafting station id</th>
            <th>Crafting time</th>
            <th>Yields</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {itemRecs.map((itemRec) => (
            <tr key={itemRec.id}>
              <td>{truncate(itemRec.id)}</td>
              <td>{timeTag(itemRec.created_at)}</td>
              <td>{timeTag(itemRec.updated_at)}</td>
              <td>{truncate(itemRec.crafted_item_id)}</td>
              <td>{truncate(itemRec.crafting_station_id)}</td>
              <td>{truncate(itemRec.crafting_time)}</td>
              <td>{truncate(itemRec.yields)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.itemRec({ id: itemRec.id })}
                    title={'Show itemRec ' + itemRec.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editItemRec({ id: itemRec.id })}
                    title={'Edit itemRec ' + itemRec.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete itemRec ' + itemRec.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(itemRec.id)}
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

export default ItemRecsList
