import type { EditItemRecipeById, UpdateItemRecipeInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ItemRecipeForm from 'src/components/ItemRecipe/ItemRecipeForm'

export const QUERY = gql`
  query EditItemRecipeById($id: String!) {
    itemRecipe: itemRecipe(id: $id) {
      id
      created_at
      updated_at
      crafted_item_id
      crafting_station_id
      crafting_time
      yields
      required_level
      ItemRecipeItem {
        id
        amount
        item_id
      }
    }
    items {
      id
      name
      image
    }
  }
`
const UPDATE_ITEM_RECIPE_MUTATION = gql`
  mutation UpdateItemRecipeMutation(
    $id: String!
    $input: UpdateItemRecipeInput!
  ) {
    updateItemRecipe(id: $id, input: $input) {
      id
      created_at
      updated_at
      crafted_item_id
      crafting_station_id
      crafting_time
      yields
      required_level
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  itemRecipe,
  items
}: CellSuccessProps<EditItemRecipeById>) => {
  const [updateItemRecipe, { loading, error }] = useMutation(
    UPDATE_ITEM_RECIPE_MUTATION,
    {
      onCompleted: () => {
        toast.success('ItemRecipe updated')
        navigate(routes.itemRecipes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateItemRecipeInput,
    id: EditItemRecipeById['itemRecipe']['id']
  ) => {
    toast.promise(updateItemRecipe({ variables: { id, input } }), {
      loading: "Updating item recipe...",
      success: "Item recipe successfully updated",
      error: <b>Failed to update item recipe.</b>,
    });
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit ItemRecipe {itemRecipe?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <ItemRecipeForm
          items={items}
          itemRecipe={itemRecipe}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
