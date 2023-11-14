import {
  FieldError,
  InputField,
  InputFieldProps,
  Label,
  TextAreaField,
  TextAreaFieldProps,
  useController,
  useErrorStyles,
} from "@redwoodjs/forms";
import clsx from "clsx";
import { CSSProperties, Fragment, HTMLAttributes, LabelHTMLAttributes, ReactNode, forwardRef, useCallback, useDeferredValue, useEffect, useId, useMemo, useRef, useState } from "react";
import { debounce, isEmpty } from "src/lib/formatters";
type InputProps = {
  name?: string;
  helperText?: string;
  label?: string;
  inputClassName?: string;
  fullWidth?: boolean;
  color?: 'primary' | 'secondary' | 'warning' | 'success' | 'error';
  variant?: 'outlined' | 'contained' | 'filled' | 'standard'
  margin?: "none" | "dense" | "normal";
  type?:
  | "number"
  | "button"
  | "time"
  | "image"
  | "text"
  | "hidden"
  | "color"
  | "search"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "month"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "submit"
  | "tel"
  | "url"
  | "week"
  | "textarea";
  onFocus?: (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => void;
  onBlur?: (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => void;
  InputProps?: {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    style?: CSSProperties;
  };
  // variant?: "outlined" | "filled" | "standard";
} & Omit<InputFieldProps, "type" | "name"> &
  Omit<TextAreaFieldProps, "type" | "name">;
// TODO: check up required validation. doesnt work
export const InputOutlined = ({
  name,
  type = "text",
  label,
  helperText,
  className,
  inputClassName,
  defaultValue,
  value,
  required,
  validation,
  disabled,
  fullWidth,
  margin = "none",
  InputProps,
  ...props
}: InputProps) => {
  // TODO: add variants, colors, sizing, make base component
  // https://github.com/mui/material-ui/blob/master/packages/mui-material/src/InputBase/InputBase.js#L245
  const [focus, setFocus] = useState(false);
  const { field } = !!name
    ? useController({
      name: name,
      rules: validation,
      defaultValue: defaultValue || value || "",
      ...props,
    })
    : { field: null };

  const handleFocus = (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => {
    setFocus(true);
    props.onFocus?.(e);
  };

  const handleBlur = (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => {
    setFocus(e.target.value !== "");

    if (name) {
      field.onBlur();
    }

    props.onBlur?.(e);
  };

  const LabelComponent: React.ElementType = !!name ? Label : "label";

  const InputComponent: React.ElementType = !!name ? type === 'textarea' ? TextAreaField : InputField : "input";

  const { className: labelClassName, style: labelStyle } = name ? useErrorStyles({
    className: `pointer-events-none absolute text-base origin-top-left z-10 transform will-change-transform duration-200 transition left-0 top-0 block max-w-[calc(100%-24px)] translate-x-3.5 translate-y-4 scale-100 overflow-hidden text-ellipsis font-normal leading-6`,
    errorClassName: `pointer-events-none absolute left-0 top-0 z-10 block origin-top-left max-w-[calc(100%-24px)] translate-x-3.5 translate-y-4 scale-100 transform overflow-hidden text-ellipsis font-normal leading-6 transition duration-200 text-base !text-red-600`,
    name,
  }) : { className: `pointer-events-none absolute text-base origin-top-left z-10 transform will-change-transform duration-200 transition left-0 top-0 block max-w-[calc(100%-24px)] translate-x-3.5 translate-y-4 scale-100 overflow-hidden text-ellipsis font-normal leading-6`, style: {} };

  const { className: inputClassNames, style: inputStyle } = name ? useErrorStyles({
    className: `peer m-0 h-6 min-w-0 w-full box-content overflow-hidden block text-base font-[inherit] focus:outline-none disabled:pointer-events-none px-3.5 rounded-[inherit] border-0 bg-transparent py-4`,
    errorClassName: `peer m-0 box-content block h-6 w-full min-w-0 overflow-hidden rounded-[inherit] border-0 bg-transparent px-3.5 py-4 font-[inherit] text-base focus:outline-none rw-input-error`,
    name,
  }) : { className: `peer m-0 h-6 min-w-0 w-full box-content overflow-hidden block text-base font-[inherit] focus:outline-none disabled:pointer-events-none px-3.5 rounded-[inherit] border-0 bg-transparent py-4`, style: {} }

  return (
    <div
      className={clsx(
        "relative mx-0 inline-flex min-w-0 max-w-sm flex-col p-0 align-top text-black dark:text-white",
        className,
        {
          "pointer-events-none text-black/50 dark:text-white/50": disabled,
          "w-full max-w-full": fullWidth,
          "mt-2 mb-1": margin === "dense",
          "mt-4 mb-2": margin === "normal",
          "mt-0 mb-0": margin == "none",
        }
      )}
    >
      <LabelComponent
        style={labelStyle}
        className={clsx(labelClassName, {
          "!pointer-events-auto !max-w-[calc(133%-32px)] !-translate-y-2 !translate-x-3.5 !scale-75 !select-none":
            focus || (name && !isEmpty(field?.value)) || !!props?.placeholder,
          "translate-x-10": !!InputProps?.startAdornment,
        })}
        {...(name ? { name: name } : {})}
        htmlFor={`input-${name}`}
      >
        {label ?? name} {required && " *"}
      </LabelComponent>
      <div
        className={clsx(
          "relative box-content inline-flex cursor-text items-center rounded text-base font-normal leading-6",
          inputClassName,
          {
            "pl-3.5": !!InputProps?.startAdornment,
            "pr-3.5": !!InputProps?.endAdornment,
          }
        )}
      >
        {!!InputProps?.startAdornment && (
          <div className="mr-2 flex h-[0.01em] max-h-[2em] items-center whitespace-nowrap text-black/70 dark:text-white/70">
            {InputProps?.startAdornment}
          </div>
        )}
        <InputComponent
          aria-invalid="false"
          id={`input-${name}`}
          type={type}
          className={clsx(inputClassNames, {
            "pl-0": !!InputProps?.startAdornment,
            "pr-0": !!InputProps?.endAdornment,
          })}
          style={inputStyle}
          disabled={disabled}
          {...(name ? field : {})}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => {
            if (name) {
              field.onChange(e);
            }
            props.onChange?.(e);
          }}
          onInput={(e) => {
            if (name) {
              field.onChange(e);
            }
            props.onInput?.(e);
          }}
          {...(name ? { 'aria-multiline': true, name: name } : {})}
          aria-describedby={helperText ? `${name}-helper-text` : null}
          {...props}
        >
        </InputComponent>
        {InputProps?.endAdornment && (
          <div className="ml-2 flex h-[0.01em] max-h-[2em] items-center whitespace-nowrap text-black/70 dark:text-white/70">
            {InputProps?.endAdornment}
          </div>
        )}
        <fieldset
          aria-hidden="true"
          style={
            {
              ...InputProps?.style,
              inset: "-5px 0px 0px",
            } as CSSProperties
          }
          className={clsx(
            "!peer-invalid:border-red-500 pointer-events-none absolute m-0 min-w-0 overflow-hidden rounded-[inherit] border border-zinc-500 px-2 text-left transition duration-75 peer-hover:border-2 peer-hover:border-zinc-300 peer-focus:border-2 peer-focus:border-zinc-300 peer-disabled:border peer-disabled:border-zinc-500",
            {
              "top-0": focus || !isEmpty(field?.value) || !!props?.placeholder,
            }
          )}
        >
          <legend
            style={{ float: "unset", height: "11px" }}
            className={clsx(
              "invisible block w-auto max-w-[.01px] overflow-hidden whitespace-nowrap p-0 !text-xs transition-all duration-75",
              {
                "!max-w-full":
                  focus || !isEmpty(field?.value) || !!props?.placeholder,
              }
            )}
          >
            <span className="visible inline-block px-1 opacity-0">
              {label ?? name} {required && " *"}
            </span>
          </legend>
        </fieldset>
      </div>
      {!!name && <FieldError name={name} className="rw-field-error" />}
      {helperText && (
        <p
          id={`${name}-helper-text`}
          className="mx-3 mt-0.5 mb-0 text-left text-xs font-normal leading-5 tracking-wide text-black/70 dark:text-white/70"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};


function formControlState({ props, states, formControl }) {
  // for every prop in `states` that is undefined, set it with the value from formControlContext
  return states.reduce((acc, state) => {
    acc[state] = props[state];

    if (formControl) {
      if (typeof props[state] === 'undefined') {
        acc[state] = formControl[state];
      }
    }

    return acc;
  }, {});
}
export interface FormControlOwnProps {
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
  /**
   * The color of the component.
   * It supports both default and custom theme colors, which can be added as shown in the
   * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  /**
   * If `true`, the label, input and helper text should be displayed in a disabled state.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the label is displayed in an error state.
   * @default false
   */
  error?: boolean;
  /**
   * If `true`, the component will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * If `true`, the component is displayed in focused state.
   */
  focused?: boolean;
  /**
   * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
   * @default 'none'
   */
  margin?: 'dense' | 'normal' | 'none';
  /**
   * If `true`, the label will indicate that the `input` is required.
   * @default false
   */
  required?: boolean;
  /**
   * The size of the component.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * The variant to use.
   * @default 'outlined'
   */
  variant?: 'standard' | 'outlined' | 'filled';

  label?: string;
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

export interface FormControlTypeMap<
  AdditionalProps = {},
  RootComponent extends React.ElementType = 'div',
> {
  props: AdditionalProps & FormControlOwnProps;
  defaultComponent: RootComponent;
}
type BaseProps<TypeMap extends OverridableTypeMap> = TypeMap["props"] &
  CommonProps;

type OverrideProps<
  TypeMap extends OverridableTypeMap,
  RootComponent extends React.ElementType
> = BaseProps<TypeMap> &
  DistributiveOmit<
    React.ComponentPropsWithRef<RootComponent>,
    keyof BaseProps<TypeMap>
  >;
type ContextFromPropsKey =
  | 'color'
  | 'disabled'
  | 'error'
  | 'fullWidth'
  | 'margin'
  | 'required'
  | 'size'
  | 'variant';

type FormControlProps<
  RootComponent extends React.ElementType = FormControlTypeMap['defaultComponent'],
  AdditionalProps = {},
> = OverrideProps<FormControlTypeMap<AdditionalProps, RootComponent>, RootComponent> & {
  component?: React.ElementType;
};
export interface FormControlContextValue extends Pick<FormControlProps, ContextFromPropsKey> {
  adornedStart: boolean;
  filled: boolean;
  focused: boolean;
  onBlur: (event?: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onEmpty: () => void;
  onFilled: () => void;
  registerEffect: undefined | (() => () => void);
  setAdornedStart: React.Dispatch<React.SetStateAction<boolean>>;
}
const FormControlContext = React.createContext<FormControlContextValue | undefined>(undefined);
function useFormControl(): FormControlContextValue | undefined {
  return React.useContext(FormControlContext);
}

export const FormControl = forwardRef((props: FormControlProps, ref) => {
  const {
    children,
    className,
    color = 'primary',
    component: Component = 'div',
    disabled = false,
    error = false,
    focused: visuallyFocused,
    fullWidth = false,
    margin = 'none',
    required = false,
    size = 'medium',
    variant = 'outlined',
    label,
    ...other
  } = props;

  const ownerState = {
    ...props,
    color,
    component: Component,
    disabled,
    error,
    fullWidth,
    margin,
    required,
    size,
    label,
    variant,
  };

  const [adornedStart, setAdornedStart] = useState(() => {
    let initialAdornedStart = false;

    if (children) {
      React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) {
          return;
        }

        const input = React.isValidElement(child) ? child.props.input : child;

        if (input && input.props.startAdornment) {
          initialAdornedStart = true;
        }
      });
    }
    return initialAdornedStart;
  });

  const [filled, setFilled] = useState(() => {
    // We need to iterate through the children and find the Input in order
    // to fully support server-side rendering.
    let initialFilled = false;

    if (children) {
      React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) {
          return;
        }

        if (isFilled(child.props, true) || isFilled(child.props.inputProps, true)) {
          initialFilled = true;
        }
      });
    }

    return initialFilled;
  });

  const [focusedState, setFocused] = React.useState(false);
  if (disabled && focusedState) {
    setFocused(false);
  }

  const focused = visuallyFocused !== undefined && !disabled ? visuallyFocused : focusedState;

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
      required,
      registerEffect: () => {
        return () => { }
      },
      variant,
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
      <Component
        className={clsx("relative mx-0 inline-flex min-w-0 flex-col p-0 align-top text-black dark:text-white", {
          "w-full": fullWidth,
          "mt-4 mb-2": ownerState.margin === 'normal',
          "mt-2 mb-1": ownerState.margin === 'dense',
        })}
        ref={ref}
        {...other}
        aria-description={`Variant: ${variant}`}
      >
        {children}
      </Component>
    </FormControlContext.Provider>
  )
})

type InputLabelProps = {
  color?: 'primary' | 'secondary' | 'warning' | 'success' | 'error';
  variant?: 'outlined' | 'filled' | 'standard';
  className?: string;
  shrink?: boolean;
  disableAnimation?: boolean;
  margin?: 'dense' | 'normal' | 'none';
  children?: ReactNode;
}
export const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>((props, ref) => {
  const {
    disableAnimation = false,
    margin,
    shrink: shrinkProp,
    variant,
    className,
    color,
    children,
  } = props;


  const labelSize = {
    outlined: {
      small: { close: `max-w-[calc(100%-24px)] translate-x-3.5 translate-y-[9px] scale-100`, open: `scale-75 translate-x-3.5 -translate-y-[9px] max-w-[calc(133%-32px)] pointer-events-auto` },
      medium: { close: `max-w-[calc(100%-24px)] translate-x-3.5 translate-y-4 scale-100`, open: `scale-75 translate-x-3.5 -translate-y-[9px] max-w-[calc(133%-32px)] pointer-events-auto` },
      large: ``
    },
    filled: {
      small: { close: `max-w-[calc(100%-24px)] translate-x-3 translate-y-[13px] scale-100`, open: `scale-75 translate-x-3 translate-y-1 max-w-[calc(133%-24px)] pointer-events-auto` },
      medium: { close: `max-w-[calc(100%-24px)] translate-x-3 translate-y-4 scale-100`, open: `scale-75 translate-x-3 translate-y-[7px] max-w-[calc(133%-24px)] pointer-events-auto` },
      large: ``
    },
    standard: {
      small: { close: `max-w-[100%] translate-x-0 translate-y-[17px] scale-100`, open: `scale-75 translate-x-0 -translate-y-[1.5px] max-w-[133%]` },
      medium: { close: `max-w-[100%] translate-x-0 translate-y-5 scale-100`, open: `scale-75 translate-x-0 -translate-y-[1.5px] max-w-[133%]` },
      large: ``
    }
  }
  const colors = {
    success: `text-green-500`,
    error: `text-red-500`,
    warning: `text-amber-400`,
    primary: `text-white/70`,
    secondary: `text-white/70`
  }

  const formControl = useFormControl();

  let shrink = shrinkProp;
  if (typeof shrink === 'undefined' && formControl) {
    shrink = formControl.filled || formControl.focused || formControl.adornedStart;
  }

  const fcs = formControlState({
    props,
    formControl,
    states: ["size", "variant", "required", "focused", "error", "color"]
  })

  const labelClasses = {
    outlined: `text-base leading-6 p-0 block origin-top-left whitespace-nowrap overflow-hidden text-ellipsis absolute left-0 top-0 z-10 pointer-events-none select-none transition-transform`,
    filled: `text-base leading-6 p-0 block origin-top-left whitespace-nowrap overflow-hidden text-ellipsis absolute left-0 top-0 z-10 pointer-events-none select-none transition-transform`,
    standard: `text-base leading-6 p-0 block origin-top-left whitespace-nowrap overflow-hidden text-ellipsis absolute left-0 top-0 transition-transform`,
  }
  const state = {
    ...props,
    disableAnimation,
    formControl,
    shrink,
    size: fcs.size = "medium",
    required: fcs.required,
    focused: fcs.focused,
    variant: fcs.variant || variant,
    error: fcs.error,
  }
  return (
    <label
      data-shrink={shrink}
      className={clsx(labelClasses[state.variant], labelSize[state.variant][state.size][state.focused || shrink ? 'open' : 'close'], className, state.error ? "text-red-500" : state.focused ? colors[fcs.color || color] : 'text-white/70')}
      ref={ref}
      children={
        state.required ? (
          <React.Fragment>
            {children}
            &thinsp;{'*'}
          </React.Fragment>
        ) : (
          children
        )
      }
    />
  )
})

function isFilled(obj: any, SSR = false) {
  return (
    obj &&
    (((obj.value != null && !(Array.isArray(obj.value) && obj.value.length === 0)) && obj.value !== '') ||
      (SSR && (obj.defaultValue != null && !(Array.isArray(obj.defaultValue) && obj.defaultValue.length === 0)) && obj.defaultValue !== ''))
  );
}

type InputBaseProps = {
  classes?: {};
  className?: string;
  'aria-describedby'?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  components?: {
    Root?: React.ElementType;
    Input?: React.ElementType;
  };
  /**
   * The extra props for the slot components.
   * You can override the existing props or add new ones.
   *
   * This prop is an alias for the `slotProps` prop.
   * It's recommended to use the `slotProps` prop instead, as `componentsProps` will be deprecated in the future.
   *
   * @default {}
   */
  componentsProps?: {
    root?: React.HTMLAttributes<HTMLDivElement> & { ownerState?: any };
    input?: React.InputHTMLAttributes<HTMLInputElement> & { ownerState?: any };
  };
  defaultValue?: unknown;
  disabled?: boolean;
  endAdornment?: React.ReactNode;
  error?: boolean;
  fullWidth?: boolean;
  id?: string;
  inputComponent?: React.ElementType<React.HTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
    [arbitrary: string]: any;
  }>
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   */
  inputProps?: React.HTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
    [arbitrary: string]: any;
  };
  inputRef?: React.Ref<any>;
  margin?: 'dense' | 'normal' | 'none';
  multiline?: boolean;
  name?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onInvalid?: React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  renderSuffix?: (state: {
    disabled?: boolean;
    error?: boolean;
    filled?: boolean;
    focused?: boolean;
    margin?: 'dense' | 'none' | 'normal';
    required?: boolean;
    startAdornment?: React.ReactNode;
  }) => React.ReactNode;
  rows?: string | number;
  maxRows?: string | number;
  minRows?: string | number;
  size?: 'small' | 'medium' | 'large';
  /**
   * The extra props for the slot components.
   * You can override the existing props or add new ones.
   *
   * This prop is an alias for the `componentsProps` prop, which will be deprecated in the future.
   *
   * @default {}
   */
  slotProps?: {
    root?: React.HTMLAttributes<HTMLDivElement> & { sx?: CSSProperties, ownerState?: any };
    input?: React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & { sx?: CSSProperties, ownerState?: any };
  };
  /**
   * The components used for each slot inside.
   *
   * This prop is an alias for the `components` prop, which will be deprecated in the future.
   *
   * @default {}
   */
  slots?: {
    root?: React.ElementType;
    input?: React.ElementType;
  };
  startAdornment?: React.ReactNode;
  type?: string;
  value?: unknown;
}
export const InputBase = forwardRef((props: InputBaseProps, ref) => {
  const {
    'aria-describedby': ariaDescribedby,
    autoComplete,
    autoFocus,
    className,
    color,
    components = {},
    componentsProps = {},
    defaultValue,
    disabled,
    endAdornment,
    error,
    fullWidth = false,
    id,
    inputComponent = 'input',
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
    placeholder,
    readOnly,
    renderSuffix,
    rows,
    size,
    slotProps = {},
    slots = {},
    startAdornment,
    type = 'text',
    value: valueProp,
    ...other
  } = props;

  const value = inputPropsProp.value != null ? inputPropsProp.value : valueProp;
  const { current: isControlled } = useRef(value != null);

  const inputRef = useRef();
  const handleInputRefWarning = useCallback((instance) => {
    if (process.env.NODE_ENV !== 'production') {
      if (instance && instance.nodeName !== 'INPUT' && !instance.focus) {
        console.error(
          [
            'ArkDashboard: You have provided a `inputComponent` to the input component',
            'that does not correctly handle the `ref` prop.',
            'Make sure the `ref` prop is called with a HTMLInputElement.',
          ].join('\n'),
        );
      }
    }
  }, []);

  const handleInputRef = useMemo(() => {
    if ([
      inputRef,
      inputRefProp,
      inputPropsProp.ref,
      handleInputRefWarning
    ].every((ref) => ref == null)) {
      return null;
    }

    return (instance) => {
      [
        inputRef,
        inputRefProp,
        inputPropsProp.ref,
        handleInputRefWarning
      ].forEach((ref) => {
        if (typeof ref === 'function') {
          ref(instance);
        } else if (ref) {
          ref.current = instance;
        }
      });
    };
  }, [
    inputRef,
    inputRefProp,
    inputPropsProp.ref,
    handleInputRefWarning
  ]);

  const [focused, setFocused] = useState(false);
  const formControl = useFormControl();

  const fcs = formControlState({
    props,
    formControl,
    states: ['color', 'disabled', 'error', 'size', 'required', 'filled', 'variant', 'label'],
  });

  fcs.focused = formControl ? formControl.focused : focused;

  // The blur won't fire when the disabled state is set on a focused input.
  // We need to book keep the focused state manually.
  useEffect(() => {
    if (!formControl && disabled && focused) {
      setFocused(false);
      if (onBlur) {
        onBlur(undefined);
      }
    }
  }, [formControl, disabled, focused, onBlur]);

  const onFilled = formControl && formControl.onFilled;
  const onEmpty = formControl && formControl.onEmpty;

  const checkDirty = React.useCallback(
    (obj) => {
      if (isFilled(obj)) {
        if (onFilled) {
          onFilled();
        }
      } else if (onEmpty) {
        onEmpty();
      }
    },
    [onFilled, onEmpty],
  );

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
          'ArkDashboard: Expected valid input target. ' +
          'Did you use a custom `inputComponent` and forget to forward refs? '
        );
      }

      checkDirty({
        value: element.value,
      });
    }

    if (inputPropsProp.onChange) {
      inputPropsProp.onChange(event);
      // inputPropsProp.onChange(event, ...args);
    }

    if (onChange) {
      onChange(event);
      // onChange(event, ...args);
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

  let InputComponent = inputComponent;
  let inputProps = inputPropsProp;

  if (multiline && InputComponent === 'input') {
    inputProps = {
      type: undefined,
      minRows: rows ? rows : minRows,
      maxRows: rows ? rows : maxRows,
      ...inputProps,
    };

    InputComponent = TextAreaField;
  }

  const handleAutoFill = (event) => {
    // Provide a fake value as Chrome might not let you access it for security reasons.
    checkDirty(event.animationName === 'auto-fill-cancel' ? inputRef.current : { value: 'x' });
  };

  useEffect(() => {
    if (formControl) {
      formControl.setAdornedStart(Boolean(startAdornment));
    }
  }, [formControl, startAdornment]);

  const ownerState = {
    ...props,
    color: fcs.color || 'primary',
    disabled: fcs.disabled,
    endAdornment,
    error: fcs.error,
    focused: fcs.focused,
    formControl: formControl,
    fullWidth,
    multiline,
    size: fcs.size,
    variant: fcs.variant,
    startAdornment,
    type,
  };

  const inputSize = {
    standard: `pt-1 px-0 pb-1`,// pb-[5px]
    outlined: `py-4 px-3.5`,// py-[16.5px]
    filled: `pt-[25px] px-3 pb-2`
  }

  const inputBaseClass = `relative box-border inline-flex cursor-text items-center text-base font-normal leading-6 dark:text-white text-black`
  const inputBaseClasses = {
    outlined: `rounded`,
    filled: `bg-white/10 rounded-t transition-colors`,
    standard: ``,
  }
  const inputBaseClassesBefore = {
    outlined: ``,
    filled: `before:content-[''] before:border-b before:border-white/70 before:absolute before:left-0 before:bottom-0 before:right-0 before:pointer-events-none`,
    standard: `before:content-[''] before:border-b before:border-white/70 before:absolute before:left-0 before:bottom-0 before:right-0 before:pointer-events-none`,
  }
  const inputBaseClassesAfter = {
    outlined: ``,
    filled: `after:content-[''] after:border-b-2 after:border-blue-500 after:absolute after:left-0 after:bottom-0 after:right-0 after:pointer-events-none after:transform after:scale-x-0 after:transition-transform`,
    standard: `after:content-[''] after:border-b-2 after:border-pea-500 after:absolute after:left-0 after:bottom-0 after:right-0 after:pointer-events-none after:transform after:scale-x-0 after:transition-transform`,
  }
  const classes = { root: '', input: `font-[inherit] leading-[inherit] m-0 h-6 min-w-0 w-full box-content block focus:outline-none disabled:pointer-events-none rounded-[inherit] border-0 bg-transparent ${inputSize[ownerState.variant]}` };
  const Root = slots.root || components.Root || 'div';
  const rootProps = slotProps.root || componentsProps.root || { ownerState: null };

  const Input = slots.input || components.Input || InputComponent;
  inputProps = { ...inputProps, ...(slotProps.input ?? componentsProps.input) };
  console.log(fcs, rootProps)
  return (
    <Fragment>
      <Root
        {...rootProps}
        {...(!(typeof Root === 'string') && {
          ownerstate: { ...rootProps.ownerState },
        })}
        ref={ref}
        onClick={handleClick}
        {...other}
        className={clsx(
          classes.root,
          inputBaseClass,
          inputBaseClasses[ownerState.variant],
          inputBaseClassesBefore[ownerState.variant],
          inputBaseClassesAfter[ownerState.variant],
          {
            'pointer-events-none': readOnly,
            "before:border-red-500 after:border-red-500": (fcs.error) && (ownerState.variant === 'filled' || ownerState.variant === 'standard'),
            "after:border-red-500": ownerState.color === 'error' && (ownerState.variant === 'filled' || ownerState.variant === 'standard'),
            "after:scale-x-100": ownerState.focused && (ownerState.variant === 'filled' || ownerState.variant === 'standard'),
            "after:border-pea-500": (ownerState.variant === 'filled' || ownerState.variant === 'standard') && ownerState.color === 'success',
          },
          rootProps.className,
          className,
        )}
      >
        {startAdornment}
        <FormControlContext.Provider value={null}>
          <Input
            ownerState={ownerState}
            aria-invalid={fcs.error}
            aria-describedby={ariaDescribedby}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            defaultValue={defaultValue}
            disabled={fcs.disabled}
            id={id}
            onAnimationStart={handleAutoFill}
            name={name}
            placeholder={placeholder}
            readOnly={readOnly}
            required={fcs.required}
            rows={rows}
            value={value}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            type={type}
            {...inputProps}
            {...(!(typeof Input === 'string') && {
              as: InputComponent,
              ownerState: { ...ownerState, ...inputProps.ownerState },
            })}
            ref={handleInputRef}
            className={clsx(
              classes.input,
              "animate-auto-fill-cancel",
              inputProps.className,
            )}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
          />
        </FormControlContext.Provider>
        {endAdornment}
        <fieldset aria-hidden className={clsx("text-left absolute bottom-0 right-0 hover:border-white px-2 rounded-[inherit] min-w-0 overflow-hidden border border-black/20 dark:border-white/20 pointer-events-none m-0 left-0 -top-[5px]", {
          "!border-pea-500 border-2": color === 'success' && fcs.focused,
          "!border-red-500 border-2": color === 'error' && fcs.focused,
          "!border-amber-400 border-2": color === 'warning' && fcs.focused,
        })}>
          <legend className={clsx("w-auto overflow-hidden block invisible text-xs p-0 h-[11px] whitespace-nowrap transition-all", {
            "max-w-full": fcs.focused || fcs.filled,
            "max-w-[0.01px]": !fcs.focused && !fcs.filled
          })}>
            <span className={"px-[5px] inline-block opacity-0 visible"}>
              {fcs.required ? (
                <React.Fragment>
                  {fcs.label}
                  &thinsp;{'*'}
                </React.Fragment>
              ) : (
                fcs.label
              )}
            </span>
          </legend>
        </fieldset>
        {/* {renderSuffix ? (
          renderSuffix({
            ...fcs,
            startAdornment
          })
        ) : null} */}
      </Root>
    </Fragment>
  )
})


