import type { FindAdminQuery, FindAdminQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query FindAdminData {
    admin: admin(id: $id) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindAdminQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  admin,
}: CellSuccessProps<FindAdminQuery, FindAdminQueryVariables>) => {
  return <div>{JSON.stringify(admin)}</div>
}
