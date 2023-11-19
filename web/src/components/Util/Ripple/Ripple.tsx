import clsx from "clsx";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { TransitionGroup } from "react-transition-group";
import { useEventCallback } from "src/lib/formatters";
export const TestButton = (props) => {
  const {
    action,
    centerRipple = false,
    children,
    className,
    disabled = false,
    onContextMenu,
    onDragLeave,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onTouchEnd,
    onTouchMove,
    onTouchStart,
  } = props;
  const rippleRef = React.useRef(null);

  function useRippleHandler(
    rippleAction,
    eventCallback,
    skipRippleAction = false
  ) {
    return useEventCallback((event) => {
      if (eventCallback) {
        eventCallback(event);
      }

      const ignore = skipRippleAction;
      if (!ignore && rippleRef.current) {
        rippleRef.current[rippleAction](event);
      }

      return true;
    });
  }

  const handleMouseDown = useRippleHandler("start", onMouseDown);
  const handleContextMenu = useRippleHandler("stop", onContextMenu);
  const handleDragLeave = useRippleHandler("stop", onDragLeave);
  const handleMouseUp = useRippleHandler("stop", onMouseUp);
  const handleMouseLeave = useRippleHandler("stop", (event) => {
    if (onMouseLeave) {
      onMouseLeave(event);
    }
  });
  const handleTouchStart = useRippleHandler("start", onTouchStart);
  const handleTouchEnd = useRippleHandler("stop", onTouchEnd);
  const handleTouchMove = useRippleHandler("stop", onTouchMove);

  const handleBlur = useRippleHandler("stop", (event) => {}, false);
  return (
    <button
      type="button"
      className="border-pea-400/50 relative box-border inline-flex appearance-none items-center justify-center rounded border bg-transparent py-1 px-4 text-sm font-medium uppercase leading-7 text-white"
      title="Clear all items"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onDragLeave={handleDragLeave}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onContextMenu={handleContextMenu}
      onBlur={handleBlur}
    >
      TEST
      <NewRipple ref={rippleRef} center={centerRipple} />
    </button>
  );
};