function deepClone<T>(source: T): T | Record<keyof any, unknown> {
  if (!(source !== null && typeof source === 'object' && source.constructor === Object)) {
    return source;
  }

  const output: Record<keyof any, unknown> = {};

  Object.keys(source).forEach((key) => {
    output[key] = deepClone(source[key]);
  });

  return output;
}
function deepmerge<T>(
  target: T,
  source: unknown,
  options: {
    clone?: boolean;
  } = { clone: true },
): T {
  const output = options.clone ? { ...target } : target;

  if ((target !== null && typeof target === 'object' && target.constructor === Object) && (source !== null && typeof source === 'object' && source.constructor === Object)) {
    Object.keys(source).forEach((key) => {
      // Avoid prototype pollution
      if (key === '__proto__') {
        return;
      }

      if ((source[key] !== null && typeof source[key] === 'object' && source[key].constructor === Object) && key in target && (target[key] !== null && typeof target[key] === 'object' && target[key].constructor === Object)) {
        // Since `output` is a clone of `target` and we have narrowed `target` in this block we can cast to the same type.
        (output as Record<keyof any, unknown>)[key] = deepmerge(target[key], source[key], options);
      } else if (options.clone) {
        (output as Record<keyof any, unknown>)[key] = (source[key] !== null && typeof source[key] === 'object' && source[key].constructor === Object)
          ? deepClone(source[key])
          : source[key];
      } else {
        (output as Record<keyof any, unknown>)[key] = source[key];
      }
    });
  }

  return output;
}
interface iInputProps extends InputBaseProps {
  sx?: CSSProperties;
  [key: string]: any
}
export const Input = forwardRef((props: iInputProps, ref) => {
  const {
    components = {},
    componentsProps: componentsPropsProp,
    fullWidth = false,
    inputComponent = 'input',
    multiline = false,
    slotProps,
    slots = {},
    type = 'text',
    color,
    ...other
  } = props;

  const classes = {}
  const ownerState = {};
  const inputComponentsProps = { root: { ownerState } as HTMLAttributes<HTMLDivElement> };

  const componentsProps =
    slotProps ?? componentsPropsProp
      ? deepmerge(slotProps ?? componentsPropsProp, inputComponentsProps)
      : inputComponentsProps;

  const RootSlot = slots.root ?? components.Root ?? InputBase;
  const InputSlot = slots.input ?? components.Input ?? InputBase;


  console.log(componentsProps)
  return (
    <InputBase
      slots={{ root: RootSlot, input: InputSlot }}
      renderSuffix={(state) => (
        <fieldset aria-hidden className={clsx("text-left absolute bottom-0 right-0 hover:border-white px-2 rounded-[inherit] min-w-0 overflow-hidden border border-black/20 dark:border-white/20 pointer-events-none m-0 left-0 -top-[5px]", {
          "!border-pea-500 border-2": color === 'success' && state.focused,
          "!border-red-500 border-2": color === 'error' && state.focused,
          "!border-amber-400 border-2": color === 'warning' && state.focused,
        })}>
          <legend className={clsx("w-auto overflow-hidden block invisible text-xs p-0 h-[11px] whitespace-nowrap transition-all", {
            "max-w-full": state.focused || state.filled,
            "max-w-[0.01px]": !state.focused && !state.filled
          })}>
            <span className={"px-[5px] inline-block opacity-0 visible"}>
              {state.required ? (
                <React.Fragment>
                  {"test1234"}
                  &thinsp;{'*'}
                </React.Fragment>
              ) : (
                "test1234"
              )}
            </span>
          </legend>
        </fieldset>
      )}
      slotProps={componentsProps}
      fullWidth={fullWidth}
      inputComponent={inputComponent}
      multiline={multiline}
      ref={ref}
      type={type}
      {...other}
      classes={classes}
    />
  )
})

