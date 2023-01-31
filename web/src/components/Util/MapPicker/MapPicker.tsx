import { useEffect } from "react";

const MapPicker = ({
  map,
}) => {
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
      "https://ark.gamepedia.com/media/thumb/d/de/Valguero_Topographic_Map.jpg/600px-Valguero_Topographic_Map.jpg",
    crystalisles:
      "https://ark.gamepedia.com/media/thumb/3/3e/Crystal_Isles_Map.jpg/600px-Crystal_Isles_Map.jpg",
    fjordur:
      "https://ark.gamepedia.com/media/thumb/3/3e/Fjordur_Map.jpg/600px-Fjordur_Map.jpg",
    lostisland:
      "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/4/45/Lost_Island_map.jpg",
  };

  const alert_coords = (evt, pt, svg) => {
    pt.x = evt.clientX;
    pt.y = evt.clientY;

    // The cursor point, translated into svg coordinates
    var cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    // console.log("(" + cursorpt.x + ", " + cursorpt.y + ")");
  }
  useEffect(() => {
    let svg = document.querySelector('svg');
    let pt = svg.createSVGPoint();
    svg.addEventListener('mousedown', (evt) => alert_coords(evt, pt, svg));
    return () => {
      svg.removeEventListener('mousedown', (evt) => alert_coords(evt, pt, svg));
    }
  }, [])

  return (
    <div>
      <svg
        className=""
        width={500}
        height={500}
        viewBox={`0 0 ${500} ${500}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <image
          href={maps[map.toLowerCase()]}
          height={500}
          width={500}
        />
        {!maps[map.toLowerCase()] && (
          <text
            x={250}
            y={250}
            textAnchor="middle"
            dominantBaseline={"middle"}
          >
            {map} map not found
          </text>
        )}
        {/* <circle
          fill="red"
          cx={(500 / 100) * pos.lon + size.width / 100}
          cy={(500 / 100) * pos.lat}
          r="5"
        /> */}
      </svg>
    </div>
  )
}

export default MapPicker
