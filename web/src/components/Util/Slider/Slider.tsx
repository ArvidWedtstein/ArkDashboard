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
  onChange?: (
    values: boolean extends true ? number[] : number | number[]
  ) => void;
  className?: string;
  text?: boolean;
  double?: boolean;
}
const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  className,
  double = false,
  text = true,
}: SliderProps) => {
  const [valueA, setValueA] = useState<number>(
    Array.isArray(value) ? value[0] : 0
  );
  const [valueB, setValueB] = useState<number>(
    Array.isArray(value) ? value[1] : max
  );

  const start = Math.min(valueA, valueB) * 3;
  const diff = Math.abs(valueA - valueB) * 3;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    doubleSlider: boolean
  ) => {
    const newValueA = parseInt(event.target.value, 10);
    const newValueB = parseInt(event.target.value, 10);
    doubleSlider ? setValueA(newValueA) : setValueB(newValueB);
    onChange?.(
      double
        ? [
            doubleSlider ? newValueA : valueA,
            !doubleSlider ? newValueB : valueB,
          ]
        : newValueA
    );
  };

  const commonInputProps = {
    type: "range",
    className:
      "slider !absolute top-0 left-0 h-6 w-full appearance-none bg-transparent p-0 outline-none",
    min,
    max,
    step,
  };

  return (
    <div
      className={
        "inline-flex justify-start space-x-1 text-gray-800 dark:text-white " +
        className
      }
    >
      <div className="relative h-6 w-[322px]">
        <div
          className="absolute left-3 right-3 top-1/2 h-2 rounded-full border border-zinc-500 bg-zinc-300 dark:border-zinc-500 dark:bg-zinc-600"
          style={{ transform: "translate(0, -50%)" }}
        ></div>
        <div
          className="border-pea-500 absolute top-1/2 h-2 rounded-full border bg-zinc-400 dark:bg-zinc-700"
          style={{
            left: `${12 + start}px`,
            width: `${diff}px`,
            transform: "translate(0, -50%)",
          }}
        />
        {double && (
          <div
            className="absolute top-0 grid h-6 w-6 place-items-center"
            style={{ left: `${valueA * 3}px` }}
          >
            <div className="bg-pea-600 grid h-5 w-5 place-items-center rounded-full border border-zinc-500 shadow-md"></div>
          </div>
        )}
        <div
          className="absolute top-0 grid h-6 w-6 place-items-center"
          style={{ left: `${valueB * 3}px` }}
        >
          <div className="bg-pea-600 grid h-5 w-5 place-items-center rounded-full border border-zinc-500 shadow-md" />
        </div>
        {double && (
          <input
            {...commonInputProps}
            value={valueA}
            onChange={(e) => handleChange(e, true)}
          />
        )}
        <input
          {...commonInputProps}
          value={valueB}
          onChange={(e) => handleChange(e, false)}
        />
      </div>
      {text && <p>{double ? `${valueA} - ${valueB}` : `${valueB}`}</p>}
    </div>
  );
};

export default Slider;
