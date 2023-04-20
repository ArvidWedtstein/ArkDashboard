import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ItemForm from 'src/components/Item/ItemForm'

import type { CreateItemInput } from 'types/graphql'

const CREATE_ITEM_MUTATION = gql`
  mutation CreateItemMutation($input: CreateItemInput!) {
    createItem(input: $input) {
      id
    }
  }
`
const CREATE_ITEM_RECIPE_MUTATION = gql`
  mutation CreateItemRecipeMutation($input: CreateItemRecipeInput!) {
    createItemRecipe(input: $input) {
      id
    }
  }
`

const NewItem = () => {
  const [createItem, { loading, error }] = useMutation(
    CREATE_ITEM_MUTATION,
    {
      onCompleted: (data) => {
        console.log(data)
        toast.success('Item created')
        navigate(routes.items())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )
  const [createItemRecipe, { loading: rLoading, error: rError }] = useMutation(
    CREATE_ITEM_RECIPE_MUTATION,
    {
      onCompleted: (data) => {
        console.log(data)
        toast.success('Item Recipe created')
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )


  const onSave = async (input: CreateItemInput) => {
    try {
      // delete input.category
      // const d = await createItem({ variables: { input } })
      console.log(input)
      createItem({ variables: { input } })
      // console.log(d)
    } catch (error) {
      console.log(error)
    }
    // await createItemRecipe({ variables: { crafted_item_id: id, amount: 1, item_id: 1, crafting_station: 606 } });
    // createItem({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Item</h2>
      </header>
      <div className="rw-segment-main">
        <ItemForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewItem
