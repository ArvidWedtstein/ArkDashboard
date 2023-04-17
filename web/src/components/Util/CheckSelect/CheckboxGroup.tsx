import { FieldError, TextField, useFormContext, useRegister } from "@redwoodjs/forms";
import clsx from "clsx";
import { useEffect, useState } from "react";

interface CheckboxGroupProps {
  name?: string;
  options: {
    label: string;
    value?: string;
    image?: string | React.ReactNode;
  }[];
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
  defaultValue,
  onChange,
  validation = {
    single: false,
  },
}: CheckboxGroupProps) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const register = name
    && useRegister({
      name: name,
      validation: { ...validation },
    });

  useEffect(() => {
    setSelectedOptions(defaultValue || []);
  }, [defaultValue]);

  const handleCheckboxChange = (event) => {
    const { name } = event.target;
    let newSelectedOptions;

    if (selectedOptions.includes(name)) {
      newSelectedOptions = selectedOptions.filter((option) => option !== name);
    } else {
      newSelectedOptions = validation.single ? [name] : [...selectedOptions, name];
    }

    setSelectedOptions(newSelectedOptions);
    onChange && onChange(name, newSelectedOptions);
  };

  return (
    <div className="flex h-fit flex-wrap gap-3 mt-1">
      {options.map(({ label, image, value: optValue }) => (
        <label key={label}>
          <input
            disabled={!name && !label}
            type="checkbox"
            name={optValue || label + "checkbox"}
            onChange={handleCheckboxChange}
            checked={selectedOptions.includes(optValue || label)}
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
      {/* <input
        type="hidden"
        {...reg}
        name={name}
        value={selectedOptions}
      /> */}
      {/* <TextField
        {...reg}
        name={name}
        value={selectedOptions}
        validation={{ ...validation, required: false }}
      /> */}

      <input
        type="text"
        name={name}
        value={selectedOptions}
        {...(name ? { ...register } : "")}
      />
    </div>
  );
};

export default CheckboxGroup;
