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
import { useState } from "react";
import { isEmpty } from "src/lib/formatters";

type InputProps = {
  name?: string;
  helperText?: string;
  label?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
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
} & Omit<InputFieldProps, "type" | "name"> &
  Omit<TextAreaFieldProps, "type" | "name">;

const Input = ({
  name,
  type = "text",
  label,
  helperText,
  className,
  inputClassName,
  icon,
  placeholder,
  ...props
}: InputProps) => {
  return (
    <div className={clsx(`w-fit min-w-fit max-w-sm`, className)}>
      <div className="rw-input-underline">
        {type === "textarea" ? (
          <TextAreaField
            name={name}
            className={clsx("peer", inputClassName)}
            {...props}
            errorClassName="peer rw-input-error"
            placeholder={placeholder ?? ""}
            aria-describedby={helperText ? `${name}-helper-text` : null}
            aria-multiline={true}
          />
        ) : (
          <InputField
            type={type}
            name={name}
            className={clsx("peer", inputClassName)}
            {...props}
            errorClassName="peer rw-input-error" // TODO: fix input error
            placeholder={placeholder ?? ""}
            aria-describedby={helperText ? `${name}-helper-text` : null}
          />
        )}
        <Label
          name={name}
          className="peer-focus-within:text-pea-500 peer-focus-within:dark:text-pea-400 inline-flex items-center space-x-1 capitalize peer-placeholder-shown:top-4 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:scale-100 peer-focus-within:top-4 peer-focus-within:-translate-y-4 peer-focus-within:scale-75"
          errorClassName="rw-label-error"
        >
          {icon && icon}
          <span>
            {label ?? name} {props.required && "*"}
          </span>
        </Label>
      </div>
      <FieldError name={name} className="rw-field-error" />
      {helperText && (
        <p className="rw-helper-text" id={`${name}-helper-text`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;

export const InputOutlined = ({
  name,
  type = "text",
  label,
  helperText,
  className,
  inputClassName,
  icon,
  defaultValue,
  value,
  iconPosition = "left",
  required,
  validation,
  disabled,
  fullWidth,
  margin = "none",
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

  const isLeftIcon = icon && iconPosition == "left";
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
    className: `pointer-events-none absolute left-0 top-0 z-10 block origin-top-left max-w-[calc(100%-24px)] translate-x-3.5 translate-y-4 scale-100 transform overflow-hidden text-ellipsis font-normal leading-6 transition duration-200 text-base`,
    errorClassName: `pointer-events-none absolute left-0 top-0 z-10 block origin-top-left max-w-[calc(100%-24px)] translate-x-3.5 translate-y-4 scale-100 transform overflow-hidden text-ellipsis font-normal leading-6 transition duration-200 text-base !text-red-600`,
    name,
  });

  return (
    <div
      className={clsx(
        "relative mx-0 inline-flex min-w-0 max-w-sm flex-col p-0 align-top text-black dark:text-white",
        {
          "pointer-events-none text-black/50 dark:text-white/50": disabled,
          "w-full": fullWidth,
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
          "translate-x-10": isLeftIcon,
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
            "pl-3.5": isLeftIcon,
            "pr-3.5": icon && !isLeftIcon,
          }
        )}
      >
        {isLeftIcon && (
          <div className="mr-2 flex h-[0.01em] max-h-[2em] items-center whitespace-nowrap text-black/70 dark:text-white/70">
            {icon}
          </div>
        )}
        {!!!name ? (
          <input
            aria-invalid="false"
            id={`input-${name}`}
            type={type}
            className={clsx(
              "peer m-0 box-content block h-6 w-full min-w-0 overflow-hidden rounded border-0 bg-transparent px-3.5 py-4 font-[inherit] text-base focus:outline-none disabled:pointer-events-none",
              {
                "pl-0": isLeftIcon,
                "pr-0": icon && !isLeftIcon,
              }
            )}
            errorClassName="peer rw-input-error"
            disabled={disabled}
            onChange={(e) => {
              !!name && field.onChange(e);
              props?.onChange?.(e);
            }}
            {...field}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-describedby={helperText ? `${name}-helper-text` : null}
            {...props}
          />
        ) : type === "textarea" ? (
          <TextAreaField
            name={name}
            className={clsx(
              "peer m-0 box-content block h-6 w-full min-w-0 overflow-hidden rounded border-0 bg-transparent px-3.5 py-4 font-[inherit] text-base focus:outline-none disabled:pointer-events-none",
              {
                "pl-0": isLeftIcon,
                "pr-0": icon && !isLeftIcon,
              }
            )}
            onChange={(e) => {
              field.onChange(e);
              props.onChange?.(e);
            }}
            {...field}
            onFocus={handleFocus}
            onBlur={handleBlur}
            errorClassName="peer rw-input-error"
            aria-describedby={helperText ? `${name}-helper-text` : null}
            aria-multiline={true}
            {...props}
          />
        ) : (
          <InputField
            aria-invalid="false"
            id={`input-${name}`}
            type={type}
            className={clsx(
              "peer m-0 box-content block h-6 w-full min-w-0 overflow-hidden rounded border-0 bg-transparent px-3.5 py-4 font-[inherit] text-base focus:outline-none disabled:pointer-events-none",
              {
                "pl-0": isLeftIcon,
                "pr-0": icon && !isLeftIcon,
              }
            )}
            errorClassName="peer rw-input-error"
            disabled={disabled}
            onChange={(e) => {
              field.onChange(e);
              props.onChange?.(e);
            }}
            {...field}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-describedby={helperText ? `${name}-helper-text` : null}
            {...props}
          />
        )}
        {icon && !isLeftIcon && (
          <div className="ml-2 flex h-[0.01em] max-h-[2em] items-center whitespace-nowrap text-black/70 dark:text-white/70">
            {icon}
          </div>
        )}
        <fieldset
          aria-hidden="true"
          style={{
            inset: "-5px 0px 0px",
          }}
          className={clsx(
            "pointer-events-none absolute m-0 min-w-0 overflow-hidden rounded border border-zinc-500 px-2 text-left transition duration-75 peer-invalid:!border-red-500 peer-hover:border-2 peer-hover:border-zinc-300 peer-focus:border-2 peer-focus:border-zinc-300 peer-disabled:border peer-disabled:border-zinc-500",
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
      <FieldError name={name} className="rw-field-error" />
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
{
  // <div className="relative inline-flex flex-col">
  //   <div className="relative inline-flex items-center rounded text-base font-normal leading-6 text-zinc-700 dark:text-zinc-300">
  //     <fieldset className="relative m-0 min-w-[0%] max-w-full overflow-hidden rounded-[inherit] border border-zinc-500 text-left text-current transition-colors hover:border-zinc-300 focus:outline-0">
  //       <input
  //         id={name}
  //         className="peer pointer-events-auto box-content block w-full min-w-0 border-0 bg-transparent px-3 py-3 placeholder:opacity-0 focus:outline-none focus:placeholder:opacity-0"
  //         type="text"
  //         placeholder=""
  //         name={name}
  //       />
  //       <legend className="invisible ml-2 block h-3 w-auto max-w-full whitespace-nowrap p-0 transition-all duration-300 peer-placeholder-shown:max-w-[.01px] peer-focus-within:max-w-full peer-placeholder-shown:[&>label]:translate-y-6 peer-placeholder-shown:[&>label]:scale-100 peer-focus-within:[&>label]:-translate-y-1 peer-focus-within:[&>label]:scale-75">
  //         <label
  //           htmlFor={name}
  //           className="pointer-events-none visible relative z-10 m-0 inline-block origin-[top_left_0px] -translate-y-1 scale-75 transform select-none px-1.5 text-base transition-transform duration-300"
  //         >
  //           Name
  //         </label>
  //       </legend>
  //     </fieldset>
  //   </div>
  // </div>;
}

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
