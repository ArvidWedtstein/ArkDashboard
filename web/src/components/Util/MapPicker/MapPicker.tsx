import { Controller, FieldError, InputFieldProps, NumberField, RegisterOptions, useErrorStyles, useForm, useRegister } from "@redwoodjs/forms";
import { useCallback, useEffect, useRef, useState } from "react";

interface MapPickerProps extends Omit<InputFieldProps, 'name'> {
  validation?: RegisterOptions
  map: string;
  valueProp?: {
    latitude: number;
    longitude: number;
  };
  onChanges?: (value: {
    latitude: number;
    longitude: number;
  }) => void;
}

const MapPicker = (props: MapPickerProps) => {
  let {
    className,
    style,
    map = "theisland",
    valueProp = {
      latitude: 0,
      longitude: 0,
    },
    onChanges,
  } = props;
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
  const [pos, setPos] = useState<{ latitude: number; longitude: number }>(valueProp);
  let svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (valueProp.latitude && valueProp.longitude) {
      let circle = svgRef.current.querySelector('g#marker')

      circle.setAttributeNS(null, 'transform', `translate(${5 * valueProp.latitude + 500 / 100}, ${5 * valueProp.longitude})`);
      svgRef.current.querySelector('text#coords').innerHTML = `${valueProp.latitude}, ${valueProp.longitude}`;
      setPos(valueProp)
    }
  }, [])



  const updatePosition = useCallback((evt) => {
    let pt = svgRef.current.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;

    let cursorpt = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    let circle = svgRef.current.querySelector('g#marker');
    circle.setAttributeNS(null, 'transform', `translate(${cursorpt.x}, ${cursorpt.y})`);

    svgRef.current.querySelector('text#coords').innerHTML = `${Math.round((cursorpt.y - 5) / 5 * 100) / 100}, ${Math.round((cursorpt.x - 5) / 5 * 100) / 100}`;


    setPos({ latitude: Math.round((cursorpt.y - 5) / 5 * 100) / 100, longitude: Math.round((cursorpt.x - 5) / 5 * 100) / 100 })
    onChanges && onChanges({ latitude: Math.round((cursorpt.y - 5) / 5 * 100) / 100, longitude: Math.round((cursorpt.x - 5) / 5 * 100) / 100 })


  }, [pos])


  return (
    <div style={style} className={className}>
      <svg
        className="select-none cursor-pointer"
        id="mapSelector"
        width={500}
        height={500}
        viewBox={`0 0 ${500} ${500}`}
        xmlns="http://www.w3.org/2000/svg"
        onClick={updatePosition}
        ref={svgRef}
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
        <g id="marker" transform="translate(0, 0)" width="20" height="20">
          <circle
            className="fill-red-400 animate-ping motion-reduce:animate-none"
            cx="0"
            cy="0"
            r="10"
          />
          <circle
            className="fill-red-500"
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
            id="coords"
            x="450"
            y="15"
            className="fill-[#97FBFF] rounded-bl-md"
            textAnchor="middle"
            dominantBaseline={"middle"}
          >
            0, 0
          </text>
        </g>
        {/* <map name="Map" id="Map">
          <area href="#" shape="poly" className="brick 1" coords="669,0,405,268,931,265" />
          <area href="#" shape="poly" className="brick 2" coords="399,269,681,268,673,468,227,455" />
          <area href="#" shape="poly" className="brick 3" coords="685,267,934,267,1134,473,676,468" />
          <area href="#" shape="poly" className="brick 4" coords="220,458,33,641,378,640,540,465,224,458" />
          <area href="#" shape="poly" className="brick 5" coords="542,467,380,643,975,641,802,471,547,467" />
          <area href="#" shape="poly" className="brick 6" coords="809,473,1137,476,1315,645,980,642,811,472" />
        </map> */}
      </svg>
    </div>
  )
};

export default MapPicker
