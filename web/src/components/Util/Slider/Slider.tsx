import { useState } from "react";
import { debounce } from "src/lib/formatters";

interface SliderProps {
  /**
   * The minimum value of the slider
   * @default 0
   */
  min?: number;
  /**
   * The maximum value of the slider
   *  @default 100
   */
  max?: number;
  /**
   * The step value of the slider
   * @default 1
   */
  step?: number;
  value?: number | number[];
  onChange?: (values: boolean extends true ? number[] : number | number[]) => void;
  className?: string;
  text?: boolean;
  double?: boolean;
}
const Slider = ({ min = 0, max = 100, step = 1, value, onChange, className, double = false, text = true }: SliderProps) => {
  const [valueA, setValueA] = useState<number>(Array.isArray(value) ? value[0] : 0);
  const [valueB, setValueB] = useState<number>(Array.isArray(value) ? value[1] : 100);

  const start = Math.min(valueA, valueB) * 3;
  const diff = Math.abs(valueA - valueB) * 3;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, doubleSlider: boolean) => {
    const newValueA = parseInt(event.target.value, 10);
    const newValueB = parseInt(event.target.value, 10);
    doubleSlider ? setValueA(newValueA) : setValueB(newValueB);
    onChange?.(double ? [doubleSlider ? newValueA : valueA, !doubleSlider ? newValueB : valueB] : newValueA);
  };


  const commonInputProps = {
    type: "range",
    className: "slider pointer-events-none !absolute top-0 left-0 h-6 w-full appearance-none bg-transparent p-0 outline-none",
    min,
    max,
    step,
  };

  return (
    <div className={"inline-flex justify-start text-gray-800 dark:text-white space-x-1 " + className}>
      <div className="relative w-[322px] h-6">
        <div className="border absolute rounded-full bg-zinc-300 dark:bg-zinc-600 dark:border-zinc-500 border-zinc-500 left-3 right-3 h-2 top-1/2" style={{ transform: "translate(0, -50%)" }}></div>
        <div className="absolute rounded-full bg-zinc-400 border-pea-500 border dark:bg-zinc-700 h-2 top-1/2" style={{ left: `${12 + start}px`, width: `${diff}px`, transform: "translate(0, -50%)" }}></div>
        {double && (
          <div className="absolute grid place-items-center top-0 h-6 w-6" style={{ left: `${valueA * 3}px` }}>
            <div className="bg-pea-600 shadow-md rounded-full grid place-items-center w-5 h-5 border border-zinc-500"></div>
          </div>
        )}
        <div className="absolute grid place-items-center top-0 h-6 w-6" style={{ left: `${valueB * 3}px` }}>
          <div className="bg-pea-600 shadow-md rounded-full grid place-items-center w-5 h-5 border border-zinc-500"></div>
        </div>
        {double && <input {...commonInputProps} value={valueA} onChange={(e) => handleChange(e, true)} />}
        <input {...commonInputProps} value={valueB} onChange={(e) => handleChange(e, false)} />
      </div>
      {text && <p>{double ? `${valueA} - ${valueB}` : `${valueB}`}</p>}
    </div>
  );
};

export default Slider;