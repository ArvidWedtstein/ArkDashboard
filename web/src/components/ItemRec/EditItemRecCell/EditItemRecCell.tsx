import type { EditItemRecById, UpdateItemRecInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ItemRecForm from 'src/components/ItemRec/ItemRecForm'

export const QUERY = gql`
  query EditItemRecById($id: String!) {
    itemRec: itemRec(id: $id) {
      id
      created_at
      updated_at
      crafted_item_id
      crafting_station_id
      crafting_time
      yields
    }
  }
`
const UPDATE_ITEM_REC_MUTATION = gql`
  mutation UpdateItemRecMutation($id: String!, $input: UpdateItemRecInput!) {
    updateItemRec(id: $id, input: $input) {
      id
      created_at
      updated_at
      crafted_item_id
      crafting_station_id
      crafting_time
      yields
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ itemRec }: CellSuccessProps<EditItemRecById>) => {
  const [updateItemRec, { loading, error }] = useMutation(
    UPDATE_ITEM_REC_MUTATION,
    {
      onCompleted: () => {
        toast.success('ItemRec updated')
        navigate(routes.itemRecs())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateItemRecInput,
    id: EditItemRecById['itemRec']['id']
  ) => {
    updateItemRec({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit ItemRec {itemRec?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <ItemRecForm
          itemRec={itemRec}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
