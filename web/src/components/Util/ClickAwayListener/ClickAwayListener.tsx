import { useEffect, useRef } from "react";

type ClickAwayListenerProps = {
  children: React.ReactNode | React.ReactNode[];
  onClickAway: () => void;
};
const ClickAwayListener = ({
  children,
  onClickAway,
}: ClickAwayListenerProps) => {
  const containerRef = useRef(null);

  const handleClick = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      onClickAway();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
};

export default ClickAwayListener;
