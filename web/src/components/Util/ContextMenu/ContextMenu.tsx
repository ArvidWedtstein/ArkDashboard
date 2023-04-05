import { MouseEventHandler, useEffect, useState } from "react";
import useComponentVisible from "src/components/useComponentVisible";

type IContextMenuProps = {
  items: IContextMenuItem[];
  children: React.ReactNode;
  type?: "context" | "click";
};
type IContextMenuItem = {
  label: string;
  icon?: React.ReactNode;
  onClick?: (e) => void;
};

export const ContextMenu = ({
  items,
  children,
  type = "context",
}: IContextMenuProps) => {
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  useEffect(() => {
    const handleWindowResize = () => {
      setIsComponentVisible(false);
    };
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [setIsComponentVisible]);

  const MAX_MENU_WIDTH = 240; // Set a maximum width for the context menu

  // Calculate the maximum allowed x and y positions for the context menu
  const maxX = window.innerWidth - MAX_MENU_WIDTH;
  const maxY = window.innerHeight;

  // Function to adjust the position of the context menu if it goes outside of the screen
  const adjustPosition = (x: number, y: number) => {
    let adjustedX = x;
    let adjustedY = y;

    // Adjust x position if it goes outside of the screen
    if (adjustedX > maxX) {
      adjustedX = maxX;
    } else if (adjustedX < 0) {
      adjustedX = 0;
    }

    // Adjust y position if it goes outside of the screen
    if (adjustedY > maxY) {
      adjustedY = maxY;
    } else if (adjustedY < 0) {
      adjustedY = 0;
    }

    return { x: adjustedX, y: adjustedY };
  };

  return (
    <div
      className={`-my-1 max-w-fit cursor-pointer rounded px-2 text-center hover:bg-slate-600 hover:bg-opacity-50`}
      ref={ref}
      onClick={(e) => {
        if (type !== "click") return;
        e.preventDefault();
        setIsComponentVisible(!isComponentVisible);
        setPoints(adjustPosition(e.clientX, e.clientY));
      }}
      onContextMenu={(e) => {
        if (type !== "context") return;
        e.preventDefault();
        setIsComponentVisible(!isComponentVisible);
        setPoints(adjustPosition(e.pageX, e.pageY));
      }}
    >
      {children}
      {isComponentVisible && (
        <div
          id="context-menu"
          style={{
            top: points.y,
            left: points.x,
            zIndex: 1000,
            transform: "translate(-50%, -50%)",
          }}
          className="fixed flex w-60 origin-top-left flex-col rounded-lg border border-gray-300 bg-white py-4 px-2 text-sm text-gray-500 shadow-lg"
        >
          {/* TODO: Fix dark/light mode */}
          {items.map((item, i) => (
            <div
              key={i}
              onClick={(e) => {
                setIsComponentVisible(false);
                item.onClick(e);
              }}
              className="flex items-center rounded py-1 px-2 hover:bg-gray-100"
            >
              {item.icon && (
                <div className="mr-2 w-4 text-gray-900">{item.icon}</div>
              )}
              <div>{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
