import { useController } from "@redwoodjs/forms";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";

interface CheckboxGroupProps {
  name?: string;
  options: {
    label: string;
    value?: string;
    image?: string | React.ReactNode;
  }[];
  form?: boolean;
  defaultValue?: Array<string>;
  onChange?: (name: string, value: string[]) => void;
  validation?: {
    valueAsBoolean?: boolean;
    valueAsJSON?: boolean;
    required?: boolean;
    single?: boolean;
  };
}
const CheckboxGroup = ({
  name,
  options,
  form = true,
  defaultValue = [],
  onChange,
  validation = {
    single: false,
  },
}: CheckboxGroupProps) => {
  const [selectedOptions, setSelectedOptions] = useState(() => defaultValue);
  const { field } = (form && !!name) ? useController({ name: name }) : { field: null };
  const memoizedOptions = useMemo(() => options, [options]);

  const handleCheckboxChange = useCallback((event) => {
    const { value } = event.target;
    let newSelectedOptions;

    if (selectedOptions.includes(value)) {
      newSelectedOptions = selectedOptions.filter((option) => option !== value);
    } else {
      newSelectedOptions = validation.single ? [value] : [...selectedOptions, value];
    }

    setSelectedOptions(newSelectedOptions);
    // onChange && onChange(value, newSelectedOptions);
    (!!name && form) && field.onChange(newSelectedOptions);
    onChange?.(value, newSelectedOptions);
  }, [name, onChange, selectedOptions, validation.single]
  );

  return (
    <div className="flex h-fit flex-wrap gap-3 mt-1">
      {memoizedOptions.map(({ label, image, value: optValue }) => (
        <label key={label} aria-details={`Item: ${optValue}`}>
          <input
            disabled={!name && !label || (!name && !form)}
            type="checkbox"
            name={name || optValue || label + "checkbox"}
            value={optValue || label}
            onChange={handleCheckboxChange}
            checked={selectedOptions.includes(optValue.toString() || label)}
            className="rw-check-input"
          />
          <span
            className={clsx("rw-check-tile", {
              disabled: !name && !label,
            })}
          >
            <span className="text-gray-900 transition-all duration-150 ease-in dark:text-stone-200">
              {image &&
                (React.isValidElement(image) ? (
                  image
                ) : (
                  <img
                    className=" max-w-16 max-h-12 w-auto"
                    src={image.toString()}
                  />
                ))}
            </span>
            <span className="mx-2 text-center text-xs text-gray-900 transition-all duration-300 ease-linear dark:text-stone-200">
              {label}
            </span>
          </span>
        </label>
      ))}
    </div>
  );
};

export default CheckboxGroup;
