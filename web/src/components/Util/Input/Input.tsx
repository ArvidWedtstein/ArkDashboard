import {
  Controller,
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
import { CSSProperties, Children, ComponentPropsWithRef, ElementType, Fragment, HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, RefCallback, SelectHTMLAttributes, createContext, forwardRef, isValidElement, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { debounce, isEmpty } from "src/lib/formatters";
type InputOutlinedProps = {
  name?: string;
  helperText?: string;
  label?: ReactNode;
  inputClassName?: string;
  fullWidth?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'DEFAULT';
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
}: InputOutlinedProps) => {
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

  const LabelComponent: ElementType = !!name ? Label : "label";

  const InputComponent: ElementType = !!name ? type === 'textarea' ? TextAreaField : InputField : "input";

  const { className: labelClassName, style: labelStyle } = name ? useErrorStyles({
    className: `pointer-events-none absolute text-base origin-top-left z-10 transform will-change-transform duration-200 transition-transform left-0 top-0 block max-w-[calc(100%-24px)] translate-x-3.5 translate-y-4 scale-100 overflow-hidden text-ellipsis font-normal leading-6`,
    errorClassName: `pointer-events-none absolute left-0 top-0 z-10 block origin-top-left max-w-[calc(100%-24px)] translate-x-3.5 translate-y-4 scale-100 transform overflow-hidden text-ellipsis font-normal leading-6 transition-transform duration-200 text-base !text-red-600`,
    name,
  }) : { className: `pointer-events-none absolute text-base origin-top-left z-10 transform will-change-transform duration-200 transition-transform left-0 top-0 block max-w-[calc(100%-24px)] translate-x-3.5 translate-y-4 scale-100 overflow-hidden text-ellipsis font-normal leading-6`, style: {} };

  const { className: inputClassNames, style: inputStyle } = name ? useErrorStyles({
    className: `peer m-0 h-6 min-w-0 w-full box-content overflow-hidden block text-base font-[inherit] focus:outline-none disabled:pointer-events-none px-3.5 rounded-[inherit] border-0 bg-transparent py-4`,
    errorClassName: `peer m-0 box-content block h-6 w-full min-w-0 overflow-hidden rounded-[inherit] border-0 bg-transparent px-3.5 py-4 font-[inherit] text-base focus:outline-none rw-input-error`,
    name,
  }) : { className: `peer m-0 h-6 min-w-0 w-full box-content overflow-hidden block text-base font-[inherit] focus:outline-none disabled:pointer-events-none px-3.5 rounded-[inherit] border-0 bg-transparent py-4`, style: {} }

  const borders = {
    primary: `border-blue-400`,
    secondary: `border-zinc-500`,
    success: `border-pea-500`,
    error: `border-red-500`,
    warning: `border-amber-400`,
    disabled: `dark:border-white/30 border-black/30`,
    DEFAULT: `group-hover:border-black group-hover:dark:border-white border-black/20 dark:border-white/20`
  }
  const fieldsetClass = `border transition-colors ease-in duration-75 absolute text-left ${borders[disabled || field?.disabled ? 'disabled' : 'DEFAULT']} bottom-0 left-0 right-0 -top-[5px] m-0 px-2 rounded-[inherit] min-w-0 overflow-hidden pointer-events-none`;
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
        {required ? (
          <Fragment>
            {label ?? name}
            &thinsp;{'*'}
          </Fragment>
        ) : (
          label ?? name
        )}
      </LabelComponent>
      <div
        className={clsx(
          "group relative box-content inline-flex cursor-text items-center rounded text-base font-normal leading-6",
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
            fieldsetClass,
            // "!peer-invalid:border-red-500 pointer-events-none absolute m-0 min-w-0 overflow-hidden rounded-[inherit] border border-zinc-500 px-2 text-left transition duration-75 peer-hover:border-2 peer-hover:border-zinc-300 peer-focus:border-2 peer-focus:border-zinc-300 peer-disabled:border peer-disabled:border-zinc-500",
            {
              "top-0": focus || !isEmpty(field?.value) || !!props?.placeholder,
            }
          )}
        >
          <legend className={clsx("w-auto overflow-hidden block invisible text-xs p-0 h-[11px] whitespace-nowrap transition-all", {
            "max-w-full": focus || !isEmpty(field?.value) || !!props?.placeholder,
            "max-w-[0.01px]": !(focus || !isEmpty(field?.value) || !!props?.placeholder)
          })}>
            <span className="visible inline-block px-1 opacity-0">
              {required ? (
                <Fragment>
                  {label ?? name}
                  &thinsp;{'*'}
                </Fragment>
              ) : (
                label ?? name
              )}
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
interface FormControlOwnProps {
  children?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'DEFAULT';
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  focused?: boolean;
  margin?: 'dense' | 'normal' | 'none';
  required?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'standard' | 'outlined' | 'filled';
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
  RootComponent extends React.ElementType = 'div',
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
  | 'color'
  | 'disabled'
  | 'error'
  | 'fullWidth'
  | 'margin'
  | 'required'
  | 'size'
  | 'variant'
  | 'label'
  | 'shrink';

type FormControlProps<
  RootComponent extends ElementType = FormControlTypeMap['defaultComponent'],
  AdditionalProps = {},
> = OverrideProps<FormControlTypeMap<AdditionalProps, RootComponent>, RootComponent> & {
  component?: ElementType;
};
interface FormControlContextValue extends Pick<FormControlProps, ContextFromPropsKey> {
  adornedStart: boolean;
  filled: boolean;
  focused: boolean;
  onBlur: (event?: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onEmpty: () => void;
  onFilled: () => void;
  setAdornedStart: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormControlContext = createContext<FormControlContextValue | undefined>(undefined);
const useFormControl = (): FormControlContextValue | undefined => useContext(FormControlContext);

export const FormControl = forwardRef<HTMLDivElement, FormControlProps>((props, ref) => {
  const {
    children,
    className,
    color = 'DEFAULT',
    disabled = false,
    error = false,
    focused: visuallyFocused,
    fullWidth = false,
    margin = 'none',
    required = false,
    size = 'medium',
    variant = 'outlined',
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
    // We need to iterate through the children and find the Input in order
    // to fully support server-side rendering.
    let initialFilled = false;

    if (children) {
      Children.forEach(children, (child) => {
        if (!isValidElement(child)) {
          return;
        }

        if ((child.props &&
          (((child.props.value != null && !(Array.isArray(child.props.value) && child.props.value.length === 0)) && child.props.value !== '') ||
            ((child.props.defaultValue != null && !(Array.isArray(child.props.defaultValue) && child.props.defaultValue.length === 0)) && child.props.defaultValue !== ''))) || (
            child.props.inputProps &&
            (((child.props.inputProps.value != null && !(Array.isArray(child.props.inputProps.value) && child.props.inputProps.value.length === 0)) && child.props.inputProps.value !== '') ||
              ((child.props.inputProps.defaultValue != null && !(Array.isArray(child.props.inputProps.defaultValue) && child.props.inputProps.defaultValue.length === 0)) && child.props.inputProps.defaultValue !== ''))
          )) {
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
        className={clsx("relative mx-0 inline-flex min-w-0 flex-col p-0 align-top text-black dark:text-white", {
          "w-full": fullWidth,
          "mt-4 mb-2": ownerState.margin === 'normal',
          "mt-2 mb-1": ownerState.margin === 'dense',
        })}
        ref={ref}
        {...other}
      >
        {children}
      </div>
    </FormControlContext.Provider>
  )
})

type InputLabelProps = {
  color?: 'primary' | 'secondary' | 'warning' | 'success' | 'error' | 'DEFAULT';
  variant?: 'outlined' | 'filled' | 'standard';
  className?: string;
  shrink?: boolean;
  disabled?: boolean;
  required?: boolean;
  disableAnimation?: boolean;
  children?: ReactNode;
} & LabelHTMLAttributes<HTMLLabelElement>;
export const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>((props, ref) => {
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
      small: { close: `max-w-[calc(100%-24px)] translate-x-3.5 translate-y-2 scale-100`, open: `scale-75 translate-x-3.5 -translate-y-[9px] max-w-[calc(133%-32px)] pointer-events-auto` },
      medium: { close: `max-w-[calc(100%-24px)] translate-x-3.5 translate-y-4 scale-100`, open: `scale-75 translate-x-3.5 -translate-y-[9px] max-w-[calc(133%-32px)] pointer-events-auto` },
      large: { close: `max-w-[calc(100%-24px)] translate-x-3.5 translate-y-6 scale-100`, open: `scale-75 translate-x-3.5 -translate-y-[9px] max-w-[calc(133%-32px)] pointer-events-auto` },
    },
    filled: {
      small: { close: `max-w-[calc(100%-24px)] translate-x-3 translate-y-3 scale-100`, open: `scale-75 translate-x-3 translate-y-1 max-w-[calc(133%-24px)] pointer-events-auto` },
      medium: { close: `max-w-[calc(100%-24px)] translate-x-3 translate-y-4 scale-100`, open: `scale-75 translate-x-3 translate-y-[7px] max-w-[calc(133%-24px)] pointer-events-auto` },
      large: { close: `max-w-[calc(100%-24px)] translate-x-3 translate-y-5 scale-100`, open: `scale-75 translate-x-3 translate-y-3 max-w-[calc(133%-24px)] pointer-events-auto` },
    },
    standard: {
      small: { close: `max-w-[100%] translate-x-0 translate-y-4 scale-100`, open: `scale-75 translate-x-0 -translate-y-[1.5px] max-w-[133%]` },
      medium: { close: `max-w-[100%] translate-x-0 translate-y-5 scale-100`, open: `scale-75 translate-x-0 -translate-y-[1.5px] max-w-[133%]` },
      large: { close: `max-w-[100%] translate-x-0 translate-y-6 scale-100`, open: `scale-75 translate-x-0 -translate-y-[1.5px] max-w-[133%]` },
    }
  }
  const colors = {
    primary: `text-blue-400`,
    secondary: `text-zinc-500`,
    success: `text-green-500`,
    error: `text-red-500`,
    warning: `text-amber-400`,
    disabled: `dark:text-white/50 text-black/50`,
    DEFAULT: `dark:text-white text-black`,
    DEFAULTNOFOCUS: `dark:text-white/70 text-black/70`,
  }

  const labelClasses = {
    outlined: `text-base leading-6 p-0 block origin-top-left whitespace-nowrap overflow-hidden text-ellipsis absolute left-0 top-0 z-10 pointer-events-none select-none transition-transform`,
    filled: `text-base leading-6 p-0 block origin-top-left whitespace-nowrap overflow-hidden text-ellipsis absolute left-0 top-0 z-10 pointer-events-none select-none transition-transform`,
    standard: `text-base leading-6 p-0 block origin-top-left whitespace-nowrap overflow-hidden text-ellipsis absolute left-0 top-0 transition-transform`,
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
  }

  const kids = state.required ? (
    <Fragment>
      {children}
      &thinsp;{'*'}
    </Fragment>
  ) : (
    children
  )

  formControl.label = kids;
  formControl.shrink = shrink;

  const { size, focused, disabled } = state;

  return (
    <label
      data-shrink={shrink}
      aria-disabled={disabled}
      className={clsx(
        labelClasses[state.variant],
        labelSize[state.variant][size][focused || shrink ? 'open' : 'close'],
        className,
        colors[disabled ? 'disabled' : state.error ? 'error' : focused ? (fcs.color || color) : 'DEFAULTNOFOCUS'],
      )}
      ref={ref}
      children={kids}
      {...other}
    />
  )
})

type InputBaseProps = {
  className?: string;
  'aria-describedby'?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'DEFAULT';
  variant?: 'outlined' | 'filled' | 'standard';
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
  inputProps?: React.HTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
    [arbitrary: string]: any;
  };
  inputRef?: React.Ref<any>;
  margin?: 'dense' | 'normal' | 'none';
  multiline?: boolean;
  name?: string;
  label?: ReactNode;
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
  }) => ReactNode;
  rows?: number;
  maxRows?: string | number;
  minRows?: string | number;
  size?: 'small' | 'medium' | 'large';
  /**
   * You can override the existing props or add new ones.
   *
   * @default {}
   */
  // slotProps?: {
  //   root?: HTMLAttributes<HTMLDivElement> & { style?: CSSProperties };
  //   input?: InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & { style?: CSSProperties };
  // };
  startAdornment?: ReactNode;
  startAdornmentProps?: HTMLAttributes<HTMLDivElement>;
  type?: string;
  value?: unknown;
}
export const InputBase = forwardRef<HTMLDivElement, InputBaseProps>((props, ref) => {
  const {
    'aria-describedby': ariaDescribedby,
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
    renderSuffix,
    rows,
    size,
    // slotProps = {},
    startAdornment,
    startAdornmentProps,
    type = 'text',
    value: valueProp,
    variant,
    ...other
  } = props;


  const inputRef = useRef();
  const [focused, setFocused] = useState(false);
  const formControl = useFormControl();

  const value = inputPropsProp.value != null ? inputPropsProp.value : valueProp;
  const { current: isControlled } = useRef(value != null);

  const onFilled = formControl && formControl.onFilled;
  const onEmpty = formControl && formControl.onEmpty;

  const checkDirty = useCallback(
    (obj) => {
      if (obj &&
        ((obj.value != null && !(Array.isArray(obj.value) && obj.value.length === 0)) && obj.value !== '')) {
        if (onFilled) {
          onFilled();
        }
      } else if (onEmpty) {
        onEmpty();
      }
    },
    [onFilled, onEmpty],
  );


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
      handleInputRefWarning,
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


  const fcs = formControlState({
    props,
    formControl,
    states: ['color', 'disabled', 'error', 'size', 'required', 'filled', 'variant', 'label'],
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

  let InputComponent: ElementType<HTMLAttributes<HTMLInputElement | HTMLTextAreaElement>> = 'input';
  let inputProps = inputPropsProp;

  if (multiline) {
    inputProps = {
      type: undefined,
      rows: rows ? rows : minRows || maxRows,
      ...inputProps,
    };

    InputComponent = 'textarea'
  }

  const handleAutoFill = (event) => {
    checkDirty(event.animationName === 'auto-fill-cancel' ? inputRef.current : { value: 'x' });
  };

  useEffect(() => {
    if (formControl) {
      formControl.setAdornedStart(Boolean(startAdornment));
    }
  }, [formControl, startAdornment]);

  const ownerState = {
    ...props,
    color: fcs.color as InputBaseProps['color'] || 'primary',
    disabled: fcs.disabled || disabled,
    endAdornment,
    error: fcs.error,
    focused: fcs.focused,
    formControl: formControl,
    fullWidth,
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
    filled: {
      small: `pt-5 px-3 pb-1`, // py-2 px-3 without label
      medium: `py-6 px-3 pb-2`, // py-4 px-3 if no label
      large: `pt-7 px-3 pb-3`,
    }
  }

  const borders = {
    primary: `after:border-blue-400`,
    secondary: `after:border-zinc-500`,
    success: `after:border-pea-500`,
    error: `after:border-red-500`,
    warning: `after:border-amber-400`,
    DEFAULT: `after:border-black after:dark:border-white`
  }

  const inputBaseClasses = {
    outlined: `rounded ${startAdornment && endAdornment ? 'px-3.5' : startAdornment ? 'pl-3.5' : endAdornment ? 'pr-3.5' : ''}`,
    filled: `dark:bg-white/10 hover:dark:bg-white/[.13] bg-black/10 hover:bg-black/[.13] rounded-t transition-colors ${startAdornment ? 'pl-3' : endAdornment ? 'pr-3' : ''}`,
    standard: `mt-4`,
  }

  const inputBaseClassesBefore = {
    outlined: ``,
    filled: `before:content-[''] before:border-b before:dark:border-white/70 before:border-black/40 before:absolute before:left-0 before:bottom-0 before:right-0 before:pointer-events-none before:transition-colors before:ease-in-out before:duration-75 hover:before:border-black hover:before:dark:border-white`,
    standard: `before:content-['"\\00a0"'] before:border-b before:dark:border-white/70 before:border-black/40 before:absolute before:left-0 before:bottom-0 before:right-0 before:pointer-events-none before:transition-all before:ease-in-out before:duration-75 hover:before:border-b-2 hover:before:border-black hover:before:dark:border-white`,
  }
  // TODO: add react-form-hook error classes here instead
  const inputBaseClassesAfter = {
    outlined: ``,
    filled: `after:content-[''] after:border-b-2 after:absolute after:left-0 after:bottom-0 after:right-0 after:pointer-events-none after:transform after:transition-transform ${ownerState.focused ? 'after:transform after:scale-x-100 after:translate-x-0' : 'after:scale-x-0 '} ${fcs.error ? `before:!border-red-500 after:border-red-500` : borders[ownerState.color ?? 'DEFAULT']}`,
    standard: `after:content-[''] after:border-b-2 after:absolute after:left-0 after:bottom-0 after:right-0 after:pointer-events-none after:transform after:transition-transform ${ownerState.focused ? 'after:transform after:scale-x-100 after:translate-x-0' : 'after:scale-x-0'} ${fcs.error ? `before:!border-red-500 hover:before:border-b after:border-red-500` : borders[ownerState.color ?? 'DEFAULT']}`,
  }
  const classes = {
    root: 'relative box-border inline-flex cursor-text items-center text-base font-normal leading-6',
    input: `font-[inherit] leading-[inherit] text-current m-0 h-6 min-w-0 ${((formControl.label || props.label)?.toString().length > 0 && !(formControl.filled || formControl.focused || formControl.adornedStart || formControl.shrink)) || (formControl.filled || formControl.adornedStart) ? 'placeholder:opacity-0' : 'placeholder:opacity-100'} focus:outline-none box-content block disabled:pointer-events-none rounded-[inherit] border-0 bg-transparent ${inputSize[ownerState.variant][ownerState.size]} ${ownerState.variant === 'filled' || ownerState.variant === 'outlined' ? startAdornment ? 'pl-0' : endAdornment ? 'pr-0' : '' : ''}`
  };

  // const rootProps = slotProps.root || {};

  // inputProps = { ...inputProps, ...slotProps.input };
  inputProps = { ...inputProps };
  return (
    <Fragment>
      <div
        // {...rootProps}
        ref={ref}
        onClick={handleClick}
        {...other}
        className={clsx(
          'group',
          classes.root,
          inputBaseClasses[ownerState.variant],
          inputBaseClassesBefore[ownerState.variant],
          inputBaseClassesAfter[ownerState.variant],
          {
            'pointer-events-none': readOnly,
            "dark:text-white/50 text-black/50 cursor-default before:border-dotted pointer-events-none": ownerState.disabled
          },
          // rootProps.className,
          className,
        )}
      >
        {startAdornment && (
          <div
            className={clsx("mr-2 flex h-[0.01em] max-h-[2em] items-center whitespace-nowrap", startAdornmentProps?.className, {
              "mt-4": ownerState.variant === 'filled'
            })}
            {...startAdornmentProps}
          >
            {startAdornment}
          </div>
        )}
        <FormControlContext.Provider value={null}>
          <InputComponent
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
            className={clsx("ml-2 flex h-[0.01em] max-h-[2em] items-center whitespace-nowrap text-black/70 dark:text-white/70", endAdornmentProps?.className)}
            {...endAdornmentProps}
          >
            {endAdornment}
          </div>
        )}

        {renderSuffix ? (
          renderSuffix({
            ...fcs,
            startAdornment
          })
        ) : null}
      </div>
    </Fragment>
  )
})

type InputProps = {
  autoComplete?: string;
  autoFocus?: boolean;
  children?: ReactNode;
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'DEFAULT';
  defaultValue?: string | number | readonly string[];
  disabled?: boolean;
  error?: boolean;
  FormHelperTextProps?: Partial<HTMLAttributes<HTMLParagraphElement>>;
  fullWidth?: boolean;
  helperText?: ReactNode;
  id?: string;
  InputLabelProps?: Partial<InputLabelProps>;
  inputProps?: InputBaseProps['inputProps'];
  InputProps?: Partial<InputBaseProps>;
  SuffixProps?: Partial<HTMLAttributes<HTMLFieldSetElement>>;
  inputRef?: React.Ref<any>;
  label?: ReactNode;
  multiline?: boolean;
  name?: string;
  onBlur?: InputBaseProps['onBlur'];
  onFocus?: InputBaseProps['onFocus'];
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  maxRows?: string | number;
  minRows?: string | number;
  margin?: 'dense' | 'normal' | 'none';
  variant?: 'standard' | 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  type?: InputHTMLAttributes<unknown>['type'];
  value?: string | number | readonly string[];
}
export const Input = forwardRef<HTMLDivElement, InputProps>((props, ref) => {
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
    SuffixProps,
    type,
    value,
    variant = 'outlined',
    size,
    margin = 'normal',
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

  const borders = {
    primary: `border-blue-400`,
    secondary: `border-zinc-500`,
    success: `border-pea-500`,
    error: `border-red-500`,
    warning: `border-amber-400`,
    disabled: `dark:border-white/30 border-black/30`,
    DEFAULT: `border-black dark:border-white`,
    DEFAULTNOFOCUS: `group-hover:border-black group-hover:dark:border-white border-black/20 dark:border-white/20`
  }

  const id = idOverride ?? useId();
  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
  const inputLabelId = label && id ? `${id}-label` : undefined;

  // TODO: fix error styles
  return (
    <FormControl
      className={className}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      ref={ref}
      required={required}
      color={color}
      variant={variant}
      ownerState={ownerState}
      margin={margin}
      {...other}
    >
      {label != null && label !== '' && (
        <InputLabel htmlFor={id} id={inputLabelId} {...InputLabelProps}>
          {label}
        </InputLabel>
      )}
      {name ? (
        <Controller
          name={name}
          defaultValue={value}
          render={({ field, fieldState, formState }) => (
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
              value={field.value || value}
              id={id}
              ref={field.ref}
              inputRef={inputRef}
              onBlur={(e) => {
                onBlur?.(e);
                field.onBlur();
              }}
              onChange={(e) => {
                onChange?.(e);
                field.onChange(e);
              }}
              onFocus={onFocus}
              placeholder={placeholder}
              inputProps={inputProps}
              {...InputProps}
              renderSuffix={(state) => (
                variant === 'outlined' ? (
                  <fieldset {...SuffixProps} aria-hidden className={clsx(`border transition-colors ease-in duration-75 absolute text-left ${borders[disabled || state.disabled ? 'disabled' : state.focused ? color : 'DEFAULTNOFOCUS']} bottom-0 left-0 right-0 -top-[5px] m-0 px-2 rounded-[inherit] min-w-0 overflow-hidden pointer-events-none`, {
                    "border-2": state.focused,
                  }, SuffixProps?.className)}>
                    <legend className={clsx("w-auto overflow-hidden block invisible text-xs p-0 h-[11px] whitespace-nowrap transition-all", {
                      "max-w-full": state.focused || state.filled || props?.InputLabelProps?.shrink,
                      "max-w-[0.01px]": !state.focused && !state.filled && !props?.InputLabelProps?.shrink
                    })}>
                      {label && label !== "" && (
                        <span className={"px-[5px] inline-block opacity-0 visible text-current"}>
                          {state.required ? (
                            <React.Fragment>
                              {label}
                              &thinsp;{'*'}
                            </React.Fragment>
                          ) : (
                            label
                          )}
                        </span>
                      )}
                    </legend>
                  </fieldset>
                ) : null
              )}
            // {...InputMore}
            />

          )}
        />
      ) : (
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
          inputRef={inputRef}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
          inputProps={inputProps}
          {...InputProps}
          renderSuffix={(state) => (
            variant === 'outlined' ? (
              <fieldset {...SuffixProps} aria-hidden className={clsx(`border transition-colors ease-in duration-75 absolute text-left ${borders[disabled || state.disabled ? 'disabled' : state.focused ? color : 'DEFAULT']} bottom-0 left-0 right-0 -top-[5px] m-0 px-2 rounded-[inherit] min-w-0 overflow-hidden pointer-events-none`, {
                "border-2": state.focused
              }, SuffixProps?.className)}>
                <legend className={clsx("w-auto overflow-hidden block invisible text-xs p-0 h-[11px] whitespace-nowrap transition-all", {
                  "max-w-full": state.focused || state.filled || props?.InputLabelProps?.shrink,
                  "max-w-[0.01px]": !state.focused && !state.filled && !props?.InputLabelProps?.shrink
                })}>
                  {label && label !== "" && (
                    <span className={"px-[5px] inline-block opacity-0 visible"}>
                      {state.required ? (
                        <React.Fragment>
                          {label}
                          &thinsp;{'*'}
                        </React.Fragment>
                      ) : (
                        label
                      )}
                    </span>
                  )}
                </legend>
              </fieldset>
            ) : null
          )}
        // {...InputMore}
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
