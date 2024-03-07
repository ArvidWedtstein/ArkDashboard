import clsx from "clsx";
import Ripple from "../Ripple/Ripple";
import {
  AnchorHTMLAttributes,
  CSSProperties,
  Children,
  Context,
  ElementType,
  LinkHTMLAttributes,
  ReactNode,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useRef,
} from "react";
import { permission } from "types/graphql";
import { useAuth } from "src/auth";
import { useRipple } from "src/hooks/useRipple";

type IButtonGroupContext = {
  className?: string;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  disabled?: boolean;
  disableRipple?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "text" | "contained" | "outlined" | "icon";
};

export const ButtonGroupContext: Context<IButtonGroupContext> = createContext<IButtonGroupContext>({});
export const ButtonGroupButtonContext: Context<string | undefined> = createContext<string | undefined>(undefined);

export type ButtonProps = {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | 'DEFAULT';
  variant?: "text" | "contained" | "outlined" | "elevated" | "icon";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
  disableRipple?: boolean;
  centerRipple?: boolean;
  /**
   * Ignores the buttongroupcontext and therefore doesnt overwrite border radius
   */
  ignoreButtonGroupPosition?: boolean;
  /**
   * Will not render if user does not have permission or user is not logged in and permission is defined
   */
  permission?: permission | 'authenticated';
  to?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props: ButtonProps, ref) => {
    const { variant: contextVariant, size: contextSize, color: contextColor, disabled: contextDisabled, fullWidth: contextFullWidth, className: contextClassName, disableRipple: contextDisableRipple, ...contextRestProps } = useContext(ButtonGroupContext);

    const buttonGroupButtonContextPositionClassName = useContext(
      ButtonGroupButtonContext
    );

    const {
      children,
      variant = contextVariant || "text",
      size = contextSize || "medium",
      color = contextColor || "primary",
      disabled = contextDisabled || false,
      startIcon: startIconProp,
      endIcon: endIconProp,
      disableRipple = contextDisableRipple,
      centerRipple: centerRippleProp = (props.variant || contextVariant || "text") === 'icon',
      fullWidth = contextFullWidth || false,
      type = "button",
      permission,
      ignoreButtonGroupPosition = false,
      ...other
    } = props;

    if (permission) {
      const { currentUser, isAuthenticated } = useAuth();
      if (currentUser && (permission === 'authenticated' ? !isAuthenticated : !currentUser?.permissions.some((perm) => perm === permission))) {
        return;
      }
    }
    const sizes = {
      text: {
        small: `text-xs leading-7 py-1 px-1.5`,
        medium: `text-sm leading-7 py-1.5 px-2`,
        large: `text-base leading-7 py-2 px-3`,
      },
      contained: {
        small: `text-xs leading-7 py-1 px-2.5`,
        medium: `text-sm leading-7 py-1.5 px-4`,
        large: `text-base leading-7 py-2 px-[22px]`,
      },
      outlined: {
        small: `text-xs leading-7 py-[3px] px-[9px]`,
        medium: `text-sm leading-7 py-[5px] px-[15px]`,
        large: `text-base leading-7 py-[7px] px-[21px]`,
      },
      elevated: {
        small: `text-xs leading-7 py-[3px] px-[9px]`,
        medium: `text-sm leading-7 py-[5px] px-[15px]`,
        large: `text-base leading-7 py-[7px] px-[21px]`,
      },
      icon: {
        small: `p-1.5 text-lg [&>svg]:w-4 [&>svg]:h-4`,
        medium: `p-2 text-2xl [&>svg]:w-5 [&>svg]:h-5`,
        large: `p-3 text-3xl [&>svg]:w-6 [&>svg]:h-6`,
      },
    };

    // TODO: replace colors with tailwind colors
    const colors = {
      text: {
        primary: "text-primary-400 hover:bg-primary-400 hover:bg-opacity-10",
        secondary: "text-secondary-400 hover:bg-secondary-400 hover:bg-opacity-10",
        success: "text-success-500 hover:bg-success-500 hover:bg-opacity-10",
        warning: "text-warning-400 hover:bg-warning-400 hover:bg-opacity-10",
        error: "text-error-500 hover:bg-error-500 hover:bg-opacity-10",
        DEFAULT: "dark:text-white text-black hover:bg-black dark:hover:bg-white dark:hover:bg-opacity-10 hover:bg-opacity-10"
      },
      contained: {
        primary:
          "bg-primary-400 border-primary-500 hover:bg-primary-500 dark:text-black/90 text-white shadow-sm hover:shadow-md",
        secondary:
          "bg-secondary-500 border-secondary-600 hover:bg-secondary-600 dark:text-black/90 text-white shadow-sm hover:shadow-md",
        success:
          "bg-success-600 border-success-600 hover:bg-success-700 text-white shadow-sm hover:shadow-md",
        warning:
          "bg-warning-400 border-warning-500 hover:bg-warning-500 dark:text-black/90 text-white shadow-sm hover:shadow-md",
        error:
          "bg-error-500 border-error-600 hover:bg-error-600 text-white shadow-sm hover:shadow-md",
        DEFAULT: "dark:bg-white dark:border-white dark:hover:bg-zinc-100 dark:text-black bg-zinc-900 border-zinc-900 hover:bg-black text-white shadow-sm hover:shadow-md"
      },
      outlined: {
        primary:
          "text-primary-400 border border-primary-400 border-opacity-50 hover:border-opacity-100 hover:bg-primary-400 hover:bg-opacity-10",
        secondary:
          "text-secondary-400 border border-secondary-400 border-opacity-50 hover:border-opacity-100 hover:bg-secondary-400 hover:bg-opacity-10",
        success:
          "text-success-500 border border-success-500 border-opacity-50 hover:border-opacity-100 hover:bg-success-500 hover:bg-opacity-10",
        warning:
          "text-warning-400 border border-warning-400 border-opacity-50 hover:border-opacity-100 hover:bg-warning-400 hover:bg-opacity-10",
        error:
          "text-error-500 border border-error-500 border-opacity-50 hover:border-opacity-100 hover:bg-error-500 hover:bg-opacity-10",
        DEFAULT: "dark:text-white border text-black dark:border-white border-black dark:border-opacity-50 border-opacity-50 hover:border-opacity-100 hover:bg-black dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10"
      },
      elevated: {
        primary: "bg-gradient-to-tr from-primary-500 to-primary-400 border-b-4 border-l-2 active:border-primary-500 active:shadow-none shadow-lg border-primary-600 text-white",
        secondary: "bg-gradient-to-tr from-secondary-500 to-secondary-400 border-b-4 border-l-2 active:border-secondary-500 active:shadow-none shadow-lg border-secondary-600 text-white",
        success: "bg-gradient-to-tr from-success-600 to-success-500 border-b-4 border-l-2 active:border-success-600 active:shadow-none shadow-lg border-success-700 text-white",
        warning: "bg-gradient-to-tr from-warning-500 to-warning-400 border-b-4 border-l-2 active:border-warning-500 active:shadow-none shadow-lg border-warning-600 text-white",
        error: "bg-gradient-to-tr from-error-600 to-error-500 border-b-4 border-l-2 active:border-error-600 active:shadow-none shadow-lg border-error-700 text-white",
        DEFAULT: "text-white dark:text-black bg-gradient-to-tr dark:from-zinc-200 dark:to-zinc-100 from-zinc-900 to-zinc-800 border-b-4 border-l-2 dark:active:border-zinc-200 active:border-zinc-700 active:shadow-none shadow-lg border-zinc-900 dark:border-zinc-300"
      },
      icon: {
        primary: "text-primary-400 hover:bg-primary-400 hover:bg-opacity-10",
        secondary: "text-secondary-400 hover:bg-secondary-400 hover:bg-opacity-10",
        success: "text-success-500 hover:bg-success-500 hover:bg-opacity-10",
        warning: "text-warning-400 hover:bg-warning-400 hover:bg-opacity-10",
        error: "text-error-500 hover:bg-error-500 hover:bg-opacity-10",
        DEFAULT: "text-black dark:text-white hover:bg-black dark:hover:bg-white dark:hover:bg-opacity-10 hover:bg-opacity-10"
      },
    };

    const disabledClasses = {
      text: `pointer-events-none cursor-default dark:text-white/30 text-black/30`,
      contained: `shadow-none pointer-events-none cursor-default dark:text-white/30 dark:bg-white/[.12] bg-black/[.12] text-black/30`,
      outlined: `pointer-events-none cursor-default dark:text-white/30 dark:border-white/[.12] text-black/30 border-black/[.12]`,
      icon: `pointer-events-none cursor-default dark:text-white/30 text-black/30`,
    };
    const base = `inline-flex items-center justify-center box-border relative cursor-pointer select-none appearance-none font-medium uppercase tracking-wide ${variant === "icon"
      ? "[&>svg]:inline-block aspect-square rounded-circle text-center [&>svg]:fill-current flex-[0_0_auto] [&>svg]:shrink-0 overflow-visible"
      : "rounded"
      }`;

    const classNames = clsx(
      contextClassName,
      base,
      sizes[variant][size],
      colors[variant][color],
      props.className,
      {
        [disabledClasses[variant]]: disabled,
        [buttonGroupButtonContextPositionClassName]: !ignoreButtonGroupPosition,
        "w-full": fullWidth
      },
    );

    const renderIcon = (iconProp: ReactNode, side: 'start' | 'end' = 'start') => {
      return iconProp && variant !== 'icon' && (
        <span
          className={clsx(`[&>svg]:shrink-0 select-none [&>svg]:inline-block [&>svg]:fill-current ${side === 'start' ? 'mr-2 -ml-1' : 'ml-2 -mr-1'}`, {
            "[&>svg]:h-3 [&>svg]:w-3": size === 'small',
            "[&>svg]:h-4 [&>svg]:w-4": size === 'medium',
            "[&>svg]:h-5 [&>svg]:w-5": size === 'large',
          })}
          style={{
            display: "inherit",
          }}
        >
          {iconProp}
        </span>
      )
    }

    const rippleRef = useRef(null);
    const { enableRipple, getRippleHandlers } = useRipple({
      disabled,
      disableRipple,
      rippleRef
    })

    const startIcon = renderIcon(startIconProp, 'start');
    const endIcon = renderIcon(endIconProp, 'end');

    const Root: ElementType = props.href || props.to ? "a" : "button";

    const componentProps = {
      ...other,
      className: classNames,
      disabled,
      ref,
      ...(props.href || props.to
        ? { href: props.href || props.to }
        : { type: type }),
    };
    return (
      <Root
        className={classNames}
        {...componentProps}
        ref={
          ref as React.LegacyRef<HTMLButtonElement> &
          React.LegacyRef<HTMLAnchorElement>
        }
        {...contextRestProps}
        {...getRippleHandlers(props)}
      >
        {startIcon}
        {children}
        {endIcon}
        {enableRipple ? (
          <Ripple ref={rippleRef} center={centerRippleProp} />
        ) : null}
      </Root>
    );
  }
);

