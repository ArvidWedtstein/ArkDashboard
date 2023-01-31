import { useEffect, useRef } from "react";

interface MapPickerProps {
  fields?: {
    latitude: string;
    longitude: string;
  }
  map: string;
  coords?: {
    lat: number;
    lon: number;
  };
  onChange?: (coords: {
    lat: number;
    lon: number;
  }) => void;
}
const MapPicker = ({
  map,
  fields = {
    latitude: "latitude",
    longitude: "longitude",
  },
  coords = {
    lat: 0,
    lon: 0,
  },
  onChange
}: MapPickerProps) => {
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



  const alert_coords = (evt, pt) => {
    pt.x = evt.clientX;
    pt.y = evt.clientY;

    // The cursor point, translated into svg coordinates
    let cursorpt = pt.matrixTransform(document.querySelector<SVGSVGElement>('svg#mapSelector').getScreenCTM().inverse());
    // let circle = document.querySelector('circle#marker')
    let circle = document.querySelector('g#marker')

    circle.setAttributeNS(null, 'transform', `translate(${cursorpt.x}, ${cursorpt.y})`);

    // circle.setAttributeNS(null, 'cx', cursorpt.x);
    // circle.setAttributeNS(null, 'cy', cursorpt.y);

    onChange && onChange({ lat: Math.round((cursorpt.x - 5) / 5 * 100) / 100, lon: Math.round((cursorpt.y - 5) / 5 * 100) / 100 })
  }
  useEffect(() => {
    let svg = document.querySelector<SVGSVGElement>('svg#mapSelector');
    let pt = svg.createSVGPoint();

    if (coords.lat && coords.lon) {
      let circle = document.querySelector('g#marker')

      circle.setAttributeNS(null, 'transform', `translate(${5 * coords.lat + 500 / 100}, ${5 * coords.lon})`);
      // circle.setAttributeNS(null, 'cx', (Math.round((coords.lat - 5) / 5 * 100) / 100).toString());
      // circle.setAttributeNS(null, 'cy', (Math.round((coords.lon - 5) / 5 * 100) / 100).toString());
    }

    svg.addEventListener('mousedown', (evt) => alert_coords(evt, pt));
    svg.addEventListener('mousemove', (evt) => updateCoords(evt, pt));
    return () => {
      svg.removeEventListener('mousedown', (evt) => alert_coords(evt, pt));
      svg.removeEventListener('mousemove', (evt) => updateCoords(evt, pt));
    }
  }, [])

  let coordsRef = useRef<SVGTextElement>(null);
  function updateCoords(evt, pt) {
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    let cursorpt = pt.matrixTransform(document.querySelector<SVGSVGElement>('svg#mapSelector').getScreenCTM().inverse())

    // let coords = document.getElementById("coords");
    coordsRef.current.innerHTML = `${Math.round((cursorpt.x - 5) / 5 * 100) / 100}, ${Math.round((cursorpt.y - 5) / 5 * 100) / 100}`;
  }

  return (
    <div className="">
      <svg
        className="select-none cursor-pointer"
        id="mapSelector"
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
        <g id="marker" transform="translate(0, 0)" width="20" height="20" fill="blue">
          <circle
            className="fill-red-400 animate-ping motion-reduce:animate-none"
            // cy={(500 / 100) * 0 + 500 / 100}
            // cx={(500 / 100) * 0 + 500 / 100}
            cx="0"
            cy="0"
            r="10"
          />
          <circle
            className="fill-red-500"
            // cy={(500 / 100) * 0 + 500 / 100}
            // cx={(500 / 100) * 0 + 500 / 100}
            cx="0"
            cy="0"
            r="5"
          />
        </g>
        <g>
          <rect
            x="400"
            width="100"
            height="30"
            className="rounded-bl-md fill-[#0D2836] p-3 stroke-2 stroke-[#60728F] opacity-70"
          />
          <text
            ref={coordsRef}
            x="450"
            y="15"
            className="fill-[#97FBFF] rounded-bl-md"
            textAnchor="middle"
            dominantBaseline={"middle"}
          >
            0, 0
          </text>
        </g>
      </svg>
    </div>
  )
}

export default MapPicker
