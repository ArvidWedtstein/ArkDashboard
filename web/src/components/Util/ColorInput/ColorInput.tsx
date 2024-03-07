import { ChangeEvent, HTMLAttributes, ReactNode, forwardRef, useId, useState } from "react";
import { FormControl, InputBase, InputBaseProps, InputLabel, InputLabelProps } from "../Input/Input";
import { Transition } from 'react-transition-group';
import clsx from "clsx";
import { FieldError, RegisterOptions, useController } from "@redwoodjs/forms";
import Button from "../Button/Button";
import { HexToHsl, HexToRgb, HslToHex, RgbToHex, RgbToHsl } from "src/lib/formatters";
import { useControlled } from "src/hooks/useControlled";

type ColorInputProps = {
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
  required?: boolean;
  margin?: "dense" | "normal" | "none";
  variant?: "standard" | "contained" | "outlined";
  size?: "small" | "medium" | "large";
  value?: string;
  validation?: RegisterOptions & {
    valueAsBoolean?: boolean;
    valueAsJSON?: boolean;
  };
};
const ColorInput = forwardRef<HTMLDivElement, ColorInputProps>((props, ref) => {
  const {
    autoFocus = false,
    children,
    className,
    color = "DEFAULT",
    defaultValue = "#000000",
    outputColorFormat = "hex",
    disabled = false,
    helperText,
    FormHelperTextProps,
    fullWidth = false,
    id: idOverride,
    InputLabelProps,
    InputProps,
    inputRef,
    label,
    name,
    onBlur,
    onChange,
    onFocus,
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

  const { field, fieldState } = !!name
    ? useController({ name: name, rules: validation, defaultValue: value })
    : { field: null, fieldState: null };


  const [error, setError] = useState(false);

  type FormatType = {
    value: 'hex' | 'rgb' | 'hsl'
    label: string
    regex: RegExp;
    active: boolean
  }
  const [formats, setFormats] = useState<FormatType[]>([
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

  const isValidColor = (input: string, format: FormatType["value"]): boolean => {
    const formatRegex = formats.find((f) => f.value === format)?.regex;
    return formatRegex?.test(input) ?? false;
  }

  const handleColorChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
    let correctedValue = value;
    const activeFormat = formats.find((f) => f.active).value;

    // Correct color, when edited by colorwheel or copy paste
    formats.forEach(({ value: formatValue, regex }) => {
      if (regex.test(value) && activeFormat !== formatValue) {
        correctedValue = convertColor(formatValue, activeFormat, value)
      }
    });

    setInputValueState(correctedValue);

    field?.onChange(convertColor(activeFormat, outputColorFormat, correctedValue));

    const isColorValid = isValidColor(convertColor(activeFormat, activeFormat, correctedValue), activeFormat)
    setError(!isColorValid);

    if (correctedValue && isColorValid) {
      setValueState(convertColor(activeFormat, outputColorFormat, correctedValue));
    }
  };

  const swapColor = () => {
    /**
     * Create a new array to avoid modifying the previous state directly,
     * and deactivate the current active format
     */
    setFormats((prevFormat) => {
      const currentIndex = prevFormat.findIndex((item) => item.active);

      if (currentIndex !== -1) {
        const newFormat = prevFormat.map((item) => ({ ...item }));
        newFormat[currentIndex].active = false;

        const nextIndex = (currentIndex + 1) % newFormat.length;
        newFormat[nextIndex].active = true;

        setInputValueState(convertColor(
          prevFormat.find((item) => item.active).value,
          newFormat.find((item) => item.active).value,
          inputValue
        ))

        const activeFormat = newFormat.find((format) => format.active).value;
        const isColorValid = isValidColor(
          convertColor(
            prevFormat.find((item) => item.active).value,
            activeFormat,
            inputValue
          ),
          activeFormat
        );

        if (isColorValid) {
          setValueState(convertColor(prevFormat.find((item) => item.active).value, outputColorFormat, inputValue));
          field?.onChange(convertColor(prevFormat.find((item) => item.active).value, outputColorFormat, inputValue));
        }

        return newFormat;
      }

      return prevFormat;
    });
  };

  // Color Converting Functions
  const convertColor = (fromFormat: FormatType["value"], toFormat: FormatType["value"], value: string) => {
    try {
      let formattedColor = value;

      if (fromFormat === toFormat || formats.find((f) => f.value === toFormat).regex.test(value)) return formattedColor;

      // TODO: make this scalable
      switch (fromFormat) {
        case 'hex':
          switch (toFormat) {
            case 'hsl':
              const hsl = HexToHsl(value);
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
              if (!/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i.test(value)) {
                if (process.env.NODE_ENV !== "production") {
                  console.error('Invalid format', value)
                }
                return value;
              }

              const [r, g, b] = value.substring(4, value.length - 1)
                .replace(/ /g, '')
                .split(',').map(Number)

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
              if (!/^hsl\(\s*(\d+)\s*,\s*(\d+%)\s*,\s*(\d+%)\s*\)$/i.test(value)) {
                if (process.env.NODE_ENV !== "production") {
                  console.error('Invalid format HslToHex', value)
                }
                return value;
              }

              const [h1, s1, l1] = value.match(/\d+/g).map(Number);

              formattedColor = HslToHex(h1, s1, l1);
              break;
            case 'rgb':
              if (!/^hsl\(\s*(\d+)\s*,\s*(\d+%)\s*,\s*(\d+%)\s*\)$/i.test(value)) {
                if (process.env.NODE_ENV !== "production") {
                  console.error('Invalid format HslToRgb', value)
                }
                return value;
              }
              const [h2, s2, l2] = value.match(/\d+/g).map(Number);
              formattedColor = HexToRgb(HslToHex(h2, s2, l2));
              break;
          }
          break;
      }
      return formattedColor;
    } catch (error) {
      console.warn(error)
    }
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
    success: `border-success-500`,
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
        autoFocus={autoFocus}
        fullWidth={fullWidth}
        type={"text"}
        value={inputValue}
        id={id}
        inputRef={inputRef}
        onBlur={(e) => {
          onBlur?.(e);
          field?.onBlur();
        }}
        onChange={(e) => {
          onChange?.(e);
          handleColorChange(e);
        }}
        onFocus={onFocus}
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
          <div className="overflow-hidden inline-flex items-center justify-center rounded-full border border-black/20 dark:border-white/20">
            <input
              className={clsx("appearance-none rounded-full overflow-hidden outline-transparent p-0 m-0", {
                "w-8 h-8": size === 'large',
                "w-7 h-7": size === 'medium',
                "w-6 h-6": size === 'small'
              })}
              ref={field ? field.ref : null}
              onChange={(e) => {
                handleColorChange(e);
                onChange?.(e);
              }}
              type="color"
              name={name}
              value={convertColor(formats.find((f) => f.active).value, 'hex', value)}
            />
          </div>
        )}
        endAdornment={(
          <>
            <div className="p-0 relative max-w-[3rem] select-none overflow-hidden text-center">
              <div className="relative flex justify-start items-center w-full transition-transform transform" style={{ transform: `translate3d(${-formats.indexOf(formats.find(f => f.active)) * 100}%, 0, 0)` }}>
                {formats.map((f) => (
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
                    className="transition-transform"
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
          className={clsx("mt-0.5 text-left text-xs leading-6 tracking-wide", {
            "!text-error-500": error || fieldState?.error || fieldState?.invalid,
            "dark:!text-white/50 !text-black/50 text-opacity-50": (disabled || field?.disabled) && !(error || fieldState?.error || fieldState?.invalid)
          })}
          {...FormHelperTextProps}
        >
          {helperText}
        </p>
      )}

      {field && (<FieldError name={name} className="rw-field-error" />)}
    </FormControl>
  );
});

export default ColorInput

