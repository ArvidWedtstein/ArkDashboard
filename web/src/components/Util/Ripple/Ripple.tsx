import clsx from "clsx";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useEventCallback } from "src/lib/formatters";
function setRef<T>(
  ref:
    | React.MutableRefObject<T | null>
    | ((instance: T | null) => void)
    | null
    | undefined,
  value: T | null
): void {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}
function useForkRef<Instance>(
  ...refs: Array<React.Ref<Instance> | undefined>
): React.RefCallback<Instance> | null {
  /**
   * This will create a new function if the refs passed to this hook change and are all defined.
   * This means react will call the old forkRef with `null` and the new forkRef
   * with the ref. Cleanup naturally emerges from this behavior.
   */
  return React.useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }

    return (instance) => {
      refs.forEach((ref) => {
        setRef(ref, instance);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}
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
  const handleRippleRef = useForkRef(rippleRef);
  const focusVisible = true;
  React.useEffect(() => {
    if (focusVisible) {
      rippleRef.current.pulsate();
    }
  }, [focusVisible]);

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
    if (focusVisible) {
      event.preventDefault();
    }
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
      className="rw-button rw-button-red"
      title="Clear all items"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onDragLeave={handleDragLeave}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      // onClick={onClick}
      onContextMenu={handleContextMenu}
      // onFocus={handleFocus}
      onBlur={handleBlur}
      // ref={handleRef}
    >
      TEST
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        aria-hidden="true"
        className="rw-button-icon-end !w-4"
        fill="currentColor"
      >
        <path d="M380.2 453.7c5.703 6.75 4.859 16.84-1.891 22.56C375.3 478.7 371.7 480 368 480c-4.547 0-9.063-1.938-12.23-5.657L192 280.8l-163.8 193.6C25.05 478.1 20.53 480 15.98 480c-3.641 0-7.313-1.25-10.31-3.781c-6.75-5.719-7.594-15.81-1.891-22.56l167.2-197.7L3.781 58.32c-5.703-6.75-4.859-16.84 1.891-22.56c6.75-5.688 16.83-4.813 22.55 1.875L192 231.2l163.8-193.6c5.703-6.688 15.8-7.563 22.55-1.875c6.75 5.719 7.594 15.81 1.891 22.56l-167.2 197.7L380.2 453.7z" />
      </svg>
      <Ripple ref={handleRippleRef} center={centerRipple} />
      {/*  {...TouchRippleProps} */}
    </button>
  );
};

