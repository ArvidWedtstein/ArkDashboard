interface Props {
  map: string,
  size: { width: number, height: number },
  pos?: { lat: number, lon: number },
}


export const Maps = ({ map, size, pos }: Props) => {
  const maps = {
    'TheIsland':
      'https://ark.gamepedia.com/media/thumb/3/3e/The_Island_Map.jpg/600px-The_Island_Map.jpg',
    'TheCenter':
      'https://ark.gamepedia.com/media/thumb/1/1a/The_Center_Map.jpg/600px-The_Center_Map.jpg',
    'ScorchedEarth':
      'https://ark.gamepedia.com/media/thumb/3/3e/Scorched_Earth_Map.jpg/600px-Scorched_Earth_Map.jpg',
    Ragnarok:
      'https://ark.gamepedia.com/media/thumb/5/5e/Ragnarok_Map.jpg/600px-Ragnarok_Map.jpg',
    Abberation:
      'https://ark.gamepedia.com/media/thumb/6/6e/Aberration_Map.jpg/600px-Aberration_Map.jpg',
    Extinction:
      'https://ark.gamepedia.com/media/thumb/2/2c/Extinction_Map.jpg/600px-Extinction_Map.jpg',
    Gen1: 'https://ark.gamepedia.com/media/thumb/4/4e/Genesis_Part_1.jpg/600px-Genesis_Part_1.jpg',
    Gen2: 'https://ark.gamepedia.com/media/thumb/0/0d/Genesis_Part_2.jpg/600px-Genesis_Part_2.jpg',
    Valguero:
      'https://ark.gamepedia.com/media/thumb/d/de/Valguero_Topographic_Map.jpg/600px-Valguero_Topographic_Map.jpg',
    'CrystalIsles':
      'https://ark.gamepedia.com/media/thumb/3/3e/Crystal_Isles_Map.jpg/600px-Crystal_Isles_Map.jpg',
    Fjordur:
      'https://ark.gamepedia.com/media/thumb/3/3e/Fjordur_Map.jpg/600px-Fjordur_Map.jpg',
    'LostIsland':
      'https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/4/45/Lost_Island_map.jpg/revision/latest/scale-to-width-down/600',
  }

  return (
    <>
      <svg width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`} xmlns="http://www.w3.org/2000/svg">
        <image href={maps[map]} height={size.height} width={size.width} />
        <circle fill="red" cx={((size.width / 100) * pos.lat) + (size.width / 100)} cy={(size.height / 100) * pos.lat} r="5" />
      </svg>
    </>
  )
}
