import clsx from "clsx";
import Ripple from "../Ripple/Ripple";
import {
  ElementType,
  LinkHTMLAttributes,
  createContext,
  forwardRef,
  useContext,
} from "react";
import { permission } from "types/graphql";
import { useAuth } from "src/auth";

interface ButtonGroupOwnProps {
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
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the button ripple effect is disabled.
   * @default false
   */
  disableRipple?: boolean;
  /**
   * If `true`, the buttons will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * The component orientation (layout flow direction).
   * @default 'horizontal'
   */
  orientation?: "vertical" | "horizontal";
  /**
   * The size of the component.
   * `small` is equivalent to the dense button styling.
   * @default 'medium'
   */
  size?: "small" | "medium" | "large";
  /**
   * The variant to use.
   * @default 'outlined'
   */
  variant?: "text" | "outlined" | "contained" | "icon";
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

interface ButtonGroupTypeMap<
  AdditionalProps = {},
  RootComponent extends React.ElementType = "div"
> {
  props: AdditionalProps & ButtonGroupOwnProps;
  defaultComponent: RootComponent;
}

type ButtonGroupProps<
  RootComponent extends React.ElementType = ButtonGroupTypeMap["defaultComponent"],
  AdditionalProps = {}
> = OverrideProps<
  ButtonGroupTypeMap<AdditionalProps, RootComponent>,
  RootComponent
> & {
  component?: React.ElementType;
};

type IButtonGroupContext = {
  className?: string;
  color?: ButtonGroupProps["color"];
  disabled?: boolean;
  disableElevation?: boolean;
  disableFocusRipple?: boolean;
  disableRipple?: boolean;
  fullWidth?: boolean;
  size?: ButtonGroupProps["size"];
  variant?: ButtonGroupProps["variant"];
};
const ButtonGroupContext = createContext<IButtonGroupContext>({});

const ButtonGroupButtonContext = createContext<string | undefined>(undefined);

type ButtonProps = {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  variant?: "text" | "contained" | "outlined" | "icon";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  disableRipple?: boolean;
  /**
   * Will not render if user does not have permission or user is not logged in and permission is defined
   */
  permission?: permission;
  to?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  LinkHTMLAttributes<HTMLAnchorElement>;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props: ButtonProps, ref) => {
    const contextProps = useContext(ButtonGroupContext);
    const buttonGroupButtonContextPositionClassName = useContext(
      ButtonGroupButtonContext
    );
    const {
      children,
      variant = props.variant || contextProps.variant || "text",
      size = props.size || contextProps.size || "medium",
      color = props.color || contextProps.color || "primary",
      disabled = props.disabled || contextProps.disabled || false,
      startIcon: startIconProp,
      endIcon: endIconProp,
      disableRipple,
      type = "button",
      permission,
      ...other
    } = props;

    if (permission) {
      const { currentUser } = useAuth();
      if (currentUser && !currentUser?.permissions.some((perm) => perm === permission)) {
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
        success: "text-pea-400 hover:bg-pea-400 hover:bg-opacity-10",
        warning: "text-amber-400 hover:bg-amber-400 hover:bg-opacity-10",
        error: "text-red-500 hover:bg-red-500 hover:bg-opacity-10",
      },
      contained: {
        primary:
          "bg-blue-400 hover:bg-blue-500 dark:text-black/90 text-white shadow-sm hover:shadow-md",
        secondary:
          "bg-zinc-500 hover:bg-zinc-600 dark:text-black/90 text-white shadow-sm hover:shadow-md",
        success:
          "bg-pea-500 hover:bg-pea-600 text-white shadow-sm hover:shadow-md",
        warning:
          "bg-amber-400 hover:bg-orange-500 dark:text-black/90 text-white shadow-sm hover:shadow-md",
        error:
          "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md",
      },
      outlined: {
        primary:
          "text-blue-400 border border-blue-400 border-opacity-50 hover:border-opacity-100 hover:bg-blue-400 hover:bg-opacity-10",
        secondary:
          "text-zinc-400 border border-zinc-400 border-opacity-50 hover:border-opacity-100 hover:bg-zinc-400 hover:bg-opacity-10",
        success:
          "text-pea-400 border border-pea-400 border-opacity-50 hover:border-opacity-100 hover:bg-pea-400 hover:bg-opacity-10",
        warning:
          "text-amber-400 border border-amber-400 border-opacity-50 hover:border-opacity-100 hover:bg-amber-400 hover:bg-opacity-10",
        error:
          "text-red-500 border border-red-500 border-opacity-50 hover:border-opacity-100 hover:bg-red-500 hover:bg-opacity-10",
      },
      icon: {
        primary: "text-blue-400 hover:bg-blue-400 hover:bg-opacity-10",
        secondary: "text-zinc-400 hover:bg-zinc-400 hover:bg-opacity-10",
        success: "text-pea-400 hover:bg-pea-400 hover:bg-opacity-10",
        warning: "text-amber-400 hover:bg-amber-400 hover:bg-opacity-10",
        error: "text-red-500 hover:bg-red-500 hover:bg-opacity-10",
      },
    };
    const disabledClasses = {
      text: `pointer-events-none cursor-default dark:text-white/30 text-black/30`,
      contained: `shadow-none pointer-events-none cursor-default dark:text-white/30 dark:bg-white/[.12] bg-black/[.12] text-black/30`,
      outlined: `pointer-events-none cursor-default dark:text-white/30 dark:border-white/[.12] text-black/30 border-black/[.12]`,
      icon: `pointer-events-none cursor-default dark:text-white/30 text-black/30`,
    };
    const base = `inline-flex items-center justify-center box-border relative cursor-pointer select-none appearance-none font-medium uppercase tracking-wide transition-colors duration-[250ms] ${variant === "icon"
      ? "[&>svg]:inline-block aspect-square rounded-[50%] text-center [&>svg]:fill-current flex-[0_0_auto] [&>svg]:shrink-0 overflow-visible"
      : "rounded min-w-[4rem]"
      }`;
    const classNames = clsx(
      contextProps.className,
      base,
      sizes[variant][size],
      buttonGroupButtonContextPositionClassName,
      colors[variant][color],
      {
        [disabledClasses[variant]]: disabled,
      },
      props.className,
      buttonGroupButtonContextPositionClassName
    );

    const startIcon = startIconProp && variant !== "icon" && (
      <span
        className="[&>svg]:shrink-0 mr-2 -ml-1 select-none transition-colors duration-200 [&>svg]:inline-block [&>svg]:h-4 [&>svg]:w-4 [&>svg]:fill-current"
        style={{
          display: "inherit",
        }}
      >
        {startIconProp}
      </span>
    );

    const endIcon = endIconProp && variant !== "icon" && (
      <span
        className="ml-2 -mr-1 shrink-0 select-none transition-colors duration-200 [&>svg]:inline-block [&>svg]:h-4 [&>svg]:w-4 [&>svg]:fill-current"
        style={{
          display: "inherit",
        }}
      >
        {endIconProp}
      </span>
    );

    const Root: ElementType = props.href || props.to ? "a" : "button";

    const componentProps = {
      ...other, // TODO: find solution for this
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
        {...contextProps}
      >
        {startIcon}
        {children}
        {endIcon}
        {!disableRipple && <Ripple center={variant === "icon"} />}
      </Root>
    );
  }
);

