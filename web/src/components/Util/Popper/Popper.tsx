import { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type PopperProps = {
  children: React.ReactNode | React.ReactNode[];
  open?: boolean;
  anchorEl: Element | null;
  disablePortal?: boolean;
  keepMounted?: boolean;
  paddingToAnchor?: number;
  style?: CSSProperties;
};
const Popper = ({
  children,
  open = false,
  anchorEl,
  disablePortal = false,
  keepMounted = false,
  paddingToAnchor = 0,
  style,
}: PopperProps) => {
  const [popperPosition, setPopperPosition] = useState({ top: 0, left: 0 });
  const popperRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!anchorEl || !popperRef?.current) return;
    const triggerRect = anchorEl?.getBoundingClientRect();
    const popperRect = popperRef?.current.getBoundingClientRect();
    let top = disablePortal
      ? triggerRect.height + paddingToAnchor
      : triggerRect.bottom + paddingToAnchor; //  + window.scrollY
    let left = triggerRect.left + window.scrollX;

    if (triggerRect.left + (popperRect.width + 20) >= window.innerWidth) {
      left = triggerRect.right - popperRect.width;
    }
    // Flip dropdown to top if it goes off screen bottom. Account for scroll
    if (top + popperRect.height + paddingToAnchor > (window.innerHeight || document.documentElement.clientHeight) + window.scrollY) {
      top = (triggerRect.bottom + window.scrollY) - triggerRect.height - popperRect.height - paddingToAnchor;
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
        ...style,
      }}
      ref={popperRef}
    >
      {children}
    </div>
  ) : (
    createPortal(
      <div
        style={{
          position: "fixed",
          transform: `translate(${popperPosition.left}px, ${popperPosition.top}px)`,
          inset: "0px auto auto 0px",
          overflow: "hidden",
          margin: 0,
          zIndex: 9999,
          ...style,
        }}
        ref={popperRef}
      >
        {children}
      </div>,
      document.body
    )
  );
};

export default Popper;
