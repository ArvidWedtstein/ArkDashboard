import { useRef } from "react";

export function useEventCallback<
  Fn extends (...args: any[]) => any = (...args: unknown[]) => unknown
>(fn: Fn): Fn;
export function useEventCallback<Args extends unknown[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return;
export function useEventCallback<Args extends unknown[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return {
  const ref = useRef(fn);
  ref.current = fn;
  return useRef((...args: Args) =>
    // @ts-expect-error hide `this`
    // tslint:disable-next-line:ban-comma-operator
    (0, ref.current!)(...args)
  ).current;
}