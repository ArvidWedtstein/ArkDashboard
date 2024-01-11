import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { TextSize } from "src/lib/formatters";
import Collapse from "../Collapse/Collapse";
import Button from "../Button/Button";

interface IDisclosureProps {
  title: string;
  children: React.ReactNode;
  text_size?: TextSize;
  className?: string;
}


const Disclosure = ({ title, children, text_size, className }: IDisclosureProps) => {
  const memoizedChildren = useMemo(() => children, [children]);
  const [isOpen, setOpen] = useState(false);

  return (
    <div className={clsx(`border-t border-zinc-500 py-1 transition-all duration-300 ease-in-out`, className)}>
      <Button
        variant="text"
        color="DEFAULT"
        onClick={() => setOpen(!isOpen)}
        fullWidth
        endIcon={(
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            className={clsx("h-4 w-4 fill-current stroke-current transition-all duration-300 ease-in-out shrink-0", {
              "rotate-45": isOpen
            })}
          >
            <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
          </svg>
        )}
      >
        <span className={`rw-label !mt-0 grow select-none ${text_size}`}>{title}</span>
      </Button>

      <Collapse in={isOpen}>
        <div className="pt-6">
          {memoizedChildren}
        </div>
      </Collapse>
    </div>
  );
};

export default Disclosure;
