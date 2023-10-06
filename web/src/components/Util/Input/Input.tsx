import {
  FieldError,
  InputField,
  InputFieldProps,
  Label,
  TextAreaField,
  TextAreaFieldProps,
  useController,
  useErrorStyles,
} from "@redwoodjs/forms";
import clsx from "clsx";
import { CSSProperties, useDeferredValue, useState } from "react";
import { debounce, isEmpty } from "src/lib/formatters";
type InputProps = {
  name?: string;
  helperText?: string;
  label?: string;
  inputClassName?: string;
  fullWidth?: boolean;
  margin?: "none" | "dense" | "normal";
  type?:
  | "number"
  | "button"
  | "time"
  | "image"
  | "text"
  | "hidden"
  | "color"
  | "search"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "month"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "submit"
  | "tel"
  | "url"
  | "week"
  | "textarea";
  onFocus?: (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => void;
  onBlur?: (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => void;
  InputProps?: {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    style?: CSSProperties;
  };
  // variant?: "outlined" | "filled" | "standard";
} & Omit<InputFieldProps, "type" | "name"> &
  Omit<TextAreaFieldProps, "type" | "name">;
// TODO: check up required validation. doesnt work
export const InputOutlined = ({
  name,
  type = "text",
  label,
  helperText,
  className,
  inputClassName,
  defaultValue,
  value,
  required,
  validation,
  disabled,
  fullWidth,
  margin = "none",
  InputProps,
  ...props
}: InputProps) => {
  const [focus, setFocus] = useState(false);
  const { field } = !!name
    ? useController({
      name: name,
      rules: validation,
      defaultValue: defaultValue || value || "",
      ...props,
    })
    : { field: null };

  const handleFocus = (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => {
    setFocus(true);
    props.onFocus?.(e);
  };

  const handleBlur = (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => {
    setFocus(e.target.value !== "");
    !!name && field.onBlur();

    props.onBlur?.(e);
  };

  const { className: labelClassName, style: labelStyle } = useErrorStyles({
    className: `pointer-events-none absolute text-base origin-top-left z-10 transform will-change-transform duration-200 transition left-0 top-0 block max-w-[calc(100%-24px)] translate-x-3.5 translate-y-4 scale-100 overflow-hidden text-ellipsis font-normal leading-6`,
    errorClassName: `pointer-events-none absolute left-0 top-0 z-10 block origin-top-left max-w-[calc(100%-24px)] translate-x-3.5 translate-y-4 scale-100 transform overflow-hidden text-ellipsis font-normal leading-6 transition duration-200 text-base !text-red-600`,
    name,
  });
  // relative block w-full rounded-t border-b border-black/40 bg-black/[.06] px-3 pb-2 pt-6 text-base text-gray-900 transition-colors duration-200 placeholder:opacity-0 hover:border-black/80 hover:bg-black/[.09] focus:bg-black/[.06] focus:outline-none focus:ring-0 dark:border-white/70 dark:bg-white/[.09] dark:hover:border-white dark:hover:bg-white/[.13] dark:focus:bg-white/[.09];
  const { className: inputClassNames, style: inputStyle } = useErrorStyles({
    className: `peer m-0 h-6 min-w-0 w-full box-content overflow-hidden block text-base font-[inherit] focus:outline-none disabled:pointer-events-none px-3.5 rounded border-0 bg-transparent py-4`,
    errorClassName: `peer m-0 box-content block h-6 w-full min-w-0 overflow-hidden rounded border-0 bg-transparent px-3.5 py-4 font-[inherit] text-base focus:outline-none rw-input-error`,
    name,
  })

  return (
    <div
      className={clsx(
        "relative mx-0 inline-flex min-w-0 max-w-sm flex-col p-0 align-top text-black dark:text-white",
        className,
        {
          "pointer-events-none text-black/50 dark:text-white/50": disabled,
          "w-full max-w-full": fullWidth,
          "mt-2 mb-1": margin === "dense",
          "mt-4 mb-2": margin === "normal",
          "mt-0 mb-0": margin == "none",
        }
      )}
    >
      <Label
        style={labelStyle}
        className={clsx(labelClassName, {
          "!pointer-events-auto !max-w-[calc(133%-32px)] !-translate-y-2 !translate-x-3.5 !scale-75 !select-none":
            focus || !isEmpty(field?.value) || !!props?.placeholder,
          "translate-x-10": !!InputProps?.startAdornment,
        })}
        name={name}
        htmlFor={`input-${name}`}
      >
        {label ?? name} {required && " *"}
      </Label>
      <div
        className={clsx(
          "relative box-content inline-flex cursor-text items-center rounded text-base font-normal leading-6",
          {
            "pl-3.5": !!InputProps?.startAdornment,
            "pr-3.5": !!InputProps?.endAdornment,
          }
        )}
      >
        {!!InputProps?.startAdornment && (
          <div className="mr-2 flex h-[0.01em] max-h-[2em] items-center whitespace-nowrap text-black/70 dark:text-white/70">
            {InputProps?.startAdornment}
          </div>
        )}
        {!!!name ? (
          <input
            aria-invalid="false"
            id={`input-${name}`}
            type={type}
            className={clsx(inputClassNames, {
              "pl-0": !!InputProps?.startAdornment,
              "pr-0": !!InputProps?.endAdornment,
            })}
            style={inputStyle}
            disabled={disabled}
            {...field}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-describedby={helperText ? `${name}-helper-text` : null}
            {...props}
          />
        ) : type === "textarea" ? (
          <TextAreaField
            name={name}
            className={clsx(inputClassNames, {
              "pl-0": !!InputProps?.startAdornment,
              "pr-0": !!InputProps?.endAdornment,
            })}
            style={inputStyle}
            onChange={(e) => {
              field.onChange(e);
              props.onChange?.(e);
            }}
            onInput={(e) => {
              field.onChange(e);
              props.onInput?.(e);
            }}
            {...field}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-describedby={helperText ? `${name}-helper-text` : null}
            aria-multiline={true}
            {...props}
          />
        ) : (
          <InputField
            aria-invalid="false"
            id={`input-${name}`}
            type={type}
            className={clsx(inputClassNames, {
              "pl-0": !!InputProps?.startAdornment,
              "pr-0": !!InputProps?.endAdornment,
            })}
            style={inputStyle}
            disabled={disabled}
            onChange={(e) => {
              field.onChange(e);
              props.onChange?.(e);
            }}
            onInput={(e) => {
              field.onChange(e);
              props.onInput?.(e);
            }}
            {...field}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-describedby={helperText ? `${name}-helper-text` : null}
            {...props}
          />
        )}
        {InputProps?.endAdornment && (
          <div className="ml-2 flex h-[0.01em] max-h-[2em] items-center whitespace-nowrap text-black/70 dark:text-white/70">
            {InputProps?.endAdornment}
          </div>
        )}
        <fieldset
          aria-hidden="true"
          style={
            {
              ...InputProps?.style,
              inset: "-5px 0px 0px",
            } as CSSProperties
          }
          className={clsx(
            "!peer-invalid:border-red-500 pointer-events-none absolute m-0 min-w-0 overflow-hidden rounded border border-zinc-500 px-2 text-left transition duration-75 peer-hover:border-2 peer-hover:border-zinc-300 peer-focus:border-2 peer-focus:border-zinc-300 peer-disabled:border peer-disabled:border-zinc-500",
            {
              "top-0": focus || !isEmpty(field?.value) || !!props?.placeholder,
            }
          )}
        >
          <legend
            style={{ float: "unset", height: "11px" }}
            className={clsx(
              "invisible block w-auto max-w-[.01px] overflow-hidden whitespace-nowrap p-0 !text-xs transition-all duration-75",
              {
                "!max-w-full":
                  focus || !isEmpty(field?.value) || !!props?.placeholder,
              }
            )}
          >
            <span className="visible inline-block px-1 opacity-0">
              {label ?? name} {required && " *"}
            </span>
          </legend>
        </fieldset>
      </div>
      {!!name && <FieldError name={name} className="rw-field-error" />}
      {helperText && (
        <p
          id={`${name}-helper-text`}
          className="mx-3 mt-0.5 mb-0 text-left text-xs font-normal leading-5 tracking-wide text-black/70 dark:text-white/70"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export const ColorInput = () => {
  const [color, setColor] = useState("#000000");
  const [format, setFormat] = useState([
    {
      value: "hex",
      label: "HEX",
      active: true,
    },
    {
      value: "rgb",
      label: "RGB",
      active: false,
    },
    {
      value: "hwb",
      label: "HWB",
      active: false,
    },
    {
      value: "hsl",
      label: "HSL",
      active: false,
    },
  ]);

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  const arrayRotate = <T extends {}>(arr: T[], count: number = 1) => {
    const len = arr.length;
    arr.push(...arr.splice(0, ((-count % len) + len) % len));
    return arr;
  };

  const swapColor = () => {
    let newFormat = arrayRotate(format).map((item, index) => ({
      ...item,
      active: index === 0,
    }));
    setFormat(newFormat);
    convertColor(newFormat?.find((item) => item.active).value);
  };

  function hexToColor(hex, format = "rgb") {
    // Remove the hash symbol if present
    hex = hex.replace(/^#/, "");

    // Parse the hex value into RGB components
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    if (format === "rgb") {
      return `rgb(${r}, ${g}, ${b})`;
    } else if (format === "hsl") {
      // Convert RGB to HSL
      const max = Math.max(r, g, b) / 255;
      const min = Math.min(r, g, b) / 255;
      let h,
        s,
        l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r / 255:
            h = (g / 255 - b / 255) / d + (g < b ? 6 : 0);
            break;
          case g / 255:
            h = (b / 255 - r / 255) / d + 2;
            break;
          case b / 255:
            h = (r / 255 - g / 255) / d + 4;
            break;
        }

        h /= 6;
      }

      // Convert HSL to CSS hsl() format
      h = Math.round(h * 360);
      s = Math.round(s * 100);
      l = Math.round(l * 100);
      return `hsl(${h}, ${s}%, ${l}%)`;
    } else if (format === "hwb") {
      // Convert RGB to HWB
      const max = Math.max(r, g, b) / 255;
      const min = Math.min(r, g, b) / 255;
      const c = max - min;
      const bValue = 1 - max;
      const w = (1 - max) * 100;

      return `hwb(${Math.round((r / 255) * 360)}, ${Math.round(
        (g / 255) * 100
      )}%, ${Math.round((b / 255) * 100)}%, ${w}%)`;
    } else {
      return "Invalid format";
    }
  }
  function colorToHex(color) {
    // Handle RGB format
    if (/^rgb\(/.test(color)) {
      const rgbValues = color.match(/\d+/g);
      if (rgbValues.length === 3) {
        const [r, g, b] = rgbValues.map(Number);
        const hex = ((1 << 24) | (r << 16) | (g << 8) | b)
          .toString(16)
          .slice(1);
        return `#${hex}`;
      }
    }

    // Handle HSL format
    if (/^hsl\(/.test(color)) {
      const hslValues = color.match(/\d+/g);
      if (hslValues.length === 3) {
        const [h, s, l] = hslValues.map(Number);
        const hslToRgb = (h, s, l) => {
          h /= 360;
          s /= 100;
          l /= 100;
          let r, g, b;
          if (s === 0) {
            r = g = b = l;
          } else {
            const hue2rgb = (p, q, t) => {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1 / 6) return p + (q - p) * 6 * t;
              if (t < 1 / 2) return q;
              if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
              return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
          }
          return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255),
          ];
        };
        const [r, g, b] = hslToRgb(h, s, l);
        const hex = ((1 << 24) | (r << 16) | (g << 8) | b)
          .toString(16)
          .slice(1);
        return `#${hex}`;
      }
    }

    // Handle HWB format
    if (/^hwb\(/.test(color)) {
      const hwbValues = color.match(/\d+/g);
      const [h2, w2, b2] = hwbValues.map(Number);

      console.log(h2, w2, b2);
      // Convert HWB to HEX (Note: This is a simplified example)
      const h = h2;
      const w = w2 / 100;
      const b = b2 / 100;
      const s = 1 - w / (1 - b);
      const l = (1 - b) * (1 - s / 2);
      const c = 2 * (1 - l) - 1;
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

      const hex = `#${((1 << 24) | (r << 16) | (g << 8) | bValue)
        .toString(16)
        .slice(1)}`;
      console.log(hex);
      return hex;
    }

    return color;
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

  const convertColor = (currentformat: string) => {
    switch (currentformat) {
      case "rgb":
        if (color.startsWith("#")) {
          // Convert HEX to RGB
          let hex = color.replace(/^#/, ""); // Remove the '#' symbol if present
          let r = parseInt(hex.slice(0, 2), 16);
          let g = parseInt(hex.slice(2, 4), 16);
          let b = parseInt(hex.slice(4, 6), 16);
          console.log(`RGB: ${r}, ${g}, ${b}`);
          setColor(`rgb(${r}, ${g}, ${b})`);
        } else if (color.startsWith("hwb")) {
          // Convert HWB to RGB (Note: This is a simplified example)
          const hwbValues = color
            .replace("hwb(", "")
            .split(",")
            .map((val) => parseFloat(val));
          const h = hwbValues[0];
          const w = hwbValues[1];
          const b1 = hwbValues[2];
          const i = Math.floor(h / 60);
          const f = h / 60 - i;
          const q = 1 - w;
          const p = 1 - b1 * q;
          let r, g, b;

          switch (i) {
            case 0:
              r = 1;
              g = f;
              b = 0;
              break;
            case 1:
              r = 1 - f;
              g = 1;
              b = 0;
              break;
            case 2:
              r = 0;
              g = 1;
              b = f;
              break;
            case 3:
              r = 0;
              g = 1 - f;
              b = 1;
              break;
            case 4:
              r = f;
              g = 0;
              b = 1;
              break;
            default:
              r = 1;
              g = 0;
              b = 1 - f;
              break;
          }

          r = Math.round(r * 255);
          g = Math.round(g * 255);
          b = Math.round(b * 255);

          console.log(`RGB: ${r}, ${g}, ${b}`);
          setColor(`rgb(${r}, ${g}, ${b})`);
        } else if (color.startsWith("hsl")) {
          // Convert HSL to RGB (Note: This is a simplified example)
          const hslValues = color.split(",").map((val) => parseFloat(val));
          const h = hslValues[0];
          const s = hslValues[1] / 100;
          const l = hslValues[2] / 100;
          const c = (1 - Math.abs(2 * l - 1)) * s;
          const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
          const m = l - c / 2;
          let r, g, b;

          if (h >= 0 && h < 60) {
            r = c;
            g = x;
            b = 0;
          } else if (h >= 60 && h < 120) {
            r = x;
            g = c;
            b = 0;
          } else if (h >= 120 && h < 180) {
            r = 0;
            g = c;
            b = x;
          } else if (h >= 180 && h < 240) {
            r = 0;
            g = x;
            b = c;
          } else if (h >= 240 && h < 300) {
            r = x;
            g = 0;
            b = c;
          } else {
            r = c;
            g = 0;
            b = x;
          }

          r = Math.round((r + m) * 255);
          g = Math.round((g + m) * 255);
          b = Math.round((b + m) * 255);

          console.log(`RGB: ${r}, ${g}, ${b}`);
          setColor(`rgb(${r}, ${g}, ${b})`);
        } else {
          console.error("Invalid input format for RGB conversion");
        }
        break;

      case "hex":
        if (color.startsWith("rgb")) {
          // Convert RGB to HEX (Note: This is a simplified example)
          const rgbValues = color
            .replace("rgb(", "")
            .split(",")
            .map((val) => parseInt(val));
          const r = rgbValues[0];
          const g = rgbValues[1];
          const b = rgbValues[2];
          const hex = `#${((1 << 24) | (r << 16) | (g << 8) | b)
            .toString(16)
            .slice(1)}`;
          console.log(`HEX: ${hex}`);
          setColor(hex);
        } else if (color.startsWith("hwb")) {
          // Convert HWB to HEX (Note: This is a simplified example)
          const hwbValues = color
            .replace("hwb(", "")
            .split(",")
            .map((val) => parseFloat(val));
          const h = hwbValues[0];
          const w = hwbValues[1] / 100;
          const b = hwbValues[2] / 100;
          const s = 1 - w / (1 - b);
          const l = (1 - b) * (1 - s / 2);
          const c = 2 * (1 - l) - 1;
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

          const hex = `#${((1 << 24) | (r << 16) | (g << 8) | bValue)
            .toString(16)
            .slice(1)}`;
          console.log(`HEX: ${hex}`);
          setColor(hex);
        } else if (color.startsWith("hsl")) {
          // Convert HSL to HEX (Note: This is a simplified example)

          setColor(HslToHex(color));
        } else {
          console.error("Invalid input format for HEX conversion");
        }
        break;

      case "hwb":
        if (color.startsWith("#")) {
          // Convert HEX to HWB (Note: This is a simplified example)
          const hex = color.replace(/^#/, ""); // Remove the '#' symbol if present
          const r = parseInt(hex.slice(0, 2), 16) / 255;
          const g = parseInt(hex.slice(2, 4), 16) / 255;
          const b = parseInt(hex.slice(4, 6), 16) / 255;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;
          let h, w, bValue;

          if (delta === 0) {
            h = 0;
            w = 1 - max;
            bValue = max;
          } else if (max === r) {
            h = ((g - b) / delta) % 6;
          } else if (max === g) {
            h = (b - r) / delta + 2;
          } else {
            h = (r - g) / delta + 4;
          }

          h = Math.round((h * 60 + 360) % 360);
          w = Math.round((1 - max) * 100);
          bValue = Math.round(max * 100);

          console.log(`HWB: ${h}, ${w}%, ${bValue}%`);
          setColor(`hwb(${h}, ${w}%, ${bValue}%)`);
        } else if (color.startsWith("hsl")) {
          console.log("HSL", arrayRotate(format, -1)[0].value);
          // Convert HSL to HWB (Note: This is a simplified example)
          const hslValues = color
            .replace("hsl(", "")
            .split(",")
            .map((val) => parseFloat(val));
          console.log("HSLVALUES", hslValues);

          let h = (hslValues[0] % 360) / 360;
          let s = Math.min(1, Math.max(0, hslValues[1] / 100));
          let l = Math.min(1, Math.max(0, hslValues[2] / 100));

          let W = s / (s + l);
          let B = l / (s + l);
          const w = (1 - s) * l;
          const bValue = 1 - l;
          console.log(`HWB: ${h * 360}, ${W}%, ${B}%`);
          console.log(
            `HWB: ${h}, ${Math.round(w * 100)}%, ${Math.round(bValue * 100)}%`
          );
          setColor(`hwb(${h * 360} ${Math.floor(W)}% ${Math.floor(B)}%)`);
        } else {
          console.error("Invalid input format for HWB conversion");
        }
        break;

      case "hsl":
        if (color.startsWith("#")) {
          // Convert HEX to HSL (Note: This is a simplified example)
          const hex = color.replace(/^#/, ""); // Remove the '#' symbol if present
          const r = parseInt(hex.slice(0, 2), 16) / 255;
          const g = parseInt(hex.slice(2, 4), 16) / 255;
          const b = parseInt(hex.slice(4, 6), 16) / 255;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;
          let h, s, l;

          if (delta === 0) {
            h = 0;
          } else if (max === r) {
            h = ((g - b) / delta) % 6;
          } else if (max === g) {
            h = (b - r) / delta + 2;
          } else {
            h = (r - g) / delta + 4;
          }

          h = Math.round((h * 60 + 360) % 360);
          l = (max + min) / 2;

          if (delta === 0) {
            s = 0;
          } else {
            s = delta / (1 - Math.abs(2 * l - 1));
          }

          s = Math.round(s * 100);
          l = Math.round(l * 100);

          console.log(`HSL: ${h}, ${s}%, ${l}%`);
          setColor(`hsl(${h}, ${s}%, ${l}%)`);
        } else if (color.startsWith("hwb")) {
          // Convert HWB to HSL (Note: This is a simplified example)
          const hwbValues = color
            .replace("hwb(", "")
            .split(" ")
            .map((val) => parseFloat(val));
          const h = hwbValues[0];
          const w = hwbValues[1] / 100;
          const b = hwbValues[2] / 100;
          const s = 1 - w / (1 - b);
          const l = (1 - b) * (1 - s / 2);
          console.log(
            `HSL: ${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`
          );
          setColor(
            `hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
          );
        } else {
          console.error("Invalid input format for HSL conversion");
        }
        break;

      default:
        console.error("Invalid format");
        break;
    }
  };

  return (
    <div className="rw-button-group">
      <input
        type="text"
        value={color}
        onChange={handleColorChange}
        className="rw-input border-r-none"
      />
      <input
        className="rw-input h-full max-w-[2rem] appearance-none border-l-0 border-none p-0"
        onChange={debounce((e) => {
          setColor(
            hexToColor(
              e.target.value,
              format?.find((item) => item.active).value
            )
          );
        }, 500)}
        type="color"
        value={colorToHex(color)}
      />
      <input
        className="rw-input max-w-[4rem] select-none border-l-0"
        readOnly
        value={format?.find((item) => item.active).label}
      />
      <button
        type="button"
        className="rw-button rw-button-gray -ml-px"
        onClick={swapColor}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="rw-button-icon"
        >
          <path d="M464 32C455.2 32 448 39.16 448 48v129.3C416.2 99.72 340.6 48 256 48c-102 0-188.3 72.91-205.1 173.3C49.42 230.1 55.3 238.3 64.02 239.8C64.91 239.9 65.8 240 66.67 240c7.672 0 14.45-5.531 15.77-13.34C96.69 141.7 169.7 80 256 80c72.49 0 137.3 44.88 163.6 112H304C295.2 192 288 199.2 288 208S295.2 224 304 224h160C472.8 224 480 216.8 480 208v-160C480 39.16 472.8 32 464 32zM447.1 272.2c-8.766-1.562-16.97 4.406-18.42 13.12C415.3 370.3 342.3 432 255.1 432c-72.49 0-137.3-44.88-163.6-112H208C216.8 320 224 312.8 224 304S216.8 288 208 288h-160C39.16 288 32 295.2 32 304v160C32 472.8 39.16 480 48 480S64 472.8 64 464v-129.3C95.84 412.3 171.4 464 256 464c101.1 0 188.3-72.91 205.1-173.3C462.6 281.9 456.7 273.7 447.1 272.2z" />
        </svg>
      </button>
    </div>
  );
};

// const Input = ({
//   name,
//   type = "text",
//   label,
//   helperText,
//   className,
//   inputClassName,
//   placeholder,
//   ...props
// }: InputProps) => {
//   return (
//     <div className={clsx(`w-fit min-w-fit max-w-sm`, className)}>
//       <div className="rw-input-underline">
//         {type === "textarea" ? (
//           <TextAreaField
//             name={name}
//             className={clsx("peer", inputClassName)}
//             {...props}
//             errorClassName="peer rw-input-error"
//             placeholder={placeholder ?? ""}
//             aria-describedby={helperText ? `${name}-helper-text` : null}
//             aria-multiline={true}
//           />
//         ) : (
//           <InputField
//             type={type}
//             name={name}
//             className={clsx("peer", inputClassName)}
//             {...props}
//             errorClassName="peer rw-input-error" // TODO: fix input error
//             placeholder={placeholder ?? ""}
//             aria-describedby={helperText ? `${name}-helper-text` : null}
//           />
//         )}
//         <Label
//           name={name}
//           className="peer-focus-within:text-pea-500 peer-focus-within:dark:text-pea-400 inline-flex items-center space-x-1 capitalize peer-placeholder-shown:top-4 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:scale-100 peer-focus-within:top-4 peer-focus-within:-translate-y-4 peer-focus-within:scale-75"
//           errorClassName="rw-label-error"
//         >
//           {/* {icon && icon} */}
//           <span>
//             {label ?? name} {props.required && "*"}
//           </span>
//         </Label>
//       </div>
//       <FieldError name={name} className="rw-field-error" />
//       {helperText && (
//         <p className="rw-helper-text" id={`${name}-helper-text`}>
//           {helperText}
//         </p>
//       )}
//     </div>
//   );
// };

// export default Input;

//   <div className="relative max-w-sm">
//   <TextField
//     name="start_date"
//     className="rw-float-input peer"
//     errorClassName="rw-float-input rw-input-error"
//     placeholder=""
//   />
//   <Label
//     name="start_date"
//     className="rw-float-label"
//     errorClassName="rw-float-label rw-label-error"
//   >
//     Start date
//   </Label>
//   {/* https://mui.com/material-ui/react-text-field/ */}
//   <FieldError name="start_date" className="rw-field-error" />
// </div>
