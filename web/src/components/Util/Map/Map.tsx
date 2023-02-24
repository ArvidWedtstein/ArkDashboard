import { useEffect, useRef, useState } from "react";

interface Props {
  map: string;
  size: { width: number; height: number };
  pos?: { lat: number; lon: number, color?: string }[];
  className?: string;
  path?: { color?: string, coords: { lat: number; lon: number }[] };
}
export const Map = ({
  map,
  size = { width: 500, height: 500 },
  pos,
  className,
  path,
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
      "https://ark.wiki.gg/images/thumb/4/44/Genesis_Part_2_Map.jpg/600px-Genesis_Part_2_Map.jpg",
    valguero:
      "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/1/19/Valguero_Map.jpg",
    crystalisles:
      "https://ark.gamepedia.com/media/thumb/3/3e/Crystal_Isles_Map.jpg/600px-Crystal_Isles_Map.jpg",
    fjordur:
      "https://ark.wiki.gg/images/7/75/Fjordur_Map.jpg",
    lostisland:
      "https://ark.wiki.gg/images/1/1e/Lost_Island_Map.jpg",
  };


  const drawSvgPath = ((coordinates: { lat: number; lon: number }[]): string => {
    let pathString = '';
    coordinates.forEach((coordinate, index) => {
      const command = index === 0 ? 'M' : 'L';
      pathString += `${command}${(size.height / 100) * coordinate.lat} ${(size.width / 100) * coordinate.lon} `;
    });
    return pathString;
  });
  return (
    <svg
      className={className}
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <image
        href={maps[map.toLowerCase()]}
        height={size.height}
        width={size.width}
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
          key={'map-pos-' + i}
          fill={p.color || "red"}
          cy={(size.height / 100) * p.lat + size.height / 100}
          cx={(size.width / 100) * p.lon + size.width / 100}
          r="5"
        />
      ))}
      {path?.coords && (
        <path
          d={drawSvgPath(path.coords)}
          stroke={path.color || "red"}
          strokeWidth="2"
          fill="none"
        />
      )}
    </svg>
  );
};

const IslandMap = () => {
  const svgRef = useRef(null);
  const imageRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (svgElement) {
      const { width, height } = svgElement.getBoundingClientRect();
      const maxScale = Math.max(width / 500, height / 500);
      setScale(maxScale);
    }
  }, []);

  const handleWheel = (event) => {
    event.preventDefault();
    if (!event.shiftKey) return;
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    const maxScale = Math.max(scale, 1);
    const minScale = Math.min(1, Math.min(600 / svgRef.current.clientWidth, 450 / svgRef.current.clientHeight));
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
    console.log(isFocused)
    if (event.button !== 0) return;
    event.preventDefault();
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
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleKeyDown = (event) => {
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      event.preventDefault();
      document.body.style.overflow = 'hidden';
    }
  };

  const handleKeyUp = (event) => {
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      document.body.style.overflow = 'auto';
    }
  };

  const viewBox = `${-translate.x} ${-translate.y} ${500} ${500}`;

  const imageTransform = `scale(${scale})`;

  return (
    <svg
      ref={svgRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
      viewBox={viewBox}
      style={{ width: 500, height: 500, overflow: 'hidden', position: 'relative', background: 'linear-gradient(to top, #E7C4A0, #F8DEB7)' }}
    >
      <image
        ref={imageRef}
        href="https://ark.gamepedia.com/media/thumb/3/3e/The_Island_Map.jpg/600px-The_Island_Map.jpg"
        width={500}
        height={500}
        style={{ pointerEvents: 'none', transform: imageTransform }}
      />
    </svg>
  );
};

export default IslandMap;