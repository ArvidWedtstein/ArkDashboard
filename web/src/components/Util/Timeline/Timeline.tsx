import clsx from 'clsx'
import { Children, DetailedHTMLProps, HTMLAttributes, ReactNode, createContext, forwardRef, isValidElement, useContext, useMemo } from 'react'
import Text, { TextProps } from '../Text/Text';
import { Colors, TextColor } from 'src/lib/formatters';


type TimelineProps = {
  position?: 'left' | 'right' | 'alternate' | 'alternate-reverse'
} & DetailedHTMLProps<
  HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>
const TimelineContext = createContext<TimelineProps>({});

{/* https://github.com/mui/material-ui/blob/master/packages/mui-lab/src/Timeline/Timeline.tsx */ }
/**
 * @name Timeline
 * @description
 *
 * @example
 * ```
 *
 * ```
 */
export const Timeline = forwardRef<HTMLUListElement, TimelineProps>((props, ref) => {
  const { position = 'right', className, ...other } = props

  const contextValue = useMemo(() => ({ position }), [position]);
  return (
    <TimelineContext.Provider value={contextValue}>
      <ul
        className={clsx('flex flex-col px-4 py-1.5 grow', className)}
        ref={ref}
        {...other}
      />
    </TimelineContext.Provider>
  )
});


type TimelineItemProps = {
  position?: 'left' | 'right' | 'alternate' | 'alternate-reverse'
} & DetailedHTMLProps<
  HTMLAttributes<HTMLLIElement>,
  HTMLLIElement
>
/**
 * @name TimelineItem
 * @description
 *
 * @example
 * ```
 *
 * ```
 */
export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>((props, ref) => {
  const { position: positionProp, className, ...other } = props;
  const { position: positionContext } = useContext(TimelineContext);

  let hasOppositeContent = false;

  Children.forEach(props.children, (child) => {
    if (child["type"]["displayName"] === 'TimelineOppositeContent') {
      hasOppositeContent = true;
    }
  });

  const ownerState = {
    ...props,
    position: positionProp || positionContext || 'right',
    hasOppositeContent,
  };

  const contextValue = useMemo(
    () => ({ position: ownerState.position }),
    [ownerState.position],
  );

  return (
    <TimelineContext.Provider value={contextValue}>
      <li
        className={clsx("list-none flex relative min-h-[4rem]", {
          "flex-row-reverse": ownerState.position === 'left',
          'even:flex-row-reverse [&:nth-child(even)_div[align=right]]:text-left [&:nth-child(even)_div[align=left]]:text-right': ownerState.position === 'alternate',
          'odd:flex-row-reverse [&:nth-child(odd)_div[align=right]]:text-left [&:nth-child(odd)_div[align=left]]:text-right': ownerState.position === 'alternate-reverse',
          "before:content-[''] before:flex-1 before:py-1.5 before:px-4": !hasOppositeContent
        }, className)}
        {...other}
      />
    </TimelineContext.Provider>
  )
});

type TimelineConnectorProps = DetailedHTMLProps<
  HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
>
/**
 * @name TimelineConnector
 * @description
 *
 * @example
 * ```
 *
 * ```
 */
export const TimelineConnector = forwardRef<HTMLSpanElement, TimelineConnectorProps>((props, ref) => {
  const { className, ...other } = props

  return (
    <span
      className={clsx("w-0.5 grow bg-secondary-300", className)}
      ref={ref}
      {...other}
    />
  )
});

/**
 * @name TimelineContent
 * @description
 *
 * @example
 * ```
 *
 * ```
 */
export const TimelineContent = forwardRef<HTMLDivElement, TextProps>((props, ref) => {
  const { className, ...other } = props;

  const { position: positionContext } = useContext(TimelineContext);

  const ownerState = {
    ...props,
    position: positionContext || 'right',
  };

  return (
    <Text
      {...other}
      ref={ref}
      component="div"
      className={clsx("py-1.5 px-4 flex-1", className)}
      align={ownerState.align || ownerState.position === 'left' ? 'right' : 'left'}
    />
  )
});

/**
 * @name TimelineOppositeContent
 * @description
 *
 * @example
 * ```
 *
 * ```
 */
export const TimelineOppositeContent = forwardRef<HTMLDivElement, TextProps>((props, ref) => {
  const { className, ...other } = props;

  const { position: positionContext } = useContext(TimelineContext);

  const ownerState = {
    ...props,
    position: positionContext || 'left',
  };

  return (
    <Text
      {...other}
      ref={ref}
      component="div"
      className={clsx("py-1.5 px-4 flex-1 mr-auto", className)}
      align={ownerState.align || ownerState.position === 'left' ? 'left' : 'right'}
    />
  );
});
TimelineOppositeContent.displayName = 'TimelineOppositeContent';

type TimelineDotProps = {
  variant?: 'contained' | 'outlined',
  color?: Colors | 'inherit';
} & DetailedHTMLProps<
  HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
>
/**
 * @name TimelineDot
 * @description
 *
 * @example
 * ```
 *
 * ```
 */
export const TimelineDot = forwardRef<HTMLSpanElement, TimelineDotProps>((props, ref) => {
  const { className, color = 'secondary', variant = 'contained', ...other } = props;

  const ownerState = {
    ...props,
    color,
    variant,
  };
  const colors = {
    red: "bg-red-400 text-red-50",
    blue: "bg-blue-400 text-blue-50",
    green: "bg-green-400 text-green-50",
    purple: "bg-purple-400 text-purple-50",
    orange: "bg-orange-400 text-orange-50",
    primary: "bg-primary-400 text-primary-50",
    secondary: "bg-secondary-400 text-secondary-50",
    success: "bg-success-400 text-success-50",
    warning: "bg-warning-400 text-warning-50",
    error: "bg-error-400 text-error-50"
  }
  const colorsOutlined = {
    red: "border-red-400 text-white",
    blue: "border-blue-400 text-white",
    green: "border-green-400 text-white",
    purple: "border-purple-400 text-black",
    orange: "border-orange-400 text-orange-100",
    primary: "border-primary-400 text-primary-50",
    secondary: "border-secondary-400 text-secondary-50",
    success: "border-success-400 text-success-50",
    warning: "border-warning-400 text-warning-50",
    error: "border-error-400 text-error-50"
  }

  const classes = {
    contained: clsx("border-transparent", {
      [colors[color]]: ownerState.color !== 'inherit'
    }),
    outlined: clsx("shadow-none bg-transparent", {
      [colorsOutlined[color]]: ownerState.color !== 'inherit'
    }),
  }
  return (
    <span
      className={clsx('flex self-baseline border-2 p-1 rounded-circle shadow my-3', classes[variant], className)}
      ref={ref}
      {...other}
    />
  )
});

type TimelineSeparatorProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>
/**
 * @name TimelineSeparator
 * @description
 *
 * @example
 * ```
 *
 * ```
 */
export const TimelineSeparator = forwardRef<HTMLDivElement, TimelineSeparatorProps>((props, ref) => {
  const { className, ...other } = props;

  return (
    <div
      className={clsx("flex flex-col flex-[0_1_0%] items-center")}
      role="separator"
      ref={ref}
      {...other}
    />
  )
});



