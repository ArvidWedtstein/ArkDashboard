import clsx from "clsx";
import Ripple from "../Ripple/Ripple";
import {
  CSSProperties,
  Children,
  ComponentPropsWithRef,
  Context,
  ElementType,
  LinkHTMLAttributes,
  ReactElement,
  ReactNode,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
  useRef,
} from "react";
import { permission } from "types/graphql";
import { useAuth } from "src/auth";
import { useRipple } from "src/components/useRipple";

type ButtonGroupOwnProps = {
  children?: React.ReactNode;
  /**
   * @default 'primary'
   */
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  disabled?: boolean;
  disableRipple?: boolean;
  fullWidth?: boolean;
  /**
   * @default 'horizontal'
   */
  orientation?: "vertical" | "horizontal";
  /**
   * @default 'medium'
   */
  size?: "small" | "medium" | "large";
  /**
   * @default 'outlined'
   */
  variant?: "text" | "outlined" | "contained" | "icon";
}

type IButtonGroupContext = {
  className?: string;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  disabled?: boolean;
  disableRipple?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "text" | "contained" | "outlined" | "icon";
};

const ButtonGroupContext: Context<IButtonGroupContext> = createContext<IButtonGroupContext>({});
const ButtonGroupButtonContext: Context<string | undefined> = createContext<string | undefined>(undefined);

