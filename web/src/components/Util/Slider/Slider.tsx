import clsx from "clsx";
import { useState } from "react";

const Slider = ({ min, max, step, value, onChange }) => {
  const [sliderValue, setSliderValue] = useState(value);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSliderValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="relative">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={handleChange}
        className="w-full h-3 bg-gray-300 rounded-full appearance-none focus:outline-none"
      />
      <div
        className={clsx(
          "absolute top-0 left-0 h-3 rounded-full w-4 bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ease-in-out",
          {
            "w-0": sliderValue === min,
            "w-full": sliderValue === max,
          }
        )}
      />
      <div
        className={clsx("absolute top-0 left-0 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow border-4 border-blue-500 transform -translate-y-1/2",
          {
            "left-0": sliderValue === min,
            "right-0": sliderValue === max,
            "translate-x-full": sliderValue === max,
          }
        )}
      >
        <div className="text-blue-500">{sliderValue}</div>
      </div>
    </div>
  );
};

export default Slider;