import type { FindBasespots } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Basespots from 'src/components/Basespot/Basespots'
import SkeletonCard from 'src/components/SkeletonCard/SkeletonCard'

export const QUERY = gql`
  query FindBasespots {
    basespots {
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

export const Loading = () => {
  return (
    <div className="grid grid-cols-2 gap-5 mb-5" >
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div >
  )
}
export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No basespots yet. '}
      <Link
        to={routes.newBasespot()}
        className="rw-link"
      >
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <>

    <div className="rw-cell-error">{error?.message}</div>
  </>
)

export const Success = ({ basespots }: CellSuccessProps<FindBasespots>) => {
  return <Basespots basespots={basespots} />
}
