import type { FindItemRecipes } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ItemRecipes from 'src/components/ItemRecipe/ItemRecipes'
import Button from 'src/components/Util/Button/Button'


// export const QUERY = gql`
//   query FindItemRecipes {
//     itemRecipes {
//       id
//       updated_at
//       crafted_item_id
//       crafting_station_id
//       crafting_time
//       yields
//       required_level
//     }
//   }
// `
export const QUERY = gql`
  query FindItemRecipes($item_id: BigInt!) {
    itemRecipesByItem(crafted_item_id: $item_id) {
      id
      crafted_item_id
      crafting_station_id
      Item_ItemRecipe_crafting_station_idToItem {
         name
         image
      }
      Item_ItemRecipe_crafted_item_idToItem {
        name
        image
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="text-center text-black dark:text-white">
      {'No itemRecipes yet. '}
      <Button
        variant="text"
        color="primary"
        to={routes.newItemRecipe()}
      >
        {"Create one?"}
      </Button>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ itemRecipesByItem }: CellSuccessProps<FindItemRecipes>) => {
  return <ItemRecipes itemRecipesByItem={itemRecipesByItem} />
}
