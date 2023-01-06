import { MouseEventHandler, useEffect, useState } from "react"
import useComponentVisible from "src/components/useComponentVisible"

type IContextMenuProps = {
  items: IContextMenuItem[];
  children: React.ReactNode;
}
type IContextMenuItem = {
  label: string
  icon?: HTMLElement
  onClick?: (e) => void
}


export const ContextMenu = ({ items, children }: IContextMenuProps) => {
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });
  const { ref, isComponentVisible, setIsComponentVisible } =
  useComponentVisible(false);


  return (
    <div ref={ref} onContextMenu={
      (e) => {
        e.preventDefault();
        setIsComponentVisible(!isComponentVisible)
        setPoints({
          x: e.pageX,
          y: e.pageY,
        });
      }
    }>
      {children}
      {isComponentVisible && (
      <div style={{
        position: 'fixed',
        top: points.y,
        left: points.x,
        zIndex: 1000,
      }} className="bg-white w-60 border border-gray-300 rounded-lg flex flex-col text-sm py-4 px-2 text-gray-500 shadow-lg">
        {items.map((item, i) => (
          <div key={i} onClick={item.onClick} className="flex hover:bg-gray-100 py-1 px-2 rounded">
            {item.icon && (<div className="w-8 text-gray-900">{item.icon}</div>)}
            <div>{item.label}</div>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}

