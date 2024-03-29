import clsx from "clsx";
import Ripple from "../Ripple/Ripple";
import { Children, cloneElement, forwardRef, isValidElement, useRef } from "react";
import { useRipple } from "src/hooks/useRipple";

type ToggleButtonProps = {
  value?: string;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  selected?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLElement>, value: any) => void;
  onClick?: (event: React.MouseEvent<HTMLElement>, value: any) => void;
  fullWidth?: boolean;
  disableRipple?: boolean;
  checkedIcon?: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLElement>, 'onChange'>;
export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    props,
    ref
  ) => {
    const {
      className,
      checkedIcon,
      disabled,
      onChange,
      onClick,
      children,
      value,
      disableRipple,
      selected,
      size = "medium",
      fullWidth,
      ...other
    } = props
    const handleChange = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement> | React.ChangeEvent<HTMLElement>) => {
      if (onClick) {
        onClick(event as React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>, value);
        if (event.defaultPrevented) {
          return;
        }
      }

      if (onChange) {
        onChange(event as React.ChangeEvent<HTMLElement>, value);
      }
    };

    const rippleRef = useRef(null);
    const { enableRipple, getRippleHandlers } = useRipple({
      disabled,
      disableRipple,
      rippleRef,
    })
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        onClick={handleChange}
        value={value}
        disabled={disabled}
        tabIndex={0}
        {...getRippleHandlers(props)}
        {...other}
        className={clsx(
          `relative box-border cursor-pointer disabled:cursor-default inline-flex select-none appearance-none items-center justify-center rounded border !border-black/[.12] font-medium uppercase text-black dark:!border-white/[.12] dark:text-white`,
          className,
          {
            "w-full": fullWidth,
            "bg-black/[.16] hover:bg-black/[.24] dark:bg-white/[.16] dark:hover:bg-white/[.24]":
              selected && !disabled,
            "hover:bg-black/[.08] dark:hover:bg-white/[.08]": !selected && !disabled,
            "p-2 text-xs": size === "small",
            "p-4 text-sm ": size === "medium",
            "p-6 text-sm": size === "large",
            "[&>img]:opacity-30 [&>img]:brightness-[1.4] [&>img]:contrast-0 [&>img]:hue-rotate-[116deg] [&>img]:saturate-[.28] [&>img]:sepia": disabled,
          }
        )}
      >
        {checkedIcon && (
          <span
            className={clsx(
              "pointer-events-none absolute top-1 left-1 flex transform items-center justify-center transition-all duration-150 ease-in",
              {
                "scale-100 opacity-100": selected,
                "scale-0 opacity-0": !selected,
              }
            )}
          >
            {checkedIcon}
          </span>
        )}

        {children}
        {enableRipple ? <Ripple ref={rippleRef} /> : null}
      </button>
    );
  }
);

type ToggleButtonGroupProps = {
  value?: any;
  exclusive?: boolean;
  enforce?: boolean;
  onChange?: (event: React.MouseEvent, value: any) => void;
  children: React.ReactNode;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  gap?: number;
};

export const ToggleButtonGroup = forwardRef<
  HTMLDivElement,
  ToggleButtonGroupProps
>(
  (
    {
      value,
      disabled,
      onChange,
      className,
      orientation = "horizontal",
      size = "medium",
      gap = 0,
      exclusive,
      enforce,
      children,
      fullWidth,
      ...props
    }: ToggleButtonGroupProps & React.HTMLAttributes<HTMLDivElement>,
    ref
  ) => {
    let classes =
      gap === 0
        ? orientation === "horizontal"
          ? `[&:not(:first-of-type)]:-ml-px [&:not(:first-of-type)]:border-l-transparent [&:not(:first-of-type)]:!rounded-l-none [&:not(:last-of-type)]:!rounded-r-none`
          : `[&:not(:first-of-type)]:-mt-px [&:not(:first-of-type)]:border-t-transparent [&:not(:first-of-type)]:!rounded-t-none [&:not(:last-of-type)]:!rounded-b-none`
        : "";

    const handleChange = (event, buttonValue) => {
      if (!onChange) {
        return;
      }

      const index = value && value.indexOf(buttonValue);
      let newValue;

      if (value && index >= 0) {
        if (enforce && value.length <= 1) {
          return;
        }
        if (!Array.isArray(value)) {
          return console.error('Value must be array if not exclusive')
        }
        newValue = value.slice();
        newValue.splice(index, 1);
      } else {
        newValue = value ? value.concat(buttonValue) : [buttonValue];
      }

      onChange(event, newValue);
    };

    const handleExclusiveChange = (
      event: React.MouseEvent,
      buttonValue: any
    ) => {
      if (!onChange) {
        return;
      }

      if (
        enforce &&
        value &&
        (Array.isArray(value)
          ? value.length === 1 && value[0] === buttonValue
          : value === buttonValue)
      ) {
        return;
      }

      onChange(event, value === buttonValue ? null : buttonValue);
    };

    const isValueSelected = (value, candidate) => {
      if (candidate === undefined || value === undefined) {
        return false;
      }

      if (Array.isArray(candidate)) {
        return candidate.indexOf(value) >= 0;
      }

      return value === candidate;
    };
    return (
      <div
        role="group"
        ref={ref}
        className={clsx("inline-flex", className, {
          "w-full": fullWidth,
          "flex-col": orientation === "vertical",
          rounded: gap === 0,
          [`gap-${gap}`]: gap > 0,
        })}
        {...props}
      >
        {Children.map(children, (child, index) => {
          if (!isValidElement(child)) {
            return null;
          }

          return cloneElement(child as React.ReactElement<any>, {
            key: `toggle-button-${index}`,
            className: clsx(classes, child.props.className),
            size: child.props.size || size,
            selected:
              child.props.selected === undefined
                ? isValueSelected(child.props.value, value)
                : child.props.selected,
            fullWidth,
            onChange: exclusive ? handleExclusiveChange : handleChange,
            disabled: child.props.disabled || disabled,
          });
        })}
      </div>
    );
  }
);
