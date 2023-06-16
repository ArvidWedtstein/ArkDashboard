import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { checkboxInputTag, timeTag } from 'src/lib/formatters'

import type {
  DeleteUserRecipeMutationVariables,
  FindUserRecipeById,
} from 'types/graphql'

const DELETE_USER_RECIPE_MUTATION = gql`
  mutation DeleteUserRecipeMutation($id: String!) {
    deleteUserRecipe(id: $id) {
      id
    }
  }
`

interface Props {
  userRecipe: NonNullable<FindUserRecipeById['userRecipe']>
}

const UserRecipe = ({ userRecipe }: Props) => {
  const [deleteUserRecipe] = useMutation(DELETE_USER_RECIPE_MUTATION, {
    onCompleted: () => {
      toast.success('UserRecipe deleted')
      navigate(routes.userRecipes())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteUserRecipeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete userRecipe ' + id + '?')) {
      deleteUserRecipe({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            UserRecipe {userRecipe.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{userRecipe.id}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(userRecipe.created_at)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(userRecipe.updated_at)}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{userRecipe.user_id}</td>
            </tr>
            <tr>
              <th>Private</th>
              <td>{checkboxInputTag(userRecipe.private)}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{userRecipe.name}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editUserRecipe({ id: userRecipe.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(userRecipe.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default UserRecipe
