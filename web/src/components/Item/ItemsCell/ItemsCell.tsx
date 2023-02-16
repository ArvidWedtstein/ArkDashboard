import type { FindItems } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Items from 'src/components/Item/Items'

export const QUERY = gql`
  query FindItems {
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
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No items yet. '}
      <Link
        to={routes.newItem()}
        className="rw-link"
      >
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ items }: CellSuccessProps<FindItems>) => {
  return <Items items={items} />
}
