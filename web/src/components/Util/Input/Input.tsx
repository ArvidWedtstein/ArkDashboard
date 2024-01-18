import {
  Controller,
  FieldError,
  RegisterOptions,
  useController,
} from "@redwoodjs/forms";
import clsx from "clsx";
import {
  Children,
  ComponentPropsWithRef,
  ElementType,
  Fragment,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { ButtonGroupButtonContext } from "../Button/Button";


function formControlState({ props, states, formControl }) {
  // for every prop in `states` that is undefined, set it with the value from formControlContext
  return states.reduce((acc, state) => {
    acc[state] = props[state];

    if (formControl) {
      if (typeof props[state] === "undefined") {
        acc[state] = formControl[state];
      }
    }

    return acc;
  }, {});
}
interface FormControlOwnProps {
  children?: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "DEFAULT";
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  focused?: boolean;
  margin?: "dense" | "normal" | "none";
  required?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "standard" | "outlined" | "contained";
  label?: ReactNode;
  shrink?: boolean;
  ownerState?: any;
}
interface OverridableTypeMap {
  props: {};
  defaultComponent: React.ElementType;
}
interface CommonProps {
  className?: string;
  style?: React.CSSProperties;
}
type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

interface FormControlTypeMap<
  AdditionalProps = {},
  RootComponent extends React.ElementType = "div"
> {
  props: AdditionalProps & FormControlOwnProps;
  ownerState?: {};
  defaultComponent: RootComponent;
}
type BaseProps<TypeMap extends OverridableTypeMap> = TypeMap["props"] &
  CommonProps;

type OverrideProps<
  TypeMap extends OverridableTypeMap,
  RootComponent extends React.ElementType
> = BaseProps<TypeMap> &
  DistributiveOmit<
    ComponentPropsWithRef<RootComponent>,
    keyof BaseProps<TypeMap>
  >;
type ContextFromPropsKey =
  | "color"
  | "disabled"
  | "error"
  | "fullWidth"
  | "margin"
  | "required"
  | "size"
  | "variant"
  | "label"
  | "shrink";

type FormControlProps<
  RootComponent extends ElementType = FormControlTypeMap["defaultComponent"],
  AdditionalProps = {}
> = OverrideProps<
  FormControlTypeMap<AdditionalProps, RootComponent>,
  RootComponent
> & {
  component?: ElementType;
};
interface FormControlContextValue
  extends Pick<FormControlProps, ContextFromPropsKey> {
  adornedStart: boolean;
  filled: boolean;
  focused: boolean;
  onBlur: (
    event?: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onFocus: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onEmpty: () => void;
  onFilled: () => void;
  setAdornedStart: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormControlContext = createContext<FormControlContextValue | undefined>(
  undefined
);
const useFormControl = (): FormControlContextValue | undefined =>
  useContext(FormControlContext);

export const FormControl = forwardRef<HTMLDivElement, FormControlProps>(
  (props, ref) => {
    const {
      children,
      className,
      color = "DEFAULT",
      disabled = false,
      error = false,
      focused: visuallyFocused,
      fullWidth = false,
      margin = "none",
      required = false,
      size = "medium",
      variant = "outlined",
      label,
      shrink,
      ownerState: ownerStateProp,
      ...other
    } = props;

    const ownerState = {
      ...props,
      color,
      disabled,
      error,
      fullWidth,
      margin,
      required,
      size,
      label,
      variant,
      shrink,
    };

    const [adornedStart, setAdornedStart] = useState(() => {
      let initialAdornedStart = false;

      if (children) {
        Children.forEach(children, (child) => {
          if (!isValidElement(child)) {
            return;
          }

          const input = isValidElement(child) ? child.props.input : child;

          if (input && input.props.startAdornment) {
            initialAdornedStart = true;
          }
        });
      }
      return initialAdornedStart;
    });

    const [filled, setFilled] = useState(() => {
      let initialFilled = false;

      if (children) {
        Children.forEach(children, (child) => {
          if (!isValidElement(child)) {
            return;
          }

          if (
            (child.props &&
              ((child.props.value != null &&
                !(
                  Array.isArray(child.props.value) &&
                  child.props.value.length === 0
                ) &&
                child.props.value !== "") ||
                (child.props.defaultValue != null &&
                  !(
                    Array.isArray(child.props.defaultValue) &&
                    child.props.defaultValue.length === 0
                  ) &&
                  child.props.defaultValue !== ""))) ||
            (child.props.inputProps &&
              ((child.props.inputProps.value != null &&
                !(
                  Array.isArray(child.props.inputProps.value) &&
                  child.props.inputProps.value.length === 0
                ) &&
                child.props.inputProps.value !== "") ||
                (child.props.inputProps.defaultValue != null &&
                  !(
                    Array.isArray(child.props.inputProps.defaultValue) &&
                    child.props.inputProps.defaultValue.length === 0
                  ) &&
                  child.props.inputProps.defaultValue !== "")))
          ) {
            initialFilled = true;
          }
        });
      }

      return initialFilled;
    });

    const [focusedState, setFocused] = useState(false);
    if (disabled && focusedState) {
      setFocused(false);
    }

    const focused =
      visuallyFocused !== undefined && !disabled
        ? visuallyFocused
        : focusedState;

    const childContext = useMemo(() => {
      return {
        adornedStart,
        setAdornedStart,
        color,
        disabled,
        error,
        filled,
        focused,
        fullWidth,
        size,
        required,
        variant,
        label,
        shrink,
        onBlur: () => {
          setFocused(false);
        },
        onEmpty: () => {
          setFilled(false);
        },
        onFilled: () => {
          setFilled(true);
        },
        onFocus: () => {
          setFocused(true);
        },
      };
    }, [
      adornedStart,
      color,
      disabled,
      error,
      filled,
      focused,
      fullWidth,
      required,
      size,
      variant,
    ]);

    return (
      <FormControlContext.Provider value={childContext}>
        <div
          className={clsx(
            "relative m-0 inline-flex min-w-0 flex-col p-0 align-top text-black dark:text-white",
            {
              "w-full": fullWidth,
              "max-w-sm": !fullWidth,
              "mt-4 mb-2": ownerState.margin === "normal",
              "mt-2 mb-1": ownerState.margin === "dense",
            },
            className
          )}
          ref={ref}
          {...other}
        >
          {children}
        </div>
      </FormControlContext.Provider>
    );
  }
);

export type InputLabelProps = {
  color?: "primary" | "secondary" | "warning" | "success" | "error" | "DEFAULT";
  variant?: "outlined" | "contained" | "standard";
  className?: string;
  shrink?: boolean;
  disabled?: boolean;
  required?: boolean;
  disableAnimation?: boolean;
  children?: ReactNode;
} & LabelHTMLAttributes<HTMLLabelElement>;
export const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(
  (props, ref) => {
    const {
      disableAnimation = false,
      shrink: shrinkProp,
      variant,
      required,
      className,
      color,
      children,
      ...other
    } = props;

    const labelSize = {
      outlined: {
        small: {
          close: `max-w-[calc(100%-24px)] translate-x-3.5 translate-y-2 scale-100`,
          open: `scale-75 translate-x-3.5 -translate-y-[9px] max-w-[calc(133%-32px)] pointer-events-auto`,
        },
        medium: {
          close: `max-w-[calc(100%-24px)] translate-x-3.5 translate-y-4 scale-100`,
          open: `scale-75 translate-x-3.5 -translate-y-[9px] max-w-[calc(133%-32px)] pointer-events-auto`,
        },
        large: {
          close: `max-w-[calc(100%-24px)] translate-x-3.5 translate-y-6 scale-100`,
          open: `scale-75 translate-x-3.5 -translate-y-[9px] max-w-[calc(133%-32px)] pointer-events-auto`,
        },
      },
      contained: {
        small: {
          close: `max-w-[calc(100%-24px)] translate-x-3 translate-y-3 scale-100`,
          open: `scale-75 translate-x-3 translate-y-1 max-w-[calc(133%-24px)] pointer-events-auto`,
        },
        medium: {
          close: `max-w-[calc(100%-24px)] translate-x-3 translate-y-4 scale-100`,
          open: `scale-75 translate-x-3 translate-y-[7px] max-w-[calc(133%-24px)] pointer-events-auto`,
        },
        large: {
          close: `max-w-[calc(100%-24px)] translate-x-3 translate-y-5 scale-100`,
          open: `scale-75 translate-x-3 translate-y-3 max-w-[calc(133%-24px)] pointer-events-auto`,
        },
      },
      standard: {
        small: {
          close: `max-w-[100%] translate-x-0 translate-y-4 scale-100`,
          open: `scale-75 translate-x-0 -translate-y-[1.5px] max-w-[133%]`,
        },
        medium: {
          close: `max-w-[100%] translate-x-0 translate-y-5 scale-100`,
          open: `scale-75 translate-x-0 -translate-y-[1.5px] max-w-[133%]`,
        },
        large: {
          close: `max-w-[100%] translate-x-0 translate-y-6 scale-100`,
          open: `scale-75 translate-x-0 -translate-y-[1.5px] max-w-[133%]`,
        },
      },
    };
    const colors = {
      primary: `text-primary-400`,
      secondary: `text-secondary-500`,
      success: `text-success-500`,
      error: `text-error-500`,
      warning: `text-warning-400`,
      disabled: `dark:text-white/50 text-black/50`,
      DEFAULT: `dark:text-white text-black`,
      DEFAULTNOFOCUS: `dark:text-white/70 text-black/70`,
    };

    const labelClasses = {
      outlined: `text-base leading-6 p-0 block origin-top-left whitespace-nowrap overflow-hidden text-ellipsis absolute left-0 top-0 z-10 pointer-events-none select-none transition-transform`,
      contained: `text-base leading-6 p-0 block origin-top-left whitespace-nowrap overflow-hidden text-ellipsis absolute left-0 top-0 z-10 pointer-events-none select-none transition-transform`,
      standard: `text-base leading-6 p-0 block origin-top-left whitespace-nowrap overflow-hidden text-ellipsis absolute left-0 top-0 transition-transform`,
    };

    const formControl = useFormControl();
    let shrink = shrinkProp;
    if (typeof shrink === "undefined" && formControl) {
      shrink =
        formControl.filled || formControl.focused || formControl.adornedStart;
    }

    const fcs = formControlState({
      props,
      formControl,
      states: ["size", "variant", "required", "focused", "error", "color"],
    });

    const state = {
      ...props,
      disableAnimation,
      formControl,
      shrink,
      size: formControl.size || "medium",
      disabled: formControl.disabled || props.disabled,
      required: formControl.required || required,
      focused: formControl.focused,
      variant: formControl.variant || variant,
      error: formControl.error,
    };

    const kids = state.required ? (
      <Fragment>
        {children}
        &thinsp;{"*"}
      </Fragment>
    ) : (
      children
    );

    formControl.label = kids;
    formControl.shrink = shrink;

    const { size, focused, disabled } = state;

    return (
      <label
        data-shrink={shrink}
        aria-disabled={disabled}
        className={clsx(
          labelClasses[state.variant],
          labelSize[state.variant][size][shrink || focused ? "open" : "close"],
          className,
          colors[
          state.error
            ? "error"
            : disabled
              ? "disabled"
              : focused
                ? fcs.color || color
                : "DEFAULTNOFOCUS"
          ]
        )}
        ref={ref}
        children={kids}
        {...other}
      />
    );
  }
);

export type InputBaseProps = {
  className?: string;
  "aria-describedby"?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "DEFAULT";
  variant?: "outlined" | "contained" | "standard";
  defaultValue?: string | number | readonly string[];
  disabled?: boolean;
  endAdornment?: React.ReactNode;
  endAdornmentProps?: HTMLAttributes<HTMLDivElement>;
  error?: boolean;
  fullWidth?: boolean;
  id?: string;
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   */
  // inputProps?: React.DetailedHTMLProps<HTMLAttributes<HTMLInputElement> | HTMLAttributes<HTMLTextAreaElement>, HTMLInputElement | HTMLTextAreaElement> & {
  inputProps?: HTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
    [arbitrary: string]: any;
  };
  inputRef?: React.Ref<any>;
  margin?: "dense" | "normal" | "none";
  multiline?: boolean;
  name?: string;
  label?: ReactNode;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
  onKeyUp?: React.KeyboardEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onInvalid?: React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  renderTags?: ReactNode | ReactNode[];
  renderSuffix?: (state: {
    disabled?: boolean;
    error?: boolean;
    filled?: boolean;
    focused?: boolean;
    margin?: "dense" | "none" | "normal";
    required?: boolean;
    startAdornment?: React.ReactNode;
  }) => ReactNode;
  rows?: number;
  min?: string | number;
  max?: string | number;
  maxRows?: string | number;
  minRows?: string | number;
  size?: "small" | "medium" | "large";
  startAdornment?: ReactNode;
  startAdornmentProps?: HTMLAttributes<HTMLDivElement>;
  type?: string;
  value?: unknown;
};
export const InputBase = forwardRef<HTMLDivElement, InputBaseProps>(
  (props, ref) => {
    const {
      "aria-describedby": ariaDescribedby,
      autoComplete,
      autoFocus,
      className,
      color,
      defaultValue,
      disabled,
      endAdornment,
      endAdornmentProps,
      error,
      fullWidth = false,
      id,
      inputProps: inputPropsProp = {},
      inputRef: inputRefProp,
      margin,
      maxRows,
      minRows,
      multiline = false,
      name,
      onBlur,
      onChange,
      onClick,
      onFocus,
      onKeyDown,
      onKeyUp,
      onInvalid,
      placeholder,
      readOnly,
      required,
      renderTags,
      renderSuffix,
      rows,
      size,
      startAdornment,
      startAdornmentProps,
      type = "text",
      value: valueProp,
      variant,
      min,
      max,
      ...other
    } = props;

    const buttonGroupButtonContextPositionClassName = useContext(
      ButtonGroupButtonContext
    );

    const inputRef = useRef();
    const [focused, setFocused] = useState(false);
    const formControl = useFormControl();

    const value =
      inputPropsProp.value != null ? inputPropsProp.value : valueProp;
    const { current: isControlled } = useRef(value != null);

    const onFilled = formControl && formControl.onFilled;
    const onEmpty = formControl && formControl.onEmpty;

    const checkDirty = useCallback(
      (obj) => {
        if (
          obj &&
          obj.value != null &&
          !(Array.isArray(obj.value) && obj.value.length === 0) &&
          obj.value !== ""
        ) {
          if (onFilled) {
            onFilled();
          }
        } else if (onEmpty) {
          onEmpty();
        }
      },
      [onFilled, onEmpty]
    );

    const handleInputRef = useMemo(() => {
      if (
        [
          inputRef,
          inputRefProp,
          inputPropsProp.ref,
        ].every((ref) => ref == null)
      ) {
        return null;
      }

      return (instance) => {
        [
          inputRef,
          inputRefProp,
          inputPropsProp.ref,
        ].forEach((ref) => {
          if (typeof ref === "function") {
            ref(instance);
          } else if (ref) {
            ref.current = instance;
          }
        });
      };
    }, [inputRef, inputRefProp, inputPropsProp.ref]);

    const fcs = formControlState({
      props,
      formControl,
      states: [
        "color",
        "disabled",
        "error",
        "size",
        "required",
        "filled",
        "variant",
        "label",
      ],
    });

    fcs.focused = formControl ? formControl.focused : focused;

    useEffect(() => {
      if (!formControl && disabled && focused) {
        setFocused(false);
        if (onBlur) {
          onBlur(undefined);
        }
      }
    }, [formControl, disabled, focused, onBlur]);

    useEffect(() => {
      if (isControlled) {
        checkDirty({ value });
      }
    }, [value, checkDirty, isControlled]);

    const handleFocus = (event) => {
      if (fcs.disabled) {
        event.stopPropagation();
        return;
      }

      if (onFocus) {
        onFocus(event);
      }

      if (inputPropsProp.onFocus) {
        inputPropsProp.onFocus(event);
      }

      if (formControl && formControl.onFocus) {
        formControl.onFocus(event);
      } else {
        setFocused(true);
      }
    };

    const handleBlur = (event) => {
      if (onBlur) {
        onBlur(event);
      }

      if (inputPropsProp.onBlur) {
        inputPropsProp.onBlur(event);
      }

      if (formControl && formControl.onBlur) {
        formControl.onBlur(event);
      } else {
        setFocused(false);
      }
    };

    const handleChange = (event, ...args) => {
      if (!isControlled) {
        const element = event.target || inputRef.current;
        if (element == null) {
          throw new Error(
            "ArkDashboard: Expected valid input target. " +
            "Did you use a custom `inputComponent` and forget to forward refs? "
          );
        }

        checkDirty({
          value: element.value,
        });
      }

      if (inputPropsProp.onChange) {
        inputPropsProp.onChange(event);
      }

      if (onChange) {
        onChange(event);
      }
    };

    // Check the input state on mount, in case it was filled by the user
    useEffect(() => {
      checkDirty(inputRef.current);
    }, []);

    const handleClick = (event) => {
      if (inputRef.current && event.currentTarget === event.target) {
        (inputRef.current as HTMLInputElement).focus();
      }

      if (onClick) {
        onClick(event);
      }
    };

    let InputComponent: ElementType<
      HTMLAttributes<HTMLInputElement | HTMLTextAreaElement>
    > = "input";
    let inputProps = inputPropsProp;

    if (multiline) {
      inputProps = {
        type: undefined,
        rows: rows ? rows : minRows || maxRows,
        ...inputProps,
      };

      InputComponent = "textarea";
    }

    const handleAutoFill = (event) => {
      checkDirty(
        event.animationName === "auto-fill-cancel"
          ? inputRef.current
          : { value: "x" }
      );
    };

    useEffect(() => {
      if (formControl) {
        formControl.setAdornedStart(Boolean(startAdornment));
      }
    }, [formControl, startAdornment]);

    const ownerState = {
      ...props,
      color: (fcs.color as InputBaseProps["color"]) || "primary",
      disabled: fcs.disabled || disabled,
      endAdornment,
      error: fcs.error,
      focused: fcs.focused,
      formControl: formControl,
      fullWidth: fullWidth || formControl.fullWidth,
      multiline,
      size: fcs.size,
      variant: fcs.variant || variant,
      startAdornment,
      type,
    };

    const inputSize = {
      standard: {
        small: `pt-px px-0 pb-1`,
        medium: `pt-1 px-0 pb-1`,
        large: `pt-2 px-0 pb-1`,
      },
      outlined: {
        small: `py-2 px-3.5`,
        medium: `py-4 px-3.5`,
        large: `py-6 px-3.5`,
      },
      contained: {
        small: `pt-5 px-3 pb-1`, // py-2 px-3 without label
        medium: `py-6 px-3 pb-2`, // py-4 px-3 if no label
        large: `pt-7 px-3 pb-3`,
      },
    };

    const borders = {
      primary: `after:border-primary-400`,
      secondary: `after:border-secondary-500`,
      success: `after:border-success-500`,
      error: `after:border-error-500`,
      warning: `after:border-warning-400`,
      DEFAULT: `after:border-black after:dark:border-white`,
    };

    const inputBaseClasses = {
      outlined: `rounded ${startAdornment && endAdornment
        ? "px-3.5"
        : startAdornment
          ? "pl-3.5"
          : endAdornment
            ? "pr-3.5"
            : ""
        }`,
      contained: `dark:bg-white/10 hover:dark:bg-white/[.13] bg-black/10 hover:bg-black/[.13] rounded-t transition-colors ${startAdornment ? "pl-3" : endAdornment ? "pr-3" : ""
        }`,
      standard: `mt-4`,
    };

    const inputBaseClassesBefore = {
      outlined: ``,
      contained: `before:content-[''] before:border-b before:dark:border-white/70 before:border-black/40 before:absolute before:left-0 before:bottom-0 before:right-0 before:pointer-events-none before:transition-colors before:ease-in-out before:duration-75 hover:before:border-black hover:before:dark:border-white`,
      standard: `before:content-['"\\00a0"'] before:border-b before:dark:border-white/70 before:border-black/40 before:absolute before:left-0 before:bottom-0 before:right-0 before:pointer-events-none before:transition-all before:ease-in-out before:duration-75 hover:before:border-b-2 hover:before:border-black hover:before:dark:border-white`,
    };

    const inputBaseClassesAfter = {
      outlined: '',
      contained: `after:content-[''] after:border-b-2 after:absolute after:left-0 after:bottom-0 after:right-0 after:pointer-events-none after:transform after:transition-transform ${ownerState.focused
        ? "after:transform after:scale-x-100 after:translate-x-0"
        : "after:scale-x-0"
        } ${fcs.error
          ? `before:!border-red-500 after:border-red-500`
          : borders[ownerState.color ?? "DEFAULT"]
        }`,
      standard: `after:content-[''] after:border-b-2 after:absolute after:left-0 after:bottom-0 after:right-0 after:pointer-events-none after:transform after:transition-transform ${ownerState.focused
        ? "after:transform after:scale-x-100 after:translate-x-0"
        : "after:scale-x-0"
        } ${fcs.error
          ? `before:!border-red-500 hover:before:border-b after:border-red-500`
          : borders[ownerState.color ?? "DEFAULT"]
        }`,
    };
    const classes = {
      root: clsx(`relative box-border inline-flex cursor-text items-center text-base font-normal leading-6`, buttonGroupButtonContextPositionClassName, {
        "w-full": ownerState.fullWidth
      }),
      input: clsx(`block w-full font-[inherit] leading-[inherit] text-current m-0 h-6 min-w-0
        ${(
          (formControl.label || props.label)?.toString().length > 0 &&
          !(
            formControl.filled ||
            formControl.focused ||
            formControl.adornedStart ||
            formControl.shrink
          )
        ) ||
          type === "date" ||
          type === "datetime"
          ? "placeholder:opacity-0"
          : "placeholder:opacity-50"
        } placeholder:transition-opacity placeholder:duration-200 placeholder:text-current focus:outline-none box-content disabled:pointer-events-none rounded-[inherit] border-0 bg-transparent
        ${inputSize[ownerState.variant][ownerState.size]}`, {
        "pl-0": startAdornment && (ownerState.variant === "contained" || ownerState.variant === "outlined"),
        "pr-0": endAdornment && (ownerState.variant === "contained" || ownerState.variant === "outlined")
      }),
    };

    return (
      <Fragment>
        <div
          ref={ref}
          onClick={handleClick}
          {...other}
          className={clsx(
            "group",
            classes.root,
            inputBaseClasses[ownerState.variant],
            inputBaseClassesBefore[ownerState.variant],
            inputBaseClassesAfter[ownerState.variant],
            {
              "pointer-events-none": readOnly,
              "pointer-events-none cursor-default text-black/50 before:border-dotted dark:text-white/50":
                ownerState.disabled,
            },
            className
          )}
        >
          {startAdornment && (
            <div
              className={clsx(
                "mr-2 flex h-[0.01em] max-h-[2em] items-center whitespace-nowrap",
                startAdornmentProps?.className,
                {
                  "mt-4": ownerState.variant === "contained",
                }
              )}
              {...startAdornmentProps}
            >
              {startAdornment}
            </div>
          )}
          {renderTags && renderTags}
          <FormControlContext.Provider value={null}>
            <InputComponent
              aria-invalid={fcs.error}
              aria-describedby={ariaDescribedby}
              autoComplete={autoComplete}
              aria-multiline={multiline}
              autoFocus={autoFocus}
              defaultValue={defaultValue}
              disabled={fcs.disabled}
              id={id}
              name={name}
              placeholder={placeholder}
              readOnly={readOnly}
              required={fcs.required}
              rows={rows}
              value={value}
              type={type}
              min={min}
              max={max}
              onAnimationStart={handleAutoFill}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
              ref={handleInputRef}
              {...inputProps}
              className={clsx(
                classes.input,
                "animate-auto-fill-cancel",
                inputProps.className
              )}
              onBlur={handleBlur}
              onChange={handleChange}
              onFocus={handleFocus}
            />
          </FormControlContext.Provider>
          {endAdornment && (
            <div
              {...endAdornmentProps}
              className={clsx(
                "ml-2 flex h-[0.01em] max-h-[2em] items-center whitespace-nowrap text-black/70 dark:text-white/70",
                endAdornmentProps?.className
              )}
            >
              {endAdornment}
            </div>
          )}

          {renderSuffix
            ? renderSuffix({
              ...fcs,
              startAdornment,
            })
            : null}
        </div>
      </Fragment>
    );
  }
);

type InputProps = {
  autoComplete?: string;
  autoFocus?: boolean;
  children?: ReactNode;
  className?: string;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "DEFAULT";
  defaultValue?: string | number | readonly string[];
  disabled?: boolean;
  error?: boolean;
  FormHelperTextProps?: Partial<HTMLAttributes<HTMLParagraphElement>>;
  fullWidth?: boolean;
  helperText?: ReactNode;
  id?: string;
  InputLabelProps?: Partial<InputLabelProps>;
  InputProps?: Partial<InputBaseProps>
  SuffixProps?: Partial<HTMLAttributes<HTMLFieldSetElement>>;
  inputRef?: React.Ref<any>;
  label?: ReactNode;
  multiline?: boolean;
  name?: string;
  onBlur?: InputBaseProps["onBlur"];
  onFocus?: InputBaseProps["onFocus"];
  onChange?: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
  >;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  maxRows?: string | number;
  minRows?: string | number;
  margin?: "dense" | "normal" | "none";
  variant?: "standard" | "contained" | "outlined";
  size?: "small" | "medium" | "large";
  type?: InputHTMLAttributes<unknown>["type"];
  value?: string | number | readonly string[];
  validation?: RegisterOptions & {
    valueAsBoolean?: boolean;
    valueAsJSON?: boolean;
  };
};

export const Input = forwardRef<HTMLDivElement, InputProps>((props, ref) => {
  const {
    autoComplete,
    autoFocus = false,
    children,
    className,
    color = "DEFAULT",
    defaultValue,
    disabled = false,
    error = false,
    FormHelperTextProps,
    fullWidth = false,
    helperText,
    id: idOverride,
    InputLabelProps,
    InputProps,
    inputRef,
    label,
    maxRows,
    minRows,
    multiline = false,
    name,
    onBlur,
    onChange,
    onFocus,
    placeholder,
    rows,
    SuffixProps,
    type,
    value,
    variant = "outlined",
    size = "medium",
    margin = "normal",
    validation,
    ...other
  } = props;

  const ownerState = {
    ...props,
    autoFocus,
    color,
    disabled,
    error,
    fullWidth,
    multiline,
    variant,
    ...validation,
  };

  const InputMore: {
    [key: string]: any;
  } = {};

  if (variant === "outlined") {
    InputMore.notched = true;
    if (InputLabelProps) {
      InputMore.notched = InputLabelProps.shrink;
    }
    InputMore.label = label;
  }

  const borders = {
    primary: `border-primary-400`,
    secondary: `border-secondary-500`,
    success: `border-success-500`,
    error: `border-error-500`,
    warning: `border-warning-400`,
    disabled: `dark:border-white/30 border-black/30`,
    DEFAULT: `border-black dark:border-white`,
    DEFAULTNOFOCUS: `group-hover:border-black group-hover:dark:border-white border-black/20 dark:border-white/20`,
  };

  const id = idOverride ?? useId();
  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
  const inputLabelId = label && id ? `${id}-label` : undefined;


  const { field, fieldState, formState } = !!name &&
    useController({
      name: name,
      defaultValue: defaultValue || value,
      rules: validation,
    });
  return (
    <FormControl
      className={className}
      disabled={disabled || field?.disabled}
      error={error || Boolean(fieldState?.error)}
      fullWidth={fullWidth}
      ref={ref}
      required={Boolean(validation?.required) || other?.required}
      color={color}
      variant={variant}
      ownerState={ownerState}
      margin={margin}
      size={size}
      {...other}
    >
      {label != null && label !== "" && (
        <InputLabel
          htmlFor={id}
          id={inputLabelId}
          {...InputLabelProps}
        >
          {label}
        </InputLabel>
      )}

      <InputBase
        label={label}
        aria-describedby={helperTextId}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        fullWidth={fullWidth}
        multiline={multiline}
        name={name}
        rows={rows}
        maxRows={maxRows}
        minRows={minRows}
        type={type}
        value={value}
        id={id}
        ref={field ? field.ref : null}
        inputRef={inputRef}
        onBlur={(e) => {
          onBlur?.(e);
          field?.onBlur();
        }}
        onChange={(e) => {
          onChange?.(e);
          field?.onChange(e);
        }}
        onFocus={onFocus}
        placeholder={placeholder}
        // inputProps={InputProps?.inputProps}
        {...InputProps}
        renderSuffix={(state) =>
          variant === "outlined" ? (
            <fieldset
              form={null}
              {...SuffixProps}
              aria-hidden
              className={clsx(
                `absolute border text-left transition-colors duration-75 ease-in ${borders[
                disabled || state.disabled
                  ? "disabled"
                  : error || state.error || Boolean(fieldState?.error) || fieldState?.invalid
                    ? 'error'
                    : state.focused
                      ? color
                      : "DEFAULTNOFOCUS"
                ]
                } pointer-events-none bottom-0 left-0 right-0 -top-[5px] m-0 min-w-0 overflow-hidden rounded-[inherit] px-2`,
                {
                  "border-2": state.focused,
                },
                SuffixProps?.className
              )}
            >
              <legend
                className={clsx(
                  "invisible block h-[11px] w-auto overflow-hidden whitespace-nowrap p-0 text-xs transition-all",
                  {
                    "max-w-full":
                      state.focused ||
                      state.filled ||
                      state.startAdornment ||
                      props?.InputLabelProps?.shrink ||
                      type === "date" ||
                      type === "datetime" || props.InputProps?.startAdornment,
                    "max-w-[0.001px]":
                      !state.focused &&
                      !state.filled &&
                      !state.startAdornment &&
                      !props?.InputLabelProps?.shrink &&
                      !(type === "date" || type === "datetime") && !props.InputProps?.startAdornment,
                  }
                )}
              >
                {label && label !== "" && (
                  <span className={"visible inline-block px-[5px] opacity-0"}>
                    {state.required ? (
                      <React.Fragment>
                        {label}
                        &thinsp;{"*"}
                      </React.Fragment>
                    ) : (
                      label
                    )}
                  </span>
                )}
              </legend>
            </fieldset>
          ) : null
        }
      />
      {helperText && (
        <p
          id={helperTextId}
          className={clsx("rw-helper-text", {
            "!text-red-500": error || fieldState?.error || fieldState?.invalid,
            "dark:!text-white/50 !text-black/50 text-opacity-50": (disabled || field?.disabled) && !(error || fieldState?.error || fieldState?.invalid)
          })}
          {...FormHelperTextProps}
        >
          {helperText}
        </p>
      )}

      {field && (<FieldError name={name} className="rw-field-error" />)}
    </FormControl>
  );
});