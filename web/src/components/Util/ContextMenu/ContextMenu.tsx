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

  return (
    <div
      className={`-my-1 max-w-fit cursor-pointer rounded px-2 text-center hover:bg-slate-600 hover:bg-opacity-50`}
      ref={ref}
      onClick={(e) => {
        if (type !== "click") return;
        e.preventDefault();
        setIsComponentVisible(!isComponentVisible);
        setPoints({
          x: e.pageX,
          y: e.pageY,
        });
      }}
      onContextMenu={(e) => {
        if (type !== "context") return;
        e.preventDefault();
        setIsComponentVisible(!isComponentVisible);
        setPoints({
          x: e.pageX,
          y: e.pageY,
        });
      }}
    >
      {children}
      {isComponentVisible && (
        <div
          style={{
            top: points.y + 5,
            left: points.x,
            zIndex: 1000,
          }}
          className="fixed flex w-60 origin-top-right flex-col rounded-lg border border-gray-300 bg-white py-4 px-2 text-sm text-gray-500 shadow-lg"
        >
          {" "}
          {/* TODO: Fix dark/light mode */}
          {items.map((item, i) => (
            <div
              key={i}
              onClick={item.onClick}
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
