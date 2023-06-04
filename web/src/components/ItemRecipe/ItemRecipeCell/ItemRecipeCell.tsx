import type { FindItemRecipeById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ItemRecipe from 'src/components/ItemRecipe/ItemRecipe'

export const QUERY = gql`
  query FindItemRecipeById($id: String!) {
    itemRecipe: itemRecipe(id: $id) {
      id
      created_at
      updated_at
      crafted_item_id
      crafting_station_id
      crafting_time
      yields
      required_level
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>ItemRecipe not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  itemRecipe,
}: CellSuccessProps<FindItemRecipeById>) => {
  return <ItemRecipe itemRecipe={itemRecipe} />
}
