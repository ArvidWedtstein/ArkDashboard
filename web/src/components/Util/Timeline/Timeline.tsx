import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes, createContext, forwardRef, isValidElement, useContext, useMemo } from 'react'
import Text from '../Text/Text';
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

  React.Children.forEach(props.children, (child) => {
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
          "even:flex-row-reverse": ownerState.position === 'alternate',
          "odd:flex-row-reverse": ownerState.position === 'alternate-reverse',
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

type TimelineContentProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>
/**
 * @name TimelineContent
 * @description
 *
 * @example
 * ```
 *
 * ```
 */
export const TimelineContent = forwardRef<HTMLDivElement, TimelineContentProps>((props, ref) => {
  const { className, ...other } = props;

  const { position: positionContext } = useContext(TimelineContext);

  return (
    <Text
      {...other}
      ref={ref}
      component="div"
      className={className}
      align={positionContext === 'alternate' || positionContext === 'alternate-reverse' ? 'inherit' : positionContext === 'left' ? 'right' : positionContext === 'right' ? 'left' : 'center'}
    />
  )
});

type TimelineOppositeContentProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>
/**
 * @name TimelineOppositeContent
 * @description
 *
 * @example
 * ```
 *
 * ```
 */
export const TimelineOppositeContent = forwardRef<HTMLDivElement, TimelineOppositeContentProps>((props, ref) => {
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
      className={clsx("py-1.5 px-4 text-right flex-1 mr-auto", className)}
      align={ownerState.position === 'left' ? 'left' : 'right'}
    />
  )
});

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
  const { className, color = 'text-secondary-500', variant = 'contained', ...other } = props;

  const ownerState = {
    ...props,
    color,
    variant,
  };

  const classes = {
    contained: clsx("border-transparent", {
      "text-secondary-50 bg-secondary-400": ownerState.color === 'secondary',
      [`text-${ownerState.color}-50 bg-${ownerState.color}-400`]: ownerState.color !== 'inherit' && ownerState.color !== 'secondary'
    }),
    outlined: clsx("shadow-none bg-transparent", {
      "border-secondary-400": ownerState.color === 'secondary',
      [`border-${ownerState.color}-400`]: ownerState.color !== 'inherit' && ownerState.color !== 'secondary',
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

type TimelineSeperatorProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>
/**
 * @name TimelineSeperator
 * @description
 *
 * @example
 * ```
 *
 * ```
 */
export const TimelineSeperator = forwardRef<HTMLDivElement, TimelineSeperatorProps>((props, ref) => {
  const { className, ...other } = props;

  return (
    <div
      className={clsx("flex flex-col flex-[0] items-center")}
      ref={ref}
      {...other}
    />
  )
});



