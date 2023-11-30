import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  animation?: boolean;
  delay?: number;
  active?: boolean;
  direction?: "top" | "bottom" | "left" | "right";
}

// TODO: rework tooltip
// must adjust position to not go over hovered content
const Tooltip = React.memo(({
  content,
  children,
  direction = "top",
  active,
  delay = 400,
}: TooltipProps) => {
  let timeout;
  const margin = 20;
  const [tooltipActive, setTooltipActive] = useState(active ?? false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const showTip = (e: React.MouseEvent<SVGGElement | HTMLDivElement>) => {
    timeout = setTimeout(() => {
      const { pageX, pageY } = e;
      setTooltipActive(true);
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
    setTooltipActive(false);
  };

  const tooltip = tooltipActive && (
    <div
      className={`absolute z-50 w-max rounded border border-zinc-500 bg-zinc-700 px-1 text-xs py-0.5 text-gray-700 shadow dark:text-white`}
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
});

export default Tooltip;
