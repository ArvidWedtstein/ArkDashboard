import { TextField } from "@redwoodjs/forms";
import { useEffect, useState } from "react";
import useComponentVisible from "../../useComponentVisible";
import { debounce } from "src/lib/formatters";

type LookupType = "user" | "post" | "default";
interface ILookup {
  items: { name: string }[];
  type?: LookupType;
  value?: string;
  children?: any;
  className?: string;
  onChange?: (value: any) => void;
  search?: boolean;
  name?: string;
}
const Lookup = ({
  items,
  type = "default",
  value,
  children,
  className,
  onChange,
  search = false,
  name,
}: ILookup) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const [searchValue, setSearch] = useState<string>("");
  const [lookupitems, setItems] = useState<{ name: string }[]>([]);

  const handleOpen = (e) => {
    setIsComponentVisible(!isComponentVisible);
  };
  const handleSelect = (e) => {
    // setSearch(e.name);
    onChange ? onChange(e) : null;
    setIsComponentVisible(false);
  };
  useEffect(() => {
    setSearch(value);
    setItems(items);
  }, [value]);

  const handleSearch = debounce((e) => setSearch(e.target.value));

  const handleReset = (e) => {
    setSearch("");
    setItems(items);
    onChange ? onChange({ name: "" }) : null;
  };
  useEffect(() => {
    if (!!!searchValue || searchValue === "") return;
    setItems(
      items.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  return (
    <div className="relative flex items-center" ref={ref}>
      <div
        onClick={handleOpen}
        className={
          className
            ? `flex h-full items-center text-center ${className}`
            : "rw-input flex h-full items-center"
        }
      >
        {search ? (
          <TextField
            name={name}
            id={name}
            autoComplete="off"
            // className="flex items-center w-full py-2 px-4 bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-600 dark:hover:text-white"
            className="flex w-full items-center bg-transparent outline-none"
            onChange={handleSearch}
            onFocus={() => setIsComponentVisible(true)}
            placeholder="Search..."
          />
        ) : (
          <>{children ? children : null}</>
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
          {!!!value && !search && isComponentVisible && (
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

      {isComponentVisible ? (
        <div className="absolute top-12 z-10 w-60 rounded border-gray-800 bg-white shadow dark:bg-gray-700">
          <ul
            className="max-h-48 overflow-y-auto py-1 text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownButton"
          >
            {lookupitems.map((item, i) => {
              return (
                <li
                  key={i}
                  onClick={() => handleSelect(item)}
                  className="flex items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {"image" in item ?? (
                    <img
                      className="mr-2 h-6 w-6 rounded-full"
                      src="/docs/images/people/profile-picture-1.jpg"
                      alt="image"
                    />
                  )}
                  {item.name}
                </li>
              );
            })}
          </ul>
          {type === "user" ?? (
            <a
              href="#"
              className="flex items-center border-t border-gray-200 bg-gray-50 p-3 text-sm font-medium text-blue-600 hover:bg-gray-100 hover:underline dark:border-gray-600 dark:bg-gray-700 dark:text-blue-500 dark:hover:bg-gray-600"
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
            </a>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Lookup;
