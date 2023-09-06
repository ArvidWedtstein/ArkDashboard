import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/MapResource/MapResourcesCell'
import { timeTag, truncate } from 'src/lib/formatters'
import Toast from 'src/components/Util/Toast/Toast'

import type {
  DeleteMapResourceMutationVariables,
  FindMapResources,
} from 'types/graphql'

const DELETE_MAP_RESOURCE_MUTATION = gql`
  mutation DeleteMapResourceMutation($id: BigInt!) {
    deleteMapResource(id: $id) {
      id
    }
  }
`

const MapResourcesList = ({ mapResources }: FindMapResources) => {
  const [deleteMapResource] = useMutation(DELETE_MAP_RESOURCE_MUTATION, {
    onCompleted: () => {
      toast.success('MapResource deleted')
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

  const onDeleteClick = (id: DeleteMapResourceMutationVariables['id']) => {
    toast.custom(
      (t) => (
        <Toast
          t={t}
          title={`You are about to delete mapResource`}
          message={`Are you sure you want to delete mapResource {id}?`}
          actionType="YesNo"
          primaryAction={() => deleteMapResource({ variables: { id } })}
        />
      ),
      { position: 'top-center' }
    )
  }
  // TODO: fix
  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Map id</th>
            <th>Item id</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Type</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {mapResources.map((mapResource) => (
            <tr key={mapResource.id}>
              <td>{truncate(mapResource.id)}</td>
              <td>{timeTag(mapResource.created_at)}</td>
              <td>{timeTag(mapResource.updated_at)}</td>
              <td>{truncate(mapResource.map_id)}</td>
              <td>{truncate(mapResource.item_id)}</td>
              <td>{truncate(mapResource.latitude)}</td>
              <td>{truncate(mapResource.longitude)}</td>
              <td>{truncate(mapResource.type)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.mapResource({ id: mapResource.id })}
                    title={'Show mapResource ' + mapResource.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editMapResource({ id: mapResource.id })}
                    title={'Edit mapResource ' + mapResource.id}
                    className="rw-button rw-button-small rw-button-blue"
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
                  <button
                    type="button"
                    title={'Delete mapResource ' + mapResource.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(mapResource.id)}
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

export default MapResourcesList