export default Button;

const getStyles = (
  orientation: 'horizontal' | 'vertical',
  variant: 'contained' | 'outlined' | 'text' | 'icon',
  button: 'first' | 'middle' | 'last'
) => {
  const isHorizontal = orientation === 'horizontal';

  const btnMap = {
    first: [isHorizontal ? `rounded-r-none` : `rounded-b-none`],
    middle: [isHorizontal ? `rounded-r-none rounded-l-none` : `rounded-b-none rounded-t-none`],
    last: [isHorizontal ? `rounded-l-none` : `rounded-t-none`],
  };
  switch (variant) {
    case "text":
      if (button === 'first' || button === 'middle') {
        btnMap[button].push(isHorizontal ? `border-r` : `border-b`);
      }
      break;
    case "outlined":
      if (button === 'first' || button === 'middle') {
        btnMap[button].push(isHorizontal ? `border-r-transparent hover:border-r-current` : `border-b-transparent hover:border-b-current`);
      }
      if (button === 'middle' || button === 'last') {
        btnMap[button].push(isHorizontal ? '-ml-px' : '-mt-px');
      }
      break;
    case "contained":
      if (button === 'first' || button === 'middle') {
        btnMap[button].push(isHorizontal ? `border-r` : `border-b`);
      }
      break;
    default:
      break;
  }

  return btnMap[button].join(' ');
};

