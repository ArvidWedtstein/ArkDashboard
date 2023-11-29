import clsx from "clsx";
import { LabelHTMLAttributes } from "react";

interface ToggleButtonProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLabel?: string;
  offLabel?: string;
  className?: LabelHTMLAttributes<HTMLLabelElement>["className"];
  disabled?: boolean;
  name?: string;
  helperText?: string;
  required?: boolean
}
const Switch = ({
  disabled,
  checked,
  onChange,
  onLabel,
  offLabel,
  helperText,
  className,
  defaultChecked,
  required,
  name,
}: ToggleButtonProps) => {
  const [isOn, setIsOn] = React.useState<boolean>(checked || defaultChecked || false);
  const renderLabel = (label: string | undefined, isOn: boolean) => (
    <span
      className={clsx(
        isOn
          ? disabled
            ? "text-pea-800"
            : "text-pea-500"
          : disabled && "dark:text-gray-500"
      )}
    >
      {label} {required && "*"}
    </span>
  );
  return (
    <label
      className={clsx(
        "relative my-1 flex w-fit cursor-pointer items-center justify-start",
        className
      )}
    >
      <input
        type="checkbox"
        checked={isOn}
        disabled={disabled}
        readOnly={!onChange}
        className="peer sr-only focus:outline-none"
        name={name}
        onChange={(e) => {
          setIsOn(e.target.checked);
          onChange?.(e);
        }}
        required={required}
      />
      <div className="overflow-hidden h-6 w-11 transition-colors after:duration-150 ease-in-out peer-checked:after:shadow rounded-full border bg-zinc-300 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:ease-in-out after:transition-all after:content-[''] border-zinc-500 dark:bg-zinc-600 peer-checked:bg-pea-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-disabled:cursor-not-allowed peer-disabled:bg-zinc-200 peer-disabled:after:bg-zinc-400"></div>
      <span className="ml-3 inline-flex space-x-1 text-sm font-medium text-znc-600 peer-disabled:cursor-not-allowed dark:text-white">
        {offLabel && renderLabel(offLabel, !isOn)}
        {offLabel && onLabel && <span>/</span>}
        {onLabel && renderLabel(onLabel, isOn)}
      </span>

      {helperText && <p className="rw-helper-text ml-3 !mt-0">{helperText}</p>}
    </label>
  );
};

export default Switch;
