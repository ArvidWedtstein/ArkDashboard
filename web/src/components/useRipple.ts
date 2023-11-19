import { useEventCallback } from "src/lib/formatters";

interface StartActionOptions {
  pulsate?: boolean;
  center?: boolean;
}
interface TouchRippleActions {
  start: (
    event?: React.SyntheticEvent,
    options?: StartActionOptions,
    callback?: () => void
  ) => void;
  stop: (event?: React.SyntheticEvent, callback?: () => void) => void;
}
const useRipple = (props) => {
  const { disabled, disableRipple, rippleRef } = props;

  const useRippleHandler = (
    rippleAction: keyof TouchRippleActions,
    skipRippleAction = false
  ) => {
    return useEventCallback((event: React.SyntheticEvent) => {
      if (!skipRippleAction && rippleRef.current) {
        rippleRef.current[rippleAction](event);
      }

      return true;
    });
  };

  const handleBlur = useRippleHandler("stop", false);
  const handleMouseDown = useRippleHandler("start");
  const handleContextMenu = useRippleHandler("stop");
  const handleDragLeave = useRippleHandler("stop");
  const handleMouseUp = useRippleHandler("stop");
  const handleMouseLeave = useRippleHandler("stop");
  const handleTouchStart = useRippleHandler("start");
  const handleTouchEnd = useRippleHandler("stop");
  const handleTouchMove = useRippleHandler("stop");

  const [mountedState, setMountedState] = React.useState(false);
};
