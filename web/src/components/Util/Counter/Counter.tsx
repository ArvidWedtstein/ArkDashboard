import clsx from "clsx";
import React, { useState, useEffect, useRef } from "react";

interface CounterProps {
  startNum: number;
  endNum: number;
  duration?: number;
  className?: string;
}
const Counter = ({
  startNum,
  endNum,
  duration = 1000,
  className = "",
}: CounterProps) => {
  const [count, setCount] = useState<number>(startNum);
  const countValueRef = useRef(null);

  useEffect(() => {
    let startTimestamp;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (endNum - startNum) + startNum));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    // Add the animation class when the count value changes
    if (countValueRef.current) {
      countValueRef.current.classList.add("animate-countup");
    }
  }, [startNum, endNum, duration]);

  useEffect(() => {
    // Remove the animation class when the count value animation completes
    const onAnimationEnd = () => {
      if (countValueRef.current) {
        countValueRef.current.classList.remove("animate-countup");
      }
    };
    countValueRef.current?.addEventListener("animationend", onAnimationEnd);

    return () => {
      countValueRef.current?.removeEventListener(
        "animationend",
        onAnimationEnd
      );
    };
  }, [count]);

  return (
    <div
      ref={countValueRef}
      className={clsx(className, {
        "animate-countup": endNum !== count,
      })}
    >
      {count}
      {/* <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 text-lg text-gray-500 opacity-0 animate-fade-in-delayed">
          Counting
        </div> */}
    </div>
  );
};

export default Counter;
