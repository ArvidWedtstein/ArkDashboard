import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useAuth } from 'src/auth'
import Toast from 'src/components/Util/Toast/Toast'

import { timeTag } from 'src/lib/formatters'

import type {
  DeleteItemRecipeItemMutationVariables,
  FindItemRecipeItemById,
} from 'types/graphql'

const DELETE_ITEM_RECIPE_ITEM_MUTATION = gql`
  mutation DeleteItemRecipeItemMutation($id: String!) {
    deleteItemRecipeItem(id: $id) {
      id
    }
  }
`

interface Props {
  itemRecipeItem: NonNullable<FindItemRecipeItemById['itemRecipeItem']>
}

const ItemRecipeItem = ({ itemRecipeItem }: Props) => {
  const { currentUser } = useAuth()
  const [deleteItemRecipeItem] = useMutation(DELETE_ITEM_RECIPE_ITEM_MUTATION, {
    onCompleted: () => {
      toast.success('ItemRecipeItem deleted')
      navigate(routes.itemRecipeItems())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteItemRecipeItemMutationVariables['id']) => {
    toast.custom(
      (t) => (
        <Toast
          t={t}
          title={`You are about to delete itemRecipeItem`}
          message={`Are you sure you want to delete itemRecipeItem?`}
          actionType="YesNo"
          primaryAction={() => deleteItemRecipeItem({ variables: { id } })}
        />
      ),
      { position: 'top-center' }
    )
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            ItemRecipeItem {itemRecipeItem.id} Detail
          </h2>
        </header>

        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                Id
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-zinc-400 sm:col-span-2 sm:mt-0">
                {itemRecipeItem.id}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                Created at
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-zinc-400 sm:col-span-2 sm:mt-0">
                {timeTag(itemRecipeItem.created_at)}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                Updated at
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-zinc-400 sm:col-span-2 sm:mt-0">
                {timeTag(itemRecipeItem.updated_at)}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                Item recipe id
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-zinc-400 sm:col-span-2 sm:mt-0">
                {itemRecipeItem.item_recipe_id}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                Item id
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-zinc-400 sm:col-span-2 sm:mt-0">
                {itemRecipeItem.item_id}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                Amount
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-zinc-400 sm:col-span-2 sm:mt-0">
                {itemRecipeItem.amount}
              </dd>
            </div>
          </dl>
        </div>

        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{itemRecipeItem.id}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(itemRecipeItem.created_at)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(itemRecipeItem.updated_at)}</td>
            </tr>
            <tr>
              <th>Item recipe id</th>
              <td>{itemRecipeItem.item_recipe_id}</td>
            </tr>
            <tr>
              <th>Item id</th>
              <td>{itemRecipeItem.item_id}</td>
            </tr>
            <tr>
              <th>Amount</th>
              <td>{itemRecipeItem.amount}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        {currentUser?.permissions.some(
          (p: permission) => p === 'gamedata_update'
        ) && (
          <Link
            to={routes.editItemRecipeItem({ id: itemRecipeItem.id })}
            className="rw-button rw-button-gray"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="rw-button-icon-start"
            >
              <path d="M493.2 56.26l-37.51-37.51C443.2 6.252 426.8 0 410.5 0c-16.38 0-32.76 6.25-45.26 18.75L45.11 338.9c-8.568 8.566-14.53 19.39-17.18 31.21l-27.61 122.8C-1.7 502.1 6.158 512 15.95 512c1.047 0 2.116-.1034 3.198-.3202c0 0 84.61-17.95 122.8-26.93c11.54-2.717 21.87-8.523 30.25-16.9l321.2-321.2C518.3 121.7 518.2 81.26 493.2 56.26zM149.5 445.2c-4.219 4.219-9.252 7.039-14.96 8.383c-24.68 5.811-69.64 15.55-97.46 21.52l22.04-98.01c1.332-5.918 4.303-11.31 8.594-15.6l247.6-247.6l82.76 82.76L149.5 445.2zM470.7 124l-50.03 50.02l-82.76-82.76l49.93-49.93C393.9 35.33 401.9 32 410.5 32s16.58 3.33 22.63 9.375l37.51 37.51C483.1 91.37 483.1 111.6 470.7 124z" />
            </svg>
            Edit
          </Link>
        )}
        {currentUser?.permissions.some(
          (p: permission) => p === 'gamedata_delete'
        ) && (
          <button
            type="button"
            className="rw-button rw-button-red"
            onClick={() => onDeleteClick(itemRecipeItem.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="rw-button-icon-start"
            >
              <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80c-15.1 0-29.4 7.125-38.4 19.25L112 64H16C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16 0-8.8-7.2-16-16-16zm-280 0l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zm248 64c-8.8 0-16 7.2-16 16v288c0 26.47-21.53 48-48 48H112c-26.47 0-48-21.5-48-48V144c0-8.8-7.16-16-16-16s-16 7.2-16 16v288c0 44.1 35.89 80 80 80h224c44.11 0 80-35.89 80-80V144c0-8.8-7.2-16-16-16zM144 416V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16zm96 0V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16zm96 0V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16z" />
            </svg>
            Delete
          </button>
        )}
      </nav>
    </>
  )
}

export default ItemRecipeItem