const RippleElement = (props) => {
  const {
    className,
    classes,
    pulsate = false,
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
    classes.rippleVisible,
    {
      [classes.ripplePulsate]: pulsate,
    }
  );

  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX,
  };

  const childClassName = clsx(classes.child, {
    [classes.childLeaving]: leaving,
    [classes.childPulsate]: pulsate,
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
const Ripple = forwardRef(
  ({ center: centerProp = false }: { center?: boolean }, ref) => {
    const DURATION = 550;
    const DELAY_RIPPLE = 80;
    const rippleRoot = `overflow-hidden pointer-events-none absolute z-0 inset-0 rounded-[inherit]`;
    const classes = {
      ripple: `absolute`,
      rippleVisible: `opacity-30 animate-[rippleenter_${DURATION}ms]`,
      ripplePulsate: `animate-[rippleenter_${
        DURATION / 2
      }ms_ease_0ms_forwards]`,
      child: `opacity-100 block w-full h-full rounded-[50%] bg-current`,
      childLeaving: `animate-[rippleexit_${DURATION}ms_cubic-bezier(0.2,_0,_0.1,_0)_0ms_forwards]`, // opacity-0
      childPulsate: `absolute left-0 top-0 animate-[ripplepulsate_2500ms_ease-in-out_200ms_infinite]`,
    };

    const [ripples, setRipples] = useState([]);
    const nextKey = useRef(0);
    const rippleCallback = useRef(null);

    useEffect(() => {
      if (rippleCallback.current) {
        rippleCallback.current();
        rippleCallback.current = null;
      }
    }, [ripples]);

    const ignoringMouseDown = useRef(false);
    const startTimer = useRef<any>(0);
    const startTimerCommit = useRef(null);
    const container = useRef(null);

    useEffect(() => {
      return () => {
        if (startTimer.current) {
          clearTimeout(startTimer.current);
        }
      };
    }, []);

    const startCommit = useCallback((params) => {
      const { pulsate, rippleX, rippleY, rippleSize, cb } = params;

      setRipples((oldRipples) => [
        ...oldRipples,
        <RippleElement
          key={nextKey.current}
          classes={{
            ripple: clsx(classes.ripple),
            rippleVisible: clsx(classes.rippleVisible),
            ripplePulsate: clsx(classes.ripplePulsate),
            child: clsx(classes.child),
            childLeaving: clsx(classes.childLeaving),
            childPulsate: clsx(classes.childPulsate),
          }}
          timeout={DURATION}
          pulsate={pulsate}
          rippleX={rippleX}
          rippleY={rippleY}
          rippleSize={rippleSize}
          in={true}
        />,
      ]);
      nextKey.current += 1;
      rippleCallback.current = cb;
    }, []);

    const start = useCallback(
      (
        event,
        options: { pulsate?: boolean; center?: boolean } = {},
        cb = () => {}
      ) => {
        const { pulsate = false, center = centerProp || options.pulsate } =
          options;

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
        let rippleX;
        let rippleY;
        let rippleSize;

        if (
          center ||
          event === undefined ||
          (event.clientX === 0 && event.clientY === 0) ||
          (!event.clientX && !event.touches)
        ) {
          rippleX = Math.round(rect.width / 2);
          rippleY = Math.round(rect.height / 2);
        } else {
          const { clientX, clientY } =
            event.touches && event.touches.length > 0
              ? event.touches[0]
              : event;
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
        if (event?.touches) {
          // check that this isn't another touchstart due to multitouch
          // otherwise we will only clear a single timer when unmounting while two
          // are running
          if (startTimerCommit.current === null) {
            // Prepare the ripple effect.
            startTimerCommit.current = () => {
              startCommit({ pulsate, rippleX, rippleY, rippleSize, cb });
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
          startCommit({ pulsate, rippleX, rippleY, rippleSize, cb });
        }
      },
      [centerProp, startCommit]
    );
    // https://github.com/mui/material-ui/blob/master/packages/mui-material/src/ButtonBase/ButtonBase.js
    // https://github.com/mui/material-ui/blob/master/packages/mui-material/src/ButtonBase/TouchRipple.js
    const pulsate = useCallback(() => {
      start({}, { pulsate: true });
    }, [start]);

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

    React.useImperativeHandle(
      ref,
      () => ({
        pulsate,
        start,
        stop,
      }),
      [pulsate, start, stop]
    );

    return (
      <span ref={container} className={rippleRoot}>
        {ripples}
      </span>
    );
  }
);

export default Ripple;

// OLD CODE
// const Ripple = ({ center = false }: { center?: boolean }) => {
//   type RippleType = {
//     radius: number;
//     size: number;
//     x: number;
//     y: number;
//     id: number;
//     activated: number;
//     scale: number;
//     duration: number;
//   };
//   const [ripples, setRipples] = useState<RippleType[]>([]);
//   // let ripples = [];
//   const [mouseDown, setMouseDown] = useState(false);

//   useEffect(() => {
//     const element = node?.parentNode; //ref.current;

//     if (!element) return;

//     element.addEventListener("mousedown", handleMouseDown);
//     element.addEventListener("mouseup", handleMouseUp);
//     element.addEventListener("mouseout", handleMouseUp);

//     return () => {
//       element.removeEventListener("mousedown", handleMouseDown);
//       element.removeEventListener("mouseup", handleMouseUp);
//       element.removeEventListener("mouseout", handleMouseUp);
//     };
//   }, []);

//   let node = null;
//   const createRipple = (event) => {
//     node = event.originalTarget;
//     if (!node) return;
//     if (!node.parentNode) return;

//     const rippleSize = Math.max(node.clientWidth, node.clientHeight);
//     const duration = Math.sqrt(rippleSize) * 90;

//     const localX =
//       event.clientX - node.getBoundingClientRect().left - rippleSize / 2;
//     const localY =
//       event.clientY - node.getBoundingClientRect().top - rippleSize / 2;

//     let radius = 0;
//     let scale = 0.3;
//     scale = 0.15;
//     radius = node.clientWidth / 2;
//     radius = center
//       ? radius
//       : radius + Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4;

//     const centerX = (node.clientWidth - radius * 2) / 2;
//     const centerY = (node.clientHeight - radius * 2) / 2;

//     const x = center ? centerX : localX;
//     const y = center ? centerY : localY;
//     const newRipple = {
//       radius: radius,
//       scale: scale,
//       size: rippleSize,
//       x,
//       y,
//       id: new Date().getTime(),
//       activated: performance.now(),
//       duration,
//     };
//     setRipples((prev) => [...prev, newRipple]);

//     ripples.push(newRipple);
//   };

//   const handleMouseDown = (event) => {
//     setMouseDown(true);
//     createRipple(event);

//     const interval = setInterval(() => {
//       if (mouseDown) {
//         createRipple(event);
//       } else {
//         clearInterval(interval);
//       }
//     }, 100);
//   };

//   const handleMouseUp = (e) => {
//     setMouseDown(false);
//     const n = e.target;

//     if (ripples.length === 0) return;

//     ripples.forEach((ripple) => {
//       const diff = performance.now() - Number(ripple.activated);
//       const delay = Math.max(250 - diff, 0);

//       setTimeout(() => {
//         let animationElement = document.getElementById(
//           `ripple-${ripple.id.toString()}`
//         );
//         if (!animationElement) {
//           return setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
//         }

//         animationElement.style.animationName = "ripple-animation-hide";
//         animationElement.style.animationDuration = "200ms";
//         animationElement.style.animationTimingFunction =
//           "cubic-bezier(0.4, 0, 0.2, 1)";
//         animationElement.style.animationFillMode = "forwards";

//         setTimeout(() => {
//           if (animationElement && animationElement.parentNode === n) {
//             // n.removeChild(animationElement);

//             setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
//           }
//         }, 200);
//       }, delay);
//     });
//   };

//   return (
//     <span
//       aria-label="ripple"
//       ref={(el) => (node = el)}
//       className="absolute inset-0 h-full w-full overflow-hidden rounded-[inherit] z-0"
//     >
//       {[...new Map(ripples.map((item) => [item["id"], item])).values()].map(
//         (ripple) => {
//           const style = {
//             width: `${ripple.size}px`,
//             height: `${ripple.size}px`,
//             left: `${ripple.x}px`,
//             top: `${ripple.y}px`,
//             transform: `scale(${ripple.scale})`,
//             animationName: "ripple-animation",
//             animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
//             borderRadius: ripple.radius ? `${ripple.radius}px` : "50%",
//             animationFillMode: "forwards",
//             animationDuration: `${ripple.duration}ms`,
//             transition: "opacity 0.3s cubic-bezier(0, 0, 0.2, 1), transform 0.3s cubic-bezier(0, 0, 0.2, 1)",
//           };

//           return (
//             <span
//               key={ripple.id}
//               aria-labelledby="ripple"
//               className="pointer-events-none absolute z-0 select-none overflow-hidden bg-white/25"
//               id={`ripple-${ripple.id.toString()}`}
//               style={{ ...style }}
//             />
//           );
//         }
//       )}
//     </span>
//   );
// };

// export default Ripple;
