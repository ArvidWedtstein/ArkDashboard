import clsx from "clsx";
import { useState } from "react";

// const Slider = ({ min, max, onChange }) => {
//   const [values, setValues] = useState([min, max]);

//   const handleChange = (index, newValue) => {
//     const newValues = [...values];
//     newValues[index] = newValue;
//     setValues(newValues);
//     onChange(newValues);
//   };

//   return (
//     <div className="range-slider">
//       <input
//         type="range"
//         min={min}
//         max={max}
//         value={values[0]}
//         onChange={(e) => handleChange(0, Number(e.target.value))}
//       />
//       <input
//         type="range"
//         min={min}
//         max={max}
//         value={values[1]}
//         onChange={(e) => handleChange(1, Number(e.target.value))}
//       />
//       <div className="range-values">
//         <span>{values[0]}</span>
//         <span>{values[1]}</span>
//       </div>
//     </div>
//   );
// };

const Slider = ({ min, max, step, value, onChange, className }) => {
  const [values, setValues] = useState(value || [min, max]);
  const [activeThumb, setActiveThumb] = useState(null);

  const handleChange = (index, newValue) => {
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
    onChange(newValues);
  };

  const handleThumbMouseDown = (index) => {
    setActiveThumb(index);
  };

  const handleMouseUp = () => {
    setActiveThumb(null);
  };

  const handleMouseMove = (e) => {
    if (activeThumb === 0) {
      const newValue = Math.max(
        min,
        Math.min(values[1] - step, parseFloat(e.target.value))
      );
      handleChange(0, newValue);
    } else if (activeThumb === 1) {
      const newValue = Math.min(
        max,
        Math.max(values[0] + step, parseFloat(e.target.value))
      );
      handleChange(1, newValue);
    }
  };

  return (
    <div className={`range-slider ${className}`} onMouseUp={handleMouseUp}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={values[0]}
        onChange={(e) => handleChange(0, parseFloat(e.target.value))}
        onMouseDown={() => handleThumbMouseDown(0)}
        onMouseMove={handleMouseMove}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={values[1]}
        onChange={(e) => handleChange(1, parseFloat(e.target.value))}
        onMouseDown={() => handleThumbMouseDown(1)}
        onMouseMove={handleMouseMove}
      />
      <div className="range-values">
        <span>{values[0]}</span>
        <span>{values[1]}</span>
      </div>
      {activeThumb !== null && (
        <div className="range-tooltip">
          {values[activeThumb]}
        </div>
      )}
    </div>
  );
};

export default Slider;