import { useEffect, useRef, useState } from "react";
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
  const containerRef = useRef(null);

  useEffect(() => {
    if (open && anchorEl) {
      // Calculate the position of the popper relative to the anchor element
      const anchorRect = anchorEl.getBoundingClientRect();
      const menuBounds = containerRef.current.getBoundingClientRect();

      let top = disablePortal
        ? anchorRect.height + paddingToAnchor
        : anchorRect.bottom + paddingToAnchor;
      let left = disablePortal ? 0 : anchorRect.left;

      // Flip dropdown to right if it goes off screen
      if (left + menuBounds.width > window.innerWidth) {
        left = anchorRect.right - menuBounds.width;
      }

      // Flip dropdown to top if it goes off screen bottom. Account for scroll
      if (top + menuBounds.height > window.innerHeight + window.scrollY) {
        top = anchorEl.scrollTop - menuBounds.height - paddingToAnchor; // scrollTop = offsetTop?
      }

      setPopperPosition({ top, left });
    }
  }, [open, anchorEl]);

  return (
    (open || keepMounted) && (
      <>
        {/* TODO: implement */}
        {disablePortal ? (
          <div
            style={{
              zIndex: 100,
              position: "absolute",
              transform: `translate(${popperPosition.left}px, ${popperPosition.top}px)`,
              inset: "0px auto auto 0px",
              margin: 0,
            }}
            ref={containerRef}
          >
            {children}
          </div>
        ) : (
          createPortal(
            <div
              style={{
                zIndex: 100,
                position: "absolute",
                transform: `translate(${popperPosition.left}px, ${popperPosition.top}px)`,
                inset: "0px auto auto 0px",
                margin: 0,
              }}
              ref={containerRef}
            >
              {children}
            </div>,
            document.body
          )
        )}
      </>
    )
  );
};

export default Popper;
