import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ItemRecForm from 'src/components/ItemRec/ItemRecForm'

import type { CreateItemRecInput } from 'types/graphql'

const CREATE_ITEM_REC_MUTATION = gql`
  mutation CreateItemRecMutation($input: CreateItemRecInput!) {
    createItemRec(input: $input) {
      id
    }
  }
`

const NewItemRec = () => {
  const [createItemRec, { loading, error }] = useMutation(
    CREATE_ITEM_REC_MUTATION,
    {
      onCompleted: () => {
        toast.success('ItemRec created')
        navigate(routes.itemRecs())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateItemRecInput) => {
    createItemRec({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New ItemRec</h2>
      </header>
      <div className="rw-segment-main">
        <ItemRecForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewItemRec
