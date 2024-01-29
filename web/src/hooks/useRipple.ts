import { useEffect, useMemo, useState } from "react";
import { useEventCallback } from "./useEventCallback";

type StartActionOptions = {
  pulsate?: boolean;
  center?: boolean;
};
export type RippleActions = {
  start: (
    event?: React.SyntheticEvent,
    options?: StartActionOptions,
    callback?: () => void
  ) => void;
  stop: (event?: React.SyntheticEvent, callback?: () => void) => void;
};

type UseRippleProps = {
  disabled: boolean;
  disableFocusRipple?: boolean;
  disableRipple?: boolean;
  disableTouchRipple?: boolean;
  rippleRef: React.RefObject<RippleActions>;
};
type RippleEventHandlers = {
  onBlur: React.FocusEventHandler;
  onContextMenu: React.MouseEventHandler;
  onDragLeave: React.DragEventHandler;
  onMouseDown: React.MouseEventHandler;
  onMouseLeave: React.MouseEventHandler;
  onMouseUp: React.MouseEventHandler;
};
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
export const useRipple = (props: UseRippleProps) => {
  const { disabled, disableRipple, rippleRef } = props;

  const useRippleHandler = (rippleAction: keyof RippleActions) => {
    return useEventCallback((event: React.SyntheticEvent) => {
      if (rippleRef.current) {
        rippleRef.current[rippleAction](event);
      }

      return true;
    });
  };

  const handleBlur = useRippleHandler("stop");
  const handleMouseDown = useRippleHandler("start");
  const handleContextMenu = useRippleHandler("stop");
  const handleDragLeave = useRippleHandler("stop");
  const handleMouseUp = useRippleHandler("stop");
  const handleMouseLeave = useRippleHandler("stop");

  const [mountedState, setMountedState] = useState(false);

  useEffect(() => {
    setMountedState(true);
  }, []);

  const enableRipple = mountedState && !disableRipple && !disabled;

  const getRippleHandlers = useMemo(() => {
    const rippleHandlers = {
      onBlur: handleBlur,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onContextMenu: handleContextMenu,
      onDragLeave: handleDragLeave,
    } as RippleEventHandlers;

    return (otherEvents: Partial<RippleEventHandlers> = {}) => {
      const eventNames = Object.keys(
        rippleHandlers
      ) as (keyof RippleEventHandlers)[];
      const wrappedEvents = eventNames.map((eventName) => ({
        name: eventName,
        handler: (ev: any) => {
          otherEvents[eventName]?.(ev);
          rippleHandlers[eventName](ev);
        },
      }));

      return wrappedEvents.reduce((acc, current) => {
        acc[current.name] = current.handler;
        return acc;
      }, {} as RippleEventHandlers);
    };
  }, [
    handleBlur,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleContextMenu,
    handleDragLeave,
  ]);

  return {
    enableRipple,
    getRippleHandlers,
  };
};
