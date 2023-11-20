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

const RippleElement = (props) => {
  const {
    rippleX,
    rippleY,
    rippleSize,
    in: inProp,
    onExited,
    timeout,
  } = props;

  const [leaving, setLeaving] = useState(false);

  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX,
  };

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
    <span className={"ripple ripple-rippleVisible"} style={rippleStyles}>
      <span className={clsx("ripple-child", {
        "ripple-childLeaving": leaving,
      })} />
    </span>
  );
};
type RippleProps = {
  center?: boolean
}
/**
 * @example
 * ```
 * const rippleRef = useRef<RippleActions>(null);
 * const { enableRipple, getRippleHandlers } = useRipple({
 *   disabled,
 *   disableRipple: false,
 *   rippleRef
 * })
 *
 * <button {...getRippleHandlers(props)}>
 *    {enableRipple ? (
 *      <Ripple ref={rippleRef} center={centerRipple} />
 *    ) : null}
 * </button>
 * ```
 */
const Ripple = forwardRef(
  ({ center: centerProp = false }: RippleProps, ref) => {
    const DURATION = 550;

    const [ripples, setRipples] = useState<React.ReactNode[]>([]);
    const nextKey = useRef<number>(0);
    const rippleCallback = useRef<(() => void) | null>(null);

    useEffect(() => {
      if (rippleCallback.current) {
        rippleCallback.current();
        rippleCallback.current = null;
      }
    }, [ripples]);

    const startTimer = useRef<ReturnType<typeof setTimeout>>();

    const startTimerCommit = useRef<(() => void) | null>(null);
    const container = useRef<HTMLSpanElement>(null);

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
            timeout={DURATION}
            rippleX={rippleX}
            rippleY={rippleY}
            rippleSize={rippleSize}
          />,
        ]);
        nextKey.current += 1;
        rippleCallback.current = cb;
      },
      []
    );

    const start = useCallback(
      (event, options: RippleProps = {}, cb = () => { }) => {
        const { center = centerProp } = options;

        const element = container.current;
        const rect = element
          ? element.getBoundingClientRect()
          : {
            width: 0,
            height: 0,
            left: 0,
            top: 0,
          };

        const { clientX, clientY } = (event as React.MouseEvent);
        let rippleX = Math.round(clientX - rect.left);
        let rippleY = Math.round(clientY - rect.top);
        let rippleSize: number;


        if (center) {
          rippleSize = Math.sqrt((2 * rect.width ** 2 + rect.height ** 2) / 3);
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

        startCommit({ rippleX, rippleY, rippleSize, cb });
      },
      [centerProp, startCommit]
    );

    const stop = useCallback((event, cb) => {
      clearTimeout(startTimer.current);

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
      <span ref={container} className={"overflow-hidden pointer-events-none absolute z-0 inset-0 rounded-[inherit]"}>
        <TransitionGroup component={null} exit>
          {ripples}
        </TransitionGroup>
      </span>
    );
  }
);


export default Ripple;

// OLD CODE
const OldRipple = ({ center = false }: { center?: boolean }) => {
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