export const TextInput = forwardRef((props: any, ref) => {
  const {
    autoComplete,
    autoFocus = false,
    children,
    className,
    color = 'primary',
    defaultValue,
    disabled = false,
    error = false,
    FormHelperTextProps,
    fullWidth = false,
    helperText,
    id: idOverride,
    InputLabelProps,
    inputProps,
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
    required = false,
    rows,
    select = false,
    SelectProps,
    type,
    value,
    variant = 'outlined',
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
    required,
    select,
    variant,
  };

  const InputMore: {
    [key: string]: any;
  } = {};

  if (variant === 'outlined') {
    InputMore.notched = true;
    if (InputLabelProps) {
      InputMore.notched = InputLabelProps.shrink;
    }
    InputMore.label = label;
  }
  if (select) {
    // unset defaults from textbox inputs
    if (!SelectProps || !SelectProps.native) {
      InputMore.id = undefined;
    }
    InputMore['aria-describedby'] = undefined;
  }
  // console.log('NOTCHED', InputLabelProps, InputMore, label != null && label !== '' && required, InputProps, required, label, `&thinsp;{'*'}`)


  const id = idOverride ?? useId();
  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
  const inputLabelId = label && id ? `${id}-label` : undefined;

  return (
    <FormControl
      className={clsx(className)}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      ref={ref}
      required={required}
      color={color}
      variant={variant}
      ownerState={ownerState}
      {...other}
    >
      {label != null && label !== '' && (
        <InputLabel htmlFor={id} id={inputLabelId} {...InputLabelProps}>
          {label}
        </InputLabel>
      )}


      {select ? (
        <select
          aria-describedby={helperTextId}
          id={id}
          labelId={inputLabelId}
          value={value}
          {...SelectProps}
        >
          {children}
        </select>
      ) : (
        <InputBase
          renderSuffix={(state) => (
            <fieldset aria-hidden className={clsx("text-left absolute bottom-0 right-0 hover:border-white px-2 rounded-[inherit] min-w-0 overflow-hidden border border-black/20 dark:border-white/20 pointer-events-none m-0 left-0 -top-[5px]", {
              "!border-pea-500 border-2": color === 'success' && state.focused,
              "!border-red-500 border-2": color === 'error' && state.focused,
              "!border-amber-400 border-2": color === 'warning' && state.focused,
            })}>
              <legend className={clsx("w-auto overflow-hidden block invisible text-xs p-0 h-[11px] whitespace-nowrap transition-all", {
                "max-w-full": state.focused || state.filled,
                "max-w-[0.01px]": !state.focused && !state.filled
              })}>
                <span className={"px-[5px] inline-block opacity-0 visible"}>
                  {label != null && label !== '' && required ? (
                    <React.Fragment>
                      {label}
                      &thinsp;{'*'}
                    </React.Fragment>
                  ) : (
                    label
                  )}
                </span>
              </legend>
            </fieldset>
          )}
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
          inputRef={inputRef}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
          inputProps={inputProps}
          {...InputMore}
          {...InputProps}
        />
      )}

      {helperText && (
        <p id={helperTextId} className="rw-helper-text" {...FormHelperTextProps}>
          {helperText}
        </p>
      )}
    </FormControl>
  )
})

