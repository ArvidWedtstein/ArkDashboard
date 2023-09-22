import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { TextSize } from "src/lib/formatters";

interface IDisclosureProps {
  title: string;
  children: React.ReactNode;
  text_size?: TextSize;
  className?: string;
}


const Disclosure = ({ title, children, text_size, className }: IDisclosureProps) => {
  const memoizedChildren = useMemo(() => children, [children]);
  const [isOpen, setOpen] = useState(false);
  const [height, setHeight] = useState<number | undefined>(
    open ? undefined : 0
  );
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setHeight(0);
      return undefined;
    }

    if (!ref.current) return undefined;

    const resizeObserver = new ResizeObserver((el) => {
      setHeight(el[0].contentRect.height);
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen]);
  return (
    <div className={`border-t border-zinc-500 py-6 transition-all duration-300 ease-in-out ${className}`}>
      <button type="button" className="-my-3 w-full flex items-center justify-between dark:text-white text-zinc-900 transition-all duration-300 ease-in-out" onClick={() => setOpen(!isOpen)}>
        <span className={`rw-label !mt-0 grow select-none ${text_size}`}>{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 500 500"
          className={clsx("h-4 w-4 fill-current stroke-current transition-all duration-300 ease-in-out shrink-0", {
            "rotate-45": isOpen
          })}
        >
          <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
        </svg>
      </button>
      <div className={`transition-[height] duration-300 overflow-hidden text-black dark:text-white`} style={{ height }}>
        <div ref={ref} className="pt-6">
          {memoizedChildren}
        </div>
      </div>
    </div>
  );
};

export default Disclosure;
