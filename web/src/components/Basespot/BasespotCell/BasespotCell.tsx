import type { FindBasespotById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Basespot from 'src/components/Basespot/Basespot'

export const QUERY = gql`
  query FindBasespotById($id: Int!) {
    basespot: basespot(id: $id) {
      id
      name
      description
      latitude
      longitude
      image
      createdAt
      Map
      estimatedForPlayers
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Basespot not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ basespot }: CellSuccessProps<FindBasespotById>) => {
  return <Basespot basespot={basespot} />
}
