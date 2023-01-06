import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Timeline/TimelinesCell'
import { timeTag, truncate } from 'src/lib/formatters'

import type { DeleteTimelineMutationVariables, FindTimelines } from 'types/graphql'

const DELETE_TIMELINE_MUTATION = gql`
  mutation DeleteTimelineMutation($id: String!) {
    deleteTimeline(id: $id) {
      id
    }
  }
`

const TimelinesList = ({ timelines }: FindTimelines) => {
  const [deleteTimeline] = useMutation(DELETE_TIMELINE_MUTATION, {
    onCompleted: () => {
      toast.success('Timeline deleted')
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

  const onDeleteClick = (id: DeleteTimelineMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete timeline ' + id + '?')) {
      deleteTimeline({ variables: { id } })
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
            <th>Created by</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {timelines.map((timeline) => (
            <tr key={timeline.id}>
              <td>{truncate(timeline.id)}</td>
              <td>{timeTag(timeline.createdAt)}</td>
              <td>{timeTag(timeline.updatedAt)}</td>
              <td>{truncate(timeline.createdBy)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.timeline({ id: timeline.id })}
                    title={'Show timeline ' + timeline.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.timeline({ id: timeline.id })}
                    title={'Edit timeline ' + timeline.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete timeline ' + timeline.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(timeline.id)}
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

export default TimelinesList
