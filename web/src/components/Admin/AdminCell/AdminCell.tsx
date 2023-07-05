import type { FindAdminData, FindAdminDataVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import Admin from '../Admin/Admin'

export const QUERY = gql`
  query FindAdminData {
    basespots {
        id
        name
        description
        latitude
        longitude
        image
        created_at
        updated_at
        map_id
        estimated_for_players
        Map {
          name
        }
      }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindAdminDataVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  basespots,
}: CellSuccessProps<FindAdminData, FindAdminDataVariables>) => {
  return <Admin basespots={basespots} />
}
