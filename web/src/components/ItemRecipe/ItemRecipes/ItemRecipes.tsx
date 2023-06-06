import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/ItemRecipe/ItemRecipesCell'
import { timeTag, truncate } from 'src/lib/formatters'

import type {
  DeleteItemRecipeMutationVariables,
  FindItemRecipes,
} from 'types/graphql'

const DELETE_ITEM_RECIPE_MUTATION = gql`
  mutation DeleteItemRecipeMutation($id: String!) {
    deleteItemRecipe(id: $id) {
      id
    }
  }
`

const ItemRecipesList = ({ itemRecipes }: FindItemRecipes) => {
  const [deleteItemRecipe] = useMutation(DELETE_ITEM_RECIPE_MUTATION, {
    onCompleted: () => {
      toast.success('ItemRecipe deleted')
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

  const onDeleteClick = (id: DeleteItemRecipeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete itemRecipe ' + id + '?')) {
      deleteItemRecipe({ variables: { id } })
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
            <th>Required level</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {itemRecipes.map((itemRecipe) => (
            <tr key={itemRecipe.id}>
              <td>{truncate(itemRecipe.id)}</td>
              <td>{timeTag(itemRecipe.created_at)}</td>
              <td>{timeTag(itemRecipe.updated_at)}</td>
              <td>{truncate(itemRecipe.crafted_item_id)}</td>
              <td>{truncate(itemRecipe.crafting_station_id)}</td>
              <td>{truncate(itemRecipe.crafting_time)}</td>
              <td>{truncate(itemRecipe.yields)}</td>
              <td>{truncate(itemRecipe.required_level)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.itemRecipe({ id: itemRecipe.id })}
                    title={'Show itemRecipe ' + itemRecipe.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editItemRecipe({ id: itemRecipe.id })}
                    title={'Edit itemRecipe ' + itemRecipe.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete itemRecipe ' + itemRecipe.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(itemRecipe.id)}
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

export default ItemRecipesList
