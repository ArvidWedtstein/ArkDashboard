import { useErrorStyles, useRegister } from "@redwoodjs/forms";
import clsx from "clsx";
import { useState } from "react";
import useComponentVisible from "src/components/useComponentVisible";

const Input = ({ name, type = "1" }) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      {type == "1" ? (
        <div className="relative inline-flex min-w-0 flex-col border-0 p-0 align-top dark:text-zinc-300">
          <label
            htmlFor="input"
            className={clsx(
              "absolute left-0 top-0 z-10 block origin-[top_left_0px] overflow-hidden overflow-ellipsis whitespace-nowrap p-0 text-base leading-[1.4375em] transition-transform",
              {
                "text-pea-500 pointer-events-auto max-w-[calc(133%-32px)] translate-x-3.5 -translate-y-[9px] scale-75 select-none":
                  isComponentVisible,
                "pointer-events-none max-w-[calc(100%-24px)] translate-x-3.5 translate-y-4 scale-100":
                  !isComponentVisible,
              }
            )}
          >
            Legend
          </label>
          <div
            className="relative inline-flex cursor-text items-center rounded text-base font-normal leading-6"
            onClick={() => setIsComponentVisible(!isComponentVisible)}
            ref={ref}
          >
            <input
              id="input"
              className="box-content block h-[1.4375em] w-full min-w-0 border-0 bg-transparent px-3.5 py-[16.5px] placeholder:opacity-0 focus:outline-none focus:placeholder:opacity-50"
              type="text"
            />
            <fieldset
              className={clsx(
                "pointer-events-none absolute left-0 right-0 bottom-0 -top-[5px] m-0 min-w-[0%] overflow-hidden rounded-[inherit] border-zinc-500 px-2 text-left text-current focus:outline-0 [&:hover]:border-zinc-300",
                {
                  "border-pea-500 border-2": isComponentVisible,
                }
              )}
            >
              <legend
                className={clsx(
                  "invisible float-none block h-[11px] w-auto overflow-hidden whitespace-nowrap p-0 text-xs transition-all duration-75",
                  isComponentVisible ? "max-w-full" : "max-w-[0.01px]"
                )}
              >
                <span className="visible inline-block px-1.5 opacity-0">
                  Legend
                </span>
              </legend>
            </fieldset>
          </div>
        </div>
      ) : type == "2" ? (
        <></>
      ) : (
        <></>
      )}
    </>
  );
};

export default Input;
