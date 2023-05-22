import type { FindItemRecById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ItemRec from 'src/components/ItemRec/ItemRec'

export const QUERY = gql`
  query FindItemRecById($id: String!) {
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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>ItemRec not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ itemRec }: CellSuccessProps<FindItemRecById>) => {
  return <ItemRec itemRec={itemRec} />
}
