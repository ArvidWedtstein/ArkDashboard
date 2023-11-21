import {
  FieldError,
  Form,
  FormError,
  Label,
  RWGqlError,
  TextField,
} from "@redwoodjs/forms";
import { MetaTags } from "@redwoodjs/web";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { toast } from "@redwoodjs/web/dist/toast";
import FibonacciSphere from "src/components/Util/FibonacciSphere/FibonacciSphere";
import { SimplexNoise3D, clamp, useControlled, useEventCallback } from "src/lib/formatters";
import { InputOutlined } from "src/components/Util/Input/Input";
import clsx from "clsx";

function trackFinger(
  event: TouchEvent | MouseEvent | React.MouseEvent,
  touchId: React.RefObject<any>,
) {
  // The event is TouchEvent
  if (touchId.current !== undefined && (event as TouchEvent).changedTouches) {
    const touchEvent = event as TouchEvent;
    for (let i = 0; i < touchEvent.changedTouches.length; i += 1) {
      const touch = touchEvent.changedTouches[i];
      if (touch.identifier === touchId.current) {
        return {
          x: touch.clientX,
          y: touch.clientY,
        };
      }
    }

    return false;
  }

  // The event is MouseEvent
  return {
    x: (event as MouseEvent).clientX,
    y: (event as MouseEvent).clientY,
  };
}

function setValueIndex({
  values,
  newValue,
  index,
}: {
  values: number[];
  newValue: number;
  index: number;
}) {
  const output = values.slice();
  output[index] = newValue;
  return output.sort((a, b) => a - b);
}
function focusThumb({
  sliderRef,
  activeIndex,
  setActive,
}: {
  sliderRef: React.RefObject<any>;
  activeIndex: number;
  setActive?: (num: number) => void;
}) {
  const doc = (sliderRef.current && sliderRef.current.ownerDocument) || document;
  if (
    !sliderRef.current?.contains(doc.activeElement) ||
    Number(doc?.activeElement?.getAttribute('data-index')) !== activeIndex
  ) {
    sliderRef.current?.querySelector(`[type="range"][data-index="${activeIndex}"]`).focus();
  }

  if (setActive) {
    setActive(activeIndex);
  }
}

