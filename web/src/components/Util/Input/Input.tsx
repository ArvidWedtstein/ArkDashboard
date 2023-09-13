import { useErrorStyles, useRegister } from "@redwoodjs/forms";
import clsx from "clsx"
import { useState } from "react";
import useComponentVisible from "src/components/useComponentVisible"

const Input = ({ name, type = "1" }) => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const [inputValue, setInputValue] = useState('');


  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setIsComponentVisible(true);
  };
  return (
    <>
      {type == "1" ? (
        <div className="inline-flex flex-col relative border-0 align-top p-0 min-w-0 dark:text-zinc-300">
          <label htmlFor="input" className={clsx("text-base overflow-ellipsis origin-[top_left_0px] absolute left-0 top-0 z-10 whitespace-nowrap overflow-hidden block leading-[1.4375em] p-0 transition-transform", {
            "max-w-[calc(133%-32px)] select-none translate-x-3.5 -translate-y-[9px] scale-75 pointer-events-auto text-pea-500": isComponentVisible,
            "max-w-[calc(100%-24px)] translate-x-3.5 translate-y-4 scale-100 pointer-events-none": !isComponentVisible
          })}>Legend</label>
          <div className="cursor-text inline-flex items-center relative rounded text-base font-normal leading-6" onClick={() => setIsComponentVisible(!isComponentVisible)} ref={ref}>
            <input
              id="input"
              className="placeholder:opacity-0 focus:outline-none focus:placeholder:opacity-50 w-full min-w-0 px-3.5 py-[16.5px] block box-content bg-transparent border-0 h-[1.4375em]"
              type="text"
            />
            <fieldset className={clsx("[&:hover]:border-zinc-300 text-left overflow-hidden px-2 m-0 rounded-[inherit] min-w-[0%] absolute left-0 right-0 bottom-0 -top-[5px] focus:outline-0 text-current border pointer-events-none border-zinc-500", {
              "border-2 border-pea-500": isComponentVisible
            })} style={{ maskImage: "linear-gradient(transparent, black)", maskPosition: "top left", maskSize: '10%' }}>
              <legend className={clsx("float-none p-0 h-[11px] text-xs invisible w-auto overflow-hidden block whitespace-nowrap transition-all duration-75", isComponentVisible ? "max-w-full" : "max-w-[0.01px]")}>
                <span className="visible px-1.5 inline-block opacity-0">Legend</span>
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
  )
}

export default Input
