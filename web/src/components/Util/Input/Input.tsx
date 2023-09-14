import { ColorField, FieldError, InputField, InputFieldProps, Label, useErrorStyles, useRegister } from "@redwoodjs/forms";


type InputProps = {
  type?: "number" | "button" | "time" | "image" | "text" | "hidden" | "color" | "search" | "date" | "datetime-local" | "email" | "file" | "month" | "password" | "radio" | "range" | "reset" | "submit" | "tel" | "url" | "week"
  helperText?: string;
  label?: string;
} & Omit<InputFieldProps, "type">;
const Input = ({ name, type = "text", label, helperText, ...props }: InputProps) => {
  return (
    <div className="max-w-sm w min-w-fit w-fit mt-5">
      <div className="rw-input-underline">
        <InputField
          type={type}
          name={name}
          className="peer"
          {...props}
          errorClassName="peer rw-input-error" // TODO: fix input error
          placeholder=""
          aria-describedby={helperText ? `${name}-helper-text` : ''}
        />
        <Label
          name={name}
          className="capitalize peer-focus-within:text-pea-600 peer-focus-within:dark:text-pea-500 peer-placeholder-shown:top-4 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:scale-100 peer-focus-within:top-4 peer-focus-within:-translate-y-4 peer-focus-within:scale-75"

          errorClassName="rw-label rw-label-error"
        >
          {label ?? name}
        </Label>
      </div>
      <FieldError name={name} className="rw-field-error" />
      {helperText && <p className="rw-helper-text" id={`${name}-helper-text`}>{helperText}</p>}
    </div>
  );
};

export default Input;


{/* <div className="relative inline-flex flex-col">
      <div className="relative inline-flex items-center rounded text-base font-normal leading-6 dark:text-zinc-300 text-zinc-700">
        <fieldset
          className="relative border m-0 min-w-[0%] max-w-full transition-colors overflow-hidden rounded-[inherit] border-zinc-500 text-left text-current focus:outline-0 hover:border-zinc-300">
          <input
            id={name}
            className="peer pointer-events-auto box-content block w-full min-w-0 border-0 bg-transparent px-3 py-3 placeholder:opacity-0 focus:outline-none focus:placeholder:opacity-0"
            type="text"
            placeholder=""
            name={name}
          />
          <legend
            className="ml-2 invisible h-3 max-w-full block w-auto whitespace-nowrap p-0 transition-all peer-placeholder-shown:[&>label]:translate-y-6 peer-placeholder-shown:[&>label]:scale-100 peer-placeholder-shown:max-w-[.01px] peer-focus-within:max-w-full peer-focus-within:[&>label]:scale-75 peer-focus-within:[&>label]:-translate-y-1"
          >
            <label htmlFor={name} className="pointer-events-none select-none m-0 text-base transform relative transition-transform z-10 inline-block origin-[top_left_0px] px-1.5 -translate-y-1 visible scale-75">
              Name
            </label>
          </legend>
        </fieldset>
      </div>
    </div> */}


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