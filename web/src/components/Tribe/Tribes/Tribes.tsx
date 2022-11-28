import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Tribe/TribesCell/TribesCell'
import { timeTag, truncate } from 'src/lib/formatters'

import type { DeleteTribeMutationVariables, FindTribes } from 'types/graphql'

const DELETE_TRIBE_MUTATION = gql`
  mutation DeleteTribeMutation($id: Int!) {
    deleteTribe(id: $id) {
      id
    }
  }
`
// TODO: Create random tribe name generator
const TribesList = ({ tribes }: FindTribes) => {
  const [deleteTribe] = useMutation(DELETE_TRIBE_MUTATION, {
    onCompleted: () => {
      toast.success('Tribe deleted')
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

  const onDeleteClick = (id: DeleteTribeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete tribe ' + id + '?')) {
      deleteTribe({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <div className="flex items-start rounded-xl bg-white p-4 shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </div>

      <div className="ml-4">
        <h2 className="font-semibold">574 Messages</h2>
        <p className="mt-2 text-sm text-gray-500">Last opened 4 days ago</p>
      </div>
    </div>

    <div className="flex items-start rounded-xl bg-white p-4 shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-orange-100 bg-orange-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>

      <div className="ml-4">
        <h2 className="font-semibold">1823 Users</h2>
        <p className="mt-2 text-sm text-gray-500">Last checked 3 days ago</p>
      </div>
    </div>
    <div className="flex items-start rounded-xl bg-white p-4 shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-100 bg-red-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>

      <div class="ml-4">
        <h2 class="font-semibold">548 Posts</h2>
        <p class="mt-2 text-sm text-gray-500">Last authored 1 day ago</p>
      </div>
    </div>
    <div className="flex items-start rounded-xl bg-white p-4 shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </div>

      <div className="ml-4">
        <h2 className="font-semibold">129 Comments</h2>
        <p className="mt-2 text-sm text-gray-500">Last commented 8 days ago</p>
      </div>
    </div>
  </div>
      <table className="table-auto">
        <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
          <tr>
            <th className="p-2 whitespace-nowrap">
              <div className="font-semibold text-left">Name</div>
            </th>
            <th className="p-2 whitespace-nowrap">
              <div className="font-semibold text-left">Description</div>
            </th>
            <th className="p-2 whitespace-nowrap">
              <div className="font-semibold text-left">Created at</div>
            </th>
            {/* <th className="p-2 whitespace-nowrap">
              <div className="font-semibold text-left">Updated at</div>
            </th> */}
            <th className="p-2 whitespace-nowrap">
              <div className="font-semibold text-left">Created by</div>
            </th>
            <th className="p-2 whitespace-nowrap">
              <div className="font-semibold text-left">&nbsp;</div>
            </th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-100">
          {tribes.map((tribe) => (
            <tr key={tribe.id}>
              <td className="p-2 whitespace-nowrap">
                <div className="text-left">{truncate(tribe.name)}</div>
              </td>
              <td className="p-2 whitespace-nowrap">
                <div className="text-left">{truncate(tribe.description)}</div>
              </td>
              <td className="p-2 whitespace-nowrap">
                <div className="text-left">{timeTag(tribe.createdAt)}</div>
              </td>
              {/* <td className="p-2 whitespace-nowrap">
              <div className="text-left">{timeTag(tribe.updatedAt)}</div>
            </td> */}
              <td className="p-2 whitespace-nowrap">
                {/* <div className="flex items-center">
                <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3">
                  <img className="rounded-full" src="https://raw.githubusercontent.com/cruip/vuejs-admin-dashboard-template/main/src/images/user-36-05.jpg" width="40" height="40" alt="Alex Shatov" />
                </div>
              </div> */}
                <div className="text-left">{truncate(tribe.createdBy)}</div>
              </td>
              <td className="p-2 whitespace-nowrap">
                <nav className="rw-table-actions">
                  <Link
                    to={routes.tribe({ id: tribe.id })}
                    title={'Show tribe ' + tribe.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editTribe({ id: tribe.id })}
                    title={'Edit tribe ' + tribe.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete tribe ' + tribe.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(tribe.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <table className="table-auto">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Created by</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {tribes.map((tribe) => (
            <tr key={tribe.id}>
              <td>{truncate(tribe.name)}</td>
              <td>{truncate(tribe.description)}</td>
              <td>{timeTag(tribe.createdAt)}</td>
              <td>{timeTag(tribe.updatedAt)}</td>
              <td>{truncate(tribe.createdBy)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.tribe({ id: tribe.id })}
                    title={'Show tribe ' + tribe.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editTribe({ id: tribe.id })}
                    title={'Edit tribe ' + tribe.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete tribe ' + tribe.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(tribe.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  )
}

export default TribesList
