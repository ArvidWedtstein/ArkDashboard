import type { FindTimelineSeasonPeople } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import TimelineSeasonPeople from 'src/components/TimelineSeasonPerson/TimelineSeasonPeople'

export const QUERY = gql`
  query FindTimelineSeasonPeople($timeline_season_id: String!) {
    timelineSeasonPeople: timelineSeasonPeople(timeline_season_id: $timeline_season_id) {
      id
      created_at
      updated_at
      user_id
      ingame_name
      timeline_season_id
      Profile {
        id
        username
        avatar_url
      }
    }
  }
`

export const Loading = () => (
  <div
    role="status"
    className="flex justify-start gap-3 nimate-pulse rounded border border-gray-200 p-4 shadow dark:border-gray-700 md:p-6"
  >
    <div className='p-3 space-y-3 w-fit'>
      <svg className="w-16 h-16 text-gray-200 dark:text-gray-700" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path></svg>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
    </div>
    <div className='p-3 space-y-3 w-fit'>
      <svg className="w-16 h-16 text-gray-200 dark:text-gray-700" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path></svg>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
    </div>
    <div className='p-3 space-y-3 w-fit'>
      <svg className="w-16 h-16 text-gray-200 dark:text-gray-700" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path></svg>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
    </div>
    <div className='p-3 space-y-3 w-fit'>
      <svg className="w-16 h-16 text-gray-200 dark:text-gray-700" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path></svg>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
)

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No timelineSeasonPeople yet. '}
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error flex animate-fly-in items-center space-x-3">
    <svg
      className="h-12 w-12 fill-current"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path d="M256 304c4.406 0 8-3.578 8-8v-176c0-4.422-3.594-8-8-8S248 115.6 248 120v176C248 300.4 251.6 304 256 304zM256 352c-8.836 0-16 7.164-16 16S247.2 384 256 384s16-7.164 16-16S264.8 352 256 352zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 496c-132.3 0-240-107.7-240-240S123.7 16 256 16s240 107.7 240 240S388.3 496 256 496z" />
    </svg>
    <div className="flex flex-col">
      <p className="text-lg font-bold leading-snug">
        Some unexpected shit happend
      </p>
      <p className="text-sm">{error?.message}</p>
    </div>
  </div>
)

export const Success = ({
  timelineSeasonPeople,
}: CellSuccessProps<FindTimelineSeasonPeople>) => {
  return <TimelineSeasonPeople timelineSeasonPeople={timelineSeasonPeople} />
}
