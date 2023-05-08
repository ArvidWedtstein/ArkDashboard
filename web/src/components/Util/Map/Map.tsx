import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

interface Props {
  map: string;
  size?: { width: number; height: number };
  pos?: { lat: number; lon: number; color?: string; name?: string }[];
  className?: string;
  path?: { color?: string; coords: { lat: number; lon: number }[] };
  interactive?: boolean;
}
export const Map = ({
  map,
  size = { width: 500, height: 500 },
  pos,
  className,
  path,
  interactive = false,
}: Props) => {
  const maps = {
    theisland:
      "https://ark.gamepedia.com/media/thumb/3/3e/The_Island_Map.jpg/600px-The_Island_Map.jpg",
    thecenter:
      "https://ark.gamepedia.com/media/thumb/1/1a/The_Center_Map.jpg/600px-The_Center_Map.jpg",
    scorchedearth:
      "https://ark.gamepedia.com/media/thumb/3/3e/Scorched_Earth_Map.jpg/600px-Scorched_Earth_Map.jpg",
    ragnarok:
      "https://ark.gamepedia.com/media/thumb/5/5e/Ragnarok_Map.jpg/600px-Ragnarok_Map.jpg",
    abberation:
      "https://ark.gamepedia.com/media/thumb/6/6e/Aberration_Map.jpg/600px-Aberration_Map.jpg",
    extinction:
      "https://ark.gamepedia.com/media/thumb/2/2c/Extinction_Map.jpg/600px-Extinction_Map.jpg",
    gen1: "https://ark.gamepedia.com/media/thumb/4/4e/Genesis_Part_1.jpg/600px-Genesis_Part_1.jpg",
    genesis:
      "https://ark.gamepedia.com/media/thumb/4/4e/Genesis_Part_1.jpg/600px-Genesis_Part_1.jpg",
    gen2: "https://ark.gamepedia.com/media/thumb/0/0d/Genesis_Part_2.jpg/600px-Genesis_Part_2.jpg",
    genesis2:
      "https://ark.gamepedia.com/media/thumb/0/0d/Genesis_Part_2.jpg/600px-Genesis_Part_2.jpg",
    valguero:
      "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/1/19/Valguero_Map.jpg",
    crystalisles:
      "https://ark.gamepedia.com/media/thumb/3/3e/Crystal_Isles_Map.jpg/600px-Crystal_Isles_Map.jpg",
    fjordur: "https://ark.wiki.gg/images/7/75/Fjordur_Map.jpg",
    lostisland: "https://ark.wiki.gg/images/1/1e/Lost_Island_Map.jpg",
    "1": "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/1/19/Valguero_Map.jpg",
    "2": "https://ark.gamepedia.com/media/thumb/3/3e/The_Island_Map.jpg/600px-The_Island_Map.jpg",
    "3": "https://ark.gamepedia.com/media/thumb/1/1a/The_Center_Map.jpg/600px-The_Center_Map.jpg",
    "4": "https://ark.gamepedia.com/media/thumb/5/5e/Ragnarok_Map.jpg/600px-Ragnarok_Map.jpg",
    "5": "https://ark.gamepedia.com/media/thumb/6/6e/Aberration_Map.jpg/600px-Aberration_Map.jpg",
    "6": "https://ark.gamepedia.com/media/thumb/2/2c/Extinction_Map.jpg/600px-Extinction_Map.jpg",
    "7": "https://ark.gamepedia.com/media/thumb/3/3e/Scorched_Earth_Map.jpg/600px-Scorched_Earth_Map.jpg",

    "8": "https://ark.gamepedia.com/media/thumb/4/4e/Genesis_Part_1.jpg/600px-Genesis_Part_1.jpg",
    "9": "https://ark.gamepedia.com/media/thumb/0/0d/Genesis_Part_2.jpg/600px-Genesis_Part_2.jpg",
    "10": "https://ark.gamepedia.com/media/thumb/3/3e/Crystal_Isles_Map.jpg/600px-Crystal_Isles_Map.jpg",
    "11": "https://ark.wiki.gg/images/7/75/Fjordur_Map.jpg",
    "12": "https://ark.wiki.gg/images/1/1e/Lost_Island_Map.jpg",
  };
  const svgRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const drawSvgPath = (coordinates: { lat: number; lon: number }[]): string => {
    let pathString = "";
    coordinates.forEach((coordinate, index) => {
      const command = index === 0 ? "M" : "L";
      pathString += `${command}${(size.height / 100) * coordinate.lon + size.width / 100
        } ${(size.width / 100) * coordinate.lat + size.height / 100} `;
    });
    return pathString;
  };

  useEffect(() => {
    const svgElement = svgRef.current;
    if (interactive && svgElement) {
      const { width, height } = svgElement.getBoundingClientRect();
      const maxScale = Math.max(width / 500, height / 500);
      setScale(maxScale);
    }
  }, []);

  const handleWheel = (event) => {
    if (!interactive) return;
    if (!event.shiftKey) return;
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    const maxScale = Math.max(scale, 1);
    const minScale = Math.min(
      1,
      Math.min(
        600 / svgRef.current.clientWidth,
        450 / svgRef.current.clientHeight
      )
    );
    const newScale = Math.max(minScale, Math.min(maxScale + delta, 5));
    const svgElement = svgRef.current;
    if (svgElement) {
      const { left, top } = svgElement.getBoundingClientRect();
      const mouseX = event.clientX - left;
      const mouseY = event.clientY - top;
      const scaleDiff = newScale / scale;
      const newTranslate = {
        x: mouseX - scaleDiff * (mouseX - translate.x),
        y: mouseY - scaleDiff * (mouseY - translate.y),
      };
      setTranslate(newTranslate);
      setScale(newScale);
    }
  };

  const handleMouseDown = (event) => {
    if (!interactive) return;
    if (event.button !== 0) return;
    if (!event.shiftKey) return;
    // event.preventDefault();
    const startCoords = {
      x: event.clientX,
      y: event.clientY,
    };
    const handleMouseMove = (event) => {
      const deltaX = event.clientX - startCoords.x;
      const deltaY = event.clientY - startCoords.y;
      setTranslate((prevState) => ({
        x: prevState.x + deltaX, // / scale,
        y: prevState.y + deltaY, // / scale,
      }));
      startCoords.x = event.clientX;
      startCoords.y = event.clientY;
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleKeyDown = (event) => {
    if (!interactive) return;
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
      document.body.style.overflow = "hidden";
    }
  };

  const handleKeyUp = (event) => {
    if (!interactive) return;
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
      document.body.style.overflow = "auto";
      setScale(1);
      setTranslate((prevState) => ({
        x: 0,
        y: 0,
      }));
    }
  };

  const viewBox = `${-translate.x} ${-translate.y} ${size.width} ${size.height
    }`;

  const imageTransform = `scale(${scale})`;

  return (
    <svg
      ref={svgRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
      className={"relative " + className}
      width={size.width}
      height={size.height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      <image
        href={maps[map.toLowerCase()]}
        style={{ pointerEvents: "none", transform: imageTransform }}
        height={size.height}
        width={size.width}
        xlinkHref="planetmap"
      />
      {!maps[map.toLowerCase()] && (
        <text
          x={size.width / 2}
          y={size.height / 2}
          textAnchor="middle"
          dominantBaseline={"middle"}
        >
          {map} map not found
        </text>
      )}

      {pos?.map((p, i) => (
        <circle
          style={{ transform: imageTransform }}
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
          style={{ pointerEvents: "none", transform: imageTransform }}
          d={drawSvgPath(path.coords)}
          stroke={path.color || "red"}
          strokeWidth="2"
          fill="none"
        />
      )}
    </svg>
  );
};
