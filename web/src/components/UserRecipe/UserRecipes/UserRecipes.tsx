import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import Table from 'src/components/Util/Table/Table'

import { QUERY } from 'src/components/UserRecipe/UserRecipesCell'
import { checkboxInputTag, timeTag, truncate } from 'src/lib/formatters'

import type {
  DeleteUserRecipeMutationVariables,
  FindUserRecipes,
} from 'types/graphql'

const DELETE_USER_RECIPE_MUTATION = gql`
  mutation DeleteUserRecipeMutation($id: String!) {
    deleteUserRecipe(id: $id) {
      id
    }
  }
`

const UserRecipesList = ({ userRecipes }: FindUserRecipes) => {
  const [deleteUserRecipe] = useMutation(DELETE_USER_RECIPE_MUTATION, {
    onCompleted: () => {
      toast.success('UserRecipe deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteUserRecipeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete userRecipe ' + id + '?')) {
      deleteUserRecipe({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>User id</th>
            <th>Private</th>
            <th>Name</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {userRecipes.map((userRecipe) => (
            <tr key={userRecipe.id}>
              <td>{truncate(userRecipe.id)}</td>
              <td>{timeTag(userRecipe.created_at)}</td>
              <td>{timeTag(userRecipe.updated_at)}</td>
              <td>{truncate(userRecipe.user_id)}</td>
              <td>{checkboxInputTag(userRecipe.private)}</td>
              <td>{truncate(userRecipe.name)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.userRecipe({ id: userRecipe.id })}
                    title={'Show userRecipe ' + userRecipe.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editUserRecipe({ id: userRecipe.id })}
                    title={'Edit userRecipe ' + userRecipe.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete userRecipe ' + userRecipe.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(userRecipe.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserRecipesList
