import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Item/ItemsCell'
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters'

import type { DeleteItemMutationVariables, FindItems } from 'types/graphql'

const DELETE_ITEM_MUTATION = gql`
  mutation DeleteItemMutation($id: BigInt!) {
    deleteItem(id: $id) {
      id
    }
  }
`

const ItemsList = ({ items }: FindItems) => {
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
    onCompleted: () => {
      toast.success('Item deleted')
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

  const onDeleteClick = (id: DeleteItemMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete item ' + id + '?')) {
      deleteItem({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Created at</th>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Max stack</th>
            <th>Weight</th>
            <th>Engram points</th>
            <th>Crafting time</th>
            <th>Req level</th>
            <th>Yields</th>
            <th>Recipe</th>
            <th>Stats</th>
            <th>Color</th>
            <th>Crafted in</th>
            <th>Effects</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{truncate(item.id)}</td>
              <td>{timeTag(item.created_at)}</td>
              <td>{truncate(item.name)}</td>
              <td>{truncate(item.description)}</td>
              <td>{truncate(item.image)}</td>
              <td>{truncate(item.max_stack)}</td>
              <td>{truncate(item.weight)}</td>
              <td>{truncate(item.engram_points)}</td>
              <td>{truncate(item.crafting_time)}</td>
              <td>{truncate(item.req_level)}</td>
              <td>{truncate(item.yields)}</td>
              <td>{jsonTruncate(item.recipe)}</td>
              <td>{jsonTruncate(item.stats)}</td>
              <td>{truncate(item.color)}</td>
              <td>{truncate(item.crafted_in)}</td>
              <td>{truncate(item.effects)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.item({ id: item.id })}
                    title={'Show item ' + item.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editItem({ id: item.id })}
                    title={'Edit item ' + item.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete item ' + item.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(item.id)}
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

export default ItemsList
