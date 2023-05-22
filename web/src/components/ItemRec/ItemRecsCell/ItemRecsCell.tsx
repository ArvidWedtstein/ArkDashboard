import type { FindItemRecs } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ItemRecs from 'src/components/ItemRec/ItemRecs'

export const QUERY = gql`
  query FindItemRecs {
    itemRecs {
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

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No itemRecs yet. '}
      <Link to={routes.newItemRec()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ itemRecs }: CellSuccessProps<FindItemRecs>) => {
  return <ItemRecs itemRecs={itemRecs} />
}
