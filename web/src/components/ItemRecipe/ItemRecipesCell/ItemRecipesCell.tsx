import type { FindItemRecipes } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ItemRecipes from 'src/components/ItemRecipe/ItemRecipes'

export const QUERY = gql`
  query FindItemRecipes {
    itemRecipes {
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

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No itemRecipes yet. '}
      <Link to={routes.newItemRecipe()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ itemRecipes }: CellSuccessProps<FindItemRecipes>) => {
  return <ItemRecipes itemRecipes={itemRecipes} />
}
