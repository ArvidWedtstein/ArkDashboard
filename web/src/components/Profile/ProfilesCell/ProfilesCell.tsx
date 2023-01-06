import type { FindProfiles } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Profiles from 'src/components/Profile/Profiles'

export const QUERY = gql`
  query FindProfiles {
    profiles {
      id
      updated_at
      username
      full_name
      avatar_url
      website
      biography
      status
      role_id
      created_at
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No profiles yet. '}
      <Link
        to={routes.newProfile()}
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

export const Success = ({ profiles }: CellSuccessProps<FindProfiles>) => {
  return <Profiles profiles={profiles} />
}
