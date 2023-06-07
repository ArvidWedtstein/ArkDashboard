import clsx from "clsx";

interface ToggleButtonProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLabel?: string;
  offLabel?: string;
  className?: string;
  disabled?: boolean;
}
const ToggleButton = ({
  disabled,
  checked,
  onChange,
  onLabel,
  offLabel,
  className = "",
  ...props
}: ToggleButtonProps) => {
  return (
    <label
      className={clsx(
        "relative my-1 flex cursor-pointer items-center justify-start",
        className.toString()
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        {...props}
        disabled={disabled}
        readOnly={!onChange && checked != null}
        className="peer sr-only"
        onChange={onChange}
      />
      <div className="rw-toggle peer-disabled:after:bg-zinc-400 peer-disabled:bg-gray-200 peer-disabled:cursor-not-allowed peer-focus:ring-pea-300 dark:peer-focus:ring-pea-800 peer-checked:bg-pea-600 peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4"></div>
      <span className="peer-disabled:cursor-not-allowed ml-3 inline-flex space-x-1 text-sm font-medium text-gray-600 dark:text-white">
        {offLabel && (<span
          className={
            !checked
              ? disabled
                ? "text-pea-800"
                : "text-pea-500"
              : disabled && "dark:text-gray-500"
          }
        >
          {offLabel}
        </span>)}
        {(offLabel && onLabel) && <span>/</span>}
        {onLabel && (<span
          className={
            checked
              ? disabled
                ? "text-pea-800"
                : "text-pea-500"
              : disabled && "dark:text-gray-500"
          }
        >
          {onLabel}
        </span>)}
      </span>
    </label>
  );
};

export default ToggleButton;
