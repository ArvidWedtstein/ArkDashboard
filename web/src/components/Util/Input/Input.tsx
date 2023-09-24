import {
  FieldError,
  InputField,
  InputFieldProps,
  Label,
  TextAreaField,
  TextAreaFieldProps,
} from "@redwoodjs/forms";
import clsx from "clsx";
import { useState } from "react";

type InputProps = {
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
  helperText?: string;
  label?: string;
  icon?: React.ReactNode;
  inputClassName?: string;
} & Omit<InputFieldProps, "type"> &
  Omit<TextAreaFieldProps, "type">;

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

export const Input2 = () => {
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState("");

  const open = (e) => {
    setFocus(true);
  };

  return (
    <div className="relative m-0 inline-flex min-w-0 flex-col p-0 align-top text-white">
      <label
        className={clsx(
          "absolute left-0 top-0 z-10 block origin-top-left translate-x-3.5 transform overflow-hidden text-ellipsis font-normal leading-6 transition focus-within:-translate-y-2",
          focus || value.length > 0
            ? "pointer-events-auto max-w-[133%-32px] -translate-y-2 scale-75 select-none"
            : "pointer-events-none max-w-[100%-24px] translate-y-4 scale-100"
        )}
        htmlFor="outlined-basic"
        id="outlined-basic-label"
      >
        Outlined
      </label>
      <div className="relative box-content inline-flex cursor-text items-center rounded text-base">
        <input
          aria-invalid="false"
          id="outlined-basic"
          type="text"
          className="peer box-content block h-6 w-full overflow-hidden rounded border-0 bg-transparent px-3.5 py-4 focus:outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={(e) => open(e)}
          onBlur={(e) => setFocus(false)}
        />
        <fieldset
          aria-hidden="true"
          className={clsx(
            "pointer-events-none absolute inset-0 -top-1 m-0 min-w-0 overflow-hidden rounded px-2 text-left peer-hover:border-2 peer-hover:border-zinc-300",
            {
              "top-0 border-2 border-zinc-300": focus || value.length > 0,
              "border border-zinc-500 ": !focus && value.length === 0,
            }
          )}
        >
          <legend
            className={clsx(
              "invisible block h-[11px] w-auto flex-nowrap overflow-hidden transition-all duration-75",
              {
                "max-w-full": focus || value.length > 0,
                "max-w-[0.01px]": !focus && value.length === 0,
              }
            )}
          >
            <span className="visible inline-block pl-1 text-xs opacity-0">
              Outlined
            </span>
          </legend>
        </fieldset>
      </div>
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