type ButtonGroupProps = {
  children?: ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  disabled?: boolean;
  disableRipple?: boolean;
  fullWidth?: boolean;
  orientation?: "vertical" | "horizontal";
  size?: "small" | "medium" | "large";
  variant?: "text" | "outlined" | "contained" | "icon";
  className?: string;
  style?: CSSProperties;
} & React.HTMLAttributes<HTMLDivElement>;

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>((props, ref) => {
  const {
    children,
    className,
    color = 'primary',
    disabled = false,
    disableRipple = false,
    fullWidth = false,
    orientation = 'horizontal',
    size = 'medium',
    variant = 'outlined',
    style,
    ...otherProps
  } = props;

  const validChildren = Children.toArray(children).filter((child) =>
    isValidElement(child),
  );

  const childrenCount = validChildren.length;

  const getButtonPositionClassName = (index) => {
    const isFirstButton = index === 0;
    const isLastButton = index === childrenCount - 1;

    if (isFirstButton && isLastButton) {
      return '';
    }
    if (isFirstButton) {
      return getStyles(orientation, variant, 'first');
    }
    if (isLastButton) {
      return getStyles(orientation, variant, 'last');
    }
    return getStyles(orientation, variant, 'middle');
  };

  return (
    <div
      className={clsx("inline-flex rounded", { "flex-col": orientation === "vertical", "w-full": fullWidth }, className)}
      role="group"
      ref={ref}
    >
      <ButtonGroupContext.Provider value={{
        color,
        disabled,
        disableRipple,
        fullWidth,
        size,
        variant,
      }}>
        {validChildren.map((child, index) => (
          <ButtonGroupButtonContext.Provider
            key={index}
            value={getButtonPositionClassName(index)}
            {...otherProps}
          >
            {child}
          </ButtonGroupButtonContext.Provider>
        ))}
      </ButtonGroupContext.Provider>
    </div>
  );
});
