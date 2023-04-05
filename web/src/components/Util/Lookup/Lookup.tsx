import { TextField } from "@redwoodjs/forms";
import { useEffect, useRef, useState } from "react";
import useComponentVisible from "../../useComponentVisible";
import { debounce, groupBy } from "src/lib/formatters";
import clsx from "clsx";

interface ILookup {
  items: { name?: string, image?: string, value?: string | number }[];

  defaultValue?: string | number | object;
  children?: any;
  className?: string;
  onChange?: (value: any) => void;
  search?: boolean;
  group?: string;
  name?: string;
  disabled?: boolean;
}
const Lookup = ({
  items,
  defaultValue,
  children,
  className,
  onChange,
  search = false,
  group,
  name,
  disabled = false,
}: ILookup) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  // const { ref: refFilter, isComponentVisible: isFilterVisible, setIsComponentVisible: setIsFilterVisible } =
  //   useComponentVisible(false);
  const [inputValue, setInputValue] = useState<string | object>("");
  const [openIndexes, setOpenIndexes] = useState([]);
  const [lookupitems, setItems] = useState<{ name?: string, image?: string, value?: string | number }[]>([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    )

    setItems(group ? groupBy(filtered, group) : filtered);
    setIsComponentVisible(true);
  }

  const handleSelect = (option) => {
    setInputValue(option)
    setItems(group ? groupBy(items, group) : items);
    onChange ? onChange(option) : null;
    setIsComponentVisible(false);
    setOpenIndexes([])
  }
  const handleReset = (e) => {
    setInputValue("");
    setItems(items);
    onChange ? onChange({ name: "" }) : null;
  };
  useEffect(() => {
    setItems(group ? groupBy(items, group) : items);
    if (defaultValue) {
      const defVal = items.find((f) => (f.value === defaultValue) || (f === defaultValue));
      setInputValue(defVal ? defVal : '');
      onChange ? onChange(defVal) : null;
    }
  }, [defaultValue, group]);


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
        className={clsx("flex h-full items-center text-center rw-input ", className, {
          "cursor-not-allowed select-none": disabled
        })}
      >
        {search ? (
          <input
            type="text"
            name={name}
            id={name}
            value={inputValue["name"] || inputValue || inputValue["value"]}
            className="flex w-full items-center bg-transparent outline-none"
            onChange={handleInputChange}
            placeholder="Search..."
            disabled={disabled}
          />
        ) : (
          <>{children ? children : inputValue["name"]}</>
        )}
        <label htmlFor={name} className="flex flex-row">
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
          {!!!inputValue && !search && isComponentVisible && (
            <svg
              onClick={handleReset}
              fill="currentColor"
              className="ml-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
            </svg>
          )}
        </label>
      </div>

      {
        isComponentVisible ? (
          <div className="absolute top-12 z-10 w-60 rounded border-gray-800 bg-white shadow dark:bg-gray-700">
            {/* <div
              onClick={(e) => setIsFilterVisible(true)}
              className="flex items-center justify-between p-3 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              <span className="mr-2 font-semibold">
                {group ? group : "All"}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 fill-current">
                <path d="M329.5 64H22.48c-18.9 0-29.33 21.5-17.41 35.88L112 225.8V368c0 7.828 3.812 15.17 10.25 19.66l79.1 55.98C206.5 446.6 211.3 448 215.9 448C228.3 448 240 438.2 240 423.1V225.8l106.9-125.9C358.8 85.5 348.4 64 329.5 64zM215.6 205.1L208 214v194.6l-64-44.79v-149.8L43.76 96h264.5L215.6 205.1zM432 112h64c8.797 0 16-7.203 16-15.1S504.8 80 496 80h-64c-8.797 0-16 7.203-16 15.1S423.2 112 432 112zM496 240h-160C327.2 240 320 247.2 320 256s7.203 16 16 16h160C504.8 272 512 264.8 512 256S504.8 240 496 240zM496 400h-160c-8.797 0-16 7.203-16 16s7.203 16 16 16h160c8.797 0 16-7.203 16-16S504.8 400 496 400z" />
              </svg>
            </div> */}
            {/* {isFilterVisible ? <div className="absolute top-12 z-10 w-60 rounded border-gray-800 bg-white shadow dark:bg-gray-700" ref={refFilter}>
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
              {!group ? lookupitems.map((item, i) => {
                return (
                  <li
                    key={i}
                    onClick={() => handleSelect(item)}
                    className="flex items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    {"image" in item && (
                      <img
                        className="mr-2 h-6 w-6 rounded-full"
                        src={item.image}
                        alt={item.name}
                      />
                    )}
                    {item.name}
                  </li>
                );
              })
                : Object.keys(lookupitems).map((key, i) => {
                  return (
                    <li key={i}>
                      <div onClick={() => toggleOpen(i)} className="flex items-center justify-between pb-2 px-4 pt-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white border-t border-b-2 border-gray-200 dark:border-gray-600">
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
                            d={openIndexes.includes(i) ? "M19 16L12 9l-7 7" : "M19 9l-7 7-7-7"}
                          ></path>
                        </svg>
                      </div>
                      {openIndexes.includes(i) && lookupitems[key].map((item, i) => {
                        return (
                          <li
                            key={i}
                            onClick={() => handleSelect(item)}
                            className="flex items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            {"image" in item && (
                              <img
                                className="mr-2 h-6 w-6 rounded-full"
                                src={item.image}
                                alt=""
                              />
                            )}
                            {item.name}
                          </li>
                        );
                      })}
                    </li>
                  );
                })
              }
            </ul>

            {/* <a
              href="#"
              className="flex items-center border-t border-gray-200 dark:border-gray-600 bg-gray-50 p-3 text-sm font-medium text-blue-600 hover:bg-gray-100 hover:underline dark:bg-gray-700 dark:text-blue-500 dark:hover:bg-gray-600"
            >
              <svg
                className="mr-1 h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
              </svg>
              Add new user
            </a> */}

          </div>
        ) : null
      }
    </div >
  );
};

export default Lookup;