// TODO: fix button events handlers for link and button
type ButtonProps = {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | 'DEFAULT';
  variant?: "text" | "contained" | "outlined" | "icon";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
  disableRipple?: boolean;
  centerRipple?: boolean;
  /**
   * Will not render if user does not have permission or user is not logged in and permission is defined
   */
  permission?: permission | 'authenticated';
  to?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  LinkHTMLAttributes<HTMLAnchorElement>;

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
      icon: {
        small: `p-1.5 text-lg [&>svg]:w-4 [&>svg]:h-4`,
        medium: `p-2 text-2xl [&>svg]:w-5 [&>svg]:h-5`,
        large: `p-3 text-3xl [&>svg]:w-6 [&>svg]:h-6`,
      },
    };
    const colors = {
      text: {
        primary: "text-blue-400 hover:bg-blue-400 hover:bg-opacity-10",
        secondary: "text-zinc-400 hover:bg-zinc-400 hover:bg-opacity-10",
        success: "text-green-500 hover:bg-green-500 hover:bg-opacity-10",
        warning: "text-orange-400 hover:bg-orange-400 hover:bg-opacity-10",
        error: "text-red-500 hover:bg-red-500 hover:bg-opacity-10",
        DEFAULT: "dark:text-white text-black hover:bg-black dark:hover:bg-white hover:bg-opacity-10"
      },
      contained: {
        primary:
          "bg-blue-400 border-blue-500 hover:bg-blue-500 dark:text-black/90 text-white shadow-sm hover:shadow-md",
        secondary:
          "bg-zinc-500 border-zinc-600 hover:bg-zinc-600 dark:text-black/90 text-white shadow-sm hover:shadow-md",
        success:
          "bg-green-600 border-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md",
        warning:
          "bg-orange-400 border-orange-500 hover:bg-orange-500 dark:text-black/90 text-white shadow-sm hover:shadow-md",
        error:
          "bg-red-500 border-red-600 hover:bg-red-600 text-white shadow-sm hover:shadow-md",
        DEFAULT: "dark:bg-white dark:border-white dark:hover:bg-zinc-100 dark:text-black bg-zinc-900 border-zinc-900 hover:bg-black text-white shadow-sm hover:shadow-md"
      },
      outlined: {
        primary:
          "text-blue-400 border border-blue-400 border-opacity-50 hover:border-opacity-100 hover:bg-blue-400 hover:bg-opacity-10",
        secondary:
          "text-zinc-400 border border-zinc-400 border-opacity-50 hover:border-opacity-100 hover:bg-zinc-400 hover:bg-opacity-10",
        success:
          "text-green-500 border border-green-500 border-opacity-50 hover:border-opacity-100 hover:bg-green-500 hover:bg-opacity-10",
        warning:
          "text-orange-400 border border-orange-400 border-opacity-50 hover:border-opacity-100 hover:bg-orange-400 hover:bg-opacity-10",
        error:
          "text-red-500 border border-red-500 border-opacity-50 hover:border-opacity-100 hover:bg-red-500 hover:bg-opacity-10",
        DEFAULT: "dark:text-white border text-black dark:border-white border-black dark:border-opacity-50 border-opacity-50 hover:border-opacity-100 hover:bg-black dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10"
      },
      icon: {
        primary: "text-blue-400 hover:bg-blue-400 hover:bg-opacity-10",
        secondary: "text-zinc-400 hover:bg-zinc-400 hover:bg-opacity-10",
        success: "text-green-500 hover:bg-green-500 hover:bg-opacity-10",
        warning: "text-orange-400 hover:bg-orange-400 hover:bg-opacity-10",
        error: "text-red-500 hover:bg-red-500 hover:bg-opacity-10",
        DEFAULT: "text-black dark:text-white hover:bg-black dark:hover:bg-white hover:bg-opacity-10"
      },
    };

    const disabledClasses = {
      text: `pointer-events-none cursor-default dark:text-white/30 text-black/30`,
      contained: `shadow-none pointer-events-none cursor-default dark:text-white/30 dark:bg-white/[.12] bg-black/[.12] text-black/30`,
      outlined: `pointer-events-none cursor-default dark:text-white/30 dark:border-white/[.12] text-black/30 border-black/[.12]`,
      icon: `pointer-events-none cursor-default dark:text-white/30 text-black/30`,
    };
    const base = `inline-flex items-center justify-center box-border relative cursor-pointer select-none appearance-none font-medium uppercase tracking-wide ${variant === "icon"
      ? "[&>svg]:inline-block aspect-square rounded-[50%] text-center [&>svg]:fill-current flex-[0_0_auto] [&>svg]:shrink-0 overflow-visible"
      : "rounded"
      }`;

    const classNames = clsx(
      contextClassName,
      base,
      sizes[variant][size],
      buttonGroupButtonContextPositionClassName,
      colors[variant][color],
      {
        [disabledClasses[variant]]: disabled,
      },
      props.className
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
      className={clsx("inline-flex rounded", { "flex-col": orientation === "vertical", "w-full": fullWidth })}
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
// {
//   (
//     <div className="flex flex-col space-y-2">
//     <div className="flex flex-row space-x-2">
//       <Button variant="text" color="secondary">button</Button>
//       <Button variant="contained" color="secondary">button</Button>
//       <Button variant="outlined" color="secondary">button</Button>
//       <Button variant="icon" color="secondary" size="medium"><svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 448 512"
//         focusable="false"
//       >
//         <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
//       </svg></Button>
//     </div>
//     <div className="flex flex-row space-x-2">
//       <Button variant="text" color="success">button</Button>
//       <Button variant="contained" color="success">button</Button>
//       <Button variant="outlined" color="success">button</Button>
//       <Button variant="icon" color="success" size="large"><svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 448 512"
//         focusable="false"
//       >
//         <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
//       </svg></Button>
//     </div>
//     <div className="flex flex-row space-x-2">
//       <Button variant="text" color="warning">button</Button>
//       <Button variant="contained" color="warning">button</Button>
//       <Button variant="outlined" color="warning">button</Button>
//       <Button variant="icon" color="warning"><svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 448 512"
//         focusable="false"
//       >
//         <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
//       </svg></Button>
//     </div>
//     <div className="flex flex-row space-x-2">
//       <Button variant="text" color="error">button</Button>
//       <Button variant="contained" color="error">button</Button>
//       <Button variant="outlined" color="error">button</Button>
//       <Button variant="icon" color="error"><svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 448 512"
//         focusable="false"
//       >
//         <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
//       </svg></Button>
//     </div>
//   </div>
//   <div className="flex flex-col space-y-2 mt-3">
//     <div className="flex flex-row space-x-2">
//       <button className="rw-button rw-button-green">BUTTON</button>
//       <button className="rw-button rw-button-green-gradient">BUTTON</button>
//       <button className="rw-button rw-button-green-outline">BUTTON</button>
//     </div>
//     <div className="flex flex-row space-x-2">
//       <button className="rw-button rw-button-blue">BUTTON</button>
//       <button className="rw-button rw-button-blue-gradient">BUTTON</button>
//       <button className="rw-button rw-button-blue-outline">BUTTON</button>
//     </div>
//     <div className="flex flex-row space-x-2">
//       <button className="rw-button rw-button-gray">BUTTON</button>
//       <button className="rw-button rw-button-gray-gradient">BUTTON</button>
//       <button className="rw-button rw-button-gray-outline">BUTTON</button>
//     </div>
//     <div className="flex flex-row space-x-2">
//       <button className="rw-button rw-button-yellow">BUTTON</button>
//       <button className="rw-button rw-button-yellow-gradient">BUTTON</button>
//       <button className="rw-button rw-button-yellow-outline">BUTTON</button>
//     </div>
//     <div className="flex flex-row space-x-2">
//       <button className="rw-button rw-button-red">BUTTON</button>
//       <button className="rw-button rw-button-red-gradient">BUTTON</button>
//       <button className="rw-button rw-button-red-outline">BUTTON</button>
//     </div>
//   </div>
//   )
// }
