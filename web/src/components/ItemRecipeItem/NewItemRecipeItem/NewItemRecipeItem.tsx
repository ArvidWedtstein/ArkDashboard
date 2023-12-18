import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ItemRecipeItemForm from 'src/components/ItemRecipeItem/ItemRecipeItemForm'

import type { CreateItemRecipeItemInput } from 'types/graphql'

const CREATE_ITEM_RECIPE_ITEM_MUTATION = gql`
  mutation CreateItemRecipeItemMutation($input: CreateItemRecipeItemInput!) {
    createItemRecipeItem(input: $input) {
      id
    }
  }
`

const NewItemRecipeItem = () => {
  const [createItemRecipeItem, { loading, error }] = useMutation(
    CREATE_ITEM_RECIPE_ITEM_MUTATION,
    {
      onCompleted: () => {
        navigate(routes.itemRecipeItems())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateItemRecipeItemInput) => {
    toast.promise(createItemRecipeItem({ variables: { input } }), {
      loading: 'Creating new ItemRecipeItem...',
      success: 'ItemRecipeItem successfully created',
      error: <b>Failed to create new ItemRecipeItem.</b>,
    })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New ItemRecipeItem</h2>
      </header>
      <div className="rw-segment-main">
        <ItemRecipeItemForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewItemRecipeItem
