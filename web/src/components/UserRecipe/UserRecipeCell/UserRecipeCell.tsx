import type { FindUserRecipeById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import UserRecipe from 'src/components/UserRecipe/UserRecipe'

export const QUERY = gql`
  query FindUserRecipeById($id: String!) {
    userRecipe: userRecipe(id: $id) {
      id
      created_at
      updated_at
      user_id
      private
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>UserRecipe not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  userRecipe,
}: CellSuccessProps<FindUserRecipeById>) => {
  return <UserRecipe userRecipe={userRecipe} />
}
