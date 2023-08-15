import { useCallback, useEffect, useRef, useState } from "react";
import { useLazyQuery } from "@apollo/client";

const MAPQUERY = gql`
  query FindMapsForMapComp {
    maps {
      id
      name
      img
      other_Map {
        id
        name
      }
    }
  }
`;

const drawSvgPath = (
  coordinates: { lat: number; lon: number }[],
  size: { width: number; height: number }
): string => {
  let pathString = "";
  coordinates.forEach((coordinate, index) => {
    const command = index === 0 ? "M" : "L";
    pathString += `${command}${(size.height / 100) * coordinate.lon + size.width / 100
      } ${(size.width / 100) * coordinate.lat + size.height / 100} `;
  });
  return pathString;
};
interface mapProps {
  map_id?: number;
  submap_id?: number;
  disable_map?: boolean;
  disable_sub_map?: boolean;
  size?: { width: number; height: number };
  pos?: { lat: number; lon: number; color?: string; name?: string }[];
  className?: string;
  path?: { color?: string; coords: { lat: number; lon: number }[] };
  interactive?: boolean;
  onSubMapChange?: (submap: number) => void;
  onPosClick?: (pos: {
    lat: number;
    lon: number;
    color?: string;
    name?: string;
    node_index?: number;
  }) => void;
}
const Map = ({
  disable_map = false,
  disable_sub_map = true,
  map_id = 2,
  submap_id = null,
  size = { width: 500, height: 500 },
  pos,
  className,
  path,
  interactive = false,
  onPosClick,
  onSubMapChange,
}: mapProps) => {
  const [loadMaps, { called, loading, data }] = useLazyQuery(MAPQUERY, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  // TODO: fetch from db instead of hardcoding
  const maps = {
    1: {
      "drawn": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Valguero-Map.webp",
      "topographic": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Valguero-Map-Topographic.webp"
    },
    2: {
      "drawn": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/TheIsland-Map.webp",
      "topographic": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/TheIsland-Map-Topographic.webp"
    },
    3: {
      "drawn": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/TheCenter-Map.webp",
      "topographic": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/TheCenter-Map-Topographic.webp"
    },
    4: {
      "drawn": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Ragnarok-Map.webp",
      "topographic": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Ragnarok-Map-Topographic.webp"
    },
    5: {
      "drawn": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Aberration-Map.webp",
      "topographic": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Aberration-Map-Topographic.webp"
    },
    6: {
      "drawn": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Extinction-Map.webp",
      "topographic": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Extinction-Map-Topographic.webp"
    },
    7: {
      "drawn": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/ScorchedEarth-Map.webp",
      "topographic": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/ScorchedEarth-Map-Topographic.webp"
    },
    8: {
      "drawn": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Genesis-Map.webp",
      "topographic": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Genesis-Map-Topographic.webp"
    },
    9: {
      "drawn": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Genesis2-Map.webp",
      "topographic": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Genesis2-Map-Topographic.webp"
    },
    10: {
      "drawn": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/CrystalIsles-Map.webp",
      "topographic": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/CrystalIsles-Map-Topographic.webp"
    },
    11: {
      "drawn": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Fjordur-Map.webp",
      "topographic": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Fjodur-Map-Topographic.webp"
    },
    12: {
      "drawn": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/LostIsland-Map.webp",
      "topographic": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/LostIsland-Map-Topographic.webp"
    },
    13: {
      "drawn": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Fjordur-Map.webp",
      "topographic": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Fjordur-Jotunheim-Map-Topographic.webp",
      "boundaries": [
        {
          "lat": 54.48,
          "lon": 21.35,
        },
        {
          "lat": 97.36,
          "lon": 64.23,
        }
      ]
    },
    14: {
      "drawn": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Fjordur-Map.webp",
      "topographic": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Fjordur-Vanaheim-Map-Topographic.webp",
      "boundaries": [
        {
          "lat": -9.15,
          "lon": 62.5,
        },
        {
          "lat": 33.73,
          "lon": 105.38,
        }
      ]
    },
    15: {
      "drawn": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Fjordur-Map.webp",
      "topographic": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Fjordur-Asgard-Map-Topographic.webp",
      "boundaries": [
        {
          "lat": 17.40,
          "lon": 5.20,
        },
        {
          "lat": 68.88,
          "lon": 56.45,
        }
      ]
    },
    16: {
      "drawn": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Fjordur-Map.webp",
      "topographic": "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Fjordur-Map-Topographic.webp",
    }
  }
  const svgRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [zoom, setZoom] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [map, setMap] = useState(map_id);
  const [subMap, setSubMap] = useState<string | number>(submap_id || '');
  const [mapType, setMapType] = useState<'img' | 'topographic_img'>('img');

  const posToMap = (coord: number): number => (size.height / 100) * coord + size.height / 100
  const calcRealmCorners = (coords: { lat: number; lon: number; }[]) => {
    return !subMap || !coords ? '' : `M${posToMap(coords[0].lon)},${posToMap(coords[0].lat)} L${posToMap(coords[1].lon)},${posToMap(coords[0].lat)} L${posToMap(coords[1].lon)},${posToMap(coords[1].lat)} L${posToMap(coords[0].lon)},${posToMap(coords[1].lat)} z`
  }

  const handleKeyUp = useCallback((event) => {
    if (
      !interactive ||
      event.code !== "ShiftLeft" ||
      event.code !== "ShiftRight"
    )
      return;

    setZoom(1);
    setPanPosition({ x: 0, y: 0 });
    setIsDragging(false);
    setStartPosition({ x: 0, y: 0 });
  }, []);

  const reset = () => {
    setZoom(1);
    setMap(map_id);
    setSubMap(submap_id);
    setMapType('img');
    setPanPosition({ x: 0, y: 0 });
    setIsDragging(false);
    setStartPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    loadMaps();
    // Notification.requestPermission();
    // new Notification("test", {
    //   image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Genesis2-Map.webp",
    // })
    // if (!canvasRef.current) return;
    // const canvas = canvasRef.current;
    // const ctx = canvas.getContext("2d");
    // const img = imgRef.current;
    // if (!ctx || !img) return;
    // ctx.drawImage(img, 0, 0, size.width, size.height);
    // canvas.addEventListener('mousedown', (e) => {
    //   return handleMouseDown(e as unknown as React.MouseEvent<HTMLCanvasElement, MouseEvent>);
    // });
    // canvas.addEventListener('mousemove', (e) => {
    //   return handleMouseMove(e as unknown as React.MouseEvent<HTMLCanvasElement, MouseEvent>);
    // });
    // canvas.addEventListener('mouseup', (e) => {
    //   return handleMouseUp();
    // });
    // canvas.addEventListener('wheel', (e) => {
    //   return handleWheel(e as unknown as React.WheelEvent<HTMLCanvasElement>);
    // })


    if (!interactive || !svgRef.current) return;
    const handleResize = () => {
      // Reset pan position to center when the container size changes
      const container = svgRef.current;
      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const imageWidth = container.scrollWidth;
        const imageHeight = container.scrollHeight;
        const centerX = (containerWidth - imageWidth) / 2;
        const centerY = (containerHeight - imageHeight) / 2;
        setPanPosition({ x: centerX, y: centerY });
      }
    };

    const handleMouseLeave = () => {
      setIsDragging(false);
    };

    window.addEventListener("resize", handleResize);
    svgRef.current.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (svgRef.current) {
        svgRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }

      // if (canvasRef.current) {
      //   canvas.removeEventListener('mousedown', (e) => {
      //     return handleMouseDown(e as unknown as React.MouseEvent<HTMLCanvasElement, MouseEvent>);
      //   });
      //   canvas.removeEventListener('mousemove', (e) => {
      //     return handleMouseMove(e as unknown as React.MouseEvent<HTMLCanvasElement, MouseEvent>);
      //   });
      //   canvas.removeEventListener('mouseup', (e) => {
      //     return handleMouseUp();
      //   });
      //   canvas.removeEventListener('wheel', (e) => {
      //     return handleWheel(e as unknown as React.WheelEvent<HTMLCanvasElement>);
      //   });
      // }
    };
  }, []);

  const handleWheel = (event: React.WheelEvent<SVGImageElement | HTMLCanvasElement>) => {
    const minZoom = 0.5;
    const maxZoom = 5;
    const { clientX, clientY } = event;

    if (!interactive || !event.shiftKey) return;

    const scale = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = event.deltaY > 0 ? zoom - 0.5 : zoom + 0.5;

    const rect = svgRef.current.getBoundingClientRect();
    const offsetX = (clientX - rect.left) / zoom;
    const offsetY = (clientY - rect.top) / zoom;

    const dx = offsetX * (1 - scale);
    const dy = offsetY * (1 - scale);

    const clampedZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);
    const clampedDX =
      clampedZoom === minZoom || clampedZoom === maxZoom ? 0 : -dx;
    const clampedDY =
      clampedZoom === minZoom || clampedZoom === maxZoom ? 0 : -dy;

    setZoom(clampedZoom);
    setPanPosition((prevPosition) => ({
      x: prevPosition.x + clampedDX,
      y: prevPosition.y + clampedDY,
    }));
  };

  const handleZoomButton = (type: "in" | "out") => {
    setZoom(type == "in" ? zoom + 0.1 : zoom - 0.1);
  };

  const handleMouseDown = (
    event: React.MouseEvent<SVGImageElement | HTMLCanvasElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (!interactive || !event.shiftKey) return;
    setIsDragging(true);
    setStartPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (
    event: React.MouseEvent<SVGImageElement | HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isDragging || !interactive || !event.shiftKey) return;

    const dx = event.clientX - startPosition.x;
    const dy = event.clientY - startPosition.y;

    setPanPosition((prevPosition) => ({
      x: prevPosition.x + dx / zoom,
      y: prevPosition.y + dy / zoom,
    }));
    setStartPosition({ x: event.clientX, y: event.clientY });
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className={"flex flex-col " + className}>
      <div
        className="rw-button-group rw-button-group-border m-0"
        role="menubar"
      >

        <button
          className="rw-button rw-button-small rw-button-gray first:!rounded-bl-none last:!rounded-br-none"
          onClick={() => handleZoomButton("in")}
          disabled={zoom >= 5 || !interactive}
        >
          +
        </button>
        <button
          className="rw-button rw-button-small rw-button-gray first:!rounded-bl-none last:!rounded-br-none"
          onClick={() => handleZoomButton("out")}
          disabled={zoom == 1 || !interactive}
        >
          -
        </button>
        <select
          value={map}
          disabled={disable_map}
          className="rw-button rw-button-small rw-button-gray first:!rounded-bl-none last:!rounded-br-none"
          onChange={(e) => setMap(parseInt(e.target.value))}
        >
          {data && data.maps.map((map: { id: number; name: string }) => (
            <option key={map.id} value={map.id}>{map.name}</option>
          ))}
        </select>
        {data && data.maps.some(m => m.other_Map && m.other_Map.length > 0) && (submap_id || subMap) && (
          <select
            value={subMap}
            disabled={disable_sub_map}
            className="rw-button rw-button-small rw-button-gray first:!rounded-bl-none last:!rounded-br-none"
            onChange={({ target: { value } }) => {
              onSubMapChange?.(parseInt(value));
              setSubMap(parseInt(value));
            }}
          >
            {data && data.maps?.find(m => m.id === map || m.id === map_id).other_Map.map((map: { id: number; name: string }) => (
              <option key={map.id} value={map.id}>{map.name}</option>
            ))}
          </select>
        )}
        <select
          value={mapType}
          disabled={disable_map && disable_sub_map}
          className="rw-button rw-button-small rw-button-gray first:!rounded-bl-none last:!rounded-br-none"
          onChange={({ target: { value } }) => (value == 'img' || value == 'topographic_img') && setMapType(value)}
        >
          <option value={'img'}>Drawn</option>
          <option value={'topographic_img'}>Topographic</option>
        </select>
        <button
          className="rw-button rw-button-small rw-button-red first:!rounded-bl-none last:!rounded-br-none"
          onClick={() => {
            reset();
          }}
          disabled={!interactive}
        >
          Reset
        </button>
      </div>
      {/* TODO: replace with canvas? */}
      {/* <canvas
        ref={canvasRef}
        height={size.height}
        width={size.width}
        style={{
          cursor: interactive ? (isDragging ? "grabbing" : "grab") : "default",
        }}
        className="border border-red-500"
      /> */}
      <svg
        ref={svgRef}
        height={size.height}
        width={size.width}
        tabIndex={0}
        className={"relative"}
        cursor={interactive ? (isDragging ? "grabbing" : "grab") : "default"}
        viewBox={`0 0 ${size.width} ${size.height}`}
        onKeyUp={handleKeyUp}
        xmlns="http://www.w3.org/2000/svg"
      >
        {data && (
          <image
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            href={data.maps.find(m => m.id === (subMap !== '' ? subMap : map))[mapType]}
            height={size.height}
            width={size.width}
            ref={imgRef}
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${zoom}) translate(${panPosition.x.toFixed(1)}px, ${panPosition.y.toFixed(1)}px)`,
              transformOrigin: "center center",
            }}
          />
        )}
        {subMap !== '' && mapType !== 'topographic_img' && (
          <path
            style={{
              pointerEvents: "none",
              width: "100%",
              height: "100%",
              transform: `scale(${zoom}) translate(${panPosition.x.toFixed(1)}px, ${panPosition.y.toFixed(1)}px)`,
              transformOrigin: "center center",
            }}
            fill="#f00"
            stroke="#f00"
            strokeWidth="2"
            strokeLinecap="round"
            fillOpacity={0.2}
            strokeOpacity={0.5}
            d={calcRealmCorners(maps[subMap].boundaries)}
          />
        )}
        <g
          x={0}
          y={0}
          style={{
            transform: `scale(${zoom}) translate(${panPosition.x.toFixed(1)}px, ${panPosition.y.toFixed(1)}px)`,
            transformOrigin: "center center",
          }}
          width="100%"
          height="100%"
        >
          {pos?.map((p, i) => (
            <circle
              style={{
                width: "100%",
                height: "100%",
                cursor: "pointer",
                // transform: `scale(${zoom}) translate(${panPosition.x.toFixed(1)}px, ${panPosition.y.toFixed(1)}px)`,
                transformOrigin: "center center",
              }}
              key={"map-pos-" + i}
              id={"map-pos-" + i}
              fill={p.color || "red"}
              stroke="black"
              className="hover:stroke-red-500"
              x={0}
              onClick={() => onPosClick?.(p)}
              y={0}
              cy={posToMap(p.lat)}
              cx={posToMap(p.lon)}
              // r={((imageTransform.replace("scale(", "").replace(')', '')) as number * 2) * 2}
              r="3"
            >
              <title>{p.name}</title>
            </circle>
          ))}
        </g>
        {pos?.length > 0 && path?.coords && (
          <path
            style={{
              pointerEvents: "none",
              width: "100%",
              height: "100%",
              transform: `scale(${zoom}) translate(${panPosition.x.toFixed(1)}px, ${panPosition.y.toFixed(1)}px)`,
              transformOrigin: "center center",
            }}
            d={drawSvgPath(path.coords, size)}
            stroke={path.color || "red"}
            strokeWidth="2"
            fill="none"
          />
        )}
      </svg>
    </div>
  );
};

export default Map;
