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
}
const ToggleButton = ({
  disabled,
  checked,
  onChange,
  onLabel,
  offLabel,
  className = "",
  defaultChecked,
  name,
}: ToggleButtonProps) => {
  const [isOn, setIsOn] = React.useState<boolean>(defaultChecked || false);
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
      {label}
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
        className="peer sr-only"
        name={name}
        onChange={(e) => {
          setIsOn(e.target.checked);
          onChange?.(e);
        }}
      />
      <div className="rw-toggle peer-focus:ring-pea-300 dark:peer-focus:ring-pea-800 peer-checked:bg-pea-600 peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-disabled:cursor-not-allowed peer-disabled:bg-gray-200 peer-disabled:after:bg-zinc-400"></div>
      <span className="ml-3 inline-flex space-x-1 text-sm font-medium text-gray-600 peer-disabled:cursor-not-allowed dark:text-white">
        {offLabel && renderLabel(offLabel, !isOn)}
        {offLabel && onLabel && <span>/</span>}
        {onLabel && renderLabel(onLabel, isOn)}
      </span>
    </label>
  );
};

export default ToggleButton;
