import type { FindItemById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Item from 'src/components/Item/Item'

export const QUERY = gql`
  query FindItemById($id: BigInt!) {
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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Item not found</div>

let item = { "id": 75, "created_at": "2023-02-14T12:07:48.079024+00:00", "name": "Thatch", "description": "Sticks torn from trees. Useful for primitive buildings.", "image": "thatch.png", "max_stack": 100, "weight": -1, "engram_points": 0, "crafting_time": null, "req_level": 0, "yields": 1, "recipe": null, "stats": [{ "id": 1, "value": "Resource" }], "color": "#d0c485", "crafted_in": null, "effects": null }
export const Failure = ({ error }: CellFailureProps) => (
  // <div className="rw-cell-error">{error?.message}</div>
  <Item item={item} />
)

export const Success = ({ item }: CellSuccessProps<FindItemById>) => {
  return <Item item={item} />
}
