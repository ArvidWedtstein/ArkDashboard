import { FieldError, useRegister } from "@redwoodjs/forms"
import { useEffect, useState } from "react"

interface CheckboxGroupProps {
  name: string;
  options: { label: string, value?: string, image?: string }[];
  defaultValue?: Array<string>;
  onChange?: (name: string, value: string[]) => void;
  validation?: {
    valueAsBoolean?: boolean;
    valueAsJSON?: boolean;
    required?: boolean;
  };
}
const CheckboxGroup = ({ name, options, defaultValue, onChange, validation }: CheckboxGroupProps) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const register = useRegister({
    name,
    validation: { ...validation }
  })

  useEffect(() => {
    setSelectedOptions(defaultValue || []);
  }, [defaultValue]);

  const handleCheckboxChange = (event) => {
    const { name } = event.target;
    let newSelectedOptions;

    if (selectedOptions.includes(name)) {
      newSelectedOptions = selectedOptions.filter(
        (option) => option !== name
      );
    } else {
      newSelectedOptions = [...selectedOptions, name];
    }

    setSelectedOptions(newSelectedOptions);
    onChange && onChange(name, newSelectedOptions);
  }

  return (
    <div className="flex gap-3 flex-wrap">
      {options.map(({ label, image, value: optValue }) => (
        <label key={label}>
          <input type="checkbox" name={optValue || label} onChange={handleCheckboxChange} checked={selectedOptions.includes(optValue || label)} className="rw-check-input" />
          <span className="rw-check-tile">
            <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
              {image && <img className="w-12 h-12" src={image} />}
            </span>
            <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">{label}</span>
          </span>
        </label>
      ))}
      <input type="hidden" name={name} value={selectedOptions} {...register} />
    </div>
  );
}

export default CheckboxGroup;