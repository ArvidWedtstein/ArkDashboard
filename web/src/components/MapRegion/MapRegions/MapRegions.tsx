import { useAuth } from "src/auth";
import {
  calculateCorners,
  checkboxInputTag,
  dynamicSort,
  formatXYtoLatLon,
  groupBy,
  mergeOverlappingSvgPaths,
  timeTag,
  truncate,
} from "src/lib/formatters";
import Toast from "src/components/Util/Toast/Toast";

import type { FindMapRegionsByMap, permission } from "types/graphql";
import { useEffect, useMemo } from "react";
import Disclosure from "src/components/Util/Disclosure/Disclosure";

const DELETE_MAP_REGION_MUTATION = gql`
  mutation DeleteMapRegionMutation($id: BigInt!) {
    deleteMapRegion(id: $id) {
      id
    }
  }
`;

const MapRegionsList = ({ mapRegionsByMap }: FindMapRegionsByMap) => {
  const { currentUser } = useAuth();

  let canvasWidth = 500;
  let canvasHeight = 500;
  const posToMap = (coord: number): number => {
    return (canvasHeight / 100) * coord + canvasWidth / 100;
  };

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
  const groupedRegions = useMemo(() => {
    const regions = groupBy(mapRegionsByMap, "name");
    return Object.keys(regions).map((key) => {
      return {
        name: key,
        regions: regions[key],
      };
    });
  }, [])

  const isInside = (lat: number, lon: number) => {
    return groupedRegions.map((group) => {
      if (group.regions.some((mapRegion) => {
        const corners = calculateCorners({ x: mapRegion.start_x, y: mapRegion.start_y }, { x: mapRegion.end_x, y: mapRegion.end_y })

        const pos1 = LatLon(corners.topLeft.x, corners.topLeft.y)
        const pos2 = LatLon(corners.topRight.x, corners.topRight.y)
        const pos3 = LatLon(corners.bottomLeft.x, corners.bottomLeft.y)
        const pos4 = LatLon(corners.bottomRight.x, corners.bottomRight.y)

        return (
          lat > Math.min(pos1.lat, pos2.lat, pos3.lat, pos4.lat) &&
          lat < Math.max(pos1.lat, pos2.lat, pos3.lat, pos4.lat) &&
          lon > Math.min(pos1.lon, pos2.lon, pos3.lon, pos4.lon) &&
          lon < Math.max(pos1.lon, pos2.lon, pos3.lon, pos4.lon)
        )
      })) {
        return group
      }
    }).filter((region) => region !== undefined).flat();
  };
  useEffect(() => {
    const canvas = document.getElementById("map") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    const onMouseMove = (e: MouseEvent) => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const lat = (e.offsetY / 500) * 100;
      const lon = (e.offsetX / 500) * 100;

      const regionsInside = isInside(lat, lon).sort((a, b) => a.regions[0].priority - b.regions[0].priority)


      if (regionsInside.length === 0 || regionsInside.some(d => d.regions.length === 0)) return;
      ctx.globalCompositeOperation = "source-over";
      ctx.filter = "blur(4px)";
      ctx.fillStyle = "rgba(255,0,0,0.5)";

      // const newpaths = mergeOverlappingSvgPaths(regionsInside[0].regions.flatMap((mapRegion) => {
      //   const corners = calculateCorners({ x: mapRegion.start_x, y: mapRegion.start_y }, { x: mapRegion.end_x, y: mapRegion.end_y })

      //   const pos1 = LatLon(corners.topLeft.x, corners.topLeft.y)
      //   const pos2 = LatLon(corners.topRight.x, corners.topRight.y)
      //   const pos3 = LatLon(corners.bottomLeft.x, corners.bottomLeft.y)
      //   const pos4 = LatLon(corners.bottomRight.x, corners.bottomRight.y)

      //   return { pathData: `M${posToMap(pos1.lon)} ${posToMap(pos1.lat)} L${posToMap(pos2.lon)} ${posToMap(pos2.lat)} L${posToMap(pos4.lon)} ${posToMap(pos4.lat)} L${posToMap(pos3.lon)} ${posToMap(pos3.lat)} L${posToMap(pos1.lon)} ${posToMap(pos1.lat)} Z` }
      // }));

      // ctx.strokeStyle = "rgba(255,255,255,1)";
      // ctx.fill(new Path2D(newpaths.pathData.split("Z")[0]));
      // ctx.stroke(new Path2D(newpaths.pathData.split("Z")[0]));

      ctx.lineJoin = "miter";
      ctx.lineWidth = 1
      const path = new Path2D();
      regionsInside[0].regions.forEach((mapRegion, i) => {

        const corners = calculateCorners({ x: mapRegion.start_x, y: mapRegion.start_y }, { x: mapRegion.end_x, y: mapRegion.end_y })

        const pos1 = LatLon(corners.topLeft.x, corners.topLeft.y)
        const pos2 = LatLon(corners.topRight.x, corners.topRight.y)
        const pos3 = LatLon(corners.bottomLeft.x, corners.bottomLeft.y)
        const pos4 = LatLon(corners.bottomRight.x, corners.bottomRight.y)

        path.addPath(new Path2D(`M${posToMap(pos1.lon)} ${posToMap(pos1.lat)} L${posToMap(pos2.lon)} ${posToMap(pos2.lat)} L${posToMap(pos4.lon)} ${posToMap(pos4.lat)} L${posToMap(pos3.lon)} ${posToMap(pos3.lat)} L${posToMap(pos1.lon)} ${posToMap(pos1.lat)} Z`))
      });
      // ctx.strokeStyle = "rgba(255,255,255,1)";
      ctx.fill(path, "nonzero");
      // ctx.stroke(path);

      ctx.filter = "blur(0px)"
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.font = "24px arial";
      ctx.fillText(regionsInside[0].name, 5, 25);
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    ctx.globalCompositeOperation = "source-over";
    dynamicSort(mapRegionsByMap, "priority").forEach((mapRegion) => {
      const start = LatLon(mapRegion.start_x, mapRegion.start_y);
      const end = LatLon(mapRegion.end_x, mapRegion.end_y);
      // ctx.beginPath();

      // if (mapRegion.name.includes("Lava Cave")) {
      //   const corners = calculateCorners({ x: mapRegion.start_x, y: mapRegion.start_y }, { x: mapRegion.end_x, y: mapRegion.end_y })

      //   const pos1 = LatLon(corners.topLeft.x, corners.topLeft.y)
      //   const pos2 = LatLon(corners.topRight.x, corners.topRight.y)
      //   const pos3 = LatLon(corners.bottomLeft.x, corners.bottomLeft.y)
      //   const pos4 = LatLon(corners.bottomRight.x, corners.bottomRight.y)

      //   ctx.moveTo(posToMap(pos1.lon), posToMap(pos1.lat));
      //   ctx.lineTo(posToMap(pos2.lon), posToMap(pos2.lat));
      //   ctx.lineTo(posToMap(pos4.lon), posToMap(pos4.lat));
      //   ctx.lineTo(posToMap(pos3.lon), posToMap(pos3.lat));
      //   ctx.lineTo(posToMap(pos1.lon), posToMap(pos1.lat));
      //   ctx.fillStyle = `rgba(${mapRegion.name.includes("water") ? 0 : 255},0,${mapRegion.name.includes("water") ? 255 : 0
      //     },${mapRegion.priority / 1000})`;
      //   ctx.fill();
      // }
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
      canvas.removeEventListener("mouseleave", () => {
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    };
  }, []);

  return (
    <div className="rw-segment">
      <div className="relative">
        <img className="absolute top-0 left-0 bottom-0 w-[500px] h-[500px] -z-10" src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${mapRegionsByMap[0].Map.topographic_img}`} alt="" decoding="async" />
        <canvas id="map" width={500} height={500} className="relative" />
      </div>
      <Disclosure title="Map Regions">
        <table className="rw-table relative">
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
      </Disclosure>
    </div>
  );
};

export default MapRegionsList;
