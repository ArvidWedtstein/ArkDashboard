import { Toast as iToast, toast } from "@redwoodjs/web/dist/toast";

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
  return (
    <div
      className={`${t.visible ? "animate-fly-in" : "animate-fade-out"
        } rw-toast ${`rw-toast-${variant}`}`}
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
        <button
          type="button"
          onClick={async () => {
            toast.dismiss(t.id);
            primaryAction?.(t);
          }}
          className={`rw-button rw-button-${variant == "error"
              ? "red"
              : variant == "success"
                ? "green"
                : variant == "info"
                  ? "blue"
                  : "yellow"
            } rw-button-small`}
        >
          {actionType === "Ok"
            ? "Ok"
            : actionType === "OkCancel"
              ? "Ok"
              : "Yes"}
        </button>
        {actionType !== "Ok" && (
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              secondaryAction?.(t);
            }}
            className="rw-button rw-button-red-outline rw-button-small"
            aria-label="Close"
          >
            {actionType === "OkCancel" ? "Cancel" : "No"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
