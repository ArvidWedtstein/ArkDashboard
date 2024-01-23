import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes, forwardRef } from 'react'

type TextProps = {
  align?: 'inherit' | 'left' | 'center' | 'right';
  variant?: 'body1' | 'body2' | 'subtitle1' | 'subtitle2' | 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1' | 'inherit'
} & DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

/**
 * @name Text
 * @description
 *https://github.com/mui/material-ui/blob/a13c0c026692aafc303756998a78f1d6c2dd707d/packages/mui-material/src/Typography/Typography.js
 * @example
 * ```
 *
 * ```
 */
const Text = forwardRef<HTMLDivElement, TextProps>((props, ref) => {
  const { variant, align, children } = props

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
  return (
    <div ref={ref}>
      <span className={clsx('m-0', {
        "font-[inherit]": variant === 'inherit'
      })}>
        {children}
      </span>
      <p>{'Find me in ./web/src/components/Text/Text.tsx'}</p>
    </div>
  )
})

export default Text
