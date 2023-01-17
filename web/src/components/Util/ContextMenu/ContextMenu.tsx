import { MouseEventHandler, useEffect, useState } from "react"
import useComponentVisible from "src/components/useComponentVisible"

type IContextMenuProps = {
  items: IContextMenuItem[];
  children: React.ReactNode;
  type?: 'context' | 'click';
}
type IContextMenuItem = {
  label: string
  icon?: React.ReactNode
  onClick?: (e) => void
}


export const ContextMenu = ({ items, children, type = 'context' }: IContextMenuProps) => {
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);


  return (
    <div
      className={`cursor-pointer hover:bg-slate-600 hover:bg-opacity-50 rounded px-2 -my-1 text-center max-w-fit`}
      ref={ref}
      onClick={
        (e) => {
          if (type !== 'click') return
          e.preventDefault();
          setIsComponentVisible(!isComponentVisible)
          setPoints({
            x: e.pageX,
            y: e.pageY,
          });
        }
      }
      onContextMenu={
        (e) => {
          if (type !== 'context') return
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
          top: points.y + 5,
          left: points.x,
          zIndex: 1000,
        }} className="bg-white w-60 border border-gray-300 rounded-lg flex flex-col text-sm py-4 px-2 text-gray-500 shadow-lg fixed"> {/* TODO: Fix dark/light mode */}
          {items.map((item, i) => (
            <div key={i} onClick={item.onClick} className="flex hover:bg-gray-100 py-1 px-2 rounded items-center">
              {item.icon && (<div className="w-4 text-gray-900 mr-2">{item.icon}</div>)}
              <div>{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

