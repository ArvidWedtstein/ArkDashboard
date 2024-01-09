import clsx from "clsx";
import { Fragment, ReactNode, useState } from "react";
import { debounce, generateUniqueId } from "src/lib/formatters";
import { Input } from "../Input/Input";
import Badge from "../Badge/Badge";
import Button from "../Button/Button";
interface Item {
  id?: string | number;
  label: string;
  value?: Item[];
  icon?: string | ReactNode;
  checked?: boolean;
  [key: string]: any; // Allow for custom props
}
interface ItemListProps {
  options: Item[];
  onSearch?: (search: string) => void;
  onSelect?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: Item
  ) => void;
  defaultSearch?: boolean;
  onCheck?: (event: React.ChangeEvent<HTMLInputElement>, item: Item) => void;
  className?: string;
}
// TODO: optimize to show actual item when searching
const ItemList = ({
  options,
  onSearch,
  onSelect,
  onCheck,
  defaultSearch = true,
  className,
}: ItemListProps) => {
  const [search, setSearch] = useState<string>("");
  const [openItemIds, setOpenItemIds] = useState<string[]>([]); // Store open item IDs
  const toggleItemOpen = (itemId: string) => {
    setOpenItemIds((prevOpenItemIds) =>
      prevOpenItemIds.includes(itemId)
        ? prevOpenItemIds.filter((id) => id !== itemId)
        : [...prevOpenItemIds, itemId]
    );
  };

  const renderItem = (item: Item) => (
    <li
      key={`${JSON.stringify(item)}-${Math.random()}`}
      className="flex items-center space-x-1"
    >
      {onCheck && (
        <input
          className="rw-input"
          type="checkbox"
          defaultChecked={item.checked || false}
          onChange={(e) => {
            onCheck?.(e, item);
          }}
        />
      )}
      <Button
        onClick={(e) => onSelect?.(e, item)}
        variant="text"
        color="DEFAULT"
        fullWidth
        className="!justify-start"
        startIcon={item.icon && typeof item.icon == "string"
          ? (
            <img className="w-6 shrink-0" src={item.icon} alt={``} loading="lazy" />
          ) : (
            item.icon
          )
        }
      >
        {item.label == "null" ? "Other" : item.label}
      </Button>
    </li>
  );

  const renderList = (item: Item, index: number, subindex?: number) => {
    const itemId = generateUniqueId();
    // const isOpen = openItemIds.includes((index + (subindex ?? 0)).toString());
    const isOpen = openItemIds.includes(`${index}-${subindex}`);
    return (
      <Fragment key={`${itemId}-${index}-${subindex}`}>
        {item?.value &&
          item?.value?.filter(({ label }) =>
            label
              .toLowerCase()
              .includes(defaultSearch ? search.toLowerCase() : "")
          ).length > 0 ? (
          <li>
            <details
              aria-label={`${index}-${subindex}`}
              className="[&>summary:after]:open:rotate-90"
              open={
                (!!search &&
                  item?.value?.filter(({ label }) =>
                    label
                      .toLowerCase()
                      .includes(defaultSearch ? search.toLowerCase() : "")
                  ).length == 1) ||
                isOpen
              }
            >
              <summary
                onClick={() => {
                  // toggleItemOpen((index + (subindex ?? 0)).toString());

                  toggleItemOpen(`${index}-${subindex}`);
                }}
                className="flex select-none items-center space-x-1 rounded-lg p-2 text-gray-900 after:absolute after:right-0 after:transform after:px-2 after:transition-transform after:duration-150 after:ease-in-out after:content-['>'] hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700"
              >
                {item.icon && typeof item.icon == "string" ? (
                  <img
                    className="h-6 w-6 shrink-0 mr-1 text-gray-500 transition duration-75 dark:text-gray-400"
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
                <Badge className="pr-4" variant="outlined" color="secondary" size="small" content={(defaultSearch
                  ? item?.value?.filter(({ label }) =>
                    label.toLowerCase().includes(search.toLowerCase())
                  )
                  : item?.value
                ).length} standalone />
              </summary>

              <ul className="ml-2 py-2 divide-y divide-zinc-500/30">
                {item?.value.map((f, i) =>
                  renderList(f, i, (subindex ?? 0) + index + 1)
                )}
              </ul>
            </details>
          </li>
        ) : (
          item?.label
            .toLowerCase()
            .includes(defaultSearch ? search.toLowerCase() : "") &&
          renderItem(item)
        )}
      </Fragment>
    );
  };

  return (
    <div className={clsx("relative max-h-screen w-fit max-w-[16rem] overflow-y-auto overflow-x-hidden rounded-lg border border-zinc-500 bg-zinc-300 px-3 py-4 text-gray-900 will-change-scroll dark:bg-zinc-600 dark:text-white", className)}>
      <ul className="relative space-y-1 font-medium divide-y divide-zinc-500/30">
        <li>
          <Input
            type="search"
            label="Search"
            margin="none"
            variant="contained"
            defaultValue={search}
            InputProps={{
              startAdornment: (
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 "
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
                  />
                </svg>
              )
            }}
            onChange={(e) => {
              debounce((e) => {
                onSearch?.(e.target.value);
                defaultSearch && setSearch(e.target.value.trim());
                setOpenItemIds([])
              }, 300)(e);
            }}
          />
        </li>
        {!options ||
          (options.length < 1 && (
            <li className="flex items-center rounded-lg p-2 text-gray-900 dark:text-white">
              No items found
            </li>
          ))}
        {options.map((option, i) => renderList(option, i))}
      </ul>
    </div>
  );
};

export default ItemList;
