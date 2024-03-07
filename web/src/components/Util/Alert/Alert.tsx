import clsx from "clsx";
import { DetailedHTMLProps, HTMLAttributes, forwardRef } from "react";

type AlertProps = {
  icon?: React.ReactNode;
  color?: 'error' | 'info' | 'success' | 'warning';
  variant?: 'contained' | 'outlined' | 'standard';
  title?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  const { color = "error", variant = "outlined", children, className, title, ...other } = props;

  const colorClasses = {
    standard: {
      info: `text-sky-200 bg-slate-900`,
      success: `text-[#cce8cd] bg-neutral-900`,
      warning: `text-warning-200 bg-stone-900`,
      error: `text-error-200 bg-stone-900`,
    },
    contained: {
      info: `bg-sky-500 text-black/80`,
      success: `bg-success-600 text-black/80`,
      warning: `bg-warning-500 text-black/80`,
      error: `bg-error-600 text-white`,
    },
    outlined: {
      info: `border border-sky-500 text-sky-300 bg-transparent`,
      success: `border border-success-300 text-[#cce8cd] bg-transparent`,
      warning: `border border-warning-300 text-warning-200 bg-transparent`,
      error: `border border-error-400 text-error-500 bg-transparent`,
    },
  }

  const iconClasses = {
    standard: {
      info: `text-sky-400`,
      success: `text-success-500`,
      warning: `text-warning-400`,
      error: `text-error-500`,
    },
    contained: {
      info: `text-white`,
      success: `text-white`,
      warning: `text-white`,
      error: `text-white`,
    },
    outlined: {
      info: `text-sky-400`,
      success: `text-success-500`,
      warning: `text-warning-400`,
      error: `text-error-500`,
    },
  }

  const icon = {
    error: (
      <svg className="w-5 h-5 fill-current inline-block select-none shrink-0 transition-colors duration-200" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 fill-current inline-block select-none shrink-0 transition-colors duration-200" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"></path>
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 fill-current inline-block select-none shrink-0 transition-colors duration-200" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z"></path>
      </svg>
    ),
    success: (
      <svg className="w-5 h-5 fill-current inline-block select-none shrink-0 transition-colors duration-200" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"></path>
      </svg>
    )
  }

  return (
    <div
      role="alert"
      ref={ref}
      className={clsx("flex items-center rounded shadow-none py-1.5 px-4 text-sm w-fit", className, {
        [colorClasses[variant][color]]: color,
      })}
      {...other}
    >
      <div className={clsx("mr-2 py-2 flex text-base opacity-90", {
        [iconClasses[variant][color]]: color,
      })}>
        {icon[color]}
      </div>
      <div className="py-2 min-w-0 overflow-auto align-middle">
        <div className="text-base -mt-0.5 font-medium">{title}</div>
        {children && children}
      </div>
    </div>
  )
});

export default Alert
