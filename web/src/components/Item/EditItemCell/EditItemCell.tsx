import type { EditItemById, UpdateItemInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ItemForm from 'src/components/Item/ItemForm'

export const QUERY = gql`
  query EditItemById($id: BigInt!) {
    item: item(id: $id) {
      id
      created_at
      name
      description
      image
      max_stack
      weight
      engram_points
      crafting_time
      req_level
      yields
      recipe
      stats
      color
      crafted_in
      effects
    }
  }
`
const UPDATE_ITEM_MUTATION = gql`
  mutation UpdateItemMutation($id: BigInt!, $input: UpdateItemInput!) {
    updateItem(id: $id, input: $input) {
      id
      created_at
      name
      description
      image
      max_stack
      weight
      engram_points
      crafting_time
      req_level
      yields
      recipe
      stats
      color
      crafted_in
      effects
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ item }: CellSuccessProps<EditItemById>) => {
  const [updateItem, { loading, error }] = useMutation(
    UPDATE_ITEM_MUTATION,
    {
      onCompleted: () => {
        toast.success('Item updated')
        navigate(routes.items())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateItemInput,
    id: EditItemById['item']['id']
  ) => {
    updateItem({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit Item {item?.name}</h2>
      </header>
      <div className="rw-segment-main">
        <ItemForm item={item} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
