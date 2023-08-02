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


const NewItem = () => {
  const [createItem, { loading, error }] = useMutation(
    CREATE_ITEM_MUTATION,
    {
      onCompleted: (data) => {
        toast.success('Item created')
        navigate(routes.items())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )


  const onSave = async (input: CreateItemInput) => {
    toast.promise(createItem({ variables: { input } }), {
      loading: "Creating new item...",
      success: "Item successfully created",
      error: <b>Failed to create item.</b>,
    });
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
