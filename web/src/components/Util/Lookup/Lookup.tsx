import { Controller, FieldError, TextField, useController, useFormContext, useRegister } from "@redwoodjs/forms";
import { useEffect, useMemo, useRef, useState } from "react";
import useComponentVisible from "../../useComponentVisible";
import { debounce, groupBy } from "src/lib/formatters";
import clsx from "clsx";

interface ILookup {
  defaultValue?: any;
  children?: any;
  className?: string;
  onSelect?: (value: any) => void;
  search?: boolean;
  group?: string;
  name?: string;
  disabled?: boolean;
  options?: { label: string, value: any, image?: string }[];
  onChange?: (value: any) => void;
  placeholder?: string;
  filterFn?: (option: any, searchTerm: string) => boolean;
  sortFn?: (a: any, b: any) => number;
}
const Lookup = ({
  defaultValue,
  children,
  className,
  onSelect,
  search = false,
  group,
  name,
  disabled = false,
  options,
  placeholder,
  onChange,
  filterFn,
  sortFn,
}: ILookup) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  // const [isFilterVisible, setIsFilterVisible] = useState(false)


  const { field } = !!name && useController({ name: name });
  const [searchTerm, setSearchTerm] = useState(defaultValue && options.length > 0 ? options?.find((option) => option?.value === defaultValue)?.label : '')
  const [filteredOptions, setFilteredOptions] = useState(options)
  const [openIndexes, setOpenIndexes] = useState([]);
  const [selectedOption, setSelectedOption] = useState(defaultValue && options.length > 0 ? options.find(option => option.value === defaultValue) : null)

  // Run filter and sort functions when options or searchTerm changes
  useEffect(() => {
    const filtered = filterFn && searchTerm ? options.filter(option =>
      filterFn(option, searchTerm)
    ) : options
    const sorted = sortFn ? filtered.sort(sortFn) : filtered
    const grouped = !!group ? groupBy(sorted, group) : sorted
    setFilteredOptions(grouped);
  }, [options, searchTerm, filterFn, sortFn])

  // Update form values when selectedOption changes
  // useEffect(() => {
  //   setValue(name, selectedOption ? selectedOption.value : null)
  // }, [selectedOption, setValue, name])

  // Update selectedOption when defaultValue changes
  useEffect(() => {
    const selected = options.find(option => option.value == defaultValue)
    setSelectedOption(selected || defaultValue)
    !!name && field.onChange(defaultValue);
  }, [defaultValue])

  // Handle input change
  const handleInputChange = event => {
    if (!event.target.value) {
      setSearchTerm('')
    }
    setSelectedOption(null)
    setSearchTerm(event.target.value)
    onChange && onChange(event)
  }

  // Handle option select
  const handleOptionSelect = option => {
    setSelectedOption(option)
    setSearchTerm(option.label)
    // name && clearErrors(name)
    onSelect && onSelect(option);
    !!name && field.onChange(option.value);
  }

  // Handle option clear
  const handleOptionClear = () => {
    setSelectedOption(null)
    setSearchTerm('')
    // name && clearErrors(name)
    onSelect && onSelect({ label: null, value: null });
    !!name && field.onChange(null);
  }

  /**
   * @description For toggling the open state of the groups
   * @param index
   */
  const toggleOpen = (index) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  return (
    <div className="relative flex items-center" ref={ref}>
      <div
        onClick={(e) => !disabled && setIsComponentVisible(true)}
        className={clsx(
          "rw-input flex h-full items-center text-center ",
          className,
          {
            "cursor-not-allowed select-none": disabled,
          }
        )}
      >
        {search ? (
          <input
            type="text"
            name={name}
            id={name}
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={placeholder || 'Search...'}
            className="flex w-full items-center bg-transparent outline-none"
            disabled={disabled}
          />
        ) : (
          <>
            <input
              type="text"
              name={name}
              id={name}
              value={searchTerm}
              className="hidden"
              onChange={handleInputChange}
              disabled={disabled}
            />
            {children ? children : (selectedOption ? selectedOption["label"] : placeholder)}
          </>
        )}

        <div className="flex flex-row">
          <label htmlFor={name}>
            <svg
              className="ml-2 h-4 w-4"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </label>
          {!!selectedOption && (
            <svg
              onClick={handleOptionClear}
              fill="currentColor"
              className="ml-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
            </svg>
          )}
        </div>
      </div>

      {isComponentVisible ? (
        <div className="absolute top-12 z-10 w-60 rounded border-gray-800 bg-white shadow dark:bg-gray-700">
          {/* <div
            onClick={(e) => setIsFilterVisible(!isFilterVisible)}
            className="flex items-center justify-between p-3 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            <span className="mr-2 font-semibold">
              {group ? group : "All"}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 fill-current">
              <path d="M329.5 64H22.48c-18.9 0-29.33 21.5-17.41 35.88L112 225.8V368c0 7.828 3.812 15.17 10.25 19.66l79.1 55.98C206.5 446.6 211.3 448 215.9 448C228.3 448 240 438.2 240 423.1V225.8l106.9-125.9C358.8 85.5 348.4 64 329.5 64zM215.6 205.1L208 214v194.6l-64-44.79v-149.8L43.76 96h264.5L215.6 205.1zM432 112h64c8.797 0 16-7.203 16-15.1S504.8 80 496 80h-64c-8.797 0-16 7.203-16 15.1S423.2 112 432 112zM496 240h-160C327.2 240 320 247.2 320 256s7.203 16 16 16h160C504.8 272 512 264.8 512 256S504.8 240 496 240zM496 400h-160c-8.797 0-16 7.203-16 16s7.203 16 16 16h160c8.797 0 16-7.203 16-16S504.8 400 496 400z" />
            </svg>
          </div>
          {isFilterVisible ? <div className="absolute top-12 z-10 w-60 rounded border-gray-800 bg-white shadow dark:bg-gray-700">
            <ul
              className="max-h-48 overflow-y-auto py-1 text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownButton"
            >
              <li>Test</li>
              <li>Test</li>
              <li>Test</li>
            </ul>
          </div> : null
          } */}
          <ul
            className="max-h-48 overflow-y-auto py-1 text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownButton"
          >
            {!options.length ? (
              <li className="flex items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                No options available
              </li>
            ) : null}
            {!group
              ? filteredOptions.map((option, i) => (
                <li
                  key={option.value}
                  onClick={() => handleOptionSelect(option)}
                  className="flex items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {"image" in option && (
                    <img
                      className="mr-2 h-6 w-6 rounded-full"
                      src={option.image}
                      alt=""
                    />
                  )}
                  {option.label}
                </li>
              )
              )
              : Object.keys(filteredOptions).map((key, i) => {
                return (
                  <li key={i}>
                    <div
                      onClick={() => toggleOpen(i)}

                      className="flex items-center justify-between border-t border-b-2 border-gray-200 px-4 pb-2 pt-3 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <span className="mr-2 font-semibold">{key}</span>
                      <svg
                        className="h-4 w-4"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={
                            openIndexes.includes(i)
                              ? "M19 16L12 9l-7 7"
                              : "M19 9l-7 7-7-7"
                          }
                        ></path>
                      </svg>
                    </div>
                    {openIndexes.includes(i) && (
                      <ul className="">
                        {filteredOptions[key].map((option, i) => (
                          <li
                            key={i}
                            onClick={() => handleOptionSelect(option)}
                            className="flex items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            {"image" in option && (
                              <img
                                className="mr-2 h-6 w-6 rounded-full"
                                src={option.image}
                                alt=""
                              />
                            )}
                            {option.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      ) : null}
    </div>
  );
};


export default Lookup;


