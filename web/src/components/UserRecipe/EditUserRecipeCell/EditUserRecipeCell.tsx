import type { EditUserRecipeById, UpdateUserRecipeInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UserRecipeForm from 'src/components/UserRecipe/UserRecipeForm'

export const QUERY = gql`
  query EditUserRecipeById($id: String!) {
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
const UPDATE_USER_RECIPE_MUTATION = gql`
  mutation UpdateUserRecipeMutation(
    $id: String!
    $input: UpdateUserRecipeInput!
  ) {
    updateUserRecipe(id: $id, input: $input) {
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

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  userRecipe,
}: CellSuccessProps<EditUserRecipeById>) => {
  const [updateUserRecipe, { loading, error }] = useMutation(
    UPDATE_USER_RECIPE_MUTATION,
    {
      onCompleted: () => {
        toast.success('UserRecipe updated')
        navigate(routes.userRecipes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateUserRecipeInput,
    id: EditUserRecipeById['userRecipe']['id']
  ) => {
    updateUserRecipe({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit UserRecipe {userRecipe?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <UserRecipeForm
          userRecipe={userRecipe}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
