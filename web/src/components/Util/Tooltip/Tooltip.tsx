import clsx from "clsx";
import { Fragment, cloneElement, forwardRef, isValidElement, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useControlled, useEventCallback } from "src/lib/formatters";
import Popper from "../Popper/Popper";

type TooltipProps = {
  content: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  animation?: boolean;
  direction?: "top" | "bottom" | "left" | "right";
  open?: boolean;
  followCursor?: boolean;
  disabled?: boolean;
  onOpen?: (event) => void
  onClose?: (event) => void
}
let hystersisOpen = false;
let hystersisTimer = null;
let cursorPosition = { x: 0, y: 0 };
// TODO: rework tooltip
// must adjust position to not go over hovered content
const Tooltip = forwardRef((props: TooltipProps, ref) => {
  const {
    content,
    children: childrenProp,
    direction = "top",
    disabled = false,
    followCursor = false,
    open: openProp,
    onOpen,
    onClose
  } = props

  const children = isValidElement(childrenProp) ? childrenProp : <span>{childrenProp}</span>;

  const [childNode, setChildNode] = useState<HTMLElement>();
  const ignoreNonTouchEvents = useRef(false);

  const closeTimer = useRef(null)
  const enterTimer = useRef(null)
  const leaveTimer = useRef(null)

  const [openState, setOpenState] = useControlled({
    controlled: openProp,
    default: false,
    name: 'Tooltip',
    state: 'open'
  });

  let open = openState;

  const handleOpen = (event) => {
    clearTimeout(hystersisTimer);
    hystersisOpen = true;

    setOpenState(true);

    if (onOpen && !open) {
      onOpen(event)
    }
  }

  const handleClose = useEventCallback((event) => {
    clearTimeout(hystersisTimer);
    hystersisTimer = setTimeout(() => {
      hystersisOpen = false;
    }, 800);
    setOpenState(false);

    if (onClose && open) {
      onClose(event);
    }


    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      ignoreNonTouchEvents.current = false;
    }, 50);
  });


  const handleEnter = (event) => {
    if (ignoreNonTouchEvents.current && event.type !== 'touchstart') {
      return;
    }

    if (childNode) {
      childNode.removeAttribute('title');
    }
    let enterNextDelay = 0;
    let enterDelay = 100;
    clearTimeout(enterTimer.current);
    clearTimeout(leaveTimer.current);
    if ((hystersisOpen && enterNextDelay)) {
      enterTimer.current = setTimeout(
        () => {
          handleOpen(event);
        },
        hystersisOpen ? enterNextDelay : enterDelay,
      );
    } else {
      handleOpen(event);
    }
  }

  const handleLeave = (event) => {
    clearTimeout(enterTimer.current);
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      handleClose(event);
    }, 0);
  };

  let hadKeyboardEvent = true
  const focusVisibleRef = React.useCallback((node: HTMLElement) => {
    if (node != null) {
      node.ownerDocument.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.metaKey || event.altKey || event.ctrlKey) {
          return;
        }
        hadKeyboardEvent = true;
      }, true);
      node.ownerDocument.addEventListener('mousedown', (e) => {
        hadKeyboardEvent = false;
      }, true);
      node.ownerDocument.addEventListener('pointerdown', (e) => {
        hadKeyboardEvent = false;
      }, true);
      node.ownerDocument.addEventListener('touchstart', (e) => {
        hadKeyboardEvent = false;
      }, true);
    }
  }, []);


  // There is no point in displaying an empty tooltip.
  if (!content && content !== 0) {
    open = false;
  }

  const handleMouseMove = (event) => {
    const childrenProps = children.props;
    if (childrenProps.onMouseMove) {
      childrenProps.onMouseMove(event);
    }

    cursorPosition = { x: event.clientX, y: event.clientY };
  };

  const handleRef = React.useMemo(() => {
    if ([focusVisibleRef, setChildNode, ref].every((ref) => ref == null)) {
      return null;
    }

    return (instance) => {
      [focusVisibleRef, setChildNode, ref].forEach((ref) => {
        if (typeof ref === 'function') {
          ref(instance);
        } else if (ref) {
          ref.current = instance;
        }
      });
    };
  }, [focusVisibleRef, setChildNode, ref]);

  const childrenProps = {
    ...children.props,
    className: clsx(children.props.className),
    ref: handleRef,
    ...(followCursor ? { onMouseMove: handleMouseMove } : {}),
    onMouseOver: handleEnter,
    onMouseLeave: handleLeave
  };

  return (
    <Fragment>
      {cloneElement(children, childrenProps)}
      {!disabled && <Popper anchorEl={followCursor ? {
        getBoundingClientRect: () => ({
          top: cursorPosition.y,
          left: cursorPosition.x,
          right: cursorPosition.x,
          bottom: cursorPosition.y,
          width: 0,
          height: 0,
        })
      } as Element : childNode}
        open={childNode ? open : false}
        paddingToAnchor={8}
        style={{
          overflow: 'visible'
        }}
      >
        <div className={`z-50 w-max overflow-visible rounded border border-zinc-500 dark:bg-zinc-700 bg-zinc-300 px-1 text-xs py-0.5 text-gray-700 shadow dark:text-white`}>
          {content}
          {/* <span className="overflow-hidden absolute -top-2 left-1/3  w-0 h-0" style={{
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderBottom: '10px solid rgba(63, 63, 70, 1)',
          }} /> */}
        </div>
      </Popper>}
    </Fragment>
  );
});

export default Tooltip;
