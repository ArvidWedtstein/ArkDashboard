import { Form, Label, SearchField } from "@redwoodjs/forms";
import { ReactNode, useState } from "react";
import { debounce } from "src/lib/formatters";

interface ItemListProps {
  options: { label: string; value?: any[], icon?: string | ReactNode }[];
  onSearch?: (search: string) => void;
}

const ItemList = ({
  options,
  onSearch
}: ItemListProps) => {
  const [search, setSearch] = useState<string>("");
  const renderItem = (item: { label: string, icon?: string | ReactNode }) => (
    <li
      key={`${JSON.stringify(item)}`}
    >
      <button
        type="button"
        className="flex w-full items-center rounded-lg p-2 text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700 space-x-1"
      >
        {item.icon && typeof item.icon == "string" ? (<img
          className="h-6 w-6 "
          src={item.icon}
          alt={``}
          loading="lazy"
        />
        ) : item.icon}
        {item.label == 'null' ? 'Other' : item.label}
      </button>
    </li>
  )

  const renderList = (item) => (
    <li key={`${JSON.stringify(item)}`}>
      {item?.value && item?.value.filter((f) => f.label.toLowerCase().includes(search.toLowerCase())).length > 0 && item?.value?.length > 1 ? (
        <details className="[&>summary:after]:open:rotate-90" open={item?.value.filter((f) => f.label.toLowerCase().includes(search.toLowerCase())).length == 1}>
          <summary className="flex select-none items-center rounded-lg p-2 text-gray-900 after:absolute after:right-0 after:transform after:px-2 after:transition-transform after:duration-150 after:ease-in-out after:content-['>'] hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700 space-x-1">
            {item.icon && typeof item.icon == "string" ? (<img
              className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 dark:text-gray-400"
              src={item.icon}
              alt={``}
              loading="lazy"
            />
            ) : item.icon}
            <span className="">{item.label == 'null' ? 'Other' : item.label}</span>
            <span className="text-pea-800 ml-2 inline-flex h-3 w-3 items-center justify-center rounded-full text-xs dark:text-stone-300">
              {item?.value.filter((f) => f.label.toLowerCase().includes(search.toLowerCase())).length}
            </span>
          </summary>

          <ul className="py-2">
            {item?.value.map((itm) => renderList(itm))}
          </ul>
        </details>) : item.label.toLowerCase().includes(search.toLowerCase()) && renderItem(item)}
    </li>
  )


  return (
    <div className="relative max-h-screen w-fit max-w-[14rem] overflow-y-auto rounded-lg border bg-zinc-300 px-3 py-4 text-gray-900 will-change-scroll border-zinc-500 dark:bg-zinc-600 dark:text-white">
      <ul className="relative space-y-2 font-medium">
        <li>
          <label
            className="sr-only mb-2 text-sm text-gray-900 dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <SearchField
              className="rw-input w-full pl-10 dark:bg-zinc-700 dark:focus:bg-zinc-700"
              name="search"
              defaultValue={search}
              placeholder="Search..."
              inputMode="search"
              onChange={(e) => {
                onSearch && onSearch(e.target.value);
                debounce((e) => {
                  setSearch(e.target.value.trim());
                }, 300)(e);
              }

              }
            />
          </div>
        </li>
        {!options ||
          (options.length < 1 && (
            <li className="flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700">
              No items found
            </li>
          ))}
        {options.map(
          (option) => (
            renderList(option)
          )
        )}
      </ul >
    </div>
  )
}

export default ItemList
