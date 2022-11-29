import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Tribe/TribesCell/TribesCell'
import Table from 'src/components/Util/Table/Table'
import { getWeekDates, timeTag, truncate } from 'src/lib/formatters'

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

  function filterDatesByCurrentWeek(dates: FindTribes['tribes']) {
    let [start, end] = getWeekDates();
    return dates.filter(d => +new Date(d.createdAt) >= +start && +new Date(d.createdAt) < +end);
  }
  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <div className="m-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="flex items-start rounded-xl bg-white p-4 shadow-lg"> {/* TODO: Create component for this  */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>

          <div className="ml-4">
            <h2 className="font-semibold">{filterDatesByCurrentWeek(tribes).length} Tribes</h2>
            <p className="mt-2 text-sm text-gray-500">Created this week</p>
          </div>
        </div>
      </div>
      <Table data={tribes} cols={["name", "description", "createdAt", "createdBy", "actions"]} />

    </div>
  )
}

export default TribesList
