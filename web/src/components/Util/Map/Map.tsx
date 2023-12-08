import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useLazyQuery } from "@apollo/client";
import { Lookup } from "../Lookup/Lookup";
import Button from "../Button/Button";
import clsx from "clsx";

const MAPQUERY = gql`
  query FindMapsForMapComp {
    maps {
      id
      name
      img
      topographic_img
      parent_map_id
      boundaries
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
  disable_map_type?: boolean;
  size?: { width: number; height: number };
  pos?: {
    lat: number;
    lon: number;
    color?: string;
    image?: string;
    name?: string;
    opacity?: number;
    /**
     * Used to determine which node to use for the selected map
     */
    map_id?: number;
  }[];
  className?: string;
  path?: { color?: string; coords: { lat: number; lon: number }[] };
  interactive?: boolean;
  onSubMapChange?: (submap: number) => void;
  onMapChange?: (map: number) => void;
  mapFilter?: (map: { id: number; name: string }) => boolean;
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
  disable_map_type = false,
  map_id = 2,
  submap_id = null,
  size = { width: 500, height: 500 },
  pos,
  className,
  path,
  interactive = false,
  mapFilter,
  onPosClick,
  onMapChange,
  onSubMapChange,
}: mapProps) => {
  const [loadMaps, { called, loading, data }] = useLazyQuery(MAPQUERY, {
    onError: (error) => {
      console.error(error);
    },
  });

  const svgRef = useRef(null);
  const imgRef = useRef(null);

  const [zoom, setZoom] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [map, setMap] = useState(map_id);
  const [subMap, setSubMap] = useState<string | number>(submap_id || null);
  const [mapType, setMapType] = useState<"img" | "topographic_img">("img");

  const posToMap = (
    coord: number,
    boundaries?: { lat: number; lon: number }[]
  ): number => {
    // TODO: fix boundary calculations
    return (size.height / 100) * coord + size.height / 100;
  };
  const calcRealmCorners = (coords: { lat: number; lon: number }[]) => {
    return !subMap || !coords
      ? ""
      : `M${posToMap(coords[0].lon)},${posToMap(coords[0].lat)} L${posToMap(
        coords[1].lon
      )},${posToMap(coords[0].lat)} L${posToMap(coords[1].lon)},${posToMap(
        coords[1].lat
      )} L${posToMap(coords[0].lon)},${posToMap(coords[1].lat)} z`;
  };

  useLayoutEffect(() => {
    if (!called && !loading) {
      loadMaps();
    }
    setMap(map_id);
    setSubMap(submap_id);

    // if (data)
    // console.log(
    //   data.maps.filter(
    //     (m) =>
    //       m.parent_map_id == null &&
    //       (mapFilter ? mapFilter({ id: m.id, name: m.name }) : true)
    //   )
    // );
  }, [called, loading, submap_id, map_id]);

  const handleKeyUp = useCallback((event) => {
    if (
      !interactive ||
      event.code !== "ShiftLeft" ||
      event.code !== "ShiftRight"
    ) {
      return;
    }

    setZoom(1);
    setPanPosition({ x: 0, y: 0 });
    setIsDragging(false);
    setStartPosition({ x: 0, y: 0 });
  }, []);

  const reset = useCallback(() => {
    setZoom(1);
    setMap(map_id);
    setSubMap(submap_id);
    setMapType("img");
    setPanPosition({ x: 0, y: 0 });
    setIsDragging(false);
    setStartPosition({ x: 0, y: 0 });
  }, [map_id, submap_id]);

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

  const handleWheel = (
    event: React.WheelEvent<SVGImageElement | HTMLCanvasElement>
  ) => {
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
    <div className={clsx("relative flex flex-col max-w-fit", className)}>
      <div className="flex flex-row m-0 max-w-[500px]" role="menubar">
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => handleZoomButton("in")}
          disabled={zoom >= 5 || !interactive}
          className="rounded-r-none first:!rounded-bl-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="fill-current w-4"
          >
            <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
          </svg>
          <span className="sr-only">Zoom In</span>
        </Button>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => handleZoomButton("out")}
          disabled={zoom == 1 || !interactive}
          className="rounded-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="fill-current w-4"
          >
            <path d="M432 256C432 264.8 424.8 272 416 272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h384C424.8 240 432 247.2 432 256z" />
          </svg>
          <span className="sr-only">Zoom Out</span>
        </Button>

        <Lookup
          margin="none"
          disableClearable
          size="small"
          SuffixProps={{
            style: {
              borderRadius: '0',
              marginRight: '-0.5px'
            }
          }}
          value={data?.maps.find((m) => m.id === map)}
          disabled={disable_map}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          options={
            (data?.maps.filter(
              (m) =>
                m.parent_map_id == null &&
                (mapFilter ? mapFilter({ id: m.id, name: m.name }) : true)
            ) as { id: number; name: string }[]) ?? []
          }
          onSelect={(e) => {
            if (!e) return;
            onMapChange?.(parseInt(e.id.toString()));
            setMap(parseInt(e.id.toString()));
          }}
        />
        {data &&
          data.maps.some(
            (m) => m.other_Map && m.other_Map.length > 0 && m.id === map
          ) && (
            <Lookup
              margin="none"
              disableClearable
              size="small"
              defaultValue={subMap}
              disabled={disable_sub_map}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) => option.name}
              options={
                data.maps?.find((m) => m.id === map || m.id === map_id)
                  .other_Map as { id: number; name: string }[]
              }
              SuffixProps={{
                style: {
                  borderRadius: '0'
                }
              }}
              onSelect={(e) => {
                if (!e) return;
                onSubMapChange?.(parseInt(e.id.toString()));
                setSubMap(parseInt(e.id.toString()));
              }}
            />
          )}
        <Lookup
          margin="none"
          disableClearable
          SuffixProps={{
            style: {
              borderRadius: '0',
            }
          }}
          size="small"
          value={[
            { label: "Drawn", value: "img" },
            { label: "Topographic", value: "topographic_img" },
          ].find((mt) => mt.value === mapType)}
          disabled={disable_map_type}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          getOptionLabel={(option) => option.label}
          options={[
            { label: "Drawn", value: "img" },
            { label: "Topographic", value: "topographic_img" },
          ]}
          onSelect={(e) => {
            if (!e) return;
            setMapType(e.value.toString() as "img" | "topographic_img");
          }}
        />
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={() => {
            reset();
          }}
          className="rounded-l-none last:!rounded-br-none"
          disabled={!interactive}
        >
          Reset
        </Button>
      </div>

      <svg
        ref={svgRef}
        height={size.height}
        width={size.width}
        tabIndex={0}
        className={"relative w-fit"}
        cursor={interactive ? (isDragging ? "grabbing" : "grab") : "default"}
        viewBox={`0 0 ${size.width} ${size.height}`}
        onKeyUp={handleKeyUp}
        xmlns="http://www.w3.org/2000/svg"
      >
        {data && (
          <image
            amplitude={0.5}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            href={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${data?.maps?.find(
              (m) =>
                m.id ===
                (data.maps.find((m) => m.id === map)?.other_Map.length > 0
                  ? subMap ?? 16
                  : map)
            )[mapType] || ""
              }`}
            height={size.height}
            width={size.width}
            ref={imgRef}
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${zoom}) translate(${panPosition.x.toFixed(
                1
              )}px, ${panPosition.y.toFixed(1)}px)`,
              transformOrigin: "center center",
            }}
          />
        )}
        {subMap &&
          mapType !== "topographic_img" &&
          data?.maps?.find((m) => m.id === (submap_id ? subMap : map))
            ?.boundaries != null && (
            <path
              style={{
                pointerEvents: "none",
                width: "100%",
                height: "100%",
                transform: `scale(${zoom}) translate(${panPosition.x.toFixed(
                  1
                )}px, ${panPosition.y.toFixed(1)}px)`,
                transformOrigin: "center center",
              }}
              fill="#f00"
              stroke="#f00"
              strokeWidth="2"
              strokeLinecap="round"
              fillOpacity={0.2}
              strokeOpacity={0.5}
              d={calcRealmCorners(
                JSON.parse(
                  data?.maps?.find((m) => m.id === (submap_id ? subMap : map))
                    ?.boundaries
                )
              )}
            />
          )}
        <g
          x={0}
          y={0}
          style={{
            transform: `scale(${zoom}) translate(${panPosition.x.toFixed(
              1
            )}px, ${panPosition.y.toFixed(1)}px)`,
            transformOrigin: "center center",
          }}
          width="100%"
          height="100%"
        >
          {pos &&
            pos
              ?.filter((p) =>
                p?.map_id ? p?.map_id === map || p.map_id === subMap : true
              )
              ?.map((p, i) => (
                <React.Fragment key={`map-pos-${i}`}>
                  {p.image && p.image != null ? (
                    <image
                      href={p.image}
                      width={9}
                      id={`map-pos-${p.lat}-${p.lon}`}
                      y={posToMap(
                        p.lat,
                        mapType == "topographic_img"
                          ? JSON.parse(
                            data?.maps?.find(
                              (m) => m.id === (submap_id ? subMap : map)
                            )?.boundaries
                          )
                          : null
                      )}
                      x={posToMap(
                        p.lon,
                        mapType == "topographic_img"
                          ? JSON.parse(
                            data?.maps?.find(
                              (m) => m.id === (submap_id ? subMap : map)
                            )?.boundaries
                          )
                          : null
                      )}
                      ref={imgRef}
                      opacity={p.opacity ?? 1}
                      className="rounded-full"
                      stroke="black"
                      style={{
                        cursor: "pointer",
                        transformOrigin: "center center",
                      }}
                      onClick={() => onPosClick?.(p)}
                    >
                      <title>{p.name}</title>
                    </image>
                  ) : (
                    <circle
                      style={{
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                        transformOrigin: "center center",
                      }}
                      id={`map-pos-${p.lat}-${p.lon}`}
                      fill={p.color || "red"}
                      stroke="black"
                      className="hover:stroke-red-500"
                      x={0}
                      onClick={() => onPosClick?.(p)}
                      y={0}
                      cy={posToMap(
                        p.lat,
                        mapType == "topographic_img"
                          ? JSON.parse(
                            data?.maps?.find(
                              (m) => m.id === (submap_id ? subMap : map)
                            )?.boundaries
                          )
                          : null
                      )}
                      cx={posToMap(
                        p.lon,
                        mapType == "topographic_img"
                          ? JSON.parse(
                            data?.maps?.find(
                              (m) => m.id === (submap_id ? subMap : map)
                            )?.boundaries
                          )
                          : null
                      )}
                      // r={((imageTransform.replace("scale(", "").replace(')', '')) as number * 2) * 2}
                      r="3"
                    >
                      <title>{p.name}</title>
                    </circle>
                  )}
                </React.Fragment>
              ))}
        </g>
        {pos?.length > 0 && path?.coords && (
          <path
            style={{
              pointerEvents: "none",
              width: "100%",
              height: "100%",
              transform: `scale(${zoom}) translate(${panPosition.x.toFixed(
                1
              )}px, ${panPosition.y.toFixed(1)}px)`,
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
