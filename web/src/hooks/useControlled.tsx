import { useCallback, useEffect, useRef, useState } from "react";

type UseControlledOptions<T> = {
  controlled?: T | undefined;
  default?: T;
  name?: string;
  state?: string;
};

type UseControlledReturnValue<T> = [T, (newValue: T) => void];

export const useControlled = <T extends unknown>({
  controlled,
  default: defaultProp,
  name = "",
  state = "value",
}: UseControlledOptions<T>): UseControlledReturnValue<T> => {
  const { current: isControlled } = useRef(controlled !== undefined);
  const [valueState, setValue] = useState(defaultProp);
  const value = isControlled ? (controlled as T) : valueState;

  if (process.env.NODE_ENV !== "production") {
    useEffect(() => {
      if (isControlled !== (controlled !== undefined)) {
        console.error(
          [
            `ArkDashboard: A component is changing the ${isControlled ? "" : "un"
            }controlled ${state} state of ${name} to be ${isControlled ? "un" : ""
            }controlled.`,
            "Elements should not switch from uncontrolled to controlled (or vice versa).",
            `Decide between using a controlled or uncontrolled ${name} ` +
            "element for the lifetime of the component.",
            "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
            ,
          ].join("\n")
        );
      }
    }, [state, name, controlled]);

    const { current: defaultValue } = React.useRef(defaultProp);
    useEffect(() => {
      if (!isControlled && defaultValue !== defaultProp) {
        console.error(
          [
            `ArkDashboard: A component is changing the default ${state} state of an uncontrolled ${name} after being initialized. ` +
            `To suppress this warning opt to use a controlled ${name}.`,
          ].join("\n")
        );
      }
    }, [JSON.stringify(defaultProp)]);
  }

  const setValueIfUncontrolled = useCallback((newValue: T) => {
    if (!isControlled) {
      setValue(newValue);
    }
  }, []);
  return [value, setValueIfUncontrolled];
};