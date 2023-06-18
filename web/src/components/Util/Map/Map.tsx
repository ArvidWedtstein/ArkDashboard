import { useCallback, useEffect, useRef, useState } from "react";

const drawSvgPath = (
  coordinates: { lat: number; lon: number }[],
  size
): string => {
  let pathString = "";
  coordinates.forEach((coordinate, index) => {
    const command = index === 0 ? "M" : "L";
    pathString += `${command}${
      (size.height / 100) * coordinate.lon + size.width / 100
    } ${(size.width / 100) * coordinate.lat + size.height / 100} `;
  });
  return pathString;
};
interface Props {
  url: string;
  size?: { width: number; height: number };
  pos?: { lat: number; lon: number; color?: string; name?: string }[];
  className?: string;
  path?: { color?: string; coords: { lat: number; lon: number }[] };
  interactive?: boolean;
}
const Map = ({
  url,
  size = { width: 500, height: 500 },
  pos,
  className,
  path,
  interactive = false,
}: Props) => {
  const svgRef = useRef(null);

  const [zoom, setZoom] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleKeyUp = useCallback((event) => {
    if (!interactive) return;
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
      setZoom(1);
      setPanPosition({ x: 0, y: 0 });
      setIsDragging(false);
      setStartPosition({ x: 0, y: 0 });
    }
  }, []);

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

  const handleWheel = (event) => {
    event.preventDefault();
    if (!interactive) return;
    if (!event.shiftKey) return;
    const scale = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = zoom * scale;
    const rect = svgRef.current.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / zoom;
    const offsetY = (event.clientY - rect.top) / zoom;
    const dx = offsetX * (1 - scale);
    const dy = offsetY * (1 - scale);
    setZoom(newZoom);
    setPanPosition((prevPosition) => ({
      x: prevPosition.x - dx,
      y: prevPosition.y - dy,
    }));
  };

  const handleMouseDown = (event) => {
    event.preventDefault();
    if (!interactive) return;
    if (!event.shiftKey) return;
    setIsDragging(true);
    setStartPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    if (!interactive) return;
    if (!event.shiftKey) return;
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
    <svg
      ref={svgRef}
      height={size.height}
      width={size.width}
      tabIndex={0}
      className={"relative" + className}
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
        href={url}
        height={size.height}
        width={size.width}
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${zoom}) translate(${panPosition.x}px, ${panPosition.y}px)`,
          transformOrigin: "center center",
        }}
      />
      {pos?.map((p, i) => (
        <circle
          style={{
            pointerEvents: "none",
            width: "100%",
            height: "100%",
            transform: `scale(${zoom}) translate(${panPosition.x}px, ${panPosition.y}px)`,
            transformOrigin: "center center",
          }}
          key={"map-pos-" + i}
          id={"map-pos-" + i}
          fill={p.color || "red"}
          cy={(size.height / 100) * p.lat + size.height / 100}
          cx={(size.width / 100) * p.lon + size.width / 100}
          // r={((imageTransform.replace("scale(", "").replace(')', '')) as number * 2) * 2}
          r="3"
        >
          <title>{p.name}</title>
        </circle>
      ))}
      {path?.coords && (
        <path
          style={{
            pointerEvents: "none",
            width: "100%",
            height: "100%",
            transform: `scale(${zoom}) translate(${panPosition.x}px, ${panPosition.y}px)`,
            transformOrigin: "center center",
          }}
          d={drawSvgPath(path.coords, size)}
          stroke={path.color || "red"}
          strokeWidth="2"
          fill="none"
        />
      )}
    </svg>
  );
};

export default Map;
