import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ItemRecipeForm from 'src/components/ItemRecipe/ItemRecipeForm'

import type { CreateItemRecipeInput } from 'types/graphql'

const CREATE_ITEM_RECIPE_MUTATION = gql`
  mutation CreateItemRecipeMutation($input: CreateItemRecipeInput!) {
    createItemRecipe(input: $input) {
      id
    }
  }
`

const NewItemRecipe = () => {
  const [createItemRecipe, { loading, error }] = useMutation(
    CREATE_ITEM_RECIPE_MUTATION,
    {
      onCompleted: () => {
        toast.success('ItemRecipe created')
        navigate(routes.itemRecipes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateItemRecipeInput) => {
    createItemRecipe({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New ItemRecipe</h2>
      </header>
      <div className="rw-segment-main">
        <ItemRecipeForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewItemRecipe
