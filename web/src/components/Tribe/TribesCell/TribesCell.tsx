import type { FindTribes } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Tribes from 'src/components/Tribe/Tribes'
import { useAuth } from '@redwoodjs/auth'

export const QUERY = gql`
  query FindTribes {
    tribes {
      id
      name
      description
      createdAt
      updatedAt
      createdBy
    }
  }
`

export const Loading = () => (
  <div className="text-center">
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>

)

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No tribes yet. '}
      <Link
        to={routes.newTribe()}
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

export const Success = async ({ tribes }: CellSuccessProps<FindTribes>) => {
  const { client } = useAuth();
  let { data, error, status } = await client
    .from("tribe_view")
    .select(
      `id, name, description, createdAt, updatedAt, createdBy, full_name`
    )
  console.log(data)
  return <Tribes tribes={tribes} />
}
