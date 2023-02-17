interface Props {
  map: string;
  size: { width: number; height: number };
  pos?: { lat: number; lon: number }[];
  className?: string;
}

export const Map = ({
  map,
  size = { width: 500, height: 500 },
  pos,
  className,
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
    fjordur:
      "https://ark.wiki.gg/images/7/75/Fjordur_Map.jpg",
    lostisland:
      "https://ark.wiki.gg/images/1/1e/Lost_Island_Map.jpg",
  };

  return (
    <>
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
            fill="red"
            cy={(size.height / 100) * p.lat + size.height / 100}
            cx={(size.width / 100) * p.lon + size.width / 100}
            r="5"
          />))}
      </svg>
    </>
  );
};
