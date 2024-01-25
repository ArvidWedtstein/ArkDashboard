import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes, forwardRef } from 'react'

type TextProps = {
  align?: 'inherit' | 'justify' | 'left' | 'center' | 'right';
  /**
   * @default 'body1'
   */
  variant?: 'body1' | 'body2' | 'button' | 'caption' | 'overline' | 'subtitle1' | 'subtitle2' | 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1' | 'inherit',
  component?: React.ElementType;
  /**
   * If true, top margin is applied
   *
   * @default false
   */
  gutterTop?: boolean;
  /**
   * If true, bottom margin is applied
   *
   * @default false
   */
  gutterBottom?: boolean;
  /**
   * If `true`, text will be truncated.
   *
   * @default false
   */
  noWrap?: boolean;
  /**
   * @default false
   */
  paragraph?: boolean;
} & DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

/**
 * @name Text
 * @description
 * Component for text.
 * @example
 * ```
 * <Text variant="h4">
 *   Your text
 * </Text>
 * ```
 */
const Text = forwardRef<HTMLDivElement, TextProps>((props, ref) => {
  const {
    variant = "body1",
    align = "inherit",
    children,
    gutterTop = false,
    gutterBottom = false,
    noWrap = false,
    paragraph = false,
    component,
    className,
    ...other
  } = props;

  const variantMap = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle1: 'h6',
    subtitle2: 'h6',
    body1: 'p',
    body2: 'p',
    inherit: 'p',
  }

  const classes: Record<typeof variant, string> = {
    h1: "text-8xl font-light leading-[1.167] -tracking-[0.01562em]",
    h2: "text-6xl font-light leading-[1.2]",
    h3: "text-5xl font-normal leading-[1.167]",
    h4: "text-4xl font-normal leading-[1.235]",
    h5: "text-2xl font-normal leading-[1.334] tracking-normal",
    h6: "text-xl font-medium leading-[1.6]",
    subtitle1: "text-base font-normal leading-[1.75]",
    subtitle2: "text-sm font-medium leading-[1.57]",
    body1: "text-base font-normal leading-[1.5]",
    body2: "text-sm font-normal leading-[1.43]",
    button: "text-sm font-medium leading-[1.75] uppercase",
    caption: "text-xs font-normal leading-[1.66] tracking-wide",
    overline: "text-xs font-normal leading-[2.66] uppercase tracking-wider",
    inherit: "[font:inherit]",
  }

  const Component = component || (paragraph ? 'p' : variantMap[variant]) || 'span';

  return (
    <Component
      ref={ref}
      className={clsx(classes[variant], {
        "text-left ": align === 'left',
        "text-right": align === 'right',
        "text-center": align === 'center',
        "text-justify": align === 'justify',
        "overflow-hidden text-ellipsis whitespace-nowrap": noWrap,
        "mt-[0.35em]": gutterTop,
        "mb-[0.35em]": gutterBottom,
        "mb-4": paragraph,
        "m-0": !paragraph && !gutterBottom
      }, className)}
      {...other}
    >
      {children}
    </Component>
  )
})

export default Text
