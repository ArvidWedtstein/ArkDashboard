import clsx from "clsx";
import { CSSProperties, ReactNode, forwardRef, useEffect, useMemo, useRef } from "react";
import { Transition } from 'react-transition-group'

type CollapseProps = {
  children?: ReactNode
  in?: boolean
  onEnter?: (...props) => void
  onEntered?: (...props) => void
  onEntering?: (...props) => void
  onExit?: (...props) => void
  onExited?: (...props) => void
  onExiting?: (...props) => void
  collapsedSize?: number
  orientation?: 'horizontal' | 'vertical'
  style?: CSSProperties
  timeout?: number | "auto"
}

const Collapse = forwardRef((props: CollapseProps, ref) => {
  const {
    children,
    in: inProp,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExited,
    onExiting,
    collapsedSize: collapsedSizeProp = 0,
    orientation = 'vertical',
    style,
    timeout = "auto",
    ...other
  } = props

  const timer = useRef(null);
  const wrapperRef = useRef(null);
  const autoTransitionDuration = useRef(null);
  const isHorizontal = orientation === 'horizontal';
  const size = isHorizontal ? 'width' : 'height';

  const collapsedSize =
    typeof collapsedSizeProp === 'number' ? `${collapsedSizeProp}px` : collapsedSizeProp;

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const nodeRef = useRef(null);
  const handleRef = useMemo(() => {
    if ([ref, nodeRef].every((ref) => ref == null)) {
      return null;
    }

    return (instance) => {
      [ref, nodeRef].forEach((r) => {
        if (typeof r === 'function') {
          r(instance);
        } else if (r) {
          r.current = instance;
        }
      });
    };
  }, [ref, nodeRef])

  const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
    if (callback) {
      const node = nodeRef.current;
      maybeIsAppearing === undefined ? callback(node) : callback(node, maybeIsAppearing)
    }
  };

  const getWrapperSize = () => {
    return wrapperRef.current ? wrapperRef.current[isHorizontal ? 'clientWidth' : 'clientHeight'] : 0;
  }

  const handleEnter = normalizedTransitionCallback((node, appear) => {
    if (wrapperRef.current && isHorizontal) {
      wrapperRef.current.style.position = 'absolute';
    }
    node.style[size] = collapsedSize;

    onEnter?.(node, appear);
  });

  const handleEntering = normalizedTransitionCallback((node, appear) => {
    const wrapperSize = getWrapperSize();
    if (wrapperRef.current && isHorizontal) {
      wrapperRef.current.style.position = '';
    }

    const transitionDuration = 200;
    const transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)'

    if (timeout === 'auto') {
      const duration2 = Math.round((4 + 15 * (wrapperSize / 36) ** 0.25 + (wrapperSize / 36) / 5) * 10);
      node.style.transitionDuration = `${duration2}ms`;
      autoTransitionDuration.current = duration2;
    } else {
      node.style.transitionDuration =
        typeof transitionDuration === 'string' ? transitionDuration : `${transitionDuration}ms`;
    }

    node.style[size] = `${wrapperSize}px`;
    node.style.transitionTimingFunction = transitionTimingFunction;

    onEntering?.(node, appear);
  });

  const handleEntered = normalizedTransitionCallback((node, appear) => {
    node.style[size] = 'auto';
    onEntered?.(node, appear);
  });

  const handleExit = normalizedTransitionCallback((node) => {
    node.style[size] = `${getWrapperSize()}px`;
    onExit?.(node);
  });

  const handleExited = normalizedTransitionCallback(onExited);

  const handleExiting = normalizedTransitionCallback((node) => {
    const wrapperSize = getWrapperSize();
    const transitionDuration = 204;
    const transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)'

    if (timeout === 'auto') {
      const duration2 = Math.round((4 + 15 * (wrapperSize / 36) ** 0.25 + (wrapperSize / 36) / 5) * 10);
      node.style.transitionDuration = `${duration2}ms`;
      autoTransitionDuration.current = duration2;
    } else {
      node.style.transitionDuration =
        typeof transitionDuration === 'string' ? transitionDuration : `${transitionDuration}ms`;
    }

    node.style[size] = collapsedSize;
    node.style.transitionTimingFunction = transitionTimingFunction;

    onExiting && onExiting(node);
  });

  const handleAddEndListener = (next) => {
    if (timeout === 'auto') {
      timer.current = setTimeout(next, autoTransitionDuration.current || 0);
    }
  };

  return (
    <Transition
      in={inProp}
      onEnter={handleEnter}
      onEntered={handleEntered}
      onEntering={handleEntering}
      onExit={handleExit}
      onExited={handleExited}
      onExiting={handleExiting}
      addEndListener={handleAddEndListener}
      nodeRef={nodeRef}
      timeout={timeout === 'auto' ? null : timeout}
      {...other}
    >
      {(state, childProps) => (
        <div
          aria-label="CollapseRoot"
          className={clsx("h-0 overflow-hidden transition-all", {
            "w-0 h-auto": orientation === 'horizontal',
            "h-auto overflow-visible": state === 'entered',
            "w-auto": state === 'entered' && orientation === 'horizontal',
            "invisible": state === 'exited' && !inProp && collapsedSizeProp === 0
          })}
          style={{
            [isHorizontal ? 'minWidth' : 'minHeight']: collapsedSize,
            ...style,
          }}
          ref={handleRef}
          {...childProps}
        >
          <div
            aria-label="CollapseWrapper"
            className={clsx("flex w-full", {
              "w-auto h-full": orientation === 'horizontal'
            })}
            ref={wrapperRef}
          >
            <div
              aria-label="CollapseWrapperInner"
              className={clsx("w-full", {
                "w-auto h-full": orientation === 'horizontal'
              })}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </Transition>
  )
})


export default Collapse
