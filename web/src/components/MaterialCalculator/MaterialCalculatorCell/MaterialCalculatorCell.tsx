import { FindItems, FindItemsVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { MaterialGrid } from '../MaterialGrid/MaterialGrid'


export const QUERY = gql`
  query {
    items {
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
      type
    }
  }
`
export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  items,
}) => {
  return <div className="rw-form-wrapper container-xl mx-auto">
    <MaterialGrid items={items} />
  </div>
}
