import { useErrorStyles, useRegister } from "@redwoodjs/forms";
import clsx from "clsx";
import { useState } from "react";
import useComponentVisible from "src/components/useComponentVisible";


type InputProps = {

} & React.InputHTMLAttributes<HTMLInputElement>;
const Input = ({ name, required }: InputProps) => {
  return (
    <div className="relative inline-flex flex-col">
      <div className="relative inline-flex items-center rounded text-base font-normal leading-6 dark:text-zinc-300 text-zinc-700">
        <fieldset
          className="relative border m-0 min-w-[0%] overflow-hidden rounded-[inherit] border-zinc-500 px-2 text-left text-current focus:outline-0 hover:border-zinc-300">
          <input
            id="input"
            className="relative peer pointer-events-auto box-content block h-[1.4375em] w-full min-w-0 border-0 bg-transparent px-3.5 py-[16.5px] placeholder:opacity-0 focus:outline-none focus:placeholder:opacity-50"
            type="text"
            placeholder=""
          />
          <legend
            className={clsx(
              "invisible h-0 max-w-full block w-auto whitespace-nowrap p-0 z-10 transition-all peer-placeholder-shown:[&>label]:translate-y-4 peer-placeholder-shown:[&>label]:scale-100 peer-placeholder-shown:max-w-[.01px] peer-focus-within:max-w-full peer-focus-within:[&>label]:translate-x-2.5 peer-focus-within:[&>label]:scale-75 peer-focus-within:[&>label]:-translate-y-1",
            )}
          >
            <label className="select-none transform relative transition-transform text-base z-10 inline-block origin-[top_left_0px] -translate-y-1 visible px-1.5 scale-75">
              Legend
            </label>
          </legend>
        </fieldset>
      </div>
    </div>
  );
};

export default Input;
