import { useAuth } from "src/auth";
import {
  checkboxInputTag,
  dynamicSort,
  formatXYtoLatLon,
  timeTag,
  truncate,
} from "src/lib/formatters";
import Toast from "src/components/Util/Toast/Toast";

import type { FindMapRegionsByMap, permission } from "types/graphql";
import { useEffect } from "react";

const DELETE_MAP_REGION_MUTATION = gql`
  mutation DeleteMapRegionMutation($id: BigInt!) {
    deleteMapRegion(id: $id) {
      id
    }
  }
`;

const MapRegionsList = ({ mapRegionsByMap }: FindMapRegionsByMap) => {
  const { currentUser } = useAuth();

  const posToMap = (coord: number): number => {
    return (500 / 100) * coord + 500 / 100;
  };
  // const calcCorners = (coords: { lat: number; lon: number }[]) => {
  //   return !coords
  //     ? null
  //     : {
  //         topleft: {
  //           lat: Math.max(...coords.map((coord) => coord.lat)),
  //           lon: Math.min(...coords.map((coord) => coord.lon)),
  //         },
  //         topright: {
  //           lat: Math.max(...coords.map((coord) => coord.lat)),
  //           lon: Math.max(...coords.map((coord) => coord.lon)),
  //         },
  //         bottomleft: {
  //           lat: Math.min(...coords.map((coord) => coord.lat)),
  //           lon: Math.min(...coords.map((coord) => coord.lon)),
  //         },
  //         bottomright: {
  //           lat: Math.min(...coords.map((coord) => coord.lat)),
  //           lon: Math.max(...coords.map((coord) => coord.lon)),
  //         },
  //       };
  // };
  const LatLon = (x: number, y: number) => {
    return {
      lat:
        y / mapRegionsByMap[0].Map.cord_mult_lat +
        mapRegionsByMap[0].Map.cord_shift_lat,
      lon:
        x / mapRegionsByMap[0].Map.cord_mult_lon +
        mapRegionsByMap[0].Map.cord_shift_lon,
    };
  };
  /**
   * Coord to lat lon
   *
   * Latitude corresponds to the Y coordinate, and Longitude corresponds to X.
   * To convert the Lat/Long map coordinates to UE coordinates, simply subtract the shift value, and multiply by the right multiplier from the following table.
   *
   *
   */

  const isInside = (lat: number, lon: number) => {
    return mapRegionsByMap.filter((mapRegion) => {
      const corners = {
        topleft: LatLon(mapRegion.start_x, mapRegion.start_y),
        topright: LatLon(mapRegion.start_x, mapRegion.end_y),
        bottomleft: LatLon(mapRegion.end_x, mapRegion.start_y),
        bottomright: LatLon(mapRegion.end_x, mapRegion.end_y),
      };
      // TODO: fix
      return (
        // lat >=  &&
        lat <= corners.topright.lat &&
        lon >= corners.bottomleft.lon &&
        lon <= corners.topright.lon
      );
    });
  };
  useEffect(() => {
    const canvas = document.getElementById("map") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    const onMouseMove = (e: MouseEvent) => {
      // console.log(e.offsetX, e.offsetY);
      const lat = (e.offsetY / 500) * 100;
      const lon = (e.offsetX / 500) * 100;

      isInside(lat, lon).forEach((mapRegion) => {
        const corners = {
          topleft: LatLon(mapRegion.start_x, mapRegion.start_y),
          topright: LatLon(mapRegion.start_x, mapRegion.end_y),
          bottomleft: LatLon(mapRegion.end_x, mapRegion.start_y),
          bottomright: LatLon(mapRegion.end_x, mapRegion.end_y),
        };
        ctx.beginPath();
        ctx.moveTo(
          posToMap(corners.bottomleft.lon),
          posToMap(corners.bottomleft.lat)
        );
        ctx.lineTo(
          posToMap(corners.bottomright.lon),
          posToMap(corners.bottomright.lat)
        );
        ctx.lineTo(
          posToMap(corners.topright.lon),
          posToMap(corners.topright.lat)
        );
        ctx.lineTo(
          posToMap(corners.topleft.lon),
          posToMap(corners.topleft.lat)
        );
        ctx.lineTo(
          posToMap(corners.bottomleft.lon),
          posToMap(corners.bottomleft.lat)
        );
        ctx.fillStyle = `rgba(${mapRegion.name.includes("water") ? 0 : 255},0,${
          mapRegion.name.includes("water") ? 255 : 0
        },${mapRegion.priority / 1000})`;
        ctx.fill();
        ctx.stroke();
      });
    };
    canvas.addEventListener("mousemove", onMouseMove);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    canvas.width = 500;
    canvas.height = 500;
    img.src = `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${mapRegionsByMap[0].Map.img}`;
    img.onload = () => {
      ctx.globalCompositeOperation = "destination-over";
      ctx.drawImage(img, 0, 0, 500, 500);
    };
    ctx.globalCompositeOperation = "source-over";
    dynamicSort(mapRegionsByMap, "priority").forEach((mapRegion) => {
      const start = LatLon(mapRegion.start_x, mapRegion.start_y);
      const end = LatLon(mapRegion.end_x, mapRegion.end_y);
      ctx.beginPath();
      // console.table({
      //   topleft: {
      //     lat: start.lat,
      //     lon: start.lon,
      //   },
      //   topright: {
      //     lat: start.lat,
      //     lon: end.lon,
      //   },
      //   bottomleft: {
      //     lat: end.lat,
      //     lon: start.lon,
      //   },
      //   bottomright: {
      //     lat: end.lat,
      //     lon: end.lon,
      //   },
      // });

      // ctx.moveTo(posToMap(start.lon), posToMap(start.lat));
      // ctx.lineTo(posToMap(end.lon), posToMap(start.lat));
      // ctx.lineTo(posToMap(end.lon), posToMap(end.lat));
      // ctx.lineTo(posToMap(start.lon), posToMap(end.lat));
      // ctx.lineTo(posToMap(start.lon), posToMap(start.lat));
      // ctx.strokeStyle = mapRegion.name.includes("water") ? "blue" : "red";

      // ctx.fillStyle = `rgba(${mapRegion.name.includes("water") ? 0 : 255},0,${
      //   mapRegion.name.includes("water") ? 255 : 0
      // },${mapRegion.priority / 1000})`;
      // ctx.fill();

      // ctx.stroke();
    });

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="rw-segment">
      <canvas id="map" />
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
  );
};

export default MapRegionsList;