const RippleElement = (props) => {
  const {
    className,
    classes,
    rippleX,
    rippleY,
    rippleSize,
    in: inProp,
    onExited,
    timeout,
  } = props;

  const [leaving, setLeaving] = useState(false);

  const rippleClassName = clsx(
    className,
    classes.ripple,
    classes.rippleVisible
  );

  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX,
  };

  const childClassName = clsx(classes.child, {
    [classes.childLeaving]: leaving,
  });

  if (!inProp && !leaving) {
    setLeaving(true);
  }
  useEffect(() => {
    if (!inProp && onExited != null) {
      // react-transition-group#onExited
      const timeoutId = setTimeout(onExited, timeout);
      return () => {
        clearTimeout(timeoutId);
      };
    }
    return undefined;
  }, [onExited, inProp, timeout]);

  return (
    <span className={rippleClassName} style={rippleStyles}>
      <span className={childClassName} />
    </span>
  );
};
export const NewRipple = forwardRef(
  ({ center: centerProp = false }: { center?: boolean }, ref) => {
    const DURATION = 550;
    const DELAY_RIPPLE = 80;
    const rippleRoot = `overflow-hidden pointer-events-none absolute z-0 inset-0 rounded-[inherit]`;
    const classes = {
      ripple: `absolute opacity-0 transition-opacity duration-500`,
      // rippleVisible: `!opacity-[.12] transform scale-100 animate-[rippleenter_${DURATION}ms_ease-in-out_0ms_forwards]`,
      child: `opacity-100 block w-full h-full rounded-[50%] bg-current`,
      // childLeaving: `animate-[rippleexit_${DURATION}ms_cubic-bezier(0.2,_0,_0.1,_0)_0ms_forwards] opacity-0`,
    };
    const [ripples, setRipples] = useState<React.ReactNode[]>([]);
    const nextKey = useRef(0);
    const rippleCallback = useRef<(() => void) | null>(null);

    useEffect(() => {
      if (rippleCallback.current) {
        rippleCallback.current();
        rippleCallback.current = null;
      }
    }, [ripples]);

    // Used to filter out mouse emulated events on mobile.
    const ignoringMouseDown = React.useRef(false);
    // We use a timer in order to only show the ripples for touch "click" like events.
    // We don't want to display the ripple for touch scroll events.
    const startTimer = React.useRef<ReturnType<typeof setTimeout>>();

    // This is the hook called once the previous timeout is ready.
    const startTimerCommit = React.useRef<(() => void) | null>(null);
    const container = React.useRef<HTMLSpanElement>(null);

    useEffect(() => {
      return () => {
        if (startTimer.current) {
          clearTimeout(startTimer.current);
        }
      };
    }, []);

    const startCommit = useCallback(
      (params) => {
        const { rippleX, rippleY, rippleSize, cb } = params;

        setRipples((oldRipples) => [
          ...oldRipples,
          <RippleElement
            key={nextKey.current}
            classes={{
              ripple: classes.ripple,
              rippleVisible: "ripple-rippleVisible",
              child: classes.child, //works
              childLeaving: "ripple-childLeaving",
            }}
            timeout={DURATION}
            rippleX={rippleX}
            rippleY={rippleY}
            rippleSize={rippleSize}
          />,
        ]);
        nextKey.current += 1;
        rippleCallback.current = cb;
      },
      [classes]
    );
    const start = useCallback(
      (event, options: { center?: boolean } = {}, cb = () => {}) => {
        const { center = centerProp } = options;

        if (event?.type === "mousedown" && ignoringMouseDown.current) {
          ignoringMouseDown.current = false;
          return;
        }

        if (event?.type === "touchstart") {
          ignoringMouseDown.current = true;
        }

        const element = container.current;
        const rect = element
          ? element.getBoundingClientRect()
          : {
              width: 0,
              height: 0,
              left: 0,
              top: 0,
            };

        // Get the size of the ripple
        let rippleX: number;
        let rippleY: number;
        let rippleSize: number;

        if (
          center ||
          ((event as React.MouseEvent)?.clientX === 0 &&
            (event as React.MouseEvent)?.clientY === 0) ||
          (!(event as React.MouseEvent)?.clientX &&
            !(event as React.TouchEvent)?.touches)
        ) {
          rippleX = Math.round(rect.width / 2);
          rippleY = Math.round(rect.height / 2);
        } else {
          const { clientX, clientY } =
            event && (event as React.TouchEvent).touches
              ? (event as React.TouchEvent).touches[0]
              : (event as React.MouseEvent);
          rippleX = Math.round(clientX - rect.left);
          rippleY = Math.round(clientY - rect.top);
        }

        if (center) {
          rippleSize = Math.sqrt((2 * rect.width ** 2 + rect.height ** 2) / 3);

          // For some reason the animation is broken on Mobile Chrome if the size is even.
          if (rippleSize % 2 === 0) {
            rippleSize += 1;
          }
        } else {
          const sizeX =
            Math.max(
              Math.abs((element ? element.clientWidth : 0) - rippleX),
              rippleX
            ) *
              2 +
            2;
          const sizeY =
            Math.max(
              Math.abs((element ? element.clientHeight : 0) - rippleY),
              rippleY
            ) *
              2 +
            2;
          rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);
        }

        // Touche devices
        if ((event as React.TouchEvent)?.touches) {
          // check that this isn't another touchstart due to multitouch
          // otherwise we will only clear a single timer when unmounting while two
          // are running
          if (startTimerCommit.current === null) {
            // Prepare the ripple effect.
            startTimerCommit.current = () => {
              startCommit({ rippleX, rippleY, rippleSize, cb });
            };
            // Delay the execution of the ripple effect.
            startTimer.current = setTimeout(() => {
              if (startTimerCommit.current) {
                startTimerCommit.current();
                startTimerCommit.current = null;
              }
            }, DELAY_RIPPLE); // We have to make a tradeoff with this value.
          }
        } else {
          startCommit({ rippleX, rippleY, rippleSize, cb });
        }
      },
      [centerProp, startCommit]
    );
    // https://github.com/mui/material-ui/blob/master/packages/mui-material/src/ButtonBase/ButtonBase.js
    // https://github.com/mui/material-ui/blob/master/packages/mui-material/src/ButtonBase/TouchRipple.js

    const stop = useCallback((event, cb) => {
      clearTimeout(startTimer.current);

      // The touch interaction occurs too quickly.
      // We still want to show ripple effect.
      if (event?.type === "touchend" && startTimerCommit.current) {
        startTimerCommit.current();
        startTimerCommit.current = null;
        startTimer.current = setTimeout(() => {
          stop(event, cb);
        });
        return;
      }

      startTimerCommit.current = null;

      setRipples((oldRipples) => {
        if (oldRipples.length > 0) {
          return oldRipples.slice(1);
        }
        return oldRipples;
      });

      rippleCallback.current = cb;
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        start,
        stop,
      }),
      [start, stop]
    );

    return (
      <span ref={container} className={rippleRoot}>
        <TransitionGroup component={null} exit>
          {ripples}
        </TransitionGroup>
      </span>
    );
  }
);

