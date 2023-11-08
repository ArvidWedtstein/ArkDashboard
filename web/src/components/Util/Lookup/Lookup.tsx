import {
  CSSProperties,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  MouseEventHandler,
  SyntheticEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { FieldError, RegisterOptions, useController } from "@redwoodjs/forms";
import clsx from "clsx";
import Popper from "../Popper/Popper";
import ClickAwayListener from "../ClickAwayListener/ClickAwayListener";
import {
  useControlled,
  usePreviousProps,
  useEventCallback,
} from "src/lib/formatters";
import Ripple from "../Ripple/Ripple";

function stripDiacritics(string) {
  return typeof string.normalize !== "undefined"
    ? string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    : string;
}

function createFilterOptions<Value>(
  config: {
    ignoreAccents?: boolean;
    ignoreCase?: boolean;
    limit?: number;
    matchFrom?: "any" | "start";
    stringify?: (option: Value) => string;
    trim?: boolean;
  } = {}
) {
  const {
    ignoreAccents = true,
    ignoreCase = true,
    limit,
    matchFrom = "any",
    stringify,
    trim = false,
  } = config;

  return (options, { inputValue, getOptionLabel }) => {
    let input = trim ? inputValue.trim() : inputValue;
    if (ignoreCase) {
      input = input.toLowerCase();
    }
    if (ignoreAccents) {
      input = stripDiacritics(input);
    }

    const filteredOptions = !input
      ? options
      : options.filter((option) => {
          let candidate = (stringify || getOptionLabel)(option);
          if (ignoreCase) {
            candidate = candidate.toLowerCase();
          }
          if (ignoreAccents) {
            candidate = stripDiacritics(candidate);
          }

          return matchFrom === "start"
            ? candidate.indexOf(input) === 0
            : candidate.indexOf(input) > -1;
        });

    return typeof limit === "number"
      ? filteredOptions.slice(0, limit)
      : filteredOptions;
  };
}
type SelectOption = {
  label?: string;
  value?: string | number;
  image?: string;
  disabled?: boolean;
  /**
   * @private
   * @ignore
   */
  isSelected?: boolean;
  /**
   * @private
   * @ignore
   */
  inSearch?: boolean;
};

type MultiSelectLookupProps = {
  multiple: true;
  defaultValue?: string[] | number[];
  /**
   * The value must have reference equality with the option in order to be selected.
   * You can customize the equality behavior with the `isOptionEqualToValue` prop.
   */
  value?: SelectOption[];
  onSelect?: (value: SelectOption[]) => void;
};

type SingleSelectLookupProps = {
  multiple?: false;
  defaultValue?: string | number;
  /**
   * The value must have reference equality with the option in order to be selected.
   * You can customize the equality behavior with the `isOptionEqualToValue` prop.
   */
  value?: SelectOption;
  onSelect?: (value: SelectOption) => void;
};

export type LookupChangeReason =
  | "createOption"
  | "selectOption"
  | "removeOption"
  | "clear"
  | "blur";
type LookupCloseReason =
  | "createOption"
  | "toggleInput"
  | "escape"
  | "selectOption"
  | "removeOption"
  | "blur";
interface LookupChangeDetails<Value = string> {
  option: Value;
}
interface FilterOptionsState<Value> {
  inputValue: string;
  getOptionLabel: (option: Value) => string;
}

export type LookupInputChangeReason = "input" | "reset" | "clear";
export type LookupValue<Value, Multiple, DisableClearable> =
  Multiple extends true
    ? Array<Value | never>
    : DisableClearable extends true
    ? NonNullable<Value | never>
    : Value | null | never;

interface LookupGroupedOption<Value = string> {
  key: number;
  index: number;
  group: string;
  options: Value[];
}
// TODO: comment with default value
type SelectProps<
  Value,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined
> = {
  options: ReadonlyArray<Value>;
  label?: string;
  name?: string;
  className?: string;
  btnClassName?: string;
  defaultValue?: number | string; //LookupValue<Value, Multiple, DisableClearable>;
  value?: LookupValue<Value, Multiple, DisableClearable>;
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the component is in a loading state.
   * This shows the `loadingText` in place of suggestions (only if there are no suggestions to show, e.g. `options` are empty).
   * @default false
   */
  loading?: boolean;
  /**
   * Text to display when in a loading state.
   *
   * @default 'Loading…'
   */
  loadingText?: React.ReactNode;
  /**
   * Text to display when empty.
   *
   * @default 'No options'
   */
  noOptionsText?: React.ReactNode;
  helperText?: string;
  disableClearable?: DisableClearable;
  readOnly?: boolean;
  open?: boolean;
  filterSelectedOptions?: boolean;
  clearOnBlur?: boolean;
  required?: boolean;
  selectOnFocus?: boolean;
  closeOnSelect?: boolean;
  autoHighlight?: boolean;
  multiple?: Multiple;
  /**
   * If `true`, the portion of the selected suggestion that has not been typed by the user,
   * known as the completion string, appears inline after the input cursor in the textbox.
   * The inline completion string is visually highlighted and has a selected state.
   * @default false
   */
  autoComplete?: boolean;
  clearOnEscape?: boolean;
  openOnFocus?: boolean;
  autoSelect?: boolean;
  inputValue?: string;
  componentName?: string;
  validation?: RegisterOptions;
  margin?: "none" | "dense" | "normal";
  size?: "small" | "medium";
  valueKey?: keyof Value;
  InputProps?: {
    style?: CSSProperties;
  };
  placeholder?: string;
  /**
   * @default -1
   */
  limitTags?: number;
  /**
   * Callback fired when the value changes.
   *
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {Value|Value[]} value The new value of the component.
   * @param {string} reason One of "createOption", "selectOption", "removeOption", "blur" or "clear".
   * @param {string} [details]
   */
  onChange?: (
    event: React.SyntheticEvent,
    value: LookupValue<Value, Multiple, DisableClearable>,
    reason: LookupChangeReason,
    details?: LookupChangeDetails<Value>
  ) => void;
  onSelect?: (value: Value) => void;
  groupBy?: (option: Value) => string;
  renderTags?: (
    value: Value[],
    getTagProps: ({ index }: { index: number }) => {
      key: number;
      disabled: boolean;
      "data-tag-index"?: number;
      tabIndex?: number;
      onClick?: React.MouseEventHandler<HTMLButtonElement>;
    }
  ) => React.ReactNode;
  onInputChange?: (
    event: ChangeEvent<HTMLInputElement> | React.SyntheticEvent,
    value: string,
    reason: LookupInputChangeReason
  ) => void;
  filterOptions?: (
    options: Value[],
    state: FilterOptionsState<Value>
  ) => Value[];
  getOptionLabel?: (option: Value) => string;
  getOptionImage?: (option: Value) => string;
  isOptionEqualToValue?: (option: Value, value: Value) => boolean;
  getOptionDisabled?: (option: Value) => boolean;
  onOpen?: (event: React.SyntheticEvent) => void;
  onClose?: (event: React.SyntheticEvent, reason: LookupCloseReason) => void;
};

// TODO: fix error styles
export const Lookup = <
  Value,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false
>(
  props: SelectProps<Value, Multiple, DisableClearable>
) => {
  const {
    multiple,
    options,
    label,
    name,
    defaultValue = multiple ? [] : null,
    value: valueProp,
    className,
    btnClassName,
    placeholder,
    inputValue: inputValueProp,
    helperText,
    validation,
    valueKey = Object.keys(options[0]).includes("value")
      ? ("value" as keyof Value)
      : (Object.keys(options[0])[0] as keyof Value),
    loadingText = "Loading…",
    noOptionsText = "No options",
    margin = "normal",
    size = "medium",
    selectOnFocus = false,
    autoSelect = false,
    openOnFocus = false,
    clearOnBlur = true,
    autoHighlight = false,
    open: openProp,
    loading = false,
    disabled = false,
    componentName = "Lookup",
    readOnly = false,
    autoComplete = false,
    clearOnEscape = false,
    required = false,
    disableClearable = false,
    closeOnSelect = true,
    filterSelectedOptions = false,
    limitTags = -1,
    InputProps,
    getOptionDisabled,
    filterOptions = createFilterOptions<Value>(),
    groupBy,
    renderTags,
    onSelect,
    onChange,
    onInputChange,
    onOpen,
    onClose,
    getOptionLabel: getOptionLabelProp = (option: Value | string) => {
      if (typeof option === "object" && option !== null && "label" in option) {
        return option.label;
      }
      return option;
    },
    getOptionImage = (option: Value) => option && option["image"],
    isOptionEqualToValue = (option: Value, value: Value) => option === value,
  } = props;
  let getOptionLabel = getOptionLabelProp;

  getOptionLabel = (option: Value) => {
    const optionLabel = getOptionLabelProp(option);

    if (typeof optionLabel !== "string") {
      console.error(
        `${componentName}: The valueProp provided to the getOptionLabel prop must be a string. Received ${typeof optionLabel} instead`
      );
    }

    return optionLabel;
  };

  const { field } =
    !!name &&
    useController({
      name: name,
      defaultValue: defaultValue,
      rules: validation,
    });

  const id = useId();

  const ignoreFocus = useRef(false);
  const firstFocus = useRef(true);
  const inputRef = useRef(null);
  const listboxRef = useRef(null);
  const anchorEl = useRef(null);

  const [focusedTag, setFocusedTag] = useState(-1);
  const defaultHighlighted = autoHighlight ? 0 : -1;
  const highlightedIndexRef = useRef(defaultHighlighted);

  const [value, setValueState] = useControlled({
    controlled: valueProp,
    default:
      multiple && Array.isArray(defaultValue)
        ? options.filter((option) =>
            defaultValue.some((value) => value === option[valueKey])
          )
        : // .map((o) => o[valueKey] as Value)
          options.find((option) => option[valueKey] === defaultValue) || null,
    name: componentName,
  });

  const [inputValue, setInputValueState] = useControlled({
    controlled: inputValueProp,
    default: "",
    name: componentName,
    state: "inputValue",
  });

  const [focused, setFocused] = useState(false);

  const resetInputValue = useCallback(
    (event, newValue) => {
      const isOptionselected =
        multiple && Array.isArray(value)
          ? value.length < newValue.length
          : newValue !== null;
      if (isOptionselected && !clearOnBlur) {
        return;
      }
      let newInputValue;
      if (multiple || newValue == null) {
        newInputValue = "";
      } else {
        const optionLabel = getOptionLabel(newValue);
        newInputValue = typeof optionLabel === "string" ? optionLabel : "";
      }

      if (inputValue === newInputValue) {
        return;
      }

      setInputValueState(newInputValue);

      if (onInputChange) {
        onInputChange(event, newInputValue, "reset");
      }
    },
    [
      getOptionLabel,
      inputValue,
      multiple,
      onInputChange,
      setInputValueState,
      clearOnBlur,
      value,
    ]
  );

  const [open, setOpenState] = useControlled({
    controlled: openProp,
    default: false,
    state: "open",
  });

  const [inputPristine, setInputPristine] = useState(true);

  const inputValueIsSelectedValue =
    !multiple &&
    !Array.isArray(value) &&
    value != null &&
    inputValue === (getOptionLabel(value) as string);

  const popupOpen = open && !readOnly;

  const filteredOptions: Value[] = open
    ? filterOptions(
        options.filter((option) => {
          if (
            filterSelectedOptions &&
            (multiple && Array.isArray(value) ? value : [value as Value]).some(
              (value2) =>
                value2 !== null && isOptionEqualToValue(option, value2)
            )
          ) {
            return false;
          }
          return true;
        }),

        {
          inputValue:
            inputValueIsSelectedValue && inputPristine ? "" : inputValue,
          getOptionLabel,
        }
      )
    : [];

  const previousProps = usePreviousProps({
    filteredOptions,
    value,
    inputValue,
  });

  useEffect(() => {
    const valueChange = value !== previousProps.value;

    if (focused && !valueChange) {
      return;
    }

    resetInputValue(null, value);
  }, [value, resetInputValue, focused, previousProps.value]);

  const listboxAvailable = open && filteredOptions.length > 0 && !readOnly;

  if (process.env.NODE_ENV !== "production") {
    if (value !== null && options.length > 0) {
      const missingValue = (
        multiple && Array.isArray(value) ? value : [value]
      ).filter(
        (value2) =>
          !options.some((option) =>
            isOptionEqualToValue(option, value2 as Value)
          )
      );

      if (missingValue.length > 0) {
        console.warn(
          [
            `ArkDashboard: The value provided to ${componentName} is invalid.`,
            `None of the options match with \`${
              missingValue.length > 1
                ? JSON.stringify(missingValue)
                : JSON.stringify(missingValue[0])
            }\`.`,
            "You can use the `isOptionEqualToValue` prop to customize the equality test.",
          ].join("\n")
        );
      }
    }
  }

  const focusTag = (tagToFocus) => {
    if (tagToFocus === -1) {
      inputRef.current.focus();
    } else {
      anchorEl.current
        .querySelector(`[data-tag-index="${tagToFocus}"]`)
        .focus();
    }
  };

  // Ensure the focusedTag is never inconsistent
  useEffect(() => {
    if (multiple && Array.isArray(value) && focusedTag > value.length - 1) {
      setFocusedTag(-1);
      focusTag(-1);
    }
  }, [value, multiple, focusedTag, focusTag]);

  const validOptionIndex = (index: number, direction: "previous" | "next") => {
    if (!listboxRef.current || index < 0 || index >= filteredOptions.length) {
      return -1;
    }

    let nextFocus = index;

    let disabledItemsFocusable = false;
    while (true) {
      const option = listboxRef.current.querySelector(
        `[data-option-index="${nextFocus}"]`
      );

      // Same logic as MenuList.js
      const nextFocusDisabled = disabledItemsFocusable
        ? false
        : !option ||
          option.disabled ||
          option.getAttribute("aria-disabled") === "true";

      if (option && option.hasAttribute("tabindex") && !nextFocusDisabled) {
        // The next option is available
        return nextFocus;
      }

      // The next option is disabled, move to the next element.
      // with looped index
      if (direction === "next") {
        nextFocus = (nextFocus + 1) % filteredOptions.length;
      } else {
        nextFocus =
          (nextFocus - 1 + filteredOptions.length) % filteredOptions.length;
      }

      // We end up with initial index, that means we don't have available options.
      // All of them are disabled
      if (nextFocus === index) {
        return -1;
      }
    }
  };

  const setHighlightedIndex = useEventCallback(
    ({
      event,
      index,
      reason = "auto",
    }: {
      event?: any;
      index?: number;
      reason?: string;
    }) => {
      highlightedIndexRef.current = index;

      // does the index exist?
      if (index === -1) {
        inputRef.current.removeAttribute("aria-activedescendant");
      } else {
        inputRef.current.setAttribute(
          "aria-activedescendant",
          `data-option-${index}`
        );
      }

      // if (onHighlightChange) {
      //   onHighlightChange(event, index === -1 ? null : filteredOptions[index], reason);
      // }

      if (!listboxRef.current) {
        return;
      }
      let unstable_classNamePrefix = "ArkDashboard";
      const prev = listboxRef.current.querySelector(
        `[role="option"].${unstable_classNamePrefix}-focused`
      );
      if (prev) {
        prev.classList.remove(`${unstable_classNamePrefix}-focused`);
        prev.classList.remove(`dark:bg-white/10`);
        prev.classList.remove(`bg-black/10`);

        prev.classList.remove(`dark:bg-white/[.12]`);
        prev.classList.remove(`bg-black/[.12]`);
      }

      let listboxNode = listboxRef.current;
      if (listboxRef.current.getAttribute("role") !== "listbox") {
        listboxNode =
          listboxRef.current.parentElement.querySelector('[role="listbox"]');
      }

      if (!listboxNode) {
        return;
      }

      if (index === -1) {
        listboxNode.scrollTop = 0;
        return;
      }

      const option = listboxRef.current.querySelector(
        `[data-option-index="${index}"]`
      );

      if (!option) {
        return;
      }

      option.classList.add(`${unstable_classNamePrefix}-focused`);
      option.classList.add(`dark:bg-white/10`);
      option.classList.add(`bg-black/10`);
      if (reason === "keyboard") {
        option.classList.add(`dark:bg-white/[.12]`);
        option.classList.add(`bg-black/[.12]`);
      }

      if (
        listboxNode.scrollHeight > listboxNode.clientHeight &&
        reason !== "mouse" &&
        reason !== "touch"
      ) {
        const element = option;

        const scrollBottom = listboxNode.clientHeight + listboxNode.scrollTop;
        const elementBottom = element.offsetTop + element.offsetHeight;
        if (elementBottom > scrollBottom) {
          listboxNode.scrollTop = elementBottom - listboxNode.clientHeight;
        } else if (
          element.offsetTop - element.offsetHeight * (groupBy ? 1.3 : 0) <
          listboxNode.scrollTop
        ) {
          listboxNode.scrollTop =
            element.offsetTop - element.offsetHeight * (groupBy ? 1.3 : 0);
        }
      }
    }
  );

  const changeHighlightedIndex = useEventCallback(
    ({
      event,
      diff,
      direction = "next",
      reason = "auto",
    }: {
      event?: any;
      diff?: "reset" | "start" | "end" | number;
      direction?: "previous" | "next";
      reason?: string;
    }) => {
      if (!popupOpen) {
        return;
      }

      const getNextIndex = () => {
        const maxIndex = filteredOptions.length - 1;

        if (diff === "reset") {
          return defaultHighlighted;
        }

        if (diff === "start") {
          return 0;
        }

        if (diff === "end") {
          return maxIndex;
        }

        const newIndex = highlightedIndexRef.current + diff;

        let includeInputInList = false;
        let disableListWrap = false;
        if (newIndex < 0) {
          if (newIndex === -1 && includeInputInList) {
            return -1;
          }

          if (
            (disableListWrap && highlightedIndexRef.current !== -1) ||
            Math.abs(diff) > 1
          ) {
            return 0;
          }

          return maxIndex;
        }

        if (newIndex > maxIndex) {
          if (newIndex === maxIndex + 1 && includeInputInList) {
            return -1;
          }

          if (disableListWrap || Math.abs(diff) > 1) {
            return maxIndex;
          }

          return 0;
        }
        return newIndex;
      };

      const nextIndex = validOptionIndex(
        getNextIndex(),
        direction as "previous" | "next"
      );
      setHighlightedIndex({ event, index: nextIndex, reason });

      // Sync the content of the input with the highlighted option.
      if (autoComplete && diff !== "reset") {
        if (nextIndex === -1) {
          inputRef.current.value = inputValue;
        } else {
          const option = getOptionLabel(filteredOptions[nextIndex]) as string;
          inputRef.current.value = option;

          const index = option.toLowerCase().indexOf(inputValue.toLowerCase());
          if (index === 0 && inputValue.length > 0) {
            inputRef.current.setSelectionRange(
              inputValue.length,
              option.length
            );
          }
        }
      }
    }
  );

  const checkHighlightedOptionExists = () => {
    const isSameValue = (value1, value2) => {
      const label1 = value1 ? getOptionLabel(value1) : "";
      const label2 = value2 ? getOptionLabel(value2) : "";
      return label1 === label2;
    };

    if (
      highlightedIndexRef.current !== -1 &&
      previousProps.filteredOptions &&
      previousProps.filteredOptions.length !== filteredOptions.length &&
      previousProps.inputValue === inputValue &&
      (multiple && Array.isArray(value) && Array.isArray(previousProps.value)
        ? value.length === previousProps.value.length &&
          previousProps.value.every(
            (val, i) => getOptionLabel(value[i]) === getOptionLabel(val)
          )
        : isSameValue(previousProps.value, value))
    ) {
      const previousHighlightedOption =
        previousProps.filteredOptions[highlightedIndexRef.current];

      if (previousHighlightedOption) {
        const previousHighlightedOptionExists = filteredOptions.some(
          (option) => {
            return (
              getOptionLabel(option) ===
              getOptionLabel(previousHighlightedOption)
            );
          }
        );

        if (previousHighlightedOptionExists) {
          return true;
        }
      }
    }
    return false;
  };

  const syncHighlightedIndex = React.useCallback(() => {
    if (!popupOpen) {
      return;
    }

    if (checkHighlightedOptionExists()) {
      return;
    }

    const valueItem = multiple ? value[0] : value;

    if (filteredOptions.length === 0 || valueItem == null) {
      changeHighlightedIndex({ event: null, diff: "reset" });
      return;
    }

    if (!listboxRef.current) {
      return;
    }

    if (valueItem != null) {
      const currentOption = filteredOptions[highlightedIndexRef.current];

      if (
        multiple &&
        Array.isArray(value) &&
        currentOption &&
        value.findIndex((val) => isOptionEqualToValue(currentOption, val)) !==
          -1
      ) {
        return;
      }

      const itemIndex = filteredOptions.findIndex((optionItem) =>
        isOptionEqualToValue(optionItem, valueItem)
      );
      if (itemIndex === -1) {
        changeHighlightedIndex({ event: null, diff: "reset" });
      } else {
        setHighlightedIndex({ index: itemIndex });
      }
      return;
    }

    if (highlightedIndexRef.current >= filteredOptions.length - 1) {
      setHighlightedIndex({ index: filteredOptions.length - 1 });
      return;
    }

    setHighlightedIndex({ index: highlightedIndexRef.current });
  }, [
    filteredOptions.length,
    multiple ? false : value,
    filterSelectedOptions,
    changeHighlightedIndex,
    setHighlightedIndex,
    popupOpen,
    inputValue,
    multiple,
  ]);

  const handleListboxRef = useEventCallback((node) => {
    if (listboxRef) {
      listboxRef.current = node;
    }

    if (!node) {
      return;
    }

    syncHighlightedIndex();
  });

  if (process.env.NODE_ENV !== "production") {
    useEffect(() => {
      if (!inputRef.current || inputRef.current.nodeName !== "INPUT") {
        if (inputRef.current && inputRef.current.nodeName === "TEXTAREA") {
          console.warn(
            [
              `A textarea element was provided to ${componentName} where input was expected.`,
              `This is not a supported scenario but it may work under certain conditions.`,
              `A textarea keyboard navigation may conflict with Autocomplete controls (e.g. enter and arrow keys).`,
              `Make sure to test keyboard navigation and add custom event handlers if necessary.`,
            ].join("\n")
          );
        } else {
          console.error(
            [
              `ArkDashboard: Unable to find the input element. It was resolved to ${inputRef.current} while an HTMLInputElement was expected.`,
              `Instead, ${componentName} expects an input element.`,
            ].join("\n")
          );
        }
      }
    }, [componentName]);
  }

  useEffect(() => {
    syncHighlightedIndex();
  }, [syncHighlightedIndex]);

  const handleOpen = (
    event: React.MouseEvent<Document, MouseEvent> | React.SyntheticEvent
  ) => {
    if (open) {
      return;
    }
    setOpenState(true);
    setInputPristine(true);

    if (onOpen) {
      onOpen(event as React.SyntheticEvent);
    }
  };

  const handleClose = (
    event: React.MouseEvent<unknown> | React.SyntheticEvent,
    reason: LookupCloseReason
  ) => {
    if (!open) {
      return;
    }

    setOpenState(false);

    if (onClose) {
      onClose(event as React.SyntheticEvent, reason);
    }
  };

  const handleValue = (
    event: React.SyntheticEvent,
    newValue,
    reason: LookupChangeReason = "clear",
    details = {}
  ) => {
    if (multiple && Array.isArray(value)) {
      if (
        value.length === newValue.length &&
        value.every((val, i) => val === newValue[i])
      ) {
        return;
      }
    } else if (value === newValue) {
      return;
    }
    if (!!name) {
      field.onChange(
        multiple
          ? Array.isArray(newValue)
            ? newValue.map((f) => f[valueKey])
            : newValue
          : newValue
      );
    }

    if (onSelect) {
      onSelect(newValue);
    }

    if (onChange) {
      onChange?.(
        event,
        newValue,
        reason,
        details as LookupChangeDetails<Value>
      );
    }

    setValueState(newValue);
  };

  const isTouch = useRef(false);

  const selectNewValue = (
    event,
    option,
    reasonProp: LookupCloseReason = "selectOption"
  ) => {
    let reason = reasonProp;
    let newValue = option;

    if (multiple) {
      newValue = Array.isArray(value) ? value.slice() : [];
      if (process.env.NODE_ENV !== "production") {
        const matches = newValue.filter((val) =>
          isOptionEqualToValue(option, val)
        );

        if (matches.length > 1) {
          console.error(
            [
              `ArkDashboard: The \`isOptionEqualToValue\` method of ${componentName} does not handle the arguments correctly.`,
              `The component expects a single value to match a given option but found ${matches.length} matches.`,
            ].join("\n")
          );
        }
      }

      const itemIndex = newValue.findIndex((o) =>
        isOptionEqualToValue(option, o)
      );

      if (itemIndex === -1) {
        newValue.push(option);
      } else if (itemIndex !== -1) {
        newValue.splice(itemIndex, 1);
        reason = "removeOption";
      }
    }

    resetInputValue(event, newValue);

    handleValue(event, newValue, reason as LookupChangeReason, { option });

    if (closeOnSelect && (!event || (!event.ctrlKey && !event.metaKey))) {
      handleClose(event, reason);
    }

    // if (
    //   blurOnSelect === true ||
    //   (blurOnSelect === 'touch' && isTouch.current) ||
    //   (blurOnSelect === 'mouse' && !isTouch.current)
    // ) {
    //   inputRef.current.blur();
    // }
  };

  function validTagIndex(index, direction) {
    if (index === -1) {
      return -1;
    }

    let nextFocus = index;

    while (true) {
      if (
        (direction === "next" &&
          nextFocus === (Array.isArray(value) ? value : [value]).length) ||
        (direction === "previous" && nextFocus === -1)
      ) {
        return -1;
      }

      const option = anchorEl.current.querySelector(
        `[data-tag-index="${nextFocus}"]`
      );

      if (
        !option ||
        !option.hasAttribute("tabindex") ||
        option.disabled ||
        option.getAttribute("aria-disabled") === "true"
      ) {
        nextFocus += direction === "next" ? 1 : -1;
      } else {
        return nextFocus;
      }
    }
  }

  const handleFocusTag = (event, direction: "previous" | "next") => {
    if (!multiple || !Array.isArray(value)) {
      return;
    }

    if (inputValue === "") {
      handleClose(event, "toggleInput");
    }

    let nextTag = focusedTag;

    if (focusedTag === -1) {
      if (inputValue === "" && direction === "previous") {
        nextTag = value.length - 1;
      }
    } else {
      nextTag += direction === "next" ? 1 : -1;

      if (nextTag < 0) {
        nextTag = 0;
      }

      if (nextTag === value.length) {
        nextTag = -1;
      }
    }

    nextTag = validTagIndex(nextTag, direction);

    setFocusedTag(nextTag);
    focusTag(nextTag);
  };

  const handleClear = (
    event: MouseEvent<HTMLButtonElement> | SyntheticEvent
  ) => {
    ignoreFocus.current = true;
    setInputValueState("");

    if (onInputChange) {
      onInputChange(event as SyntheticEvent, "", "clear");
    }

    handleValue(event, multiple ? [] : null, "clear");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.isDefaultPrevented()) {
      return;
    }

    if (
      focusedTag !== -1 &&
      ["ArrowLeft", "ArrowRight"].indexOf(event.key) === -1
    ) {
      setFocusedTag(-1);
      focusTag(-1);
    }

    switch (event.key) {
      case "Home":
        if (open) {
          // Prevent scroll of the page
          event.preventDefault();
          changeHighlightedIndex({
            diff: "start",
            direction: "next",
            reason: "keyboard",
            event,
          });
        }
        break;
      case "End":
        if (popupOpen) {
          // Prevent scroll of the page
          event.preventDefault();
          changeHighlightedIndex({
            diff: "end",
            direction: "previous",
            reason: "keyboard",
            event,
          });
        }
        break;
      case "PageUp":
        // Prevent scroll of the page
        event.preventDefault();
        changeHighlightedIndex({
          diff: -5,
          direction: "previous",
          reason: "keyboard",
          event,
        });
        handleOpen(event);
        break;
      case "PageDown":
        // Prevent scroll of the page
        event.preventDefault();
        changeHighlightedIndex({
          diff: 5,
          direction: "next",
          reason: "keyboard",
          event,
        });
        handleOpen(event);
        break;
      case "ArrowDown":
        // Prevent cursor move
        event.preventDefault();
        changeHighlightedIndex({
          diff: 1,
          direction: "next",
          reason: "keyboard",
          event,
        });
        handleOpen(event);
        break;
      case "ArrowUp":
        // Prevent cursor move
        event.preventDefault();
        changeHighlightedIndex({
          diff: -1,
          direction: "previous",
          reason: "keyboard",
          event,
        });
        handleOpen(event);
        break;
      case "ArrowLeft":
        handleFocusTag(event, "previous");
        break;
      case "ArrowRight":
        handleFocusTag(event, "next");
        break;
      case "Enter":
        if (highlightedIndexRef.current !== -1 && popupOpen) {
          const option = filteredOptions[highlightedIndexRef.current];
          const disabled = getOptionDisabled
            ? getOptionDisabled(option)
            : false;

          // Avoid early form validation, let the end-users continue filling the form.
          event.preventDefault();

          if (disabled) {
            return;
          }

          selectNewValue(event, option, "selectOption");

          // Move the selection to the end.
          if (autoComplete) {
            inputRef.current.setSelectionRange(
              inputRef.current.value.length,
              inputRef.current.value.length
            );
          }
        }
        break;
      case "Escape":
        if (popupOpen) {
          // Avoid Opera to exit fullscreen mode.
          event.preventDefault();
          // Avoid the Modal to handle the event.
          event.stopPropagation();
          handleClose(event, "escape");
        } else if (
          clearOnEscape &&
          (inputValue !== "" ||
            (multiple && Array.isArray(value) && value.length > 0))
        ) {
          // Avoid Opera to exit fullscreen mode.
          event.preventDefault();
          // Avoid the Modal to handle the event.
          event.stopPropagation();
          handleClear(event as React.SyntheticEvent);
        }
        break;
      case "Backspace":
        if (
          multiple &&
          Array.isArray(value) &&
          !readOnly &&
          inputValue === "" &&
          value.length > 0
        ) {
          const index = focusedTag === -1 ? value.length - 1 : focusedTag;
          const newValue = value.slice();
          newValue.splice(index, 1);
          handleValue(event, newValue, "removeOption", {
            option: value[index],
          });
        }
        break;
      case "Delete":
        if (
          multiple &&
          Array.isArray(value) &&
          !readOnly &&
          inputValue === "" &&
          value.length > 0 &&
          focusedTag !== -1
        ) {
          const index = focusedTag;
          const newValue = value.slice();
          newValue.splice(index, 1);
          handleValue(event, newValue, "removeOption", {
            option: value[index],
          });
        }
        break;
      default:
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);

    if (openOnFocus && !ignoreFocus.current) {
      handleOpen(event);
    }
  };

  const handleBlur = (event = null) => {
    if (
      listboxRef.current !== null &&
      listboxRef.current.parentElement?.contains(document.activeElement)
    ) {
      inputRef.current.focus();
      return;
    }

    setFocused(false);
    firstFocus.current = true;
    ignoreFocus.current = false;

    if (autoSelect && highlightedIndexRef.current !== -1 && popupOpen) {
      selectNewValue(
        event,
        filteredOptions[highlightedIndexRef.current],
        "blur"
      );
    } else if (clearOnBlur) {
      resetInputValue(event, value);
    }

    handleClose(event, "blur");
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;

    if (inputValue !== newValue) {
      setInputValueState(newValue);
      setInputPristine(false);

      if (onInputChange) {
        onInputChange(event, newValue, "input");
      }
    }

    if (newValue === "") {
      if (!disableClearable && !multiple) {
        handleValue(event, null, "clear");
      }
    } else {
      handleOpen(event);
    }
  };

  const handleOptionMouseMove = (event: React.MouseEvent<HTMLLIElement>) => {
    const index = Number(event.currentTarget.getAttribute("data-option-index"));
    if (highlightedIndexRef.current !== index) {
      setHighlightedIndex({
        event,
        index,
        reason: "mouse",
      });
    }
  };

  const handleOptionTouchStart = (event) => {
    setHighlightedIndex({
      event,
      index: Number(event.currentTarget.getAttribute("data-option-index")),
      reason: "touch",
    });
    isTouch.current = true;
  };

  const handleOptionClick = (event: React.MouseEvent<HTMLLIElement>) => {
    const index = Number(event.currentTarget.getAttribute("data-option-index"));
    selectNewValue(event, filteredOptions[index], "selectOption");

    isTouch.current = false;
  };

  const handleTagDelete = (index: number) => (event: MouseEvent) => {
    if (!multiple || !Array.isArray(value)) {
      return;
    }

    const newvalue = value.slice();
    newvalue.splice(index, 1);
    handleValue(event, newvalue, "removeOption", {
      option: value[index],
    });
  };

  const handlePopupIndicator = (event: MouseEvent) => {
    if (open) {
      handleClose(event, "toggleInput");
    } else {
      handleOpen(event);
    }
  };

  const handleMouseDown = (event) => {
    if (!event.currentTarget.contains(event.target)) {
      return;
    }
    if (event.target.getAttribute("id") !== id) {
      event.preventDefault();
    }
  };

  const handleClick = (event) => {
    if (!event.currentTarget.contains(event.target)) {
      return;
    }

    inputRef.current.focus();

    if (
      selectOnFocus &&
      firstFocus.current &&
      inputRef.current.selectionEnd - inputRef.current.selectionStart === 0
    ) {
      inputRef.current.select();
    }

    firstFocus.current = false;
  };

  const handleInputMouseDown = (event) => {
    if (!disabled && (inputValue === "" || !open)) {
      handlePopupIndicator(event);
    }
  };

  let dirty = false && inputValue.length > 0;
  dirty =
    dirty ||
    (multiple && Array.isArray(value) ? value.length > 0 : value !== null);

  let groupedOptions:
    | Value[]
    | {
        key: number;
        index: number;
        group: string;
        options: Value[];
      }[] = filteredOptions;
  if (groupBy) {
    const indexBy = new Map();
    let warn = false;

    groupedOptions = filteredOptions.reduce((acc, option, index) => {
      const group = groupBy(option);

      if (acc.length > 0 && acc[acc.length - 1].group === group) {
        acc[acc.length - 1].options.push(option);
      } else {
        if (process.env.NODE_ENV !== "production") {
          if (indexBy.get(group) && !warn) {
            console.warn(
              `ArkDashboard: The options provided combined with the \`groupBy\` method of ${componentName} returns duplicated headers.`,
              "You can solve the issue by sorting the options with the output of `groupBy`."
            );
            warn = true;
          }
          indexBy.set(group, true);
        }

        acc.push({
          key: index,
          index,
          group,
          options: [option],
        });
      }

      return acc;
    }, []);
  }

  if (disabled && focused) {
    handleBlur();
  }

  const renderChips = () => {
    if (
      !(
        multiple &&
        Array.isArray(value) &&
        (value as Array<unknown>).length > 0
      )
    ) {
      return;
    }

    let selectedOptions;

    const getCustomizedTagProps: ({ index }: { index: number }) => {
      key: number;
      disabled: boolean;
      "data-tag-index": number;
      tabIndex: number;
      onClick: MouseEventHandler;
    } = ({ index }) => {
      const disabled = getOptionDisabled
        ? getOptionDisabled(value[index])
        : false;
      return {
        key: index,
        tabIndex: -1,
        "data-tag-index": index,
        disabled,
        ...(!readOnly && { onClick: handleTagDelete(index) }),
      };
    };

    if (renderTags) {
      selectedOptions = renderTags(value, getCustomizedTagProps);
    } else {
      selectedOptions = (value as Array<unknown>).map((option, index) => {
        return (
          <div
            key={index}
            role="button"
            data-tag-index={index}
            className="relative m-0.5 box-border inline-flex h-8 max-w-[calc(100%-6px)] select-none appearance-none items-center justify-center whitespace-nowrap rounded-2xl bg-white/10 align-middle text-xs outline-0"
          >
            <span className="overflow-hidden text-ellipsis whitespace-nowrap px-3">
              {getOptionLabel(option as Value) as string}
            </span>
            {!readOnly && (
              <svg
                className="mr-1 -ml-1.5 inline-block h-4 w-4 shrink-0 select-none fill-current text-base text-white/60 transition-colors hover:text-white/40"
                viewBox="0 0 24 24"
                focusable="false"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                {...getCustomizedTagProps({ index })}
              >
                <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
              </svg>
            )}
          </div>
        );
      });
    }

    if (limitTags > -1 && Array.isArray(selectedOptions)) {
      const more = selectedOptions.length - limitTags;
      if (!focused && more > 0) {
        selectedOptions = selectedOptions.slice(0, limitTags);
        selectedOptions.push(
          <span className="m-1 max-w-[calc(100%-6px)]">{`+${more}`}</span>
        );
      }
    }

    return selectedOptions;
  };

  const renderOption = (
    option: Value,
    index: number,
    group: boolean = false
  ): React.JSX.Element => {
    const selected = (multiple && Array.isArray(value) ? value : [value]).some(
      (value2) =>
        value2 != null && isOptionEqualToValue(option, value2 as Value)
    );

    const disabled = getOptionDisabled ? getOptionDisabled(option) : false;

    const image = getOptionImage ? getOptionImage(option) : null;

    // TODO: add check if group is over or under
    const optionClassNames = clsx("flex items-center last:rounded-b-lg", {
      "px-2 py-1": size === "small",
      "py-2 px-4": size === "medium",
      "first:rounded-t-lg": index == 0 && !groupBy,
      "cursor-not-allowed text-zinc-500/50": disabled,
    });
    return (
      <li
        data-option-index={index}
        id={`${id}-option-${index}`}
        key={`option-${index}`}
        onMouseMove={handleOptionMouseMove}
        onClick={handleOptionClick}
        onTouchStart={handleOptionTouchStart}
        aria-selected={selected}
        aria-disabled={disabled}
        className={optionClassNames}
        tabIndex={-1}
        role="option"
      >
        {image && (
          <img
            className="mr-2 h-6 w-6"
            src={image}
            alt={getOptionLabel(option) as string}
          />
        )}

        <span className="grow">{getOptionLabel(option) as string}</span>

        {selected && !group && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="h-5 w-5 shrink-0"
            focusable="false"
          >
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </li>
    );
  };

  const renderOptions = () => {
    if (loading) {
      return (
        <li className="flex items-center py-2 px-4 text-zinc-500/70 dark:text-zinc-300/70">
          {loadingText}
        </li>
      );
    }

    if (groupedOptions.length == 0) {
      return (
        <li className="flex items-center py-2 px-4 text-zinc-500/70 dark:text-zinc-300/70">
          {noOptionsText}
        </li>
      );
    }

    return groupedOptions.map((option, index) => {
      if (groupBy && "group" in option) {
        const typedOption = option;
        return (
          <li className="overflow-hidden" key={typedOption.key}>
            <div className="px-2 py-1">{typedOption.group}</div>
            <ul>
              {typedOption.options.map((option2, index2) =>
                renderOption(option2, typedOption.index + index2)
              )}
            </ul>
          </li>
        );
      }
      return renderOption(option, index);
    });
  };

  return (
    <div
      className={clsx(
        "group relative flex w-fit min-w-[10rem] items-center text-black dark:text-white",
        className
      )}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      aria-owns={listboxAvailable ? `${id}-listbox` : null}
      onClick={(event) => {
        if (handleClick) {
          handleClick(event);
        }
        if (event.currentTarget === event.target && handleInputMouseDown) {
          handleInputMouseDown(event as React.SyntheticEvent);
        }
      }}
    >
      <div
        className={clsx(
          "relative mx-0 inline-flex w-full min-w-0 flex-col p-0 align-top",
          {
            "pointer-events-none text-black/50 dark:text-white/50": disabled,
            "mt-2 mb-1": margin === "dense",
            "mt-4 mb-2": margin === "normal",
            "mt-0 mb-0": margin == "none",
          }
        )}
        ref={anchorEl}
      >
        <label
          className={clsx(
            "pointer-events-none absolute left-0 top-0 z-10 block max-w-[calc(100%-24px)] origin-top-left translate-x-3.5 scale-100 transform overflow-hidden text-ellipsis font-normal leading-6 transition duration-200",
            {
              "!pointer-events-auto !max-w-[calc(133%-32px)] !-translate-y-2 !translate-x-3.5 !scale-75 !select-none":
                open || inputValue.length > 0,
              "translate-y-1 text-sm": size == "small",
              "translate-y-4 text-base": size == "medium",
            }
          )}
          htmlFor={`input-${name || id}`}
        >
          {label ?? name} {required && " *"}
        </label>

        <div
          className={clsx(
            "relative box-border inline-flex w-full cursor-text flex-wrap items-center rounded font-normal leading-6",
            btnClassName,
            {
              "pr-10": !disableClearable && open,
              "pr-12": !disableClearable && open,
              "text-sm": size == "small",
              "text-base": size == "medium",
            }
          )}
        >
          {/* Chips */}
          {renderChips()}

          <input
            id={`input-${name || id}`}
            type="text"
            className={clsx(
              "peer m-0 box-content block h-6 w-0 min-w-[30px] grow rounded-[inherit] border-0 bg-transparent font-[inherit] focus:outline-none disabled:pointer-events-none",
              {
                "py-1 pl-2 pr-1 text-sm": size == "small",
                "py-4 px-3 text-base": size === "medium",
              }
            )}
            disabled={disabled}
            value={inputValue}
            placeholder={placeholder}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChange={handleInputChange}
            onMouseDown={handleInputMouseDown}
            ref={inputRef}
            spellCheck={false}
            aria-activedescendant={popupOpen ? "" : null}
            aria-autocomplete={autoComplete ? "both" : "list"}
            aria-controls={listboxAvailable ? `${id}-listbox` : undefined}
            aria-expanded={listboxAvailable}
            role="combobox"
          />

          <div className="absolute right-2 top-[calc(50%-14px)] whitespace-nowrap text-black/70 dark:text-white/70">
            {!disableClearable && !disabled && dirty && !readOnly && (
              <button
                type="button"
                onClick={handleClear}
                className="relative -mr-0.5 box-border inline-flex appearance-none items-center justify-center rounded-full p-1 align-middle transition-colors duration-75 hover:bg-white/10 peer-hover:visible peer-focus:visible"
              >
                <svg
                  className="h-4 w-4 shrink-0 select-none fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  focusable="false"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={handlePopupIndicator}
              className="relative -mr-0.5 inline-flex select-none appearance-none items-center justify-center rounded-full p-1 align-middle transition-colors duration-75 hover:bg-white/10"
            >
              <svg
                className={clsx(
                  "h-4 w-4 transition-transform duration-75 will-change-transform",
                  {
                    "shrink-0": !popupOpen,
                    "shrink-0 rotate-180": popupOpen,
                  }
                )}
                fill="none"
                stroke="currentColor"
                focusable="false"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={"M19 9l-7 7-7-7"}
                />
              </svg>
              <Ripple center />
            </button>
          </div>
          <fieldset
            aria-hidden="true"
            style={{
              ...InputProps?.style,
              inset: "-5px 0px 0px",
            }}
            className={clsx(
              "pointer-events-none absolute m-0 min-w-0 overflow-hidden rounded-[inherit] border border-zinc-500 px-2 text-left transition duration-75 group-hover:border-2 group-hover:border-zinc-300 peer-invalid:!border-red-500 peer-hover:border-2 peer-hover:border-zinc-300 peer-focus:border-2 peer-focus:border-zinc-300 peer-disabled:border peer-disabled:border-zinc-500",
              {
                "top-0":
                  open || filteredOptions.length > 0 || inputValue.length > 0,
              }
            )}
          >
            <legend
              style={{ float: "unset", height: "11px" }}
              className={clsx(
                "invisible block w-auto max-w-[.01px] overflow-hidden whitespace-nowrap !p-0 !text-xs transition-all duration-75",
                {
                  "!max-w-full":
                    open || filteredOptions.length > 0 || inputValue.length > 0,
                }
              )}
            >
              {(label ?? name) && (
                <span className="visible inline-block px-1 opacity-0">
                  {label ?? name} {required && " *"}
                </span>
              )}
            </legend>
          </fieldset>
        </div>

        {!!name && <FieldError name={name} className="rw-field-error" />}
        {helperText && (
          <p
            id={`${name}-helper-text`}
            className="mx-3 mt-0.5 mb-0 text-left text-xs font-normal leading-5 tracking-wide text-black/70 dark:text-white/70"
          >
            {helperText}
          </p>
        )}
      </div>

      {/* Dropdown Menu */}
      <Popper anchorEl={anchorEl.current} open={popupOpen} paddingToAnchor={4}>
        <ClickAwayListener
          onClickAway={(e) => {
            if (
              anchorEl?.current?.parentElement &&
              anchorEl.current.parentElement.contains(e.target as HTMLElement)
            ) {
              return;
            }
            handleClose(e, "escape");
          }}
        >
          <div
            role="menu"
            className={clsx(
              "z-30 w-fit max-w-full select-none overflow-hidden rounded-lg border border-zinc-500 bg-white shadow transition-colors duration-300 ease-in-out dark:bg-zinc-800",
              {
                "min-w-[10rem]": size === "small",
                "min-w-[15rem]": size === "medium",
              }
            )}
          >
            <ul
              className="relative max-h-48 space-y-1 overflow-y-auto pt-0 text-gray-700 will-change-scroll dark:text-gray-200"
              aria-labelledby={`${id}-label`}
              ref={handleListboxRef}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              role="listbox"
            >
              {renderOptions()}
            </ul>
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

type OldSelectProps = {
  options: SelectOption[];
  label?: string;
  name?: string;
  className?: string;
  btnClassName?: string;
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the component is in a loading state.
   * This shows the `loadingText` in place of suggestions (only if there are no suggestions to show, e.g. `options` are empty).
   * @default false
   */
  loading?: boolean;
  /**
   * Text to display when in a loading state.
   *
   * @default 'Loading…'
   */
  loadingText?: React.ReactNode;
  /**
   * Text to display when empty.
   *
   * @default 'No options'
   */
  noOptionsText?: React.ReactNode;
  helperText?: string;
  disableClearable?: boolean;
  readOnly?: boolean;
  open?: boolean;
  filterlookupOptions?: boolean;
  filterSelectedOptions?: boolean;
  clearOnBlur?: boolean;
  required?: boolean;
  selectOnFocus?: boolean;
  closeOnSelect?: boolean;
  clearOnEscape?: boolean;
  openOnFocus?: boolean;
  autoSelect?: boolean;
  inputValue?: string;
  componentName?: string;
  validation?: RegisterOptions;
  margin?: "none" | "dense" | "normal";
  size?: "small" | "medium";
  InputProps?: {
    style?: CSSProperties;
  };
  placeholder?: string;
  groupBy?: (option: SelectOption) => string;
  renderTags?: (lookupOptions: Readonly<SelectOption[]>) => React.ReactNode;
  onInputChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    newInputValue: string
  ) => void;
  filterOptions?: (options: SelectOption[], state: any) => SelectOption[];
  filterFn?: (option: SelectOption, searchTerm: string) => boolean;
  getOptionLabel?: (option: SelectOption) => string;
  isOptionEqualToValue?: (option: SelectOption, value: SelectOption) => boolean;
} & (SingleSelectLookupProps | MultiSelectLookupProps);
export const Lookup2 = ({
  multiple = false,
  options,
  label,
  name,
  defaultValue,
  value: valueProp,
  className,
  btnClassName,
  placeholder,
  inputValue: inputValueProp,
  helperText,
  validation,
  loadingText = "Loading…",
  noOptionsText = "No options",
  margin = "normal",
  size = "medium",
  selectOnFocus = false,
  openOnFocus = false,
  open: openProp = false,
  loading = false,
  disabled = false,
  readOnly = false,
  required = false,
  disableClearable = false,
  closeOnSelect = true,
  filterlookupOptions = false,
  InputProps,
  groupBy,
  renderTags,
  onSelect,
  onInputChange,
  filterFn,
  getOptionLabel: getOptionLabelProp = (option: SelectOption) =>
    option.label ?? "",
  isOptionEqualToValue = (option: SelectOption, value: SelectOption) =>
    option.value === value.value,
}: OldSelectProps) => {
  // https://github.com/mui/material-ui/blob/a13c0c026692aafc303756998a78f1d6c2dd707d/packages/mui-base/src/useAutocomplete/useAutocomplete.js#L107
  const anchorEl = useRef(null);
  const [isOpen, setOpen] = useState(openProp);
  const [searchTerm, setSearchTerm] = useState<string>(inputValueProp || "");
  const [internalValue, setInternalValue] = useState<string>("");
  const [lookupOptions, setLookupOptions] = useState<SelectOption[]>(options);

  let getOptionLabel = getOptionLabelProp;

  getOptionLabel = (option: SelectOption) => {
    const optionLabel = getOptionLabelProp(option);

    if (typeof optionLabel !== "string") {
      console.error(
        `Lookup: The valueProp provided to the getOptionLabel prop must be a string. Received ${typeof optionLabel} instead`
      );
    }

    return optionLabel;
  };

  const { field } =
    !!name &&
    useController({
      name: name,
      defaultValue: defaultValue,
      rules: validation,
    });

  useEffect(() => {
    setLookupOptions((prev) =>
      prev.map((option) => {
        const inSearch =
          !searchTerm ||
          (filterFn
            ? filterFn(option, searchTerm)
            : getOptionLabel(option)
                .toLowerCase()
                .includes(searchTerm.toLowerCase()));

        return {
          ...option,
          inSearch: inSearch,
        };
      })
    );
  }, [options, searchTerm, filterFn]);

  // Update selectedOption when defaultValue changes
  useEffect(() => {
    setSearchTerm("");
    setInternalValue("");

    const valuesToSelect = valueProp
      ? Array.isArray(valueProp) && multiple
        ? valueProp.map((s) => s.value)
        : !Array.isArray(valueProp)
        ? [valueProp.value]
        : []
      : Array.isArray(defaultValue) && multiple
      ? defaultValue.map(
          (dv) => options.find((o) => o.value === dv) ?? { valueProp: "" }
        )
      : [defaultValue];

    const selected: SelectOption[] = options.map((option) => {
      // const isSelected = valuesToSelect.includes(option.valueProp);

      // const values = Array.isArray(valueProp) && multiple ? valueProp : [valueProp] as SelectOption[];
      // const missingValue = (multiple ? valueProp as SelectOption[] : [valueProp] as SelectOption[]).filter((value2) => value2 !== null && !options.some((option) => isOptionEqualToValue(option, value2)));

      // values.findIndex((v) => isOptionEqualToValue(option, v));
      const isSelected = valuesToSelect.some((valueProp) =>
        isOptionEqualToValue(
          option,
          options.find((o) => o.value === valueProp) ?? { value: "" }
        )
      );
      const inSearch =
        !searchTerm ||
        getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase());

      return {
        ...option,
        isSelected,
        inSearch,
      };
    });

    setLookupOptions(selected);

    if (!!name) {
      field.onChange(multiple ? valuesToSelect : valuesToSelect[0]);
    }

    setInternalValue(
      multiple
        ? ""
        : options?.find((e) =>
            isOptionEqualToValue(
              e,
              options.find((o) => o.value === valuesToSelect[0]) ?? {
                value: "",
              }
            )
          )?.label ?? ""
    );
  }, [defaultValue, valueProp, multiple, options]);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (openOnFocus) {
      setOpen(true);
    }

    if (selectOnFocus) {
      event.target.select();
    }
  };

  // TODO: do not trigger select if same option is selected again
  const handleOptionSelect = useCallback(
    (
      event:
        | React.MouseEvent<HTMLLIElement>
        | React.MouseEvent<SVGSVGElement> = null,
      option: SelectOption
    ) => {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }

      if (!option || option.disabled) return;

      const isSelected = lookupOptions.some(
        (o) => o?.value === option.value && o?.isSelected
        // (o) => isOptionEqualToValue(o, option) && o?.isSelected
      );

      const updateOptions = lookupOptions.map((o) => {
        if (isOptionEqualToValue(o, option)) {
          return {
            ...o,
            isSelected: !isSelected,
          };
        }
        return { ...o, isSelected: false };
      }) as SelectOption[];

      if (!!name) {
        field.onChange(
          multiple
            ? updateOptions
                .filter((f) => f != null && f.isSelected)
                .map((o) => o?.value)
            : option.value
        );
      }

      multiple
        ? onSelect?.(updateOptions)
        : onSelect?.(
            Array.isArray(updateOptions.find((o) => o.isSelected))
              ? updateOptions.find((o) => o.isSelected)[0]
              : updateOptions.find((o) => o.isSelected) ?? undefined
          );

      setLookupOptions(updateOptions);
      setSearchTerm("");
      setInternalValue(multiple ? "" : option.label);

      if (closeOnSelect && (!event || (!event.ctrlKey && !event.metaKey))) {
        setOpen(false);
      }
    },
    [lookupOptions, multiple, onSelect]
  );

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value || "";
    setSearchTerm(inputValue);
    setInternalValue(inputValue);
    onInputChange?.(event, inputValue);
  };

  const handleClearSelection = (event) => {
    setLookupOptions((prev) => prev.map((o) => ({ ...o, isSelected: false })));
    setSearchTerm("");
    setInternalValue("");
    multiple ? onSelect?.([]) : onSelect?.(undefined);
    if (!!name) {
      field.onChange(multiple ? [] : undefined);
    }

    if (onInputChange) {
      onInputChange(event, "");
    }
  };

  const handleClose = (event: MouseEvent<any> | SyntheticEvent) => {
    if (
      anchorEl.current &&
      anchorEl.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const toggleLookup = (
    e: React.MouseEvent<HTMLButtonElement> | MouseEvent<HTMLInputElement>
  ) => {
    e.stopPropagation();

    if (disabled) {
      return setOpen(false);
    }

    setOpen(!isOpen);

    const input = anchorEl.current.querySelector("input");
    if (e.currentTarget.type == "button") input?.focus();

    // TODO: fix this / check if it really is needed
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  const renderChips = () => {
    const filteredOptions = lookupOptions.filter(
      (o) => o != null && o.isSelected
    );
    if (multiple && renderTags) {
      return renderTags(filteredOptions);
    }

    return (
      multiple &&
      !renderTags &&
      filteredOptions.map((option) => (
        <div
          role="button"
          className="relative m-0.5 box-border inline-flex h-8 max-w-[calc(100%-6px)] select-none appearance-none items-center justify-center whitespace-nowrap rounded-2xl bg-white/10 align-middle text-xs outline-0"
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap px-3">
            {option.label}
          </span>
          {!readOnly && (
            <svg
              onClick={(e) => handleOptionSelect(e, option)}
              className="mr-1 -ml-1.5 inline-block h-4 w-4 shrink-0 select-none fill-current text-base text-white/60 transition-colors hover:text-white/40"
              viewBox="0 0 24 24"
              focusable="false"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
            </svg>
          )}
        </div>
      ))
    );
  };

  const renderOption = (
    option: SelectOption,
    index: number
  ): React.JSX.Element => {
    const { value: valueProps, image, disabled, isSelected } = option;

    // TODO: add check if group is over or under
    const optionClassNames = clsx("flex items-center last:rounded-b-lg", {
      "px-2 py-1": size === "small",
      "py-2 px-4": size === "medium",
      "first:rounded-t-lg": index == 0 && !groupBy,
      "cursor-not-allowed text-zinc-500/50": disabled,
      "hover:bg-zinc-200 dark:hover:bg-zinc-600/90 dark:hover:text-white":
        !disabled,
    });
    return (
      <li
        data-option-index={index}
        key={`option-${valueProp}-${index}`}
        onClick={(e) => handleOptionSelect(e, option)}
        aria-checked={isSelected}
        aria-selected={isSelected}
        aria-disabled={disabled}
        className={optionClassNames}
        tabIndex={-1}
        role="option"
      >
        {"image" in option && (
          <img
            className="mr-2 h-6 w-6"
            src={image}
            alt={getOptionLabel(option)}
          />
        )}

        <span className="grow">{getOptionLabel(option)}</span>

        {isSelected && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="h-5 w-5 shrink-0"
            focusable="false"
          >
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </li>
    );
  };

  const renderOptions = () => {
    const filteredOptions = lookupOptions.filter((option) => {
      if (filterlookupOptions) {
        return !option?.isSelected && option?.inSearch;
      }

      return option.inSearch;
    });

    if (loading) {
      return (
        <li className="flex items-center py-2 px-4 text-zinc-500/70 dark:text-zinc-300/70">
          {loadingText}
        </li>
      );
    }

    if (filteredOptions.length == 0) {
      return (
        <li className="flex items-center py-2 px-4 text-zinc-500/70 dark:text-zinc-300/70">
          {noOptionsText}
        </li>
      );
    }

    if (groupBy) {
      const groupedOptions = filteredOptions.reduce((acc, obj) => {
        let groupKey = groupBy(obj);
        acc[groupKey] = [...(acc[groupKey] || []), obj];
        return acc;
      }, {}) as {
        [key: string]: SelectOption[];
      };

      return Object.entries(groupedOptions).map(([groupTitle, groupItems]) => {
        return (
          <li className="overflow-hidden" key={`group-${groupTitle}`}>
            <div className="px-2 py-1">{groupTitle}</div>
            <ul>{groupItems.map(renderOption)}</ul>
          </li>
        );
      });
    }

    return filteredOptions.map(renderOption);
  };

  return (
    <div
      className={clsx(
        "group relative flex w-fit min-w-[10rem] items-center text-black dark:text-white",
        className
      )}
    >
      <div
        className={clsx(
          "relative mx-0 inline-flex w-full min-w-0 flex-col p-0 align-top",
          {
            "pointer-events-none text-black/50 dark:text-white/50": disabled,
            "mt-2 mb-1": margin === "dense",
            "mt-4 mb-2": margin === "normal",
            "mt-0 mb-0": margin == "none",
          }
        )}
        ref={anchorEl}
      >
        <label
          className={clsx(
            "pointer-events-none absolute left-0 top-0 z-10 block max-w-[calc(100%-24px)] origin-top-left translate-x-3.5 translate-y-4 scale-100 transform overflow-hidden text-ellipsis font-normal leading-6 transition duration-200",
            {
              "!pointer-events-auto !max-w-[calc(133%-32px)] !-translate-y-2 !translate-x-3.5 !scale-75 !select-none":
                isOpen ||
                lookupOptions.filter((o) => o != null && o.isSelected).length >
                  0 ||
                searchTerm.length > 0 ||
                internalValue.length > 0,
              "text-sm": size == "small",
              "text-base": size == "medium",
            }
          )}
          htmlFor={`input-${name}`}
        >
          {label ?? name} {required && " *"}
        </label>

        <div
          className={clsx(
            "relative box-border inline-flex w-full cursor-text flex-wrap items-center rounded font-normal leading-6",
            btnClassName,
            {
              "pr-10":
                !disableClearable &&
                lookupOptions.filter((d) => d != null && d.isSelected).length ==
                  0,
              "pr-12":
                !disableClearable &&
                lookupOptions.filter((d) => d != null && d.isSelected).length >
                  0,
              "text-sm": size == "small",
              "text-base": size == "medium",
            }
          )}
        >
          {/* Chips */}
          {renderChips()}

          <input
            aria-invalid="false"
            id={`input-${name}`}
            type="text"
            className={clsx(
              "peer m-0 box-content block h-6 w-0 min-w-[30px] grow rounded-[inherit] border-0 bg-transparent font-[inherit] focus:outline-none disabled:pointer-events-none",
              {
                "py-1 pl-2 pr-1 text-sm": size == "small",
                "py-4 px-3 text-base": size === "medium",
              }
            )}
            disabled={disabled}
            value={internalValue}
            readOnly={readOnly}
            required={required}
            placeholder={placeholder}
            onFocus={handleFocus}
            onChange={handleInputChange}
            onClick={toggleLookup}
            role="combobox"
          />

          <div className="absolute right-2 top-[calc(50%-14px)] whitespace-nowrap text-black/70 dark:text-white/70">
            {!disableClearable &&
              lookupOptions.filter((d) => d != null && d.isSelected).length >
                0 && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="relative -mr-0.5 box-border inline-flex appearance-none items-center justify-center rounded-full p-1 align-middle transition-colors duration-75 hover:bg-white/10 peer-hover:visible peer-focus:visible"
                >
                  <svg
                    className="h-4 w-4 shrink-0 select-none fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    focusable="false"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              )}
            <button
              type="button"
              onClick={toggleLookup}
              className="relative -mr-0.5 inline-flex select-none appearance-none items-center justify-center rounded-full p-1 align-middle transition-colors duration-75 hover:bg-white/10"
            >
              <svg
                className={clsx(
                  "h-4 w-4 transition-transform duration-75 will-change-transform",
                  {
                    "shrink-0": !isOpen,
                    "shrink-0 rotate-180": isOpen,
                  }
                )}
                fill="none"
                stroke="currentColor"
                focusable="false"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={"M19 9l-7 7-7-7"}
                />
              </svg>
            </button>
          </div>
          <fieldset
            aria-hidden="true"
            style={{
              ...InputProps?.style,
              inset: "-5px 0px 0px",
            }}
            className={clsx(
              "pointer-events-none absolute m-0 min-w-0 overflow-hidden rounded-[inherit] border border-zinc-500 px-2 text-left transition duration-75 group-hover:border-2 group-hover:border-zinc-300 peer-invalid:!border-red-500 peer-hover:border-2 peer-hover:border-zinc-300 peer-focus:border-2 peer-focus:border-zinc-300 peer-disabled:border peer-disabled:border-zinc-500",
              {
                "top-0":
                  isOpen ||
                  lookupOptions.filter((o) => o != null && o.isSelected)
                    .length > 0 ||
                  searchTerm.length > 0 ||
                  internalValue.length > 0,
              }
            )}
          >
            <legend
              style={{ float: "unset", height: "11px" }}
              className={clsx(
                "invisible block w-auto max-w-[.01px] overflow-hidden whitespace-nowrap !p-0 !text-xs transition-all duration-75",
                {
                  "!max-w-full":
                    isOpen ||
                    lookupOptions.filter((o) => o != null && o.isSelected)
                      .length > 0 ||
                    searchTerm.length > 0 ||
                    internalValue.length > 0,
                }
              )}
            >
              {(label ?? name) && (
                <span className="visible inline-block px-1 opacity-0">
                  {label ?? name} {required && " *"}
                </span>
              )}
            </legend>
          </fieldset>
        </div>

        {!!name && <FieldError name={name} className="rw-field-error" />}
        {helperText && (
          <p
            id={`${name}-helper-text`}
            className="mx-3 mt-0.5 mb-0 text-left text-xs font-normal leading-5 tracking-wide text-black/70 dark:text-white/70"
          >
            {helperText}
          </p>
        )}
      </div>

      {/* Dropdown Menu */}
      <Popper anchorEl={anchorEl.current} open={isOpen} paddingToAnchor={4}>
        <ClickAwayListener onClickAway={(e) => handleClose(e)}>
          <div
            role="menu"
            className={clsx(
              "z-30 w-fit max-w-full select-none overflow-hidden rounded-lg border border-zinc-500 bg-white shadow transition-colors duration-300 ease-in-out dark:bg-zinc-800",
              {
                "min-w-[10rem]": size === "small",
                "min-w-[15rem]": size === "medium",
              }
            )}
          >
            <ul
              className="relative max-h-48 space-y-1 overflow-y-auto pt-0 text-gray-700 will-change-scroll dark:text-gray-200"
              aria-labelledby="dropdownButton"
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              role="listbox"
            >
              {renderOptions()}
            </ul>
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};
