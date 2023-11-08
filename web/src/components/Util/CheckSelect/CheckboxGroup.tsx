import { useController } from "@redwoodjs/forms";
import clsx from "clsx";
import { useCallback, useMemo, useState } from "react";
import Ripple from "../Ripple/Ripple";

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
  size?: "sm" | "md" | "lg";
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
  size = "lg",
  disabled = false,
  validation = {
    required: false,
    single: false,
  },
}: CheckboxGroupProps) => {
  // TODO: fix errorStyles for checkbox group
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
              "rw-check-tile relative flex flex-col items-center justify-center rounded-lg border-2 border-zinc-500 bg-zinc-300 shadow transition-all duration-150 dark:bg-zinc-600",
              {
                disabled: (!name && !label) || disabled,
                "cursor-pointer": label && !disabled,
              },
              size === 'lg' ? 'h-28 w-28' : size === 'md' ? 'h-20 w-20' : 'h-12 w-12'
            )}
          >
            <span className="text-gray-900 transition-all duration-150 ease-in dark:text-stone-200">
              {image &&
                (React.isValidElement(image) ? (
                  image
                ) : (
                  <img
                    className={size === 'lg' ? 'max-w-16 max-h-12 w-auto' : size === 'md' ? 'max-w-10 max-h-8 w-auto' : "max-w-8 max-h-8 w-auto"}
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

type ToggleButtonGroupProps = {
  value?: string;
  exclusive?: boolean;
  onChange?: (event: React.MouseEvent<HTMLElement>, value: string) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  size?: "small" | "medium" | "large";
  validation?: {
    valueAsBoolean?: boolean;
    valueAsJSON?: boolean;
    valueAsNumber?: boolean;
    required?: boolean;
    single?: boolean;
  };
};


export const ToggleButton = (props) => {
  console.log(props)
  return (
    <button type="button" tabIndex={0} {...props} className={clsx("inline-flex items-center justify-center relative box-border cursor-pointer select-none appearance-none font-medium p-2 uppercase border text-sm border-black/10 dark:text-white text-black dark:border-white/10", props.className)}>
      {props.children}
      <Ripple />
    </button>
  )
}
export const ToggleButtonGroup = ({
  value,
  disabled = false,
  onChange,
  className,
  orientation = "horizontal",
  size = "medium",
  exclusive = false,
  children,
}: ToggleButtonGroupProps) => {
  // https://github.com/mui/material-ui/blob/a13c0c026692aafc303756998a78f1d6c2dd707d/packages/mui-material/src/ToggleButtonGroup/ToggleButtonGroup.js

  let classes = orientation === 'horizontal'
    ? `[&:not(:first-of-type)]:!-ml-px [&:not(:first-of-type)]:!border-l-transparent [&:not(:first-of-type)]:!rounded-l-none [&:not(:last-of-type)]:!rounded-r-none`
    : `[&:not(:first-of-type)]:!-mt-px [&:not(:first-of-type)]:!border-t-transparent [&:not(:first-of-type)]:!rounded-t-none [&:not(:last-of-type)]:!rounded-b-none`

  const handleChange = (event, buttonValue) => {
    if (!onChange) {
      return;
    }

    const index = value && value.indexOf(buttonValue);
    let newValue;

    if (value && index >= 0) {
      newValue = value.slice();
      newValue.splice(index, 1);
    } else {
      newValue = value ? value.concat(buttonValue) : [buttonValue];
    }

    onChange(event, newValue);
  };

  const handleExclusiveChange = (event, buttonValue) => {
    if (!onChange) {
      return;
    }

    onChange(event, value === buttonValue ? null : buttonValue);
  };

  function isValueSelected(value, candidate) {
    if (candidate === undefined || value === undefined) {
      return false;
    }

    if (Array.isArray(candidate)) {
      return candidate.indexOf(value) >= 0;
    }

    return value === candidate;
  }
  return (
    <div role="group" className={clsx("rounded", className, classes)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        return React.cloneElement(child as React.ReactElement<any>, {
          className: clsx(child.props.className, classes, {
            'bg-zinc-300 dark:bg-zinc-600': isValueSelected(child.props.value, value),
            'bg-zinc-100 dark:bg-zinc-700': !isValueSelected(child.props.value, value),
          }),
          size: child.props.size || size,
          selected: child.props.selected === undefined
            ? isValueSelected(child.props.value, value)
            : child.props.selected,
          onClick: exclusive ? handleExclusiveChange : handleChange,
          disabled: disabled || child.props.disabled,
          "aria-pressed": false,
        });
      })}
    </div>
  )
}

export default CheckboxGroup;