// OLD CODE
const Ripple = ({ center = false }: { center?: boolean }) => {
  type RippleType = {
    radius: number;
    size: number;
    x: number;
    y: number;
    id: number;
    activated: number;
    scale: number;
    duration: number;
  };
  const [ripples, setRipples] = useState<RippleType[]>([]);
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const element = node?.parentNode; //ref.current;

    if (!element) return;

    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("mouseout", handleMouseUp);

    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseup", handleMouseUp);
      element.removeEventListener("mouseout", handleMouseUp);
    };
  }, []);

  let node = null;
  const createRipple = (event) => {
    node = event.originalTarget;
    if (!node) return;
    if (!node.parentNode) return;

    const rippleSize = Math.max(node.clientWidth, node.clientHeight);
    const duration = Math.sqrt(rippleSize) * 90;

    const localX =
      event.clientX - node.getBoundingClientRect().left - rippleSize / 2;
    const localY =
      event.clientY - node.getBoundingClientRect().top - rippleSize / 2;

    let radius = 0;
    let scale = 0.3;
    scale = 0.1;
    radius = node.clientWidth / 2;
    radius = center
      ? radius
      : radius + Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4;

    const centerX = (node.clientWidth - radius * 2) / 2;
    const centerY = (node.clientHeight - radius * 2) / 2;

    const x = center ? centerX : localX;
    const y = center ? centerY : localY;
    const newRipple = {
      radius: radius,
      scale: scale,
      size: rippleSize,
      x,
      y,
      id: new Date().getTime(),
      activated: performance.now(),
      duration,
    };
    setRipples((prev) => [...prev, newRipple]);

    ripples.push(newRipple);
  };

  const handleMouseDown = (event) => {
    setMouseDown(true);
    createRipple(event);

    const interval = setInterval(() => {
      if (mouseDown) {
        createRipple(event);
      } else {
        clearInterval(interval);
      }
    }, 100);
  };

  const handleMouseUp = (e) => {
    setMouseDown(false);
    const n = e.target;

    if (ripples.length === 0) return;

    ripples.forEach((ripple) => {
      const diff = performance.now() - Number(ripple.activated);
      const delay = Math.max(250 - diff, 0);

      setTimeout(() => {
        let animationElement = document.getElementById(
          `ripple-${ripple.id.toString()}`
        );

        if (!animationElement) {
          return setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
        }
        animationElement.style.animationName = "ripple-animation-hide";
        animationElement.style.animationDuration = "200ms";
        animationElement.style.animationTimingFunction =
          "cubic-bezier(0.4, 0, 0.2, 1)";
        animationElement.style.animationFillMode = "forwards";

        setTimeout(() => {
          if (animationElement && animationElement.parentNode === n) {
            // n.removeChild(animationElement);

            setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
          }
        }, 300);
      }, delay);
    });
  };

  return (
    <span
      aria-label="ripple"
      ref={(el) => (node = el)}
      className="absolute inset-0 z-0 h-full w-full overflow-hidden rounded-[inherit]"
    >
      <TransitionGroup exit>
        {[...new Map(ripples.map((item) => [item["id"], item])).values()].map(
          (ripple) => {
            const style = {
              width: `${ripple.size}px`,
              height: `${ripple.size}px`,
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              transform: `scale(${ripple.scale})`,
              animationName: "ripple-animation",
              animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: "50%",
              animationFillMode: "forwards",
              animationDuration: `${ripple.duration}ms`,
              transition:
                "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            };

            return (
              <span
                key={ripple.id}
                aria-labelledby="ripple"
                className="pointer-events-none absolute z-0 select-none overflow-hidden bg-white/25"
                id={`ripple-${ripple.id.toString()}`}
                style={{ ...style }}
              />
            );
          }
        )}
      </TransitionGroup>
    </span>
  );
};

export default Ripple;
