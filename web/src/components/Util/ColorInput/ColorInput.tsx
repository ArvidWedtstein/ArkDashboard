import { HTMLAttributes, InputHTMLAttributes, ReactNode, forwardRef, useId, useState } from "react";
import { FormControl, InputBase, InputBaseProps, InputLabel, InputLabelProps } from "../Input/Input";
import { Transition } from 'react-transition-group';
import clsx from "clsx";
import { Controller, FieldError, RegisterOptions, UseControllerReturn } from "@redwoodjs/forms";
import Button from "../Button/Button";
import { useControlled } from "src/lib/formatters";
type ColorInputProps = {
  autoComplete?: string;
  autoFocus?: boolean;
  children?: ReactNode;
  className?: string;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "DEFAULT";
  defaultValue?: string;
  disabled?: boolean;
  outputColorFormat?: 'hex' | 'rgb' | 'hsl'
  error?: boolean;
  FormHelperTextProps?: Partial<HTMLAttributes<HTMLParagraphElement>>;
  fullWidth?: boolean;
  helperText?: ReactNode;
  id?: string;
  InputLabelProps?: Partial<InputLabelProps>;
  InputProps?: Partial<InputBaseProps>
  SuffixProps?: Partial<HTMLAttributes<HTMLFieldSetElement>>;
  inputRef?: React.Ref<any>;
  label?: ReactNode;
  name?: string;
  onBlur?: InputBaseProps["onBlur"];
  onFocus?: InputBaseProps["onFocus"];
  onChange?: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
  >;
  placeholder?: string;
  required?: boolean;
  margin?: "dense" | "normal" | "none";
  variant?: "standard" | "filled" | "outlined";
  size?: "small" | "medium" | "large";
  value?: string;
  validation?: RegisterOptions & {
    valueAsBoolean?: boolean;
    valueAsJSON?: boolean;
  };
};
const ColorInput = forwardRef<HTMLDivElement, ColorInputProps>((props, ref) => {
  const {
    autoComplete,
    autoFocus = false,
    children,
    className,
    color = "DEFAULT",
    defaultValue = "#000000",
    outputColorFormat = "hex",
    disabled = false,
    FormHelperTextProps,
    fullWidth = false,
    helperText,
    id: idOverride,
    InputLabelProps,
    InputProps,
    inputRef,
    label,
    name,
    onBlur,
    onChange,
    onFocus,
    placeholder,
    SuffixProps,
    value: valueProp,
    variant = "outlined",
    size = "medium",
    margin = "normal",
    validation,
    ...other
  } = props;

  const [value, setValueState] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: 'ColorInput',
  });

  const [inputValue, setInputValueState] = useControlled({
    default: defaultValue,
    name: 'ColorInput',
    state: "inputValue",
  });

  const [error, setError] = useState(false);

  type FormatType = {
    value: 'hex' | 'rgb' | 'hsl'
    label: string
    regex: RegExp;
    active: boolean
  }
  const [format, setFormat] = useState<FormatType[]>([
    {
      value: "hex",
      label: "HEX",
      regex: /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
      active: true,
    },
    {
      value: "rgb",
      label: "RGB",
      regex: /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i,
      active: false,
    },
    {
      value: "hsl",
      label: "HSL",
      regex: /^hsl\(\s*(\d+)\s*,\s*(\d+%)\s*,\s*(\d+%)\s*\)$/i,
      active: false,
    },
  ]);

  const isValidColor = (input: string, formats: 'hex' | 'rgb' | 'hsl'): boolean => {
    const formatRegex = format.find((f) => f.value === formats)?.regex;
    return formatRegex.test(input) ?? false;
  }

  const handleColorChange = (event, field, colorPicker: boolean = false) => {
    const { value } = event.target;
    setInputValueState(convertColor(colorPicker ? 'hex' : format.find((item) => item.active).value, format.find((item) => item.active).value, value));

    field?.onChange(convertColor(colorPicker ? 'hex' : format.find((item) => item.active).value, outputColorFormat, value));

    // console.log(convertColor(colorPicker ? 'hex' : format.find((item) => item.active).value, format.find((item) => item.active).value, value))
    const isColorValid = isValidColor(convertColor(colorPicker ? 'hex' : format.find((item) => item.active).value, format.find((item) => item.active).value, value), format.find((item) => item.active).value)
    setError(!isColorValid);
    if (value && isColorValid) {
      setValueState(convertColor(colorPicker ? 'hex' : format.find((item) => item.active).value, outputColorFormat, value));
      console.log('VALID')
    }
  };

  const swapColor = () => {
    setFormat((prevFormat) => {

      const currentIndex = prevFormat.findIndex((item) => item.active);

      if (currentIndex !== -1) {
        // Create a new array to avoid modifying the previous state directly
        const newFormat = prevFormat.map((item) => ({ ...item }));

        // Deactivate the current active format
        newFormat[currentIndex].active = false;

        // Calculate the index of the next format (rotating circularly)
        const nextIndex = (currentIndex + 1) % newFormat.length;

        // Activate the next format
        newFormat[nextIndex].active = true;


        setInputValueState(convertColor(
          prevFormat.find((item) => item.active).value,
          newFormat.find((item) => item.active).value,
          inputValue
        ))

        return newFormat;
      }

      // If no active format found, return the previous state
      return prevFormat;
    });
  };

  // Color Converting Functions
  const RgbToHex = (rgb: string) => {
    const rgbValues = rgb.match(/\d+/g);
    if (rgbValues?.length === 3) {
      const [r, g, b] = rgbValues.map(Number);
      const hex = ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
      return `#${hex}`;
    }
    return rgb;
  };
  const RgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }
  const HexToRgb = (hex: string) => {
    const bigint = parseInt(hex.replace(/^#/, ""), 16)
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
  }
  const HslToHex = (color: string) => {
    const hslValues = color
      .replace("hsl(", "")
      .split(",")
      .map((val) => parseFloat(val));
    const h = hslValues[0];
    const s = hslValues[1] / 100;
    const l = hslValues[2] / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r, g, bValue;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      bValue = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      bValue = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      bValue = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      bValue = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      bValue = c;
    } else {
      r = c;
      g = 0;
      bValue = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    bValue = Math.round((bValue + m) * 255);

    return `#${((1 << 24) | (r << 16) | (g << 8) | bValue)
      .toString(16)
      .slice(1)}`;
  };

  const convertColor = (fromFormat: FormatType["value"], toFormat: FormatType["value"], value: string) => {
    let formattedColor = value;

    switch (fromFormat) {
      case 'hex':
        switch (toFormat) {
          case 'hsl':
            const hex = value.replace(/^#/, "");
            const [r, g, b] = hex.match(/.{1,2}/g).map((val) => parseInt(val, 16));
            const hsl = RgbToHsl(r, g, b);
            formattedColor = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
            break;
          case 'rgb':
            formattedColor = HexToRgb(value);
            break;
        }
        break;

      case 'rgb':
        switch (toFormat) {
          case 'hsl':
            const hex = RgbToHex(value).replace(/^#/, "");
            const [r, g, b] = hex.match(/.{1,2}/g).map((val) => parseInt(val, 16));
            const hsl = RgbToHsl(r, g, b)
            formattedColor = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
            break;
          case 'hex':
            formattedColor = RgbToHex(value);
            break;
        }
        break;

      case 'hsl':
        switch (toFormat) {
          case 'hex':
            formattedColor = HslToHex(value);
            break;
          case 'rgb':
            const [h, s, l] = value.match(/\d+/g).map(Number);
            formattedColor = HexToRgb(HslToHex(`hsl(${h}, ${s}%, ${l}%)`));
            break;
        }
        break;
    }
    return formattedColor;
  };

  const [rotate, setRotate] = useState(false);
  const duration = 150;

  const defaultStyle = {
    transition: `transform ${duration}ms ease-in`,
    transform: `rotate(0deg)`
  }

  const transitionStyles = {
    entering: { transform: `rotate(180deg)` },
    entered: { transform: `rotate(180deg)` },
    exiting: {
      transition: `transform 0ms ease-in`,
      transform: `rotate(0deg)`
    },
    exited: {
      transition: `transform 0ms ease-in`,
      transform: `rotate(0deg)`
    },
  };
  const borders = {
    primary: `border-blue-400`,
    secondary: `border-zinc-500`,
    success: `border-pea-500`,
    error: `border-red-500`,
    warning: `border-amber-400`,
    disabled: `dark:border-white/30 border-black/30`,
    DEFAULT: `border-black dark:border-white`,
    DEFAULTNOFOCUS: `group-hover:border-black group-hover:dark:border-white border-black/20 dark:border-white/20`,
  };

  const id = idOverride ?? useId();
  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
  const inputLabelId = label && id ? `${id}-label` : undefined;

  const ownerState = {
    ...props,
    autoFocus,
    color,
    disabled,
    error,
    fullWidth,
    variant,
    ...validation,
  };

  const renderFormControl = ({ field, fieldState, formState }: UseControllerReturn) => {
    return (
      <FormControl
        className={className}
        disabled={disabled || field?.disabled}
        error={error || Boolean(fieldState?.error) || fieldState?.invalid}
        fullWidth={fullWidth}
        ref={ref}
        required={Boolean(validation?.required)}
        color={color}
        variant={variant}
        ownerState={ownerState}
        margin={margin}
        size={size}
        {...other}
      >
        {label != null && label !== "" && (
          <InputLabel
            htmlFor={id}
            id={inputLabelId}
            {...InputLabelProps}
          >
            {label}
          </InputLabel>
        )}

        <InputBase
          label={label}
          aria-describedby={helperTextId}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          fullWidth={fullWidth}
          type={"text"}
          value={inputValue}
          id={id}
          ref={field ? field.ref : null}
          inputRef={inputRef}
          onBlur={(e) => {
            onBlur?.(e);
            field?.onBlur();
          }}
          onChange={(e) => {
            onChange?.(e);
            handleColorChange(e, field);
          }}
          onFocus={onFocus}
          placeholder={placeholder}
          {...InputProps}
          renderSuffix={(state) =>
            variant === "outlined" ? (
              <fieldset
                {...SuffixProps}
                aria-hidden
                className={clsx(
                  `absolute border text-left transition-colors duration-75 ease-in ${borders[
                  disabled || state.disabled
                    ? "disabled"
                    : error || state.error || Boolean(fieldState?.error) || fieldState?.invalid
                      ? 'error'
                      : state.focused
                        ? color
                        : "DEFAULTNOFOCUS"
                  ]
                  } pointer-events-none bottom-0 left-0 right-0 -top-[5px] m-0 min-w-0 overflow-hidden rounded-[inherit] px-2`,
                  {
                    "border-2": state.focused,
                  },
                  SuffixProps?.className
                )}
              >
                <legend
                  className={clsx(
                    "invisible block h-[11px] w-auto overflow-hidden whitespace-nowrap p-0 text-xs transition-all",
                    {
                      "max-w-full":
                        state.focused ||
                        state.filled ||
                        state.startAdornment ||
                        props?.InputLabelProps?.shrink || props.InputProps?.startAdornment,
                      "max-w-[0.001px]":
                        !state.focused &&
                        !state.filled &&
                        !state.startAdornment &&
                        !props?.InputLabelProps?.shrink && !props.InputProps?.startAdornment,
                    }
                  )}
                >
                  {label && label !== "" && (
                    <span className={"visible inline-block px-[5px] opacity-0"}>
                      {state.required ? (
                        <React.Fragment>
                          {label}
                          &thinsp;{"*"}
                        </React.Fragment>
                      ) : (
                        label
                      )}
                    </span>
                  )}
                </legend>
              </fieldset>
            ) : null
          }
          startAdornment={(
            <div className="overflow-hidden inline-flex items-center justify-center rounded-full border border-black/20 dark:border-white/20 ">
              <input
                className="w-8 h-8 appearance-none rounded-full overflow-hidden outline-transparent p-0 m-0"
                onChange={(e) => {
                  handleColorChange(e, field, true);
                  onChange?.(e);
                }}
                type="color"
                name={name}
                value={value}
              />
            </div>
          )}
          endAdornment={(
            <>
              <div className="p-0 relative max-w-[3rem] select-none overflow-hidden text-center">
                <div className="relative flex justify-start items-center w-full transition-transform transform" style={{ transform: `translate3d(${-format.indexOf(format.find(f => f.active)) * 100}%, 0, 0)` }}>
                  {format.map((f) => (
                    <div className={clsx("min-w-[3rem] h-full text-center")} key={f.value}>
                      {f.label}
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="icon"
                color="DEFAULT"
                size={size}
                onClick={() => {
                  swapColor();
                  setRotate(!rotate)
                }}
              >
                <Transition
                  in={rotate}
                  timeout={duration}
                  onEntered={() => setRotate(false)}
                >
                  {(state) => (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="rw-button-icon transition-transform"
                      style={{
                        ...defaultStyle,
                        ...transitionStyles[state]
                      }}
                    >
                      <path d="M464 32C455.2 32 448 39.16 448 48v129.3C416.2 99.72 340.6 48 256 48c-102 0-188.3 72.91-205.1 173.3C49.42 230.1 55.3 238.3 64.02 239.8C64.91 239.9 65.8 240 66.67 240c7.672 0 14.45-5.531 15.77-13.34C96.69 141.7 169.7 80 256 80c72.49 0 137.3 44.88 163.6 112H304C295.2 192 288 199.2 288 208S295.2 224 304 224h160C472.8 224 480 216.8 480 208v-160C480 39.16 472.8 32 464 32zM447.1 272.2c-8.766-1.562-16.97 4.406-18.42 13.12C415.3 370.3 342.3 432 255.1 432c-72.49 0-137.3-44.88-163.6-112H208C216.8 320 224 312.8 224 304S216.8 288 208 288h-160C39.16 288 32 295.2 32 304v160C32 472.8 39.16 480 48 480S64 472.8 64 464v-129.3C95.84 412.3 171.4 464 256 464c101.1 0 188.3-72.91 205.1-173.3C462.6 281.9 456.7 273.7 447.1 272.2z" />
                    </svg>
                  )}
                </Transition>
              </Button>
            </>
          )}
        />

        {helperText && (
          <p
            id={helperTextId}
            className={clsx("rw-helper-text", {
              "!text-red-500": error || fieldState?.error || fieldState?.invalid,
              "dark:!text-white/50 !text-black/50 text-opacity-50": (disabled || field?.disabled) && !(error || fieldState?.error || fieldState?.invalid)
            })}
            {...FormHelperTextProps}
          >
            {helperText}
          </p>
        )}

        {field && (<FieldError name={name} className="rw-field-error" />)}
      </FormControl>
    )
  }

  return (
    <>
      {name ? (
        <Controller
          name={name}
          defaultValue={value}
          rules={validation}
          render={renderFormControl}
        />
      ) : renderFormControl({ field: null, fieldState: null, formState: null })}

      {/* <div className="rw-button-group">
        <input
          type="text"
          value={selectedColor}
          onChange={handleColorChange}
          className="rw-input border-r-none"
        />
        <input
          className="rw-input h-full max-w-[2rem] appearance-none border-l-0 border-none p-0"
          onChange={(e) => setSelectedColor(convertColor('hex', format?.find((item) => item.active).value, e.target.value))}
          type="color"
          value={convertColor(format?.find((item) => item.active).value, 'hex', selectedColor)}
        />
        <div className="rw-input p-0 relative max-w-[4rem] select-none border-l-0 overflow-hidden">
          <div className="relative flex w-full transition-transform transform" style={{ transform: `translate3d(${-format.indexOf(format.find(f => f.active)) * 100}%, 0, 0)` }}>
            <p className={clsx("relative px-4 py-3.5 inline-block w-full h-full rounded-none")}>
              HEX
            </p>
            <p className={clsx("relative px-4 py-3.5 inline-block w-full h-full rounded-none")}>
              RGB
            </p>
            <p className={clsx("relative px-4 py-3.5 inline-block w-full h-full rounded-none")}>
              HSL
            </p>
          </div>
        </div>
        <input
          className="rw-input max-w-[4rem] select-none border-l-0"
          readOnly
          value={format?.find((item) => item.active).label}
        />
        <button
          type="button"
          className="rw-button rw-button-gray -ml-px"
          onClick={() => {
            swapColor();
            setRotate(!rotate)
          }}
        >
          <Transition
            in={rotate}
            timeout={duration}
            onEntered={() => setRotate(false)}
          >
            {(state) => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="rw-button-icon transition-transform"
                style={{
                  ...defaultStyle,
                  ...transitionStyles[state]
                }}
              >
                <path d="M464 32C455.2 32 448 39.16 448 48v129.3C416.2 99.72 340.6 48 256 48c-102 0-188.3 72.91-205.1 173.3C49.42 230.1 55.3 238.3 64.02 239.8C64.91 239.9 65.8 240 66.67 240c7.672 0 14.45-5.531 15.77-13.34C96.69 141.7 169.7 80 256 80c72.49 0 137.3 44.88 163.6 112H304C295.2 192 288 199.2 288 208S295.2 224 304 224h160C472.8 224 480 216.8 480 208v-160C480 39.16 472.8 32 464 32zM447.1 272.2c-8.766-1.562-16.97 4.406-18.42 13.12C415.3 370.3 342.3 432 255.1 432c-72.49 0-137.3-44.88-163.6-112H208C216.8 320 224 312.8 224 304S216.8 288 208 288h-160C39.16 288 32 295.2 32 304v160C32 472.8 39.16 480 48 480S64 472.8 64 464v-129.3C95.84 412.3 171.4 464 256 464c101.1 0 188.3-72.91 205.1-173.3C462.6 281.9 456.7 273.7 447.1 272.2z" />
              </svg>
            )}
          </Transition>
        </button>

      </div> */}
    </>
  );
});

export default ColorInput

