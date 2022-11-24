import type { FindBasespots } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Basespots from 'src/components/Basespot/Basespots'

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
    <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-slate-700 h-10 w-10"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-slate-700 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-slate-700 rounded col-span-2"></div>
              <div className="h-2 bg-slate-700 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
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
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ basespots }: CellSuccessProps<FindBasespots>) => {
  return <Basespots basespots={basespots} />
}
