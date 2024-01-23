import { Toast as iToast, toast } from "@redwoodjs/web/dist/toast";
import Button from "../Button/Button";
import clsx from "clsx";

interface ToastProps {
  t: iToast;
  title?: string | React.ReactNode;
  message?: string | React.ReactNode;
  variant?: "error" | "success" | "info" | "warning";
  actionType?: "YesNo" | "OkCancel" | "Ok";
  primaryAction?: (toast: iToast) => void;
  secondaryAction?: (toast: iToast) => void;
}
const Toast = ({
  t,
  title,
  message,
  variant = "error",
  actionType = "YesNo",
  primaryAction,
  secondaryAction,
}: ToastProps) => {

  const variants = {
    info: `border-primary-400 text-primary-800 dark:border-primary-800 dark:text-primary-400`,
    success: `text-success-800 border-success-300 dark:text-success-400 dark:border-success-600`,
    warning: `border-warning-300 text-warning-800 dark:border-warning-800 dark:text-warning-400`,
    error: `border-error-300 dark:border-error-600 text-black dark:text-white`,
  }
  return (
    <div
      className={clsx(`rounded border-2 bg-zinc-50 p-4 text-black dark:bg-zinc-800 dark:text-white`, {
        [variants[variant]]: variant,
        "animate-fly-in": t.visible,
        "animate-fade-out": !t.visible
      })}
      role="alert"
    >
      <div className="flex items-center">
        <svg
          className="mr-2 h-4 w-4 flex-shrink-0"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">{variant}</span>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <div className="mt-2 mb-4 text-sm">{message}</div>
      <div className="flex space-x-2">
        <Button
          size="small"
          variant="outlined"
          color={variant === 'info' ? 'primary' : variant}
          onClick={async () => {
            toast.dismiss(t.id);
            primaryAction?.(t);
          }}
        >
          {actionType === "Ok"
            ? "Ok"
            : actionType === "OkCancel"
              ? "Ok"
              : "Yes"}
        </Button>
        {actionType !== "Ok" && (
          <Button
            size="small"
            variant="text"
            color="secondary"
            onClick={() => {
              toast.dismiss(t.id);
              secondaryAction?.(t);
            }}
          >
            {actionType === "OkCancel" ? "Cancel" : "No"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Toast;
