import { HTMLAttributes, forwardRef, useId, useMemo, useRef } from "react";
import { Transition } from 'react-transition-group'
import clsx from "clsx";
import ReactDOM from "react-dom";

interface DialogContextValue {
  titleId?: string;
}

const DialogContext = React.createContext<DialogContextValue>({});

type DialogProps = {
  scroll?: 'paper' | 'body',
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  onClose?: (event, reason?: string) => void;
  onBackdropClick?: (event) => void;
  open?: boolean;
} & React.DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const Dialog = forwardRef<HTMLDivElement, DialogProps>((props, ref) => {
  const {
    scroll = "paper",
    maxWidth,
    "aria-labelledby": ariaLabelledbyProp,
    children,
    onClose,
    onBackdropClick,
    open = false,
    ...other
  } = props;
  const ariaLabelledby = ariaLabelledbyProp ?? useId();
  const dialogContextValue = useMemo(() => {
    return { titleId: ariaLabelledby }
  }, [])

  const backdropClick = useRef<boolean>();
  const handleMouseDown = (event) => {
    backdropClick.current = event.target === event.currentTarget;
  }

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!backdropClick.current) {
      return;
    }

    backdropClick.current = null;

    if (onBackdropClick) {
      onBackdropClick(event);
    }

    if (onClose) {
      onClose(event, 'backdropClick');
    }
  }

  // useEffect(() => {
  //   if (!open) return
  //   let x = window.scrollX;
  //   let y = window.scrollY;
  //   window.onscroll = function () { window.scrollTo(x, y); };

  //   return () => {
  //     window.onscroll = function () { };
  //   }
  // }, [open])

  if (!open) {
    return null;
  }
  const defaultStyle = {
    transition: `opacity 300ms ease-in-out`,
    opacity: 0,
  }
  const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
  };
  return ReactDOM.createPortal((
    <div className="fixed inset-0 z-50" role="dialog" onClick={handleBackdropClick} {...other} ref={ref}>
      <div aria-label="backdrop" className="fixed flex items-center justify-center inset-0 bg-black/50 -z-10" />
      <Transition
        appear
        in={open}
        timeout={300}
        role="presentation"
      >
        {(state) => (
          <div
            className={clsx("h-full outline-0", {
              "flex justify-center items-center": scroll === 'paper',
              "overflow-y-auto overflow-x-hidden text-center after:content-[''] after:inline-block after:h-full after: align-middle after:w-0": scroll === 'body'
            })}
            style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}
            onMouseDown={handleMouseDown}
          >
            <div
              className={clsx("animate-pop-up m-8 dark:text-white text-black shadow-lg bg-zinc-300 dark:bg-zinc-800 rounded relative overflow-y-auto", {
                "flex flex-col max-h-[calc(100%_-_64px)]": scroll === 'paper',
                "inline-block align-middle text-left": scroll === 'body',
                "max-w-[calc(100%-64px)]": !maxWidth,
                "max-w-xs": maxWidth === 'xs',
                "max-w-sm": maxWidth === 'sm',
                "max-w-md": maxWidth === 'md',
                "max-w-lg": maxWidth === 'lg',
                "max-w-xl": maxWidth === 'xl',
                "max-w-2xl": maxWidth === '2xl'
              })}
              role="dialog"
              aria-labelledby={ariaLabelledby}
            >
              <DialogContext.Provider value={dialogContextValue}>
                {children}
              </DialogContext.Provider>
            </div>
          </div>
        )}
      </Transition>
    </div>
  ), document.body)
})

type DialogActionsProps = {
  children?: React.ReactNode
} & React.DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
export const DialogActions = forwardRef<HTMLDivElement, DialogActionsProps>((props, ref) => {
  const { children, className, ...other } = props;
  return (
    <div className={clsx("flex items-center p-2 justify-end flex-[0_0_auto]", className)} {...other} ref={ref}>{children}</div>
  )
});

type DialogContentProps = {
  children?: React.ReactNode;
  dividers?: boolean
} & React.DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>((props, ref) => {
  const { children, dividers, className, ...other } = props;
  return (
    <div {...other} className={clsx("overflow-y-auto flex-auto px-6", className, {
      "py-4 border-y border-zinc-500": dividers,
      "py-5": !dividers
    })} ref={ref}>{children}</div>
  )
});
type DialogTitleProps = {
  children?: React.ReactNode
} & React.DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
export const DialogTitle = forwardRef<HTMLDivElement, DialogTitleProps>((props, ref) => {
  const { children, className, ...other } = props;
  return (
    <h2 className={clsx("px-6 py-4 flex-[0_0_auto] font-medium text-xl leading-6", className)} ref={ref} {...other}>{children}</h2>
  )
});