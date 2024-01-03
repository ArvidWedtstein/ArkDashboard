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
// TODO: optimize or remove
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


{/* <List
            style={{
              maxHeight: 300,
              overflow: 'auto'
            }}
            className="p-0 bg-neutral-800 divide-y divide-zinc-500"
          >
            {Object.entries(groupBy(itemRecipes, "Item_ItemRecipe_crafted_item_idToItem.category")).sort().map(([category, categoryRecipes]) => {
              return (
                <Fragment>
                  <ListItem
                    className="uppercase bg-neutral-800 sticky top-0 z-20 shadow font-medium"
                    icon={
                      <img
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${categoriesIcons[category]}.webp`}
                        className="h-8 w-8 rounded-full bg-zinc-500 p-1"
                      />
                    }
                    disableRipple
                    secondaryAction={
                      <Button
                        variant="icon"
                        color="DEFAULT"
                        onClick={() => setCollapseCategories((prev) => prev.some((c) => c === category) ? prev.filter((c) => c != category) : [...prev, category])}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={clsx("fill-current shrink-0 transition-transform ease-in-out duration-75", {
                          "rotate-180": !collapseCategories.some(c => c === category)
                        })}>
                          <path d="M443.8 330.8C440.6 334.3 436.3 336 432 336c-3.891 0-7.781-1.406-10.86-4.25L224 149.8l-197.1 181.1c-6.5 6-16.64 5.625-22.61-.9062c-6-6.5-5.594-16.59 .8906-22.59l208-192c6.156-5.688 15.56-5.688 21.72 0l208 192C449.3 314.3 449.8 324.3 443.8 330.8z" />
                        </svg>
                      </Button>
                    }
                  >
                    {category}
                  </ListItem>
                  <Collapse timeout={200} in={collapseCategories.some((cat) => cat === category)}>
                    <List className="p-0 divide-y divide-zinc-500">
                      {Object.entries(groupBy(categoryRecipes, "Item_ItemRecipe_crafted_item_idToItem.type")).sort().map(([type, typeRecipes]) => {
                        return (
                          <Fragment>
                            <ListItem
                              className="uppercase bg-neutral-800 sticky top-12 z-10 pl-10 font-medium"
                              disableRipple
                              secondaryAction={
                                <Button
                                  variant="icon"
                                  color="DEFAULT"
                                  onClick={() => setCollapseCategories((prev) => prev.some((c) => c === `${category}.${type}`) ? prev.filter((c) => c != `${category}.${type}`) : [...prev, `${category}.${type}`])}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={clsx("fill-current shrink-0 transition-transform ease-in-out duration-75", {
                                    "rotate-180": !collapseCategories.some(c => c === `${category}.${type}`)
                                  })}>
                                    <path d="M443.8 330.8C440.6 334.3 436.3 336 432 336c-3.891 0-7.781-1.406-10.86-4.25L224 149.8l-197.1 181.1c-6.5 6-16.64 5.625-22.61-.9062c-6-6.5-5.594-16.59 .8906-22.59l208-192c6.156-5.688 15.56-5.688 21.72 0l208 192C449.3 314.3 449.8 324.3 443.8 330.8z" />
                                  </svg>
                                </Button>
                              }
                            >
                              {type}
                            </ListItem>
                            <Collapse timeout={200} in={collapseCategories.some((cat) => cat === `${category}.${type}`)}>
                              {dynamicSort(typeRecipes, "Item_ItemRecipe_crafted_item_idToItem.name").map((recipe) => {
                                return (
                                  <ListItem
                                    className="bg-zinc-700"
                                    icon={
                                      <img
                                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${recipe.Item_ItemRecipe_crafted_item_idToItem.image}`}
                                        className="h-8 w-8 rounded-full bg-zinc-500 p-1"
                                      />
                                    }
                                  >
                                    {recipe.Item_ItemRecipe_crafted_item_idToItem.name}
                                  </ListItem>
                                )
                              })}
                            </Collapse>
                          </Fragment>
                        )
                      })}
                    </List>
                  </Collapse>
                </Fragment>
              )
            })}
          </List> */}