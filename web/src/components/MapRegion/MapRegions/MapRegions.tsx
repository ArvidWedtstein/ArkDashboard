import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useAuth } from 'src/auth'
import { QUERY } from 'src/components/MapRegion/MapRegionsCell'
import { checkboxInputTag, timeTag, truncate } from 'src/lib/formatters'
import Toast from 'src/components/Util/Toast/Toast'

import type {
  DeleteMapRegionMutationVariables,
  FindMapRegionsByMap,
  permission,
} from 'types/graphql'

const DELETE_MAP_REGION_MUTATION = gql`
  mutation DeleteMapRegionMutation($id: BigInt!) {
    deleteMapRegion(id: $id) {
      id
    }
  }
`

const MapRegionsList = ({ mapRegionsByMap }: FindMapRegionsByMap) => {
  const { currentUser } = useAuth()
  const [deleteMapRegion] = useMutation(DELETE_MAP_REGION_MUTATION, {
    onCompleted: () => {
      toast.success('MapRegion deleted')
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

  const onDeleteClick = (id: DeleteMapRegionMutationVariables['id']) => {
    toast.custom(
      (t) => (
        <Toast
          t={t}
          title={`You are about to delete mapRegion`}
          message={`Are you sure you want to delete mapRegion {id}?`}
          actionType="YesNo"
          primaryAction={() => deleteMapRegion({ variables: { id } })}
        />
      ),
      { position: 'top-center' }
    )
  }
  const xy = (x: number, y: number, multX: number, multY: number, shiftX: number, shiftY: number) => {
    return {
      lat: Math.floor(y / multY + shiftY),
      lon: Math.floor(x / multX + shiftX),
    }
  }
  return (
    <div className="rw-segment">

      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Map id</th>
            <th>Wind</th>
            <th>Temperature</th>
            <th>Priority</th>
            <th>Outside</th>
            <th>Start</th>
            <th>End</th>
            <th>Lat</th>
            <th>Lon</th>
            <th>End Coord</th>
          </tr>
        </thead>
        <tbody>
          {mapRegionsByMap.map((mapRegion) => (
            <tr key={mapRegion.id}>
              <td>{truncate(mapRegion.id)}</td>
              <td>{truncate(mapRegion.name)}</td>
              <td>{truncate(mapRegion.map_id)}</td>
              <td>{truncate(mapRegion.wind)}</td>
              <td>{truncate(mapRegion.temperature)}</td>
              <td>{truncate(mapRegion.priority)}</td>
              <td>{checkboxInputTag(mapRegion.outside)}</td>
              <td>{`${mapRegion.start_x} - ${mapRegion.start_z}`}</td>
              <td>{`${mapRegion.end_x} - ${mapRegion.end_z}`}</td>
              <td>{xy(mapRegion.start_x, mapRegion.start_z, mapRegion.Map.cord_mult_lon, mapRegion.Map.cord_mult_lat, mapRegion.Map.cord_shift_lon, mapRegion.Map.cord_shift_lat).lat}</td>
              <td>{xy(mapRegion.start_x, mapRegion.start_z, mapRegion.Map.cord_mult_lon, mapRegion.Map.cord_mult_lat, mapRegion.Map.cord_shift_lon, mapRegion.Map.cord_shift_lat).lon}</td>
              <td>{`${mapRegion.end_x} - ${mapRegion.end_z}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MapRegionsList
