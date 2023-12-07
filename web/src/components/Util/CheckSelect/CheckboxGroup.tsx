import { useController } from "@redwoodjs/forms";
import clsx from "clsx";
import { useCallback, useMemo, useRef, useState } from "react";
import Ripple from "../Ripple/Ripple";
import { useRipple } from "src/components/useRipple";

interface CheckboxGroupProps {
  name?: string;
  options: {
    label: string;
    value?: string | number;
    image?: string | React.ReactNode;
  }[];
  exclusive?: boolean;
  form?: boolean;
  className?: string;
  defaultValue?: string[] | string;
  size?: "small" | "medium" | "large";
  onChange?: (name: string, value: string[]) => void;
  disabled?: boolean;
  disableRipple?: boolean;
  validation?: {
    valueAsBoolean?: boolean;
    valueAsJSON?: boolean;
    valueAsNumber?: boolean;
    required?: boolean;
    single?: boolean;
  };
}
const CheckboxGroup = (props: CheckboxGroupProps) => {
  const {
    name,
    options,
    form = true,
    defaultValue = [],
    onChange,
    className,
    size = "large",
    disabled = false,
    exclusive = false,
    disableRipple,
    validation = {
      required: false,
      single: false,
    }
  } = props
  // TODO: fix errorStyles for checkbox group
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    () => validation.single || exclusive ? defaultValue as string[] : [defaultValue] as string[]
  );
  const { field } =
    form && !!name
      ? useController({ name: name, rules: validation, defaultValue })
      : { field: null };
  const memoizedOptions = useMemo(() => options, [options]);

  const handleCheckboxChange = ((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    let newSelectedOptions;

    if (selectedOptions.includes(value)) {
      newSelectedOptions = selectedOptions.filter(
        (option) => option !== value
      );
    } else {
      newSelectedOptions = validation.single || exclusive
        ? [value]
        : [...selectedOptions, value];
    }

    setSelectedOptions(newSelectedOptions);

    if (name && field) {
      field.onChange(
        validation.single || exclusive
          ? validation.valueAsNumber
            ? parseInt(newSelectedOptions[0])
            : newSelectedOptions[0]
          : newSelectedOptions
      );
    }

    if (onChange) {
      onChange(value, newSelectedOptions);
    }
  });

  return (
    <div
      className={clsx("flex h-fit flex-wrap gap-1 md:gap-3", className)}
    >
      {memoizedOptions.map(({ label, image, value: optValue }) => {
        const rippleRef = useRef(null);
        const { enableRipple, getRippleHandlers } = useRipple({
          disabled,
          disableRipple,
          rippleRef
        })
        return (

          <label key={label} aria-details={`Item: ${optValue}`} className="overflow-hidden" {...getRippleHandlers()}>
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
                "rw-check-tile p-1 relative flex flex-col items-center justify-center rounded border border-black/[.12] dark:border-white/[.12] transition-all duration-150 overflow-hidden",
                {
                  disabled: (!name && !label) || disabled,
                  "cursor-pointer": label && !disabled,
                  "h-12 w-12 text-xs": size === 'small',
                  "h-20 w-20 text-xs": size === 'medium',
                  "h-28 w-28 text-sm": size === 'large',
                },
              )}
            >
              <span className="inline-flex items-center justify-center text-gray-900 grow transition-all overflow-hidden duration-150 ease-in dark:text-stone-200">
                {image &&
                  (React.isValidElement(image) ? (
                    image
                  ) : (
                    <img
                      className={clsx("w-auto", {
                        "max-w-8 max-h-8": size === 'small',
                        'max-w-10 max-h-8': size === 'medium',
                        'max-w-16 max-h-12': size === 'large',
                      })}
                      src={image.toString()}
                    />
                  ))}
              </span>
              <span className="mx-2 text-center text-gray-900 transition-all duration-300 ease-linear dark:text-stone-200">
                {label}
              </span>
              {enableRipple ? <Ripple ref={rippleRef} /> : null}
            </span>
          </label>
        )
      })}
    </div>
  );
};

export default CheckboxGroup;
