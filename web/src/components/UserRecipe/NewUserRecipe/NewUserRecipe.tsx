import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UserRecipeForm from 'src/components/UserRecipe/UserRecipeForm'

import type { CreateUserRecipeInput } from 'types/graphql'

const CREATE_USER_RECIPE_MUTATION = gql`
  mutation CreateUserRecipeMutation($input: CreateUserRecipeInput!) {
    createUserRecipe(input: $input) {
      id
    }
  }
`

const NewUserRecipe = () => {
  const [createUserRecipe, { loading, error }] = useMutation(
    CREATE_USER_RECIPE_MUTATION,
    {
      onCompleted: () => {
        toast.success('UserRecipe created')
        navigate(routes.userRecipes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateUserRecipeInput) => {
    createUserRecipe({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New UserRecipe</h2>
      </header>
      <div className="rw-segment-main">
        <UserRecipeForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewUserRecipe
