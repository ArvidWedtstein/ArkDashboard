import { FieldError, RegisterOptions } from "@redwoodjs/forms/dist";
import clsx from "clsx";
import { CSSProperties, Fragment, HTMLAttributes, useRef, useState } from "react";

import DateCalendar from "../DateCalendar/DateCalendar";
import Popper from "../Popper/Popper";
import ClickAwayListener from "../ClickAwayListener/ClickAwayListener";
import { FormControl, InputBase, InputLabel } from "../Input/Input";
import Button from "../Button/Button";
import { isDate, toLocaleISODate } from "src/lib/formatters";

type ViewType = "year" | "month" | "day";
type InputFieldProps = {
  margin?: "none" | "dense" | "normal";
  label?: string;
  helperText?: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  InputProps?: {
    style?: CSSProperties;
  };
  HelperTextProps?: Partial<HTMLAttributes<HTMLParagraphElement>>;
};
type DatePickerProps = {
  displayWeekNumber?: boolean;
  showDaysOutsideCurrentMonth?: boolean;
  fixedWeekNumber?: number;
  views?: ViewType[];
  disabled?: boolean;
  readOnly?: boolean;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  firstDayOfWeek?: number;
  variant?: 'filled' | 'outlined' | 'standard';
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "DEFAULT";
  margin?: "none" | "dense" | "normal";
  size?: "small" | "medium" | "large";
  // validation?: RegisterOptions;
} & InputFieldProps;



const DateField = ({ format = 'DD/YYYY/MM' }: any) => {
  const [inputValue, setInputValue] = useState(format);
  const [segment, setSegment] = useState({ start: 0, end: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  const order = format.split('/').map((f) => f.slice(0, 1))
  const sectionRange: Record<string, {
    start: number;
    end: number;
    order: number;
  }> = {
    day: { start: format.indexOf('D'), end: format.indexOf('D') + 2, order: order.indexOf('D') },
    month: { start: format.indexOf('M'), end: format.indexOf('M') + 2, order: order.indexOf('M') },
    year: { start: format.indexOf('Y'), end: format.indexOf('Y') + 4, order: order.indexOf('Y') }
  }

  const setCursorPosition = (start: number, end: number) => {
    requestAnimationFrame(() => {
      inputRef.current.setSelectionRange(start, end);
    });
  };

  const handleInputChange = (event) => {
    let value: string = event.target.value.toString();
    const caretPosition = event.target.selectionStart;

    const range = Object.values(sectionRange)?.find(
      (data) =>
        caretPosition >= data.start && caretPosition <= data.end
    );

    if (range) {
      const sectionLength = range.end - range.start;
      let sections = value.split('/');
      let section = sections[range.order]?.padStart(sectionLength, '0');
      if (caretPosition >= range.start && caretPosition <= range.end) {
        sections[range.order] = `${section.slice(-sectionLength).padStart(sectionLength, '0')}`;
        value = sections.join('/');
      }

      let newCaretPosition = range.start + section.slice(0, caretPosition - range.start).replace(/\D/g, '').length;

      setCursorPosition(newCaretPosition, newCaretPosition);
    }

    let formattedValue = '';
    let charIndex = 0;

    for (let i = 0; i < format.length; i++) {
      if ('DMY'.includes(format[i])) {
        formattedValue += value.replace(/\D/g, '')[charIndex] || '';
        // formattedValue += value.replace(/[^A-Za-z0-9]/g, '')[charIndex] || '';

        charIndex += 1;
      } else {
        formattedValue += format[i];
      }
    }
    setInputValue(formattedValue);

  };

  const handleClick = (event) => {
    const clickPosition = event.nativeEvent.target.selectionStart;

    const range = Object.values(sectionRange)?.find(
      (data) =>
        clickPosition >= data.start && clickPosition <= data.end
    );

    if (range) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(range.start, range.end);
      setSegment({ start: range.start, end: range.end });
    }
  };

  const handleSelectChange = (event) => {
    console.log(event.target.selectionStart);
  };

  const handlePaste = (event) => {
    event.stopPropagation();
    event.preventDefault();
    console.log(event.clipboardData.getData('Text'));

    // setInputValue()
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // event.preventDefault();
    event.stopPropagation();

    const clickPosition = (event.nativeEvent.target as HTMLInputElement).selectionStart;

    const range = Object.values(sectionRange)?.find((data) => {
      if (clickPosition >= data.start && (clickPosition > format.length ? format.length : clickPosition) <= data.end) {
        return data
      }
    })
    switch (event.code) {
      case 'ArrowLeft':
        let newPos = Object.values(sectionRange)?.find((data) => data.order === (range.order === 0 ? 0 : range.order - 1));
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newPos.start, newPos.end);
        setSegment({ start: newPos.start, end: newPos.end })
        break;
      case 'ArrowRight':
        const { start, end } = Object.values(sectionRange)?.find((data) => data.order === (range.order >= Object.values(sectionRange).length - 1 ? Object.values(sectionRange).length - 1 : range.order + 1));
        inputRef.current.focus();
        (event.nativeEvent.target as HTMLInputElement).setSelectionRange(start, end);
        setSegment({ start, end })
        break;
      default:
        // inputRef.current.focus();
        // inputRef.current.setSelectionRange(range.start, range.end);
        break;
    }
  }

  return (
    <div>

      <label className="rw-label">Date</label>
      <input
        className="rw-input"
        value={inputValue}
        ref={inputRef}
        onKeyUp={handleKeyUp}
        onChange={handleInputChange}
        onSelect={handleSelectChange}
        onPaste={handlePaste}
        placeholder={format}
        onClick={handleClick}
      />
    </div>
  );
};
const DateField2 = ({ format = 'DD/YYYY/MM' }: any) => {
  const [inputValue, setInputValue] = useState(format);
  const [segment, setSegment] = useState({ start: 0, end: 0 })
  const inputRef = useRef<HTMLInputElement>(null);
  const order = format.split('/').map((f) => f.slice(0, 1))
  const sectionRange = {
    day: { start: format.indexOf('D'), end: format.indexOf('D') + 2, order: order.indexOf('D') },
    month: { start: format.indexOf('M'), end: format.indexOf('M') + 2, order: order.indexOf('M') },
    year: { start: format.indexOf('Y'), end: format.indexOf('Y') + 4, order: order.indexOf('Y') }
  }
  const handleInputChange = (event) => {
    console.log('CHANGE')
    let value: string = event.target.value.toString();
    // value = value.replace(/\D/g, ''); // Remove non-numeric characters

    const caretPosition = event.target.selectionStart;

    const range = Object.values(sectionRange)?.find((data) => {
      if (caretPosition >= data.start && (caretPosition > format.length ? format.length : caretPosition) <= data.end) {
        return data
      }
    })

    const sectionLength = range.end - range.start;
    let sections = value.split('/')
    let section = sections[range.order].padStart(sectionLength, '0');
    if (caretPosition >= range.start && caretPosition <= range.end) {
      sections[range.order] = `${section.slice(-sectionLength).padStart(sectionLength, '0')}`
      value = sections.join('/')
    }


    // Apply the format to the input value
    let formattedValue = '';
    let charIndex = 0;

    for (let i = 0; i < format.length; i++) {
      if ('MDY'.includes(format[i])) {
        formattedValue += value.replace(/\D/g, '')[charIndex] || '';
        charIndex += 1;
      } else {
        formattedValue += format[i];
      }
    }
    // Auto-complete month and jump to the next section
    // if (formattedValue.length === 2 && format.includes('M')) {
    //   formattedValue = formattedValue.padStart(2, '0');
    //   charIndex += 1; // Move to the next section
    // }

    console.log(inputRef.current.selectionStart, range.start, range.end)
    // setInputValue(value);
    setInputValue(formattedValue);


    // inputRef.current.focus();
    inputRef.current.setSelectionRange(segment.start, segment.end);

  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // inputRef.current.focus();
    // inputRef.current.setSelectionRange(segment.start, segment.end);
  }
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // event.preventDefault();
    // event.stopPropagation();

    // const clickPosition = (event.nativeEvent.target as HTMLInputElement).selectionStart;

    // const range = Object.values(sectionRange)?.find((data) => {
    //   if (clickPosition >= data.start && (clickPosition > format.length ? format.length : clickPosition) <= data.end) {
    //     return data
    //   }
    // })
    // switch (event.code) {
    //   case 'ArrowLeft':
    //     let newPos = Object.values(sectionRange)?.find((data) => data.order === (range.order === 0 ? 0 : range.order - 1));
    //     inputRef.current.focus();
    //     inputRef.current.setSelectionRange(newPos.start, newPos.end);
    //     setSegment({ start: newPos.start, end: newPos.end })
    //     break;
    //   case 'ArrowRight':
    //     const { start, end } = Object.values(sectionRange)?.find((data) => data.order === (range.order >= Object.values(sectionRange).length - 1 ? Object.values(sectionRange).length - 1 : range.order + 1));
    //     inputRef.current.focus();
    //     (event.nativeEvent.target as HTMLInputElement).setSelectionRange(start, end);
    //     setSegment({ start, end })
    //     break;
    //   default:
    //     // inputRef.current.focus();
    //     // inputRef.current.setSelectionRange(range.start, range.end);
    //     break;
    // }

  }

  const handleClick = (event) => {
    // Logic to extract date sections based on the format
    const dateSections = extractDateSections();
    console.log('Date Sections:', dateSections);
    const clickPosition = event.nativeEvent.target.selectionStart;

    const range = Object.values(sectionRange)?.find((data) => {
      if (clickPosition >= data.start && (clickPosition > format.length ? format.length : clickPosition) <= data.end) {
        return data
      }
    })

    // Move focus to the clicked section or the first section
    inputRef.current.focus();
    // inputRef.current.select()
    inputRef.current.setSelectionRange(range.start, range.end);
    setSegment({ start: range.start, end: range.end })
  };

  const extractDateSections = () => {
    // Logic to extract date sections based on the format
    let day = inputValue.substring(sectionRange.day.start, sectionRange.day.end);
    let month = inputValue.substring(sectionRange.month.start, sectionRange.month.end);
    let year = inputValue.substring(sectionRange.year.start, sectionRange.year.end);

    return { day, month, year };
  };

  const handleSelectChange = (event) => {
    console.log(event.target.selectionStart)
  }

  const handlePaste = (event) => {
    // Stop data actually being pasted into div
    event.stopPropagation();
    event.preventDefault();
    console.log('PASTE')
    console.log(event.clipboardData, event.clipboardData.getData('Text'))
  }

  return (
    <div>
      <label className="rw-label">Date</label>
      <input
        className="rw-input"
        value={inputValue}
        ref={inputRef}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
        onSelect={handleSelectChange}
        onPaste={handlePaste}
        placeholder={format}
        onClick={handleClick}
      />
      <button type="button" className="rw-button rw-button-gray-outline" onClick={handleClick}>Get Date Sections</button>
    </div>
  );
};

const DatePicker = ({
  views = ["day", "year"],
  disabled = false,
  readOnly = false,
  defaultValue = new Date(),
  margin = "normal",
  label,
  name,
  helperText,
  required,
  InputProps,
  placeholder,
  variant = 'outlined',
  color = "DEFAULT",
  size = "medium",
  HelperTextProps,
  onChange,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    defaultValue && isDate(defaultValue) ? new Date(defaultValue) : null
  );
  const [internalValue, setInternalValue] = useState<string>("");

  const toggleOpen = (
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    if (!disabled) {
      setOpen(!open);
    }
  };

  const borders = {
    primary: `border-blue-400`,
    secondary: `border-zinc-500`,
    success: `border-pea-500`,
    error: `border-red-500`,
    warning: `border-amber-400`,
    disabled: `dark:border-white/30 border-black/30`,
    DEFAULT: `group-hover:border-black group-hover:dark:border-white border-black/20 dark:border-white/20`
  }

  const handleInputChange = (e) => {
    const inputText: string = e.target.value;

    const parsedDate = new Date(inputText);

    setInternalValue(inputText);
    if (
      parsedDate &&
      parsedDate instanceof Date &&
      !isNaN(parsedDate.getTime())
    ) {
      setInternalValue(parsedDate.toLocaleDateString(navigator && navigator.language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }))
      setSelectedDate(parsedDate);
    }

    onChange?.(e)
  };

  const handleBlur = (e) => {
    // if (selectedDate) {
    //   setInternalValue(new Date(selectedDate).toDateString());
    // }
  };

  const handleClick = (e) => {
    setOpen(!open);
  };

  const handleClose = (event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <div
      className={"group relative flex w-fit min-w-[10rem] items-center text-black dark:text-white"}
    >
      <FormControl
        ref={anchorRef}
        margin={margin}
        disabled={disabled}
        size={size}
        variant={variant}
        color={color}
        required={required}
        onClick={handleClick}
      >
        <InputLabel
          children={label ?? name}
          shrink={open
            ||
            internalValue.length > 0
            // || (Array.isArray(value) && value.length > 0)
          }
        />

        <InputBase
          readOnly={readOnly}
          {...InputProps}
          renderSuffix={(state) => (
            variant === 'outlined' ? (
              <fieldset aria-hidden className={clsx(`border transition-colors ease-in duration-75 absolute text-left ${borders[disabled || state.disabled ? 'disabled' : state.focused ? color : 'DEFAULT']} bottom-0 left-0 right-0 -top-[5px] m-0 px-2 rounded-[inherit] min-w-0 overflow-hidden pointer-events-none`)}>
                <legend className={clsx("w-auto overflow-hidden block invisible text-xs p-0 h-[11px] whitespace-nowrap transition-all", {
                  "max-w-full": state.focused || state.filled || open,
                  "max-w-[0.01px]": !state.focused && !state.filled
                })}>
                  {label && label !== "" && (
                    <span className={"px-[5px] inline-block opacity-0 visible"}>
                      {state.required ? (
                        <React.Fragment>
                          {label}
                          &thinsp;{'*'}
                        </React.Fragment>
                      ) : (
                        label
                      )}
                    </span>
                  )}
                </legend>
              </fieldset>
            ) : null
          )}
          value={internalValue}
          placeholder={placeholder}
          inputProps={{
            spellCheck: false,
            "aria-activedescendant": open ? "" : null,
            onChange: handleInputChange,
            onBlur: handleBlur,
          }}
          endAdornment={(
            <Button
              variant="icon"
              color={"DEFAULT"}
              className="-mr-0.5 !p-2"
              tabIndex={0}
              onClick={(e) => toggleOpen(e)}
              aria-label={`Choose date${selectedDate
                ? `, selected date is ${selectedDate.toLocaleDateString(
                  navigator && navigator.language,
                  {
                    dateStyle: "long",
                  }
                )}`
                : ""
                }`}
              disabled={disabled}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4">
                <path d="M384 64h-32V16C352 7.164 344.8 0 336 0S320 7.164 320 16V64H128V16C128 7.164 120.8 0 112 0S96 7.164 96 16V64H64C28.65 64 0 92.65 0 128v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V128C448 92.65 419.3 64 384 64zM32 224h96v64H32V224zM160 288V224h128v64H160zM288 320v64H160v-64H288zM32 320h96v64H32V320zM64 480c-17.67 0-32-14.33-32-32v-31.1h96V480H64zM160 480v-63.1h128V480H160zM416 448c0 17.67-14.33 32-32 32h-64v-63.1h96V448zM416 384h-96v-64h96V384zM416 288h-96V224h96V288zM416 192H32V128c0-17.67 14.33-32 32-32h320c17.67 0 32 14.33 32 32V192z" />
              </svg>
            </Button>
          )}
        />
        {/* TODO: add formerror */}
        {helperText && (
          <p className="rw-helper-text" {...HelperTextProps}>
            {helperText}
          </p>
        )}
      </FormControl>

      {/* Menu */}
      <Popper anchorEl={anchorRef?.current} open={open} paddingToAnchor={4}>
        <ClickAwayListener
          onClickAway={handleClose}
        >
          <div
            className={
              "z-30 w-fit min-w-[15rem] max-w-full select-none overflow-hidden rounded-lg border border-zinc-500 bg-white shadow transition-colors duration-300 ease-in-out dark:bg-zinc-800"
            }
          >
            <DateCalendar
              views={views}
              defaultValue={selectedDate || new Date()}
              onChange={(date) => {
                setSelectedDate(date);
                setInternalValue(date.toLocaleDateString(navigator && navigator.language, {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }));
                setOpen(false);
              }}
            />
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default DatePicker;
