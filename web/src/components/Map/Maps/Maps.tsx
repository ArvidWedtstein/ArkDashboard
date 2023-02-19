import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Map/MapsCell'
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters'

import type { DeleteMapMutationVariables, FindMaps } from 'types/graphql'

const DELETE_MAP_MUTATION = gql`
  mutation DeleteMapMutation($id: BigInt!) {
    deleteMap(id: $id) {
      id
    }
  }
`

const MapsList = ({ maps }: FindMaps) => {
  const [deleteMap] = useMutation(DELETE_MAP_MUTATION, {
    onCompleted: () => {
      toast.success('Map deleted')
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

  const onDeleteClick = (id: DeleteMapMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete map ' + id + '?')) {
      deleteMap({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Created at</th>
            <th>Name</th>
            <th>Loot crates</th>
            <th>Oil veins</th>
            <th>Water veins</th>
            <th>Wyvern nests</th>
            <th>Ice wyvern nests</th>
            <th>Gas veins</th>
            <th>Deinonychus nests</th>
            <th>Charge nodes</th>
            <th>Plant z nodes</th>
            <th>Drake nests</th>
            <th>Glitches</th>
            <th>Magmasaur nests</th>
            <th>Poison trees</th>
            <th>Mutagen bulbs</th>
            <th>Carniflora</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {maps.map((map) => (
            <tr key={map.id}>
              <td>{truncate(map.id)}</td>
              <td>{timeTag(map.created_at)}</td>
              <td>{truncate(map.name)}</td>
              <td>{jsonTruncate(map.loot_crates)}</td>
              <td>{jsonTruncate(map.oil_veins)}</td>
              <td>{jsonTruncate(map.water_veins)}</td>
              <td>{jsonTruncate(map.wyvern_nests)}</td>
              <td>{jsonTruncate(map.ice_wyvern_nests)}</td>
              <td>{jsonTruncate(map.gas_veins)}</td>
              <td>{jsonTruncate(map.deinonychus_nests)}</td>
              <td>{jsonTruncate(map.charge_nodes)}</td>
              <td>{jsonTruncate(map.plant_z_nodes)}</td>
              <td>{jsonTruncate(map.drake_nests)}</td>
              <td>{jsonTruncate(map.glitches)}</td>
              <td>{jsonTruncate(map.magmasaur_nests)}</td>
              <td>{jsonTruncate(map.poison_trees)}</td>
              <td>{jsonTruncate(map.mutagen_bulbs)}</td>
              <td>{jsonTruncate(map.carniflora)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.map({ id: map.id })}
                    title={'Show map ' + map.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editMap({ id: map.id })}
                    title={'Edit map ' + map.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete map ' + map.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(map.id)}
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

export default MapsList
