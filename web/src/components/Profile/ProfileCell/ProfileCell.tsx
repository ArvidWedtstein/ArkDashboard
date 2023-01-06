import type { FindProfileById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Profile from 'src/components/Profile/Profile'

export const QUERY = gql`
  query FindProfileById($id: String!) {
    profile: profile(id: $id) {
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

export const Empty = () => <div>Profile not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ profile }: CellSuccessProps<FindProfileById>) => {
  return <Profile profile={profile} />
}
