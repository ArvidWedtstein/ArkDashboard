import type { FindTribeById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Tribe from 'src/components/Tribe/Tribe'

export const QUERY = gql`
  query FindTribeById($id: Int!) {
    tribe: tribe(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Tribe not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ tribe }: CellSuccessProps<FindTribeById>) => {
  return <Tribe tribe={tribe} />
}
