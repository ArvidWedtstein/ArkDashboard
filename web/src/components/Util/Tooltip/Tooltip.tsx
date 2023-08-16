import { CSSProperties, useState } from "react";

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  animation?: boolean;
}
const Tooltip = ({
  content,
  children,
  className,
  animation = true,
}: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const tooltipStyle: {
    opacity: number;
    transition: string;
  } = {
    opacity: showTooltip ? 1 : 0,
    transition: animation ? "opacity 0.3s" : "none",
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </div>
      {showTooltip && (
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="absolute z-50 w-max rounded-lg border border-zinc-500 bg-zinc-700 p-2 text-gray-700 shadow dark:text-white"
          style={{ ...tooltipStyle }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
