import { useController } from "@redwoodjs/forms";
import clsx from "clsx";
import { forwardRef, useMemo, useRef, useState } from "react";
import Ripple from "../Ripple/Ripple";
import { useRipple } from "src/components/useRipple";

type CheckboxGroupProps<T extends string | number> = {
  name?: string;
  options: {
    label: string;
    value?: T;
    image?: string | React.ReactNode;
  }[];
  exclusive?: boolean;
  enforce?: boolean;
  className?: string;
  defaultValue?: T[] | T;
  size?: "small" | "medium" | "large";
  onChange?: (changedValue: T, selectedValues: T[]) => void;
  disabled?: boolean;
  disableRipple?: boolean;
  validation?: {
    valueAsBoolean?: boolean;
    valueAsJSON?: boolean;
    valueAsNumber?: boolean;
    required?: boolean;
  };
}
const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps<string | number>>((props, ref) => {
  const {
    name,
    options,
    defaultValue = [],
    onChange,
    className,
    size = "large",
    disabled = false,
    exclusive = false,
    enforce = false,
    disableRipple,
    validation = {
      required: false,
    }
  } = props
  // TODO: fix errorStyles for checkbox group
  const [selectedOptions, setSelectedOptions] = useState<(string | number)[]>(
    () => (exclusive ? [defaultValue] : Array.isArray(defaultValue) ? defaultValue : [defaultValue]) as (string | number)[]
  );

  const { field } =
    !!name
      ? useController({ name: name, rules: validation, defaultValue })
      : { field: null };

  const memoizedOptions = useMemo(() => options, [options]);

  const handleCheckboxChange = ((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, ariaValueText } = event.target;
    let correctValue = ariaValueText === 'number' ? parseInt(value) : value;
    let newSelectedOptions: (string | number)[];

    if (selectedOptions.includes(correctValue)) {
      newSelectedOptions = selectedOptions.filter(
        (option) => option !== correctValue
      );
    } else {
      newSelectedOptions = exclusive
        ? [correctValue]
        : [...selectedOptions, correctValue];
    }

    if (enforce) {
      const slicedOptions = newSelectedOptions.slice(0, 1);
      newSelectedOptions = slicedOptions.length >= 1 ? slicedOptions : []
    }

    setSelectedOptions(newSelectedOptions);

    if (name && field) {
      field.onChange(
        exclusive
          ? validation.valueAsNumber
            ? parseInt(newSelectedOptions[0] as string)
            : newSelectedOptions[0]
          : newSelectedOptions
      );
    }

    if (onChange) {
      onChange(correctValue as string | number, newSelectedOptions as (string | number)[]);
    }
  });

  return (
    <div
      className={clsx("flex h-fit flex-wrap gap-1 md:gap-3", className)}
      ref={ref}
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
              disabled={(!name && !label) || disabled}
              type="checkbox"
              name={name || optValue.toString() || label + "checkbox"}
              value={optValue || label}
              onChange={handleCheckboxChange}
              aria-valuetext={typeof optValue}
              aria-checked={selectedOptions.includes(optValue ?? label)}
              checked={selectedOptions.includes(optValue ?? label)}
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
});

export default CheckboxGroup;
