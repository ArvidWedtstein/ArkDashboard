import {
  Controller,
  FieldError,
  InputFieldProps,
  NumberField,
  RegisterOptions,
  useErrorStyles,
  useForm,
  useRegister,
} from "@redwoodjs/forms";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";

interface MapPickerProps extends Omit<InputFieldProps, "name"> {
  validation?: RegisterOptions;
  map: string | number;
  url?: string;
  valueProp?: {
    latitude: number;
    longitude: number;
  };
  onChanges?: (value: { latitude: number; longitude: number }) => void;
}

const MapPicker = ({
  className,
  style,
  url = "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/TheIsland-Map.webp",
  map = "theisland",
  valueProp = {
    latitude: 0,
    longitude: 0,
  },
  onChanges,
  validation = {
    disabled: false,
  },
}: MapPickerProps) => {
  const [pos, setPos] = useState<{ latitude: number; longitude: number }>(
    valueProp
  );
  let svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (valueProp.latitude && valueProp.longitude) {
      let circle = svgRef.current.querySelector("g#marker");

      circle.setAttributeNS(
        null,
        "transform",
        `translate(${5 * valueProp.longitude + 500 / 100}, ${
          5 * valueProp.latitude
        })`
      );
      svgRef.current.querySelector(
        "text#coords"
      ).innerHTML = `${valueProp.latitude}, ${valueProp.longitude}`;
      setPos(valueProp);
    }
  }, [valueProp]);

  const updatePosition = useCallback(
    (evt) => {
      let pt = svgRef.current.createSVGPoint();
      pt.x = evt.clientX;
      pt.y = evt.clientY;

      let cursorpt = pt.matrixTransform(
        svgRef.current.getScreenCTM().inverse()
      );
      let circle = svgRef.current.querySelector("g#marker");
      circle.setAttributeNS(
        null,
        "transform",
        `translate(${cursorpt.x}, ${cursorpt.y})`
      );

      svgRef.current.querySelector("text#coords").innerHTML = `${
        Math.round(((cursorpt.y - 5) / 5) * 100) / 100
      }, ${Math.round(((cursorpt.x - 5) / 5) * 100) / 100}`;

      setPos({
        latitude: Math.round(((cursorpt.y - 5) / 5) * 100) / 100,
        longitude: Math.round(((cursorpt.x - 5) / 5) * 100) / 100,
      });
      onChanges &&
        onChanges({
          latitude: Math.round(((cursorpt.y - 5) / 5) * 100) / 100,
          longitude: Math.round(((cursorpt.x - 5) / 5) * 100) / 100,
        });
    },
    [pos]
  );

  return (
    <div style={style} className={className}>
      <svg
        className="cursor-pointer select-none"
        id={`mapSelector${name}`}
        width={500}
        height={500}
        viewBox={`0 0 ${500} ${500}`}
        xmlns="http://www.w3.org/2000/svg"
        onClick={!validation.disabled ? updatePosition : () => {}}
        ref={svgRef}
      >
        <image href={url} height={500} width={500} />
        <g id="marker" transform="translate(0, 0)" width="20" height="20">
          <circle
            className="animate-ping fill-red-400 motion-reduce:animate-none"
            cx="0"
            cy="0"
            r="10"
          />
          <circle className="fill-red-500" cx="0" cy="0" r="5" />
        </g>
        <g>
          <rect
            x="400"
            width="100"
            height="30"
            className="rounded-bl-md fill-[#0D2836] stroke-[#60728F] stroke-2 p-3 opacity-70"
          />
          <text
            id="coords"
            x="450"
            y="15"
            className="rounded-bl-md fill-[#97FBFF]"
            textAnchor="middle"
            dominantBaseline={"middle"}
          >
            0, 0
          </text>
        </g>
      </svg>
    </div>
  );
};

export default MapPicker;
