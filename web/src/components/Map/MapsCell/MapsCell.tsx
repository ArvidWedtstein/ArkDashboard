import type { FindMaps } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Maps from 'src/components/Map/Maps'

export const QUERY = gql`
  query FindMaps {
    maps {
      id
      name
      img
      icon
    }
  }
`

export const Loading = () => (
  <div role="status" className="animate-pulse">
    <div className="mx-auto h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
    <div className="mt-8 mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div className="h-56 bg-gray-200 rounded-lg dark:bg-gray-700" />
      <div className="h-56 bg-gray-200 rounded-lg dark:bg-gray-700" />
      <div className="h-56 bg-gray-200 rounded-lg dark:bg-gray-700" />
      <div className="h-56 bg-gray-200 rounded-lg dark:bg-gray-700" />
      <div className="h-56 bg-gray-200 rounded-lg dark:bg-gray-700" />
      <div className="h-56 bg-gray-200 rounded-lg dark:bg-gray-700" />
      <div className="h-56 bg-gray-200 rounded-lg dark:bg-gray-700" />
      <div className="h-56 bg-gray-200 rounded-lg dark:bg-gray-700" />
      <div className="h-56 bg-gray-200 rounded-lg dark:bg-gray-700" />
      <div className="h-56 bg-gray-200 rounded-lg dark:bg-gray-700" />
      <div className="h-56 bg-gray-200 rounded-lg dark:bg-gray-700" />
      <div className="h-56 bg-gray-200 rounded-lg dark:bg-gray-700" />
    </div>
    <span className="sr-only">Loading...</span>
  </div>
)

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No maps yet. '}
      <Link
        to={routes.newMap()}
        className="rw-link"
      >
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error flex items-center space-x-3 animate-fly-in" >
    <svg className="w-12 h-12 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M256 304c4.406 0 8-3.578 8-8v-176c0-4.422-3.594-8-8-8S248 115.6 248 120v176C248 300.4 251.6 304 256 304zM256 352c-8.836 0-16 7.164-16 16S247.2 384 256 384s16-7.164 16-16S264.8 352 256 352zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 496c-132.3 0-240-107.7-240-240S123.7 16 256 16s240 107.7 240 240S388.3 496 256 496z" />
    </svg>
    <div className="flex flex-col">
      <p className="font-bold text-lg leading-snug">Some unexpected shit happend</p>
      <p className="text-sm">{error?.message}</p>
    </div>
  </div>
);

export const Success = ({ maps }: CellSuccessProps<FindMaps>) => {
  return <Maps maps={maps} />
}
