import { useController } from "@redwoodjs/forms";
import clsx from "clsx";
import { useCallback, useMemo, useState } from "react";

interface CheckboxGroupProps {
  name?: string;
  options: {
    label: string;
    value?: string | number;
    image?: string | React.ReactNode;
  }[];
  form?: boolean;
  className?: string;
  defaultValue?: string[] | string;
  onChange?: (name: string, value: string[]) => void;
  disabled?: boolean;
  validation?: {
    valueAsBoolean?: boolean;
    valueAsJSON?: boolean;
    valueAsNumber?: boolean;
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
  className,
  disabled = false,
  validation = {
    required: false,
    single: false,
  },
}: CheckboxGroupProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    () => validation.single ? defaultValue as string[] : [defaultValue] as string[]
  );
  const { field } =
    form && !!name
      ? useController({ name: name, rules: validation, defaultValue })
      : { field: null };
  const memoizedOptions = useMemo(() => options, [options]);

  const handleCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      let newSelectedOptions;

      if (selectedOptions.includes(value)) {
        newSelectedOptions = selectedOptions.filter(
          (option) => option !== value
        );
      } else {
        newSelectedOptions = validation.single
          ? [value]
          : [...selectedOptions, value];
      }

      setSelectedOptions(newSelectedOptions);
      !!name &&
        form &&
        field.onChange(
          validation.single
            ? validation.valueAsNumber
              ? parseInt(newSelectedOptions[0])
              : newSelectedOptions[0]
            : newSelectedOptions
        );
      onChange?.(value, newSelectedOptions);
    },
    [name, onChange, selectedOptions, validation.single]
  );

  return (
    <div
      className={clsx("mt-1 flex h-fit flex-wrap gap-1 md:gap-3", className)}
    >
      {memoizedOptions.map(({ label, image, value: optValue }) => (
        <label key={label} aria-details={`Item: ${optValue}`}>
          <input
            disabled={(!name && !label) || (!name && !form) || disabled}
            type="checkbox"
            name={name || optValue.toString() || label + "checkbox"}
            value={optValue || label}
            onChange={handleCheckboxChange}
            checked={selectedOptions.includes(optValue.toString() || label)}
            className="rw-check-input absolute hidden overflow-hidden"
          />
          <span
            className={clsx(
              "rw-check-tile relative flex h-28 w-28 flex-col items-center justify-center rounded-lg border-2 border-zinc-500 bg-zinc-300 shadow transition-all duration-150 dark:bg-zinc-600",
              {
                disabled: (!name && !label) || disabled,
                "cursor-pointer": label && !disabled,
              }
            )}
          >
            <span className="text-gray-900 transition-all duration-150 ease-in dark:text-stone-200">
              {image &&
                (React.isValidElement(image) ? (
                  image
                ) : (
                  <img
                    className="max-w-16 max-h-12 w-auto"
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
