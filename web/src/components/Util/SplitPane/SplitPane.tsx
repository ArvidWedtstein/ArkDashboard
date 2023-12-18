import clsx from "clsx";
import { cloneElement, forwardRef, useEffect, useRef, useState } from "react";


type SplitterProps = {
  orientation?: 'vertical' | 'horizontal';
  fixedPanel?: '1' | '2';
  fixedPanelWidth?: number;
  children?: React.ReactNode
}
const SplitPane = forwardRef<HTMLDivElement, SplitterProps>((props, ref) => {
  const {
    orientation = 'horizontal',
    fixedPanel = "1",
    fixedPanelWidth = 50,
    children
  } = props;

  if (React.Children.count(children) !== 2) {
    throw new Error('SplitPane component requires exactly two children.');
  }
  // TODO: FIX. does not work


  const [splitterPosition, setSplitterPosition] = useState(50);
  const splitPanelRef = useRef(null)

  useEffect(() => {
    setSplitterPosition(fixedPanelWidth)
  }, [])

  const handleMouseMove = (event) => {
    if (splitPanelRef.current) {
      const rect = splitPanelRef.current.getBoundingClientRect();
      const containerWidth = rect.width;
      const newPosition = Math.min(Math.max(event.pageX - rect.left, 0), containerWidth - 1);
      setSplitterPosition(newPosition);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={clsx("relative flex w-full", {
        "flex-col": orientation === 'vertical',
        "flex-row": orientation === 'horizontal'
      })}
      ref={splitPanelRef}
    >
      {/* <div style={{ flex: `0 0 ${splitterPosition}px` }} className="select-none"> */}
      {cloneElement(children[0], { style: { flex: `0 0 ${splitterPosition}px`, select: 'none' } })}
      {/* </div> */}
      <span className="relative -mx-2 px-2 inline-block hover:shadow cursor-col-resize box-content w-px" style={{ zIndex: '9999' }} ref={ref} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <span className="dark:bg-white bg-black !w-3 inline-block h-full"></span>
      </span>
      {cloneElement(children[1], { style: { flex: fixedPanel === '2' ? `0 0 auto` : '1 1 auto', select: 'none' } })}
      {/* <div style={{ flex: fixedPanel === '2' ? `0 0 auto` : '1 1 auto', overflow: 'hidden' }} className="select-none">
        {React.Children.toArray(children)[1]}
      </div> */}
    </div>
  );
});

export default SplitPane