export default Button;
// https://github.com/mui/material-ui/tree/a13c0c026692aafc303756998a78f1d6c2dd707d/packages/mui-material/src/ButtonGroup

const getValidKids = (children: React.ReactNode) => {
  return React.Children.toArray(children).filter((child) =>
    React.isValidElement(child),
  ) as React.ReactElement[];
};

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
  const BORDER_COLOR = 'border-blue-500';
  const BORDER_OPACITY = 'border-opacity-50';
  switch (variant) {
    case "text":
      if (button === 'first' || button === 'middle') {
        btnMap[button].push(isHorizontal ? `border-r` : `border-b`, BORDER_COLOR, BORDER_OPACITY);
      }
      break;
    case "outlined":
      if (button === 'first' || button === 'middle') {
        btnMap[button].push(isHorizontal ? `border-r-transparent hover:border-r-current` : `border-b-transparent hover:border-b-current`);
      }
      if (button === 'middle' || button === 'last') {
        btnMap[button].push(`-m${isHorizontal ? 'l' : 't'}-px`);
      }
      break;
    case "contained":
      if (button === 'first' || button === 'middle') {
        btnMap[button].push(isHorizontal ? `border-r` : `border-b`, BORDER_COLOR);
      }
      break;
    default:
      break;
  }

  return btnMap[button].join(' ');
};

export const ButtonGroup = ({
  children,
  variant,
  orientation = "horizontal",
}: {
  children: React.ReactNode;
  variant?: "text" | "outlined" | "contained" | "icon";
  orientation?: 'horizontal' | 'vertical';
}) => {
  const classes = {
    firstButton: getStyles(orientation, variant, 'first'),
    middleButton: getStyles(orientation, variant, 'middle'),
    lastButton: getStyles(orientation, variant, 'last'),
  };

  const validChildren = getValidKids(children);
  const childrenCount = validChildren.length;

  const getButtonPositionClassName = (index) => {
    const isFirstButton = index === 0;
    const isLastButton = index === childrenCount - 1;

    if (isFirstButton && isLastButton) {
      return '';
    }
    if (isFirstButton) {
      return classes.firstButton;
    }
    if (isLastButton) {
      return classes.lastButton;
    }
    return classes.middleButton;
  };

  return (
    <div className={clsx("inline-flex rounded", { "flex-col": orientation === "vertical" })} role="group">
      <ButtonGroupContext.Provider value={{
        color: 'error',
        disabled: false,
        disableFocusRipple: false,
        disableRipple: false,
        fullWidth: false,
        size: 'small',
        variant,
      }}>
        {validChildren.map((child, index) => (
          <ButtonGroupButtonContext.Provider
            key={index}
            value={getButtonPositionClassName(index)}
          >
            {child}
          </ButtonGroupButtonContext.Provider>
        ))}
      </ButtonGroupContext.Provider>
    </div>
  );
};
// {
//   (
//     <div className="flex flex-col space-y-2">
//     <div className="flex flex-row space-x-2">
//       <ButtonGroup variant="outlined">
//         <Button color="primary">button</Button>
//         <Button color="primary">button</Button>
//         <Button color="primary">button</Button>
//       </ButtonGroup>
//       <ButtonGroup variant="contained">
//         <Button color="primary">button</Button>
//         <Button color="primary">button</Button>
//         <Button color="primary">button</Button>
//       </ButtonGroup>
//       <ButtonGroup variant="text">
//         <Button color="primary">button</Button>
//         <Button color="primary">button</Button>
//         <Button color="primary">button</Button>
//       </ButtonGroup>
//     </div>
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
