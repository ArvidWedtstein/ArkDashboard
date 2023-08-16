import { SearchField } from "@redwoodjs/forms";
import { ReactNode, useState } from "react";
import { debounce } from "src/lib/formatters";

interface Item {
  id?: string | number;
  label: string;
  value?: Item[];
  icon?: string | ReactNode;
}
interface ItemListProps {
  options: Item[];
  onSearch?: (search: string) => void;
  onSelect?: (item: Item) => void;
  defaultSearch?: boolean;
  onCheck?: (event: React.ChangeEvent<HTMLInputElement>, item: Item) => void;
}

const ItemList = ({
  options,
  onSearch,
  onSelect,
  onCheck,
  defaultSearch = true,
}: ItemListProps) => {
  const [search, setSearch] = useState<string>("");
  const renderItem = (item: Item) => (
    <li key={`${JSON.stringify(item)}-${Math.random()}`} className="flex items-center p-2 space-x-1 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700 rounded-lg">
      {onCheck && (
        <input
          className="rw-input"
          type="checkbox"
          onChange={(e) =>
            onCheck?.(e, item)
          }
        />
      )}
      <button
        type="button"
        className="flex w-full items-center space-x-1 text-sm transition duration-75"
        onClick={() => onSelect?.(item)}
      >
        {item.icon && typeof item.icon == "string" ? (
          <img className="h-6 w-6 " src={item.icon} alt={``} loading="lazy" />
        ) : (
          item.icon
        )}
        {item.label == "null" ? "Other" : item.label}
      </button>
    </li>
  );

  const renderList = (item: Item) => (
    <React.Fragment key={`${JSON.stringify(item)}-${Math.random()}`}>
      {
        item?.value &&
          item?.value?.filter(({ label }) =>
            label.toLowerCase().includes(defaultSearch ? search.toLowerCase() : "")
          ).length > 0 ? (
          <li>
            <details
              className="[&>summary:after]:open:rotate-90"
              open={
                !!search &&
                item?.value?.filter(({ label }) =>
                  label
                    .toLowerCase()
                    .includes(defaultSearch ? search.toLowerCase() : "")
                ).length == 1
              }
            >
              <summary className="flex select-none items-center space-x-1 rounded-lg p-2 text-gray-900 after:absolute after:right-0 after:transform after:px-2 after:transition-transform after:duration-150 after:ease-in-out after:content-['>'] hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700">
                {item.icon && typeof item.icon == "string" ? (
                  <img
                    className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 dark:text-gray-400"
                    src={item.icon}
                    alt={``}
                    loading="lazy"
                  />
                ) : (
                  item.icon
                )}
                <span className="flex-grow">
                  {item.label == "null" ? "Other" : item.label}
                </span>
                <span className="text-pea-800 pr-6 inline-flex h-3 items-center justify-center text-right rounded-full text-xs dark:text-stone-300">
                  {
                    (defaultSearch
                      ? item?.value?.filter(({ label }) =>
                        label.toLowerCase().includes(search.toLowerCase())
                      )
                      : item?.value
                    ).length
                  }
                </span>
              </summary>

              <ul className="py-2">{item?.value.map(renderList)}</ul>
            </details>
          </li>
        ) : (
          item?.label
            .toLowerCase()
            .includes(defaultSearch ? search.toLowerCase() : "") &&
          renderItem(item)
        )
      }
    </React.Fragment>
  )

  return (
    <div className="relative max-h-screen w-fit max-w-[14rem] overflow-y-auto rounded-lg border border-zinc-500 bg-zinc-300 px-3 py-4 text-gray-900 will-change-scroll dark:bg-zinc-600 dark:text-white">
      <ul className="relative space-y-2 font-medium">
        <li>
          <label className="sr-only mb-2 text-sm text-gray-900 dark:text-white">
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
            <input
              className="rw-input w-full pl-10 dark:bg-zinc-700 dark:focus:bg-zinc-700"
              name="search"
              defaultValue={search}
              placeholder="Search..."
              inputMode="search"
              onChange={(e) => {
                debounce((e) => {
                  onSearch?.(e.target.value);
                  defaultSearch && setSearch(e.target.value.trim());
                }, 300)(e);
              }}
            />
          </div>
        </li>
        {!options ||
          (options.length < 1 && (
            <li className="flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700">
              No items found
            </li>
          ))}
        {options.map((option) => renderList(option))}
      </ul>
    </div>
  );
};

export default ItemList;
