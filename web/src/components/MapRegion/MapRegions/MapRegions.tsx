import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useAuth } from 'src/auth'
import { QUERY } from 'src/components/MapRegion/MapRegionsCell'
import { checkboxInputTag, formatXYtoLatLon, timeTag, truncate } from 'src/lib/formatters'
import Toast from 'src/components/Util/Toast/Toast'

import type {
  DeleteMapRegionMutationVariables,
  FindMapRegionsByMap,
  permission,
} from 'types/graphql'
import { useEffect } from 'react'

const DELETE_MAP_REGION_MUTATION = gql`
  mutation DeleteMapRegionMutation($id: BigInt!) {
    deleteMapRegion(id: $id) {
      id
    }
  }
`

const MapRegionsList = ({ mapRegionsByMap }: FindMapRegionsByMap) => {
  const { currentUser } = useAuth()

  const posToMap = (
    coord: number,
  ): number => {
    return (500 / 100) * coord + 500 / 100;
  };
  const calcRealmCorners = (coords: { lat: number; lon: number }[], ctx) => {
    return !coords
      ? null
      : `M${posToMap(coords[0].lon)},${posToMap(coords[0].lat)} L${posToMap(
        coords[1].lon
      )},${posToMap(coords[0].lat)} L${posToMap(coords[1].lon)},${posToMap(
        coords[1].lat
      )} L${posToMap(coords[0].lon)},${posToMap(coords[1].lat)} z`;
  };

  const LatLon = (x: number, y: number) => {
    return {
      lat: (y / mapRegionsByMap[0].Map.cord_mult_lat) + mapRegionsByMap[0].Map.cord_shift_lat,
      lon: (x / mapRegionsByMap[0].Map.cord_mult_lon) + mapRegionsByMap[0].Map.cord_shift_lon,
    }
  }
  /**
   * Coord to lat lon
   *
   * Latitude corresponds to the Y coordinate, and Longitude corresponds to X.
   * To convert the Lat/Long map coordinates to UE coordinates, simply subtract the shift value, and multiply by the right multiplier from the following table.
   *
   *
   */

  useEffect(() => {
    const canvas = document.getElementById('map') as HTMLCanvasElement
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    canvas.width = 500;
    canvas.height = 500;
    img.src = `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${mapRegionsByMap[0].Map.img}`;
    img.onload = () => {

      ctx.globalCompositeOperation = 'destination-over';
      ctx.drawImage(img, 0, 0, 500, 500);
    }
    ctx.globalCompositeOperation = 'source-over';
    mapRegionsByMap.forEach((mapRegion) => {
      const start = LatLon(mapRegion.start_x, mapRegion.start_y)
      const end = LatLon(mapRegion.end_x, mapRegion.end_y)
      ctx.beginPath();
      ;
      ctx.moveTo(posToMap(start.lon), posToMap(start.lat));
      ctx.lineTo(posToMap(end.lon), posToMap(start.lat));
      ctx.lineTo(posToMap(end.lon), posToMap(end.lat));
      ctx.lineTo(posToMap(start.lon), posToMap(end.lat));
      ctx.lineTo(posToMap(start.lon), posToMap(start.lat));
      ctx.strokeStyle = 'red';
      ctx.stroke();
    });

    ctx.fillStyle = 'blue';
    ctx.fillRect(75, 75, 100, 100);

  }, [])

  return (
    <div className="rw-segment">
      <canvas id="map">

      </canvas>
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
            <th>Start Lat</th>
            <th>Start Lon</th>
            <th>End Lat</th>
            <th>End Lon</th>
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
              <td>{LatLon(mapRegion.start_x, mapRegion.start_y).lat}</td>
              <td>{LatLon(mapRegion.start_x, mapRegion.start_y).lon}</td>
              <td>{LatLon(mapRegion.end_x, mapRegion.end_y).lat}</td>
              <td>{LatLon(mapRegion.end_x, mapRegion.end_y).lon}</td>
              <td>{`${mapRegion.end_x} - ${mapRegion.end_z}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MapRegionsList
