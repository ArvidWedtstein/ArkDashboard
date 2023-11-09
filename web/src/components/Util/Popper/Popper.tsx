import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type PopperProps = {
  children: React.ReactNode | React.ReactNode[];
  open?: boolean;
  anchorEl: Element | null;
  disablePortal?: boolean;
  keepMounted?: boolean;
  paddingToAnchor?: number;
};
const Popper = ({
  children,
  open = false,
  anchorEl,
  disablePortal = false,
  keepMounted = false,
  paddingToAnchor = 0,
}: PopperProps) => {
  const [popperPosition, setPopperPosition] = useState({ top: 0, left: 0 });
  const popperRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!anchorEl || !popperRef?.current) return;
    const triggerRect = anchorEl?.getBoundingClientRect();
    const popperRect = popperRef?.current.getBoundingClientRect();

    let top = disablePortal
      ? triggerRect.height + paddingToAnchor
      : triggerRect.bottom + window.scrollY + paddingToAnchor;
    let left = triggerRect.left + window.scrollX;

    if (triggerRect.left + (popperRect.width + 20) >= window.innerWidth) {
      left = triggerRect.right - popperRect.width;
    }

    // Flip dropdown to top if it goes off screen bottom. Account for scroll
    if (top > window.innerHeight + window.scrollY) {
      top = anchorEl.scrollTop + popperRect.height - paddingToAnchor; // scrollTop = offsetTop?
    }

    setPopperPosition({ top, left });
  };

  useLayoutEffect(() => {
    updatePosition();

    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [anchorEl, popperRef, open]);

  if (!(open || keepMounted)) return null;
  return disablePortal ? (
    <div
      style={{
        zIndex: 100,
        position: "absolute",
        transform: `translate(${popperPosition.left}px, ${popperPosition.top}px)`,
        inset: "0px auto auto 0px",
        margin: 0,
      }}
      ref={popperRef}
    >
      {children}
    </div>
  ) : (
    createPortal(
      <div
        style={{
          position: "absolute",
          transform: `translate(${popperPosition.left}px, ${popperPosition.top}px)`,
          inset: "0px auto auto 0px",
          overflow: "hidden",
          margin: 0,
        }}
        className="z-50"
        ref={popperRef}
      >
        {children}
      </div>,
      document.body
    )
  );
};

export default Popper;
