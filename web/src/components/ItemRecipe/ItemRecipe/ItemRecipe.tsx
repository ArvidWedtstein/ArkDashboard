import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

import type {
  DeleteItemRecipeMutationVariables,
  FindItemRecipeById,
} from 'types/graphql'

const DELETE_ITEM_RECIPE_MUTATION = gql`
  mutation DeleteItemRecipeMutation($id: BigInt!) {
    deleteItemRecipe(id: $id) {
      id
    }
  }
`

interface Props {
  itemRecipe: NonNullable<FindItemRecipeById['itemRecipe']>
}

const ItemRecipe = ({ itemRecipe }: Props) => {
  const [deleteItemRecipe] = useMutation(DELETE_ITEM_RECIPE_MUTATION, {
    onCompleted: () => {
      toast.success('ItemRecipe deleted')
      navigate(routes.itemRecipes())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteItemRecipeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete itemRecipe ' + id + '?')) {
      deleteItemRecipe({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            ItemRecipe {itemRecipe.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{itemRecipe.id}</td>
            </tr>
            <tr>
              <th>Crafted item id</th>
              <td>{itemRecipe.crafted_item_id}</td>
            </tr>
            <tr>
              <th>Crafting station id</th>
              <td>{itemRecipe.crafting_station_id}</td>
            </tr>
            <tr>
              <th>Crafting time</th>
              <td>{itemRecipe.crafting_time}</td>
            </tr>
            <tr>
              <th>Yields</th>
              <td>{itemRecipe.yields}</td>
            </tr>
            <tr>
              <th>Required level</th>
              <td>{itemRecipe.required_level}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editItemRecipe({ id: itemRecipe.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(itemRecipe.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default ItemRecipe
