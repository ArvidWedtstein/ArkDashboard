import clsx from "clsx";
import React, { useState, useEffect, useRef } from "react";

interface CounterProps {
  startNumber: number;
  endNumber: number;
  duration?: number;
  className?: string;
}
const Counter = ({
  startNumber,
  endNumber,
  duration = 1000,
  className = "",
}: CounterProps) => {
  const [count, setCount] = useState<number>(startNumber);
  const countValueRef = useRef(null);

  useEffect(() => {
    let startTimestamp;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (endNumber - startNumber) + startNumber));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    // Add the animation class when the count value changes
    if (countValueRef.current) {
      countValueRef.current.classList.add("animate-countup");
    }
  }, [startNumber, endNumber, duration]);

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
    <span
      ref={countValueRef}
      className={clsx(className, {
        "animate-countup": endNumber !== count,
      })}
    >
      {count}
      {/* <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 text-lg text-gray-500 opacity-0 animate-fade-in-delayed">
          Counting
        </div> */}
    </span>
  );
};

export default Counter;
