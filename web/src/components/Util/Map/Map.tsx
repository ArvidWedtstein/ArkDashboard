import { useCallback, useEffect, useRef, useState } from "react";

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
  disable_map?: boolean;
  size?: { width: number; height: number };
  pos?: { lat: number; lon: number; color?: string; name?: string }[];
  className?: string;
  path?: { color?: string; coords: { lat: number; lon: number }[] };
  interactive?: boolean;
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
  map_id = 2,
  size = { width: 500, height: 500 },
  pos,
  className,
  path,
  interactive = false,
  onPosClick,
}: mapProps) => {
  const svgRef = useRef(null);
  const imgRef = useRef(null);
  const maps = {
    2: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/TheIsland-Map.webp",
    3: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/TheCenter-Map.webp",
    7: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/ScorchedEarth-Map.webp",
    4: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Ragnarok-Map.webp",
    5: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Aberration-Map.webp",
    6: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Extinction-Map.webp",
    1: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Valguero-Map.webp",
    8: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Genesis-Map.webp",
    10: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/CrystalIsles-Map.webp",
    11: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Fjordur-Map.webp",
    12: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/LostIsland-Map.webp",
    9: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/Genesis2-Map.webp",
  };
  const [zoom, setZoom] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [map, setMap] = useState(map_id);

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
    setPanPosition({ x: 0, y: 0 });
    setIsDragging(false);
    setStartPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
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
    };
  }, []);

  const isInBounds = () => {
    const rect = svgRef.current.getBoundingClientRect();
    const imgRect = imgRef.current.getBoundingClientRect();

    if (
      imgRect.left / zoom < rect.left ||
      imgRect.right / zoom > rect.right ||
      imgRect.top / zoom < rect.top ||
      imgRect.bottom / zoom > rect.bottom
    )
      return false;
    else return true;
    // return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
  };
  const handleWheel = (event: React.WheelEvent<SVGImageElement>) => {
    const minZoom = 1;
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
    event: React.MouseEvent<SVGImageElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (!interactive || !event.shiftKey) return;
    setIsDragging(true);
    setStartPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (
    event: React.MouseEvent<SVGImageElement, MouseEvent>
  ) => {
    if (!isDragging || !interactive || !event.shiftKey) return;

    const dx = event.clientX - startPosition.x;
    const dy = event.clientY - startPosition.y;

    // if (isInBounds()) {
    //   setIsDragging(false);
    //   console.info('out of bounds');
    //   return;
    // }

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
          <option value={5}>Aberration</option>
          <option value={10}>Crystal Isles</option>
          <option value={6}>Extinction</option>
          <option value={11}>Fjordur</option>
          <option value={8}>Genesis</option>
          <option value={9}>Genesis 2</option>
          <option value={12}>Lost Island</option>
          <option value={4}>Ragnarok</option>
          <option value={7}>Scorched Earth</option>
          <option value={3}>The Center</option>
          <option value={2}>The Island</option>
          <option value={1}>Valguero</option>
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
        <image
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          href={maps[map]}
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
        <g
          x={0}
          y={0}
          style={{
            transform: `scale(${zoom}) translate(${panPosition.x.toFixed(1)}px, ${panPosition.y.toFixed(1)}px)`,
          }}
          width="100%"
          height="100%"
        >
          {pos?.map((p, i) => (
            <circle
              style={{
                // pointerEvents: "none",
                width: "100%",
                cursor: "pointer",
                height: "100%",
                transform: `scale(${zoom}) translate(${panPosition.x.toFixed(1)}px, ${panPosition.y.toFixed(1)}px)`,
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
              cy={(size.height / 100) * p.lat + size.height / 100}
              cx={(size.width / 100) * p.lon + size.width / 100}
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
