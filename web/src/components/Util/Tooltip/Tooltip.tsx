import { useState } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  animation?: boolean;
  delay?: number;
  direction?: "top" | "bottom" | "left" | "right";
}
const Tooltip = ({
  content,
  children,
  direction = "top",
  delay = 400,
}: TooltipProps) => {
  let timeout;
  const margin = 20;
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const showTip = (e: React.MouseEvent<SVGGElement | HTMLDivElement>) => {
    timeout = setTimeout(() => {
      const { pageX, pageY } = e;
      setActive(true);
      setPosition({ top: pageY, left: pageX });
    }, delay || 400);
  };
  const updatePosition = (
    e: React.MouseEvent<HTMLDivElement | SVGGElement>
  ) => {
    if (!active) return;
    const { pageX, pageY } = e;
    setPosition({ top: pageY, left: pageX + margin });
  };

  const hideTip = () => {
    clearTimeout(timeout);
    setActive(false);
  };

  const tooltip = active && (
    <div
      className={`absolute z-50 w-max rounded-lg border border-zinc-500 bg-zinc-700 p-2 text-gray-700 shadow dark:text-white`}
      style={{ top: position.top, left: position.left, position: "absolute" }}
    >
      {content}
    </div>
  );

  return (
    <div
      onMouseEnter={showTip}
      onMouseMove={updatePosition}
      onMouseLeave={hideTip}
    >
      {children}
      {createPortal(tooltip, document.body)}
    </div>
  );
};

export default Tooltip;
