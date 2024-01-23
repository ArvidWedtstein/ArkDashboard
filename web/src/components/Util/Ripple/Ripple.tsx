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


  // .ripple {
  //   opacity: 0;
  //   position: absolute;
  // }
  // .ripple-rippleVisible {
  //   opacity: 0.12;
  //   transform: scale(1);
  //   animation-name: ripple-enter;
  //   animation-duration: 550ms;
  //   animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  // }
  // .ripple-child {
  //   opacity: 1;
  //   display: block;
  //   width: 100%;
  //   height: 100%;
  //   border-radius: 50%;
  //   background-color: currentColor;
  // }
  // .ripple-childLeaving {
  //   opacity: 0;
  //   animation-name: ripple-exit;
  //   animation-duration: 550ms;
  //   animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  // }
  return (
    <span className={"absolute opacity-[.12] scale-100 animate-ripple-enter"} style={rippleStyles}>
      <span className={clsx("opacity-100 block w-full h-full rounded-[50%] bg-current", {
        "opacity-0 animate-ripple-exit": leaving,
      })} />
    </span>
    // <span className={"ripple ripple-rippleVisible"} style={rippleStyles}>
    //   <span className={clsx("ripple-child", {
    //     "ripple-childLeaving": leaving,
    //   })} />
    // </span>
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

        let rippleX: number;
        let rippleY: number;
        let rippleSize: number;
        if (
          center ||
          ((event as React.MouseEvent)?.clientX === 0 &&
            (event as React.MouseEvent)?.clientY === 0)
        ) {
          rippleX = Math.round(rect.width / 2);
          rippleY = Math.round(rect.height / 2);
        } else {
          const { clientX, clientY } = (event as React.MouseEvent)
          rippleX = Math.round(clientX - rect.left);
          rippleY = Math.round(clientY - rect.top);
        }

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