function areValuesEqual(
  newValue: number | Array<number>,
  oldValue: number | Array<number>,
): boolean {
  if (typeof newValue === 'number' && typeof oldValue === 'number') {
    return newValue === oldValue;
  }
  if (typeof newValue === 'object' && typeof oldValue === 'object') {
    return newValue.length === oldValue.length &&
      newValue.every((value, index) => value === oldValue[index]);
  }
  return false;
}
let hadKeyboardEvent = true;
let hadFocusVisibleRecently = false;
let hadFocusVisibleRecentlyTimeout: undefined | number;
function useIsFocusVisible() {
  const ref = React.useCallback((node: HTMLElement) => {
    if (node != null) {
      node.ownerDocument.addEventListener('keydown', (event) => {
        if (event.metaKey || event.altKey || event.ctrlKey) {
          return;
        }
        hadKeyboardEvent = true;
      }, true);
      node.ownerDocument.addEventListener('mousedown', () => {
        hadKeyboardEvent = false;
      }, true);
      node.ownerDocument.addEventListener('pointerdown', () => {
        hadKeyboardEvent = false;
      }, true);
      node.ownerDocument.addEventListener('touchstart', () => {
        hadKeyboardEvent = false;
      }, true);
      node.ownerDocument.addEventListener('visibilitychange', (s) => {
        if (this.visibilityState === 'hidden') {
          // If the tab becomes active again, the browser will handle calling focus
          // on the element (Safari actually calls it twice).
          // If this tab change caused a blur on an element with focus-visible,
          // re-apply the class when the user switches back to the tab.
          if (hadFocusVisibleRecently) {
            hadKeyboardEvent = true;
          }
        }
      }, true);
    }
  }, []);

  const isFocusVisibleRef = React.useRef(false);

  /**
   * Should be called if a blur event is fired
   */
  function handleBlurVisible() {
    // checking against potential state variable does not suffice if we focus and blur synchronously.
    // React wouldn't have time to trigger a re-render so `focusVisible` would be stale.
    // Ideally we would adjust `isFocusVisible(event)` to look at `relatedTarget` for blur events.
    // This doesn't work in IE11 due to https://github.com/facebook/react/issues/3751
    // TODO: check again if React releases their internal changes to focus event handling (https://github.com/facebook/react/pull/19186).
    if (isFocusVisibleRef.current) {
      // To detect a tab/window switch, we look for a blur event followed
      // rapidly by a visibility change.
      // If we don't see a visibility change within 100ms, it's probably a
      // regular focus change.
      hadFocusVisibleRecently = true;
      window.clearTimeout(hadFocusVisibleRecentlyTimeout!);
      hadFocusVisibleRecentlyTimeout = window.setTimeout(() => {
        hadFocusVisibleRecently = false;
      }, 100);

      isFocusVisibleRef.current = false;

      return true;
    }

    return false;
  }

  /**
   * Should be called if a blur event is fired
   */
  function handleFocusVisible(event: React.FocusEvent) {
    const { target } = event;
    try {
      return target.matches(':focus-visible');
    } catch (error) {
      // Browsers not implementing :focus-visible will throw a SyntaxError.
      // We use our own heuristic for those browsers.
      // Rethrow might be better if it's not the expected error but do we really
      // want to crash if focus-visible malfunctioned?
    }

    if (hadKeyboardEvent) {
      isFocusVisibleRef.current = true;
      return true;
    }
    return false;
  }

  return { isFocusVisibleRef, onFocus: handleFocusVisible, onBlur: handleBlurVisible, ref };
}
const useSlider = (parameters) => {
  const {
    defaultValue = 50,
    disabled = false,
    disableSwap = false,
    marks: marksProp = false,
    max = 100,
    min = 0,
    name,
    onChange,
    onChangeCommitted,
    orientation = 'horizontal',
    rootRef: ref,
    step = 1,
    tabIndex,
    value: valueProp,
  } = parameters;

  const touchId = useRef<number>();
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(-1);
  const [dragging, setDragging] = useState(false);
  const moveCount = useRef(0);

  const [valueDerived, setValueState] = useControlled({
    controlled: valueProp,
    default: defaultValue ?? min,
    name: 'Slider',
  });

  const handleChange =
    onChange &&
    ((event: Event | React.SyntheticEvent, value: number | number[], thumbIndex: number) => {
      // Redefine target to allow name and value to be read.
      // This allows seamless integration with the most popular form libraries.
      // https://github.com/mui/material-ui/issues/13485#issuecomment-676048492
      // Clone the event to not override `target` of the original event.
      const nativeEvent = (event as React.SyntheticEvent).nativeEvent || event;
      // @ts-ignore The nativeEvent is function, not object
      const clonedEvent = new nativeEvent.constructor(nativeEvent.type, nativeEvent);

      Object.defineProperty(clonedEvent, 'target', {
        writable: true,
        value: { value, name },
      });

      onChange(clonedEvent, value, thumbIndex);
    });

  const range = Array.isArray(valueDerived);
  let values = range ? valueDerived.slice().sort((a, b) => a - b) : [valueDerived];
  values = values.map((value) => clamp(value, min, max));
  const marks =
    marksProp === true && step !== null
      ? [...Array(Math.floor((max - min) / step) + 1)].map((_, index) => ({
        value: min + step * index,
      }))
      : marksProp || [];

  const marksValues = (marks).map((mark) => mark.value);


  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef,
  } = useIsFocusVisible();
  const [focusedThumbIndex, setFocusedThumbIndex] = React.useState(-1);

  const sliderRef = React.useRef<HTMLSpanElement>();
  const handleFocusRef = React.useMemo(() => {
    console.log('FOCUS REF')
    if ([focusVisibleRef, sliderRef].every((ref) => ref == null)) {
      return null;
    }

    return (instance) => {
      [focusVisibleRef, sliderRef].forEach((ref) => {
        if (typeof ref === 'function') {
          ref(instance);
        } else if (ref) {
          ref.current = instance;
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusVisibleRef, sliderRef]);
  const handleRef = React.useMemo(() => {
    if ([ref, handleFocusRef].every((ref) => ref == null)) {
      return null;
    }

    return (instance) => {
      [ref, handleFocusRef].forEach((ref) => {
        if (typeof ref === 'function') {
          ref(instance);
        } else if (ref) {
          ref.current = instance;
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, handleFocusRef]);

  const createHandleHiddenInputFocus =
    (otherHandlers) => (event: React.FocusEvent) => {
      console.log('FOCUS')
      const index = Number(event.currentTarget.getAttribute('data-index'));
      handleFocusVisible(event);
      if (isFocusVisibleRef.current === true) {
        setFocusedThumbIndex(index);
      }
      setOpen(index);
      otherHandlers?.onFocus?.(event);
    };
  const createHandleHiddenInputBlur =
    (otherHandlers) => (event: React.FocusEvent) => {
      handleBlurVisible();
      if (isFocusVisibleRef.current === false) {
        setFocusedThumbIndex(-1);
      }
      setOpen(-1);
      otherHandlers?.onBlur?.(event);
    };

  useEffect(() => {
    if (disabled && sliderRef.current!.contains(document.activeElement)) {
      // This is necessary because Firefox and Safari will keep focus
      // on a disabled element:
      // https://codesandbox.io/s/mui-pr-22247-forked-h151h?file=/src/App.js
      // @ts-ignore
      document.activeElement?.blur();
    }
  }, [disabled]);

  if (disabled && active !== -1) {
    setActive(-1);
  }
  if (disabled && focusedThumbIndex !== -1) {
    setFocusedThumbIndex(-1);
  }

  const createHandleHiddenInputChange =
    (otherHandlers) => (event: React.ChangeEvent) => {

      otherHandlers.onChange?.(event);

      const index = Number(event.currentTarget.getAttribute('data-index'));
      const value = values[index];
      const marksIndex = marksValues.indexOf(value);

      // @ts-ignore
      let newValue = event.target.valueAsNumber;

      if (marks && step == null) {
        const maxMarksValue = marksValues[marksValues.length - 1];
        if (newValue > maxMarksValue) {
          newValue = maxMarksValue;
        } else if (newValue < marksValues[0]) {
          newValue = marksValues[0];
        } else {
          newValue = newValue < value ? marksValues[marksIndex - 1] : marksValues[marksIndex + 1];
        }
      }

      newValue = clamp(newValue, min, max);

      if (range) {
        // Bound the new value to the thumb's neighbours.
        if (disableSwap) {
          newValue = clamp(newValue, values[index - 1] || -Infinity, values[index + 1] || Infinity);
        }

        const previousValue = newValue;
        newValue = setValueIndex({
          values,
          newValue,
          index,
        });

        let activeIndex = index;

        // Potentially swap the index if needed.
        if (!disableSwap) {
          activeIndex = newValue.indexOf(previousValue);
        }

        focusThumb({ sliderRef, activeIndex });
      }

      setValueState(newValue);
      setFocusedThumbIndex(index);

      if (handleChange && !areValuesEqual(newValue, valueDerived)) {
        handleChange(event, newValue, index);
      }

      if (onChangeCommitted) {
        onChangeCommitted(event, newValue);
      }
    };

  const previousIndex = React.useRef<number>();
  let axis = orientation;

  const getFingerNewValue = ({
    finger,
    move = false,
  }: {
    finger: { x: number; y: number };
    move?: boolean;
  }) => {
    const { current: slider } = sliderRef;
    const { width, height, bottom, left } = slider!.getBoundingClientRect();
    let percent;

    if (axis.indexOf('vertical') === 0) {
      percent = (bottom - finger.y) / height;
    } else {
      percent = (finger.x - left) / width;
    }

    if (axis.indexOf('-reverse') !== -1) {
      percent = 1 - percent;
    }

    let newValue;

    newValue = (max - min) * percent + min;
    if (step) {
      const nearest = Math.round((newValue - min) / step) * step + min;
      newValue = Number(nearest.toFixed(step));
    } else {
      const { index: closestIndex } = marksValues.reduce(
        (acc, value: number, index: number) => {
          const distance = Math.abs(newValue - value);

          if (acc === null || distance < acc.distance || distance === acc.distance) {
            return {
              distance,
              index,
            };
          }

          return acc;
        },
        null,
      ) ?? {};

      newValue = marksValues[closestIndex!];
    }

    newValue = clamp(newValue, min, max);
    let activeIndex = 0;

    if (range) {
      if (!move) {
        const { index } = values.reduce(
          (acc, value: number, index: number) => {
            const distance = Math.abs(newValue - value);

            if (acc === null || distance < acc.distance || distance === acc.distance) {
              return {
                distance,
                index,
              };
            }

            return acc;
          },
          null,
        ) ?? {};
        activeIndex = index
      } else {
        activeIndex = previousIndex.current!;
      }

      // Bound the new value to the thumb's neighbours.
      if (disableSwap) {
        newValue = clamp(
          newValue,
          values[activeIndex - 1] || -Infinity,
          values[activeIndex + 1] || Infinity,
        );
      }

      const previousValue = newValue;
      newValue = setValueIndex({
        values,
        newValue,
        index: activeIndex,
      });

      // Potentially swap the index if needed.
      if (!(disableSwap && move)) {
        activeIndex = newValue.indexOf(previousValue);
        previousIndex.current = activeIndex;
      }
    }

    return { newValue, activeIndex };
  };

  const handleTouchMove = useEventCallback((nativeEvent: TouchEvent | MouseEvent) => {
    const finger = trackFinger(nativeEvent, touchId);

    if (!finger) {
      return;
    }

    moveCount.current += 1;

    // Cancel move in case some other element consumed a mouseup event and it was not fired.
    // @ts-ignore buttons doesn't not exists on touch event
    if (nativeEvent.type === 'mousemove' && nativeEvent.buttons === 0) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handleTouchEnd(nativeEvent);
      return;
    }

    const { newValue, activeIndex } = getFingerNewValue({
      finger,
      move: true,
    });

    focusThumb({ sliderRef, activeIndex, setActive });
    setValueState(newValue);
    const INTENTIONAL_DRAG_COUNT_THRESHOLD = 2
    if (!dragging && moveCount.current > INTENTIONAL_DRAG_COUNT_THRESHOLD) {
      setDragging(true);
    }

    if (handleChange && !areValuesEqual(newValue, valueDerived)) {
      handleChange(nativeEvent, newValue, activeIndex);
    }
  });

  const handleTouchEnd = useEventCallback((nativeEvent: TouchEvent | MouseEvent) => {
    const finger = trackFinger(nativeEvent, touchId);
    setDragging(false);

    if (!finger) {
      return;
    }

    const { newValue } = getFingerNewValue({ finger, move: true });

    setActive(-1);
    if (nativeEvent.type === 'touchend') {
      setOpen(-1);
    }

    if (onChangeCommitted) {
      onChangeCommitted(nativeEvent, newValue);
    }

    touchId.current = undefined;

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    stopListening();
  });

  const handleTouchStart = useEventCallback((nativeEvent: TouchEvent) => {
    if (disabled) {
      return;
    }

    const touch = nativeEvent.changedTouches[0];
    if (touch != null) {
      // A number that uniquely identifies the current finger in the touch session.
      touchId.current = touch.identifier;
    }
    const finger = trackFinger(nativeEvent, touchId);
    if (finger !== false) {
      const { newValue, activeIndex } = getFingerNewValue({ finger });
      focusThumb({ sliderRef, activeIndex, setActive });

      setValueState(newValue);

      if (handleChange && !areValuesEqual(newValue, valueDerived)) {
        handleChange(nativeEvent, newValue, activeIndex);
      }
    }

    moveCount.current = 0;
    const doc = (sliderRef.current && sliderRef.current.ownerDocument) || document;
    doc.addEventListener('touchmove', handleTouchMove);
    doc.addEventListener('touchend', handleTouchEnd);
  });

  const stopListening = React.useCallback(() => {
    const doc = (sliderRef.current && sliderRef.current.ownerDocument) || document;
    doc.removeEventListener('mousemove', handleTouchMove);
    doc.removeEventListener('mouseup', handleTouchEnd);
    doc.removeEventListener('touchmove', handleTouchMove);
    doc.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchEnd, handleTouchMove]);


  React.useEffect(() => {
    const { current: slider } = sliderRef;
    // slider!.addEventListener('touchstart', handleTouchStart, {
    //   passive: true,
    // });

    return () => {
      // @ts-ignore
      slider!.removeEventListener('touchstart', handleTouchStart);

      stopListening();
    };
  }, [stopListening, handleTouchStart]);

  React.useEffect(() => {
    if (disabled) {
      stopListening();
    }
  }, [disabled, stopListening]);

  const createHandleMouseDown =
    (otherHandlers) => (event: React.MouseEvent<HTMLSpanElement>) => {
      otherHandlers.onMouseDown?.(event);
      if (disabled) {
        return;
      }

      if (event.defaultPrevented) {
        return;
      }

      // Only handle left clicks
      if (event.button !== 0) {
        return;
      }

      // Avoid text selection
      event.preventDefault();
      const finger = trackFinger(event, touchId);
      if (finger !== false) {
        const { newValue, activeIndex } = getFingerNewValue({ finger });
        focusThumb({ sliderRef, activeIndex, setActive });

        setValueState(newValue);

        if (handleChange && !areValuesEqual(newValue, valueDerived)) {
          handleChange(event, newValue, activeIndex);
        }
      }

      moveCount.current = 0;
      const doc = (sliderRef.current && sliderRef.current.ownerDocument) || document;
      doc.addEventListener('mousemove', handleTouchMove);
      doc.addEventListener('mouseup', handleTouchEnd);
    };


  const trackOffset = ((range ? values[0] : min - min) * 100) / (max - min);
  const trackLeap = ((values[values.length - 1] - min) * 100) / (max - min) - trackOffset;


  const getRootProps = <ExternalProps extends Record<string, unknown> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ) => {
    const externalHandlers = {};

    Object.keys(externalProps)
      .filter(
        (prop) =>
          prop.match(/^on[A-Z]/) && typeof externalProps[prop] === 'function' && ![].includes(prop),
      )
      .forEach((prop) => {
        externalHandlers[prop] = externalProps[prop];
      });

    const ownEventHandlers = {
      onMouseDown: createHandleMouseDown(externalHandlers || {}),
    };

    const mergedEventHandlers = {
      ...externalHandlers,
      ...ownEventHandlers,
    };

    return {
      ...externalProps,
      ref: handleRef,
      ...mergedEventHandlers,
    };
  };

  const createHandleMouseOver =
    (otherHandlers) => (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      otherHandlers.onMouseOver?.(event);

      const index = Number(event.currentTarget.getAttribute('data-index'));
      setOpen(index);
    };

  const createHandleMouseLeave =
    (otherHandlers) => (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      otherHandlers.onMouseLeave?.(event);

      setOpen(-1);
    };

  const getThumbProps = <ExternalProps extends Record<string, unknown> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ) => {
    const externalHandlers = {};

    Object.keys(externalProps)
      .filter(
        (prop) =>
          prop.match(/^on[A-Z]/) && typeof externalProps[prop] === 'function' && ![].includes(prop),
      )
      .forEach((prop) => {
        externalHandlers[prop] = externalProps[prop];
      });

    const ownEventHandlers = {
      onMouseOver: createHandleMouseOver(externalHandlers || {}),
      onMouseLeave: createHandleMouseLeave(externalHandlers || {}),
    };

    return {
      ...externalProps,
      ...externalHandlers,
      ...ownEventHandlers,
    };
  };

  const getThumbStyle = (index: number) => {
    return {
      // So the non active thumb doesn't show its label on hover.
      pointerEvents: active !== -1 && active !== index ? 'none' : undefined,
    };
  };

  const getHiddenInputProps = <ExternalProps extends Record<string, unknown> = {}>(
    externalProps: ExternalProps = {} as ExternalProps,
  ) => {
    const externalHandlers = {
      onChange: (e) => { console.log(e) }
    };

    Object.keys(externalProps)
      .filter(
        (prop) =>
          prop.match(/^on[A-Z]/) && typeof externalProps[prop] === 'function' && ![].includes(prop),
      )
      .forEach((prop) => {
        externalHandlers[prop] = externalProps[prop];
      });
    console.log('HANDLE CHANGE', externalHandlers)
    const ownEventHandlers = {
      onChange: createHandleHiddenInputChange(externalHandlers || {}),
      onFocus: createHandleHiddenInputFocus(externalHandlers || {}),
      onBlur: createHandleHiddenInputBlur(externalHandlers || {}),
    };

    const mergedEventHandlers = {
      ...externalHandlers,
      ...ownEventHandlers,
    };

    return {
      tabIndex,
      'aria-labelledby': `Label 1234`,
      'aria-orientation': orientation,
      'aria-valuemax': max,
      'aria-valuemin': min,
      name,
      type: 'range',
      min: parameters.min,
      max: parameters.max,
      step: parameters.step === null && parameters.marks ? 'any' : parameters.step ?? undefined,
      disabled,
      ...externalProps,
      ...mergedEventHandlers,
      style: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        // whiteSpace: 'nowrap',
        // height: '1px',
        // width: '1px',
        // So that VoiceOver's focus indicator matches the thumb's dimensions
        width: '100%',
        height: '100%',
      },
    };
  };

  return {
    active,
    axis: axis,
    axisProps: {
      horizontal: {
        offset: (percent: number) => ({ left: `${percent}%` }),
        leap: (percent: number) => ({ width: `${percent}%` }),
      },
      'horizontal-reverse': {
        offset: (percent: number) => ({ right: `${percent}%` }),
        leap: (percent: number) => ({ width: `${percent}%` }),
      },
      vertical: {
        offset: (percent: number) => ({ bottom: `${percent}%` }),
        leap: (percent: number) => ({ height: `${percent}%` }),
      },
    },
    dragging,
    focusedThumbIndex,
    getHiddenInputProps,
    getRootProps,
    getThumbProps,
    marks: marks,
    open,
    range,
    rootRef: handleRef,
    trackLeap,
    trackOffset,
    values,
    getThumbStyle,
  };
}
type SliderProps = {
  size?: 'small' | 'medium' | 'large';
  orientation?: 'horizontal' | 'vertical';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'DEFAULT';
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  name?: string;
  marks?: boolean
}
const Slider = forwardRef<HTMLSpanElement, SliderProps>((props, ref) => {
  const { size = "medium", orientation = "horizontal", min = 0, max = 100, step = 1, marks: marksProp = false } = props

  let openProp = false
  let markActive = false;
  // TODO: add disabled and error classes
  const SliderClass = {
    root: clsx("rounded-xl inline-block box-content relative cursor-pointer mb-5 text-pea-400 touch-none", {
      "w-full h-1 py-3": orientation === 'horizontal',
      "height-full w-1 px-3": orientation === 'vertical',
    }),
    rail: clsx("block absolute rounded-[inherit] opacity-30 bg-current", {
      "w-full h-[inherit] top-1/2 -translate-y-1/2": orientation === 'horizontal',
      "h-full w-[inherit] left-1/2 -translate-x-1/2": orientation === 'vertical',
    }),
    track: clsx("block absolute rounded-[inherit] border border-current bg-current transition-transform", {
      "border-none": size === 'small',
      "h-[inherit] top-1/2 -translate-y-1/2": orientation === 'horizontal',
      "w-[inherit] left-1/2 -translate-x-1/2": orientation === 'vertical'
    }),
    thumb: clsx("absolute w-5 h-5 rounded-[50%] bg-current flex items-center justify-center box-border hover:shadow-md",
      "before:absolute before:content-[''] before:rounded-[inherit] before:w-full before:h-full before:shadow",
      "after:absolute after:content-[''] after:rounded-[50%] after:w-10 after:h-10 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2",
      {
        "w-3 h-3 before:shadow-none": size === 'small',
        "top-1/2 -translate-y-1/2 -translate-x-1/2": orientation === 'horizontal',
        "left-1/2 -translate-x-1/2 translate-y-1/2": orientation === 'vertical'
      }
    ),
    valueLabel: clsx(`absolute bg-zinc-500 rounded-sm flex items-center justify-center z-10`, {
      [`transform ${orientation === 'horizontal' ? '-translate-y-full' : '-translate-y-1/2'} scale-100`]: openProp,
      "-top-2.5 origin-bottom before:absolute before:content-[''] before:w-2 before:h-2 before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45 before:bg-inherit before:bottom-0 before:left-1/2": orientation === 'horizontal',
      [`${size === 'small' ? 'right-5' : size === 'medium' ? 'right-7' : 'right-9'} origin-right top-1/2 before:absolute before:content-[''] before:w-2 before:h-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:bg-inherit before:-right-2 before:top-1/2`]: orientation === 'vertical',
      "text-xs py-1 px-2": size === 'small',
      "px-3 py-1": size === 'medium',
      "": size === 'large'
    }),
    sliderMark: clsx("absolute w-0.5 h-0.5 rounded-sm bg-current", {
      "top-1/2 -translate-x-px -translate-y-1/2": orientation === 'horizontal',
      "left-1/2 -translate-x-1/2 -translate-y-px": orientation === 'vertical',
      "bg-pea-600 opacity-80": markActive
    }),
    sliderMarkLabel: clsx("text-zinc-300 absolute whitespace-nowrap", {
      "top-7 -translate-x-1/2": orientation === 'horizontal',
      "left-9 translate-y-1/2": orientation === 'vertical',
      "dark:text-white text-black": markActive,
    })
  }
  const [value, setValue] = useState(50);
  const inputRef = useRef(null);
  const handleChange = (event) => {
    console.log('HANDLECHAN', event.target.value)
    setValue(event.target.value);
  };
  const handleThumbClick = () => {
    if (inputRef.current) {
      console.log('focus')
      inputRef.current.focus();
    }
  };

  const ownerState = {
    ...props,
    max,
    min,
    classes: {},
    disabled: false,
    disableSwap: false,
    orientation,
    marks: marksProp,
    color: 'primary',
    size,
    step,
    scale: 1,
    track: true,
    valueLabelDisplay: 'off',
    valueLabelFormat: (x) => x,
  };

  const {
    axisProps,
    getRootProps,
    getHiddenInputProps,
    getThumbProps,
    open,
    active,
    axis,
    focusedThumbIndex,
    range,
    dragging,
    marks,
    values,
    trackOffset,
    trackLeap,
    getThumbStyle,
  } = useSlider({ ...ownerState, rootRef: ref });
  console.log('DRAGGING', open, dragging, range, values)
  return (
    <>
      <span className={SliderClass.root} {...getRootProps}>
        <span className={SliderClass.rail} />
        <span className={SliderClass.track} style={{
          ...axisProps[axis].offset(trackOffset),
          ...axisProps[axis].leap(trackLeap),
        }} />
        {marks
          .filter((mark) => mark.value >= min && mark.value <= max)
          .map((mark, index) => {

            const percent = ((mark.value - min) * 100) / (max - min);
            const style = axisProps[axis].offset(percent);

            let markActive;
            let track = !!openProp
            if (track === false) {
              markActive = values.indexOf(mark.value) !== -1;
            } else {
              markActive =
                (range
                  ? mark.value >= values[0] && mark.value <= values[values.length - 1]
                  : mark.value <= values[0]);
            }

            return (
              <React.Fragment key={index}>
                <span
                  data-index={index}
                  // {...markProps}
                  // {...(!isHostComponent(MarkSlot) && {
                  //   markActive,
                  // })}
                  style={{ ...style }}
                  className={clsx(SliderClass.sliderMarkLabel, {
                    "!text-red-500": markActive,
                  })}
                />
                {mark.label != null ? (
                  <span
                    aria-hidden
                    data-index={index}
                    // {...markLabelProps}
                    // {...(!isHostComponent(MarkLabelSlot) && {
                    //   markLabelActive: markActive,
                    // })}
                    style={{ ...style }}
                    className={clsx(SliderClass.sliderMarkLabel, {
                      "!text-red-500": markActive,
                    })}
                  >
                    {mark.label}
                  </span>
                ) : null}
              </React.Fragment>
            );
          })}
        {values.map((value, index) => {

          const percent = ((value - min) * 100) / (max - min) + 50;
          const style = axisProps[axis].offset(percent);
          return (
            /* TODO v6: Change component structure. It will help in avoiding the complicated React.cloneElement API added in SliderValueLabel component. Should be: Thumb -> Input, ValueLabel. Follow Joy UI's Slider structure. */
            <span
              className={SliderClass.valueLabel}
              key={index}
              {...{
                valueLabelFormat: ownerState.valueLabelFormat,
                valueLabelDisplay: ownerState.valueLabelDisplay,
                value: ownerState.valueLabelFormat,
                index,
                open: open === index || active === index || ownerState.valueLabelDisplay === 'on',
                disabled: false,
              }}
            // {...valueLabelProps}
            >
              <span
                data-index={index}
                {...getThumbProps()}
                className={clsx(SliderClass.thumb, {
                  "ring-1 ring-red-500": active === index,
                  "bg-red-500": focusedThumbIndex === index,
                })}
                style={{
                  ...style,
                  ...getThumbStyle(index),
                  // ...thumbProps.style,
                }}
              >
                <input
                  // style={{
                  //   clip: `rect(0px, 0px, 0px, 0px)`,
                  //   height: '100%',
                  //   width: '100%',
                  //   padding: '0px',
                  //   border: '0px',
                  //   position: 'absolute',
                  //   whiteSpace: 'nowrap',
                  //   overflow: 'hidden',
                  //   direction: 'ltr',
                  //   margin: '-1px',
                  // }}
                  data-index={index}
                  aria-label={`Label ${index}`}
                  aria-valuenow={value}
                  aria-labelledby={`Label ${index}`}
                  aria-valuetext={
                    `Label ${index}`
                  }
                  value={values[index]}
                  {...getHiddenInputProps()}
                />
              </span>
            </span>
            // <span
            //   key={index}
            //   data-index={index}
            //   {...getThumbProps()}
            //   className={clsx(SliderClass.thumb, {
            //     "ring-1 ring-red-500": active === index,
            //     "ring ring-pea-500": focusedThumbIndex === index,
            //   })}
            //   style={{
            //     ...style,
            //     ...getThumbStyle(index),
            //   }}
            // >
            //   <input
            //     data-index={index}
            //     aria-label={`Label ${index}`}
            //     aria-valuenow={value}
            //     aria-labelledby={`Label ${index}`}
            //     aria-valuetext={
            //       `Label ${index}`
            //     }
            //     value={values[index]}
            //     style={{
            //       ...getHiddenInputProps().style,
            //       position: 'absolute',
            //       whiteSpace: 'nowrap'
            //     }}
            //     onChange={(e) => {
            //       console.log('ONCHANGEEEE')
            //       getHiddenInputProps().onChange(e)
            //     }}
            //     {...getHiddenInputProps()}
            //   />
            // </span>
          );
        })}
      </span>
    </>
  )
})
interface GTWPageProps {
  error: RWGqlError;
  loading: boolean;
}
const GtwPage = (props: GTWPageProps) => {
  // TODO: Replace with data from db
  const ArkDinos = [
    "Ankylosaurus",
    "Argentavis",
    "Arthropluera",
    "Baryonyx",
    "Beelzebufo",
    "Brontosaurus",
    "Carbonemys",
    "Castoroides",
    "Carnotaurus",
    "Compy",
    "Daeodon",
    "Dilophosaurus",
    "Dimetrodon",
    "Diplocaulus",
    "Diplodocus",
    "Doedicurus",
    "Dodo",
    "Dung Beetle",
    "Equus",
    "Gallimimus",
    "Giganotosaurus",
    "Gigantopithecus",
    "Glowtail",
    "Dragon",
    "Gryphon",
    "Hesperornis",
    "Ichthyornis",
    "Iguanodon",
    "Kairuku",
    "Karkinos",
    "Kaprosuchus",
    "Megachelon",
    "Megalania",
    "Megaloceros",
    "Megalodon",
    "Megatherium",
    "Moschops",
    "Oviraptor",
    "Paraceratherium",
    "Pegomastax",
    "Plesiosaur",
    "Parasaur",
    "Polar Bear",
    "Procoptodon",
    "Pteranodon",
    "Pulmonoscorpius",
    "Quetzal",
    "Raptor",
    "Rex",
    "Rock Drake",
    "Sabertooth",
    "Sarco",
    "Sarcosuchus",
    "Spino",
    "Stegosaurus",
    "Therizinosaurus",
    "Thorny Dragon",
    "Titanoboa",
    "Titanosaur",
    "Triceratops",
    "Troodon",
    "Tusoteuthis",
    "Tyrannosaurus",
    "Velonasaur",
    "Woolly Rhino",
    "Wyvern",
    "Yutyrannus",
    "Ankylo",
    "Desmodus",
    "Fenrir",
    "Araneo",
    "Gacha",
    "Mantis",
    "Megalosaurus",
    "Ovis",
    "Pachy",
    "Pachyrhinosaurus",
    "Purlovia",
    "Scout",
    "Bulbdog",
    "Cnidaria",
    "Dunkleosteus",
    "Eurypterid",
    "Ichthyosaurus",
    "Liopleurodon",
    "Lystrosaurus",
    "Mammoth",
    "Manta",
    "Mosasaurus",
    "Onyc",
    "Pachycephalosaurus",
    "Astrocetus",
    "Basilosaurus",
    "Astrodelphis",
    "Fjordhawk",
    "Featherlight",
    "Gasbags",
    "Dimorphodon",
    "Snow Owl",
    "Sinomacrops",
    "Phoenix",
    "Tapejara",
    "Titanomyrma",
    "Pelagornis",
    "Griffin",
    "Vulture",
    "Angler",
    "Electrophorus",
    "Piranha",
    "Otter",
    "Ichtyosaurus",
    "Trilobite",
    "Leedsichthys",
    "Lamprey",
    "Ammonite",
    "Amargasaurus",
    "Allosaurus",
    "Achatina",
    "Andrewsarchus",
    "Beezlebufo",
    "Bloodstalker",
    "Dilophosaur",
    "Enforcer",
    "Giant Bee",
    "Chalicotherium",
    "Deinonychus",
    "Dinopithecus",
    "Jerboa",
    "Hyaenodon",
    "Ferox",
    "Direbear",
    "Kentrosaurus",
    "Maewing",
    "Nameless",
    "Phiomia",
    "Sabertooth Salmon",
    "Spinosaur",
    "Shinehorn",
    "Thylacoleo",
    "Rollrat",
    "Terrorbird",
    "Reaper",
    "Seeker",
    "Shadowmane",
    "Ravager",
    "Rockelemental",
    "Therezinosaurus",
    "Unicorn",
    "Yeti",
    "Deathworm",
    "Mesopithecus",
    "Mek",
    "Morellatops",
    "Noglin",
    "Leech",
    "Moeder",
    "Voidwyrm",
    "Lymantria",
    "Archaeopteryx",
  ];

  const sameLetters = (str1: string, str2: string) => {
    if (str1.length !== str2.length) return false;

    const obj1 = {};
    const obj2 = {};

    for (const letter of str1) {
      obj1[letter] = (obj1[letter] || 1) + 1;
    }
    for (const letter of str2) {
      obj2[letter] = (obj2[letter] || 1) + 1;
    }

    for (const key in obj1) {
      if (!obj2.hasOwnProperty(key)) return false;
      if (obj1[key] !== obj2[key]) return false;
    }
    return true;
  };

  const getWord = (word: string) => {
    return ArkDinos.filter((dino) => {
      if (sameLetters(dino.toLowerCase(), word.trim().toLowerCase())) {
        return dino;
      }
    });
  };

  const QUERY = gql`
    query GTWDinos {
      dinos {
        id
        name
      }
    }
  `;
  // useQuery(QUERY)
  const [word, setWord] = useState("");
  const handlechange = (e) => {
    setWord(e.target.value);

    if (getWord(e.target.value)[0] === undefined) return;
    toast.success("Copied to clipboard");
    navigator.clipboard.writeText(getWord(e.target.value)[0]);
  };

  function hasLetters(word: string, letters: string): boolean {
    // Convert the word and letters to lowercase to make the comparison case-insensitive
    word = word.toLowerCase();
    letters = letters.toLowerCase();

    // Loop through each letter in the letters string
    for (let i = 0; i < letters.length; i++) {
      // If the letter is not found in the word, return false
      if (word.indexOf(letters[i]) === -1) {
        return false;
      }
    }

    // If all letters are found in the word, return true
    return true;
  }
  const debouncedChangeHandler = useMemo(() => debounce(handlechange, 500), []);

  // MATRIX GRID
  // const ref = useRef<HTMLCanvasElement>(null);
  // useEffect(() => {
  //   if (ref.current) {
  //     const interval = 1000 / 60; // fps
  //     const noiseStr = 10;
  //     const row = 12;
  //     const simplex = new SimplexNoise3D(321);

  //     const ctx = ref.current.getContext("2d");
  //     const grids = [];
  //     class Grid {
  //       index: number;
  //       rowCount: number;
  //       ex: number;
  //       ey: number;
  //       size: number;
  //       boxSize: number;
  //       sx: number;
  //       sy: number;
  //       x: number;
  //       y: number;
  //       noise: number;
  //       sizePercent: number;
  //       constructor(index, rowCount) {
  //         this.index = index;
  //         this.rowCount = rowCount;

  //         this.ex = this.index % this.rowCount;
  //         this.ey = Math.floor(this.index / this.rowCount);
  //       }
  //       resize(canvasWidth, canvasHeight) {
  //         const minSize = Math.min(canvasWidth, canvasHeight);
  //         this.size = minSize / this.rowCount;
  //         this.boxSize = this.size * (0.3 + 0.7 * this.noise);

  //         this.sx = canvasWidth / 2 - minSize / 2;
  //         this.sy = canvasHeight / 2 - minSize / 2;

  //         this.x = this.sx + this.ex * this.size;
  //         this.y = this.sy + this.ey * this.size;
  //       }
  //       update(simplex: SimplexNoise3D, noiseStr, time) {
  //         this.noise =
  //           (simplex.noise(this.ex / noiseStr, this.ey / noiseStr, time) + 1) /
  //           2;
  //         this.sizePercent = 0.1 + 0.89 * this.noise;
  //         this.boxSize = this.size * this.sizePercent;
  //       }
  //       draw(ctx) {
  //         ctx.lineWidth = 1;
  //         ctx.strokeStyle = "#f1f1f1";
  //         ctx.fillStyle = "#191919";
  //         ctx.fillRect(this.x, this.y, this.size, this.size);
  //         ctx.strokeRect(this.x, this.y, this.size, this.size);

  //         ctx.fillStyle = `rgba(241, 241, 241, ${this.sizePercent})`;
  //         ctx.fillRect(this.x, this.y, this.boxSize, this.boxSize);
  //       }
  //     }
  //     function render() {
  //       let now, delta;
  //       let then = Date.now();
  //       function frame(timestamp) {
  //         requestAnimationFrame(frame);
  //         now = Date.now();
  //         delta = now - then;
  //         if (delta < interval) return;
  //         then = now - (delta % interval);

  //         ctx.clearRect(0, 0, ref.current.width, ref.current.height);

  //         ctx.save();
  //         ctx.translate(ref.current.width, ref.current.height);
  //         ctx.rotate(Math.PI);

  //         grids.forEach((grid) => {
  //           grid.resize(ref.current.width, ref.current.height);
  //           grid.update(simplex, noiseStr, timestamp * 0.0005);
  //           grid.draw(ctx);
  //         });

  //         ctx.restore();
  //       }
  //       requestAnimationFrame(frame);
  //     }
  //     for (let index = 0; index < Math.pow(row, 2); index++) {
  //       const grid = new Grid(index, row);
  //       grids.push(grid);
  //     }

  //     render();
  //   }
  // }, []);
  return (
    <>
      <MetaTags
        title="Guess the word"
        description="Type in random dino scabbled and get the solved word!"
      />

      <div className="container-xl m-3 text-center">
        {/* <FibonacciSphere
          animate={true}
          text={ArkDinos.filter((f) => hasLetters(f.toString(), word))}
          className="h-1/3 w-1/3 text-white"
        /> */}
        <div className="text-center">
          <h1 className="rw-label p-3 text-center text-2xl text-black dark:text-white">
            {getWord(word)}
          </h1>
        </div>
        <Form error={props.error} className="m-6 p-3 flex justify-center">
          <FormError
            error={props.error}
            wrapperClassName="rw-form-error-wrapper"
            titleClassName="rw-form-error-title"
            listClassName="rw-form-error-list"
          />

          <InputOutlined
            type="text"
            name="scrambledWord"
            label="Scrambled Dino Word"
            placeholder="Scrambled Word:"
            onInput={(event) => {
              debouncedChangeHandler(event);
            }}
          />
        </Form>

        <Slider />
        {/* <canvas ref={ref}></canvas> */}
      </div>
    </>
  );
};

export default GtwPage;
