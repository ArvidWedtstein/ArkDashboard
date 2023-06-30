import { useState } from "react";

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
}
const Tooltip = ({ content, children }: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="relative overflow-visible"
    >
      {children}
      {showTooltip && (
        <div
          className="absolute w-max top-full left-1/2 transform -translate-x-1/2 border border-zinc-500 dark:text-white p-2 rounded-lg z-50"
        >
          {content}
        </div>
      )}
    </div>
  )
}

export default Tooltip
