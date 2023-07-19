import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useAuth } from 'src/auth'

import { checkboxInputTag, timeTag } from 'src/lib/formatters'

import type {
  DeleteUserRecipeMutationVariables,
  FindUserRecipeById,
  permission,
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
  const { currentUser } = useAuth()
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
    <article>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            UserRecipe {userRecipe.name} Detail
          </h2>
        </header>
        <div className="my-3 flex flex-col flex-wrap gap-2 text-black dark:text-white">
          {userRecipe?.UserRecipeItemRecipe?.map(({ id, ItemRecipe, amount }) => (
            <div>
              <h3 className="text-lg font-bold">{ItemRecipe.Item_ItemRecipe_crafted_item_idToItem.name} ({amount})</h3>
              {ItemRecipe.ItemRecipeItem.map(({ amount, Item }) => (
                <button
                  type="button"
                  className="animate-fade-in b relative rounded-lg border border-zinc-500 p-2 text-center hover:border-red-500 hover:ring-1 hover:ring-red-500"
                  title={Item.name}
                  onClick={() => onDeleteClick(id)}
                  key={`recipe-${Item.id}`}
                >
                  <img
                    className="h-10 w-10"
                    src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${Item.image}`}
                    alt={Item.name}
                  />
                  <div className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-xs font-bold">
                    {amount}
                  </div>
                </button>
              ))}
            </div>
          )
          )}
        </div>
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
        {currentUser.role_id == 'f0c1b8e9-5f27-4430-ad8f-5349f83339c0' && (
          <>
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
          </>
        )}
      </nav>
    </article>
  )
}

export default UserRecipe
