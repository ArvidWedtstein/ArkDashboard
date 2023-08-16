import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import Toast from 'src/components/Util/Toast/Toast'

import { timeTag } from 'src/lib/formatters'

import type {
  DeleteMapResourceMutationVariables,
  FindMapResourceById,
} from 'types/graphql'

const DELETE_MAP_RESOURCE_MUTATION = gql`
  mutation DeleteMapResourceMutation($id: BigInt!) {
    deleteMapResource(id: $id) {
      id
    }
  }
`

interface Props {
  mapResource: NonNullable<FindMapResourceById['mapResource']>
}

const MapResource = ({ mapResource }: Props) => {
  const [deleteMapResource] = useMutation(DELETE_MAP_RESOURCE_MUTATION, {
    onCompleted: () => {
      toast.success('MapResource deleted')
      navigate(routes.mapResources())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteMapResourceMutationVariables['id']) => {
    toast.custom(
      (t) => (
        <Toast
          t={t}
          title={`You are about to delete mapResource`}
          message={`Are you sure you want to delete mapResource?`}
          actionType="YesNo"
          primaryAction={() => deleteMapResource({ variables: { id } })}
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
            MapResource {mapResource.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{mapResource.id}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(mapResource.created_at)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(mapResource.updated_at)}</td>
            </tr>
            <tr>
              <th>Map id</th>
              <td>{mapResource.map_id}</td>
            </tr>
            <tr>
              <th>Item id</th>
              <td>{mapResource.item_id}</td>
            </tr>
            <tr>
              <th>Latitude</th>
              <td>{mapResource.latitude}</td>
            </tr>
            <tr>
              <th>Longitude</th>
              <td>{mapResource.longitude}</td>
            </tr>
            <tr>
              <th>Type</th>
              <td>{mapResource.type}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editMapResource({ id: mapResource.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(mapResource.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default MapResource