export const ColorInput = () => {
  const [color, setColor] = useState("#000000");
  const [format, setFormat] = useState([
    {
      value: "hex",
      label: "HEX",
      active: true,
    },
    {
      value: "rgb",
      label: "RGB",
      active: false,
    },
    {
      value: "hwb",
      label: "HWB",
      active: false,
    },
    {
      value: "hsl",
      label: "HSL",
      active: false,
    },
  ]);

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  const arrayRotate = <T extends {}>(arr: T[], count: number = 1) => {
    const len = arr.length;
    arr.push(...arr.splice(0, ((-count % len) + len) % len));
    return arr;
  };

  const swapColor = () => {
    let newFormat = arrayRotate(format).map((item, index) => ({
      ...item,
      active: index === 0,
    }));
    setFormat(newFormat);
    convertColor(newFormat?.find((item) => item.active).value);
  };

  function hexToColor(hex, format = "rgb") {
    // Remove the hash symbol if present
    hex = hex.replace(/^#/, "");

    // Parse the hex value into RGB components
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    if (format === "rgb") {
      return `rgb(${r}, ${g}, ${b})`;
    } else if (format === "hsl") {
      // Convert RGB to HSL
      const max = Math.max(r, g, b) / 255;
      const min = Math.min(r, g, b) / 255;
      let h,
        s,
        l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r / 255:
            h = (g / 255 - b / 255) / d + (g < b ? 6 : 0);
            break;
          case g / 255:
            h = (b / 255 - r / 255) / d + 2;
            break;
          case b / 255:
            h = (r / 255 - g / 255) / d + 4;
            break;
        }

        h /= 6;
      }

      // Convert HSL to CSS hsl() format
      h = Math.round(h * 360);
      s = Math.round(s * 100);
      l = Math.round(l * 100);
      return `hsl(${h}, ${s}%, ${l}%)`;
    } else if (format === "hwb") {
      // Convert RGB to HWB
      const max = Math.max(r, g, b) / 255;
      const min = Math.min(r, g, b) / 255;
      const c = max - min;
      const bValue = 1 - max;
      const w = (1 - max) * 100;

      return `hwb(${Math.round((r / 255) * 360)}, ${Math.round(
        (g / 255) * 100
      )}%, ${Math.round((b / 255) * 100)}%, ${w}%)`;
    } else {
      return "Invalid format";
    }
  }
  function colorToHex(color) {
    // Handle RGB format
    if (/^rgb\(/.test(color)) {
      const rgbValues = color.match(/\d+/g);
      if (rgbValues.length === 3) {
        const [r, g, b] = rgbValues.map(Number);
        const hex = ((1 << 24) | (r << 16) | (g << 8) | b)
          .toString(16)
          .slice(1);
        return `#${hex}`;
      }
    }

    // Handle HSL format
    if (/^hsl\(/.test(color)) {
      const hslValues = color.match(/\d+/g);
      if (hslValues.length === 3) {
        const [h, s, l] = hslValues.map(Number);
        const hslToRgb = (h, s, l) => {
          h /= 360;
          s /= 100;
          l /= 100;
          let r, g, b;
          if (s === 0) {
            r = g = b = l;
          } else {
            const hue2rgb = (p, q, t) => {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1 / 6) return p + (q - p) * 6 * t;
              if (t < 1 / 2) return q;
              if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
              return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
          }
          return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255),
          ];
        };
        const [r, g, b] = hslToRgb(h, s, l);
        const hex = ((1 << 24) | (r << 16) | (g << 8) | b)
          .toString(16)
          .slice(1);
        return `#${hex}`;
      }
    }

    // Handle HWB format
    if (/^hwb\(/.test(color)) {
      const hwbValues = color.match(/\d+/g);
      const [h2, w2, b2] = hwbValues.map(Number);

      console.log(h2, w2, b2);
      // Convert HWB to HEX (Note: This is a simplified example)
      const h = h2;
      const w = w2 / 100;
      const b = b2 / 100;
      const s = 1 - w / (1 - b);
      const l = (1 - b) * (1 - s / 2);
      const c = 2 * (1 - l) - 1;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;
      let r, g, bValue;

      if (h >= 0 && h < 60) {
        r = c;
        g = x;
        bValue = 0;
      } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        bValue = 0;
      } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        bValue = x;
      } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        bValue = c;
      } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        bValue = c;
      } else {
        r = c;
        g = 0;
        bValue = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      bValue = Math.round((bValue + m) * 255);

      const hex = `#${((1 << 24) | (r << 16) | (g << 8) | bValue)
        .toString(16)
        .slice(1)}`;
      console.log(hex);
      return hex;
    }

    return color;
  }
  const HslToHex = (color: string) => {
    const hslValues = color
      .replace("hsl(", "")
      .split(",")
      .map((val) => parseFloat(val));
    const h = hslValues[0];
    const s = hslValues[1] / 100;
    const l = hslValues[2] / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r, g, bValue;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      bValue = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      bValue = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      bValue = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      bValue = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      bValue = c;
    } else {
      r = c;
      g = 0;
      bValue = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    bValue = Math.round((bValue + m) * 255);

    return `#${((1 << 24) | (r << 16) | (g << 8) | bValue)
      .toString(16)
      .slice(1)}`;
  };

  const convertColor = (currentformat: string) => {
    switch (currentformat) {
      case "rgb":
        if (color.startsWith("#")) {
          // Convert HEX to RGB
          let hex = color.replace(/^#/, ""); // Remove the '#' symbol if present
          let r = parseInt(hex.slice(0, 2), 16);
          let g = parseInt(hex.slice(2, 4), 16);
          let b = parseInt(hex.slice(4, 6), 16);
          console.log(`RGB: ${r}, ${g}, ${b}`);
          setColor(`rgb(${r}, ${g}, ${b})`);
        } else if (color.startsWith("hwb")) {
          // Convert HWB to RGB (Note: This is a simplified example)
          const hwbValues = color
            .replace("hwb(", "")
            .split(",")
            .map((val) => parseFloat(val));
          const h = hwbValues[0];
          const w = hwbValues[1];
          const b1 = hwbValues[2];
          const i = Math.floor(h / 60);
          const f = h / 60 - i;
          const q = 1 - w;
          const p = 1 - b1 * q;
          let r, g, b;

          switch (i) {
            case 0:
              r = 1;
              g = f;
              b = 0;
              break;
            case 1:
              r = 1 - f;
              g = 1;
              b = 0;
              break;
            case 2:
              r = 0;
              g = 1;
              b = f;
              break;
            case 3:
              r = 0;
              g = 1 - f;
              b = 1;
              break;
            case 4:
              r = f;
              g = 0;
              b = 1;
              break;
            default:
              r = 1;
              g = 0;
              b = 1 - f;
              break;
          }

          r = Math.round(r * 255);
          g = Math.round(g * 255);
          b = Math.round(b * 255);

          console.log(`RGB: ${r}, ${g}, ${b}`);
          setColor(`rgb(${r}, ${g}, ${b})`);
        } else if (color.startsWith("hsl")) {
          // Convert HSL to RGB (Note: This is a simplified example)
          const hslValues = color.split(",").map((val) => parseFloat(val));
          const h = hslValues[0];
          const s = hslValues[1] / 100;
          const l = hslValues[2] / 100;
          const c = (1 - Math.abs(2 * l - 1)) * s;
          const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
          const m = l - c / 2;
          let r, g, b;

          if (h >= 0 && h < 60) {
            r = c;
            g = x;
            b = 0;
          } else if (h >= 60 && h < 120) {
            r = x;
            g = c;
            b = 0;
          } else if (h >= 120 && h < 180) {
            r = 0;
            g = c;
            b = x;
          } else if (h >= 180 && h < 240) {
            r = 0;
            g = x;
            b = c;
          } else if (h >= 240 && h < 300) {
            r = x;
            g = 0;
            b = c;
          } else {
            r = c;
            g = 0;
            b = x;
          }

          r = Math.round((r + m) * 255);
          g = Math.round((g + m) * 255);
          b = Math.round((b + m) * 255);

          console.log(`RGB: ${r}, ${g}, ${b}`);
          setColor(`rgb(${r}, ${g}, ${b})`);
        } else {
          console.error("Invalid input format for RGB conversion");
        }
        break;

      case "hex":
        if (color.startsWith("rgb")) {
          // Convert RGB to HEX (Note: This is a simplified example)
          const rgbValues = color
            .replace("rgb(", "")
            .split(",")
            .map((val) => parseInt(val));
          const r = rgbValues[0];
          const g = rgbValues[1];
          const b = rgbValues[2];
          const hex = `#${((1 << 24) | (r << 16) | (g << 8) | b)
            .toString(16)
            .slice(1)}`;
          console.log(`HEX: ${hex}`);
          setColor(hex);
        } else if (color.startsWith("hwb")) {
          // Convert HWB to HEX (Note: This is a simplified example)
          const hwbValues = color
            .replace("hwb(", "")
            .split(",")
            .map((val) => parseFloat(val));
          const h = hwbValues[0];
          const w = hwbValues[1] / 100;
          const b = hwbValues[2] / 100;
          const s = 1 - w / (1 - b);
          const l = (1 - b) * (1 - s / 2);
          const c = 2 * (1 - l) - 1;
          const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
          const m = l - c / 2;
          let r, g, bValue;

          if (h >= 0 && h < 60) {
            r = c;
            g = x;
            bValue = 0;
          } else if (h >= 60 && h < 120) {
            r = x;
            g = c;
            bValue = 0;
          } else if (h >= 120 && h < 180) {
            r = 0;
            g = c;
            bValue = x;
          } else if (h >= 180 && h < 240) {
            r = 0;
            g = x;
            bValue = c;
          } else if (h >= 240 && h < 300) {
            r = x;
            g = 0;
            bValue = c;
          } else {
            r = c;
            g = 0;
            bValue = x;
          }

          r = Math.round((r + m) * 255);
          g = Math.round((g + m) * 255);
          bValue = Math.round((bValue + m) * 255);

          const hex = `#${((1 << 24) | (r << 16) | (g << 8) | bValue)
            .toString(16)
            .slice(1)}`;
          console.log(`HEX: ${hex}`);
          setColor(hex);
        } else if (color.startsWith("hsl")) {
          // Convert HSL to HEX (Note: This is a simplified example)

          setColor(HslToHex(color));
        } else {
          console.error("Invalid input format for HEX conversion");
        }
        break;

      case "hwb":
        if (color.startsWith("#")) {
          // Convert HEX to HWB (Note: This is a simplified example)
          const hex = color.replace(/^#/, ""); // Remove the '#' symbol if present
          const r = parseInt(hex.slice(0, 2), 16) / 255;
          const g = parseInt(hex.slice(2, 4), 16) / 255;
          const b = parseInt(hex.slice(4, 6), 16) / 255;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;
          let h, w, bValue;

          if (delta === 0) {
            h = 0;
            w = 1 - max;
            bValue = max;
          } else if (max === r) {
            h = ((g - b) / delta) % 6;
          } else if (max === g) {
            h = (b - r) / delta + 2;
          } else {
            h = (r - g) / delta + 4;
          }

          h = Math.round((h * 60 + 360) % 360);
          w = Math.round((1 - max) * 100);
          bValue = Math.round(max * 100);

          console.log(`HWB: ${h}, ${w}%, ${bValue}%`);
          setColor(`hwb(${h}, ${w}%, ${bValue}%)`);
        } else if (color.startsWith("hsl")) {
          console.log("HSL", arrayRotate(format, -1)[0].value);
          // Convert HSL to HWB (Note: This is a simplified example)
          const hslValues = color
            .replace("hsl(", "")
            .split(",")
            .map((val) => parseFloat(val));
          console.log("HSLVALUES", hslValues);

          let h = (hslValues[0] % 360) / 360;
          let s = Math.min(1, Math.max(0, hslValues[1] / 100));
          let l = Math.min(1, Math.max(0, hslValues[2] / 100));

          let W = s / (s + l);
          let B = l / (s + l);
          const w = (1 - s) * l;
          const bValue = 1 - l;
          console.log(`HWB: ${h * 360}, ${W}%, ${B}%`);
          console.log(
            `HWB: ${h}, ${Math.round(w * 100)}%, ${Math.round(bValue * 100)}%`
          );
          setColor(`hwb(${h * 360} ${Math.floor(W)}% ${Math.floor(B)}%)`);
        } else {
          console.error("Invalid input format for HWB conversion");
        }
        break;

      case "hsl":
        if (color.startsWith("#")) {
          // Convert HEX to HSL (Note: This is a simplified example)
          const hex = color.replace(/^#/, ""); // Remove the '#' symbol if present
          const r = parseInt(hex.slice(0, 2), 16) / 255;
          const g = parseInt(hex.slice(2, 4), 16) / 255;
          const b = parseInt(hex.slice(4, 6), 16) / 255;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;
          let h, s, l;

          if (delta === 0) {
            h = 0;
          } else if (max === r) {
            h = ((g - b) / delta) % 6;
          } else if (max === g) {
            h = (b - r) / delta + 2;
          } else {
            h = (r - g) / delta + 4;
          }

          h = Math.round((h * 60 + 360) % 360);
          l = (max + min) / 2;

          if (delta === 0) {
            s = 0;
          } else {
            s = delta / (1 - Math.abs(2 * l - 1));
          }

          s = Math.round(s * 100);
          l = Math.round(l * 100);

          console.log(`HSL: ${h}, ${s}%, ${l}%`);
          setColor(`hsl(${h}, ${s}%, ${l}%)`);
        } else if (color.startsWith("hwb")) {
          // Convert HWB to HSL (Note: This is a simplified example)
          const hwbValues = color
            .replace("hwb(", "")
            .split(" ")
            .map((val) => parseFloat(val));
          const h = hwbValues[0];
          const w = hwbValues[1] / 100;
          const b = hwbValues[2] / 100;
          const s = 1 - w / (1 - b);
          const l = (1 - b) * (1 - s / 2);
          console.log(
            `HSL: ${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`
          );
          setColor(
            `hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
          );
        } else {
          console.error("Invalid input format for HSL conversion");
        }
        break;

      default:
        console.error("Invalid format");
        break;
    }
  };

  return (
    <div className="rw-button-group">
      <input
        type="text"
        value={color}
        onChange={handleColorChange}
        className="rw-input border-r-none"
      />
      <input
        className="rw-input h-full max-w-[2rem] appearance-none border-l-0 border-none p-0"
        onChange={debounce((e) => {
          setColor(
            hexToColor(
              e.target.value,
              format?.find((item) => item.active).value
            )
          );
        }, 500)}
        type="color"
        value={colorToHex(color)}
      />
      <input
        className="rw-input max-w-[4rem] select-none border-l-0"
        readOnly
        value={format?.find((item) => item.active).label}
      />
      <button
        type="button"
        className="rw-button rw-button-gray -ml-px"
        onClick={swapColor}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="rw-button-icon"
        >
          <path d="M464 32C455.2 32 448 39.16 448 48v129.3C416.2 99.72 340.6 48 256 48c-102 0-188.3 72.91-205.1 173.3C49.42 230.1 55.3 238.3 64.02 239.8C64.91 239.9 65.8 240 66.67 240c7.672 0 14.45-5.531 15.77-13.34C96.69 141.7 169.7 80 256 80c72.49 0 137.3 44.88 163.6 112H304C295.2 192 288 199.2 288 208S295.2 224 304 224h160C472.8 224 480 216.8 480 208v-160C480 39.16 472.8 32 464 32zM447.1 272.2c-8.766-1.562-16.97 4.406-18.42 13.12C415.3 370.3 342.3 432 255.1 432c-72.49 0-137.3-44.88-163.6-112H208C216.8 320 224 312.8 224 304S216.8 288 208 288h-160C39.16 288 32 295.2 32 304v160C32 472.8 39.16 480 48 480S64 472.8 64 464v-129.3C95.84 412.3 171.4 464 256 464c101.1 0 188.3-72.91 205.1-173.3C462.6 281.9 456.7 273.7 447.1 272.2z" />
        </svg>
      </button>
    </div>
  );
};
