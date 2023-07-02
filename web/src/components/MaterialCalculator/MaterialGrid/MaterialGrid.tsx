import {
  Form,
  FormError,
  Label,
  RWGqlError,
  SearchField,
} from "@redwoodjs/forms";
import { useCallback, useMemo, useReducer, useState } from "react";

import {
  formatNumber,
  generatePDF,
  getBaseMaterials,
  groupBy,
  timeFormatL,
} from "src/lib/formatters";
import debounce from "lodash.debounce";
import Table from "src/components/Util/Table/Table";
import ToggleButton from "src/components/Util/ToggleButton/ToggleButton";
import {
  DeleteUserRecipeMutationVariables,
  FindItemsMats,
} from "types/graphql";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/dist/toast";
import { useAuth } from "src/auth";
import { QUERY } from "../MaterialCalculatorCell";
import { navigate, routes } from "@redwoodjs/router";
import UserRecipesCell from "src/components/UserRecipe/UserRecipesCell";

const CREATE_USERRECIPE_MUTATION = gql`
  mutation CreateUserRecipe($input: CreateUserRecipeInput!) {
    createUserRecipe(input: $input) {
      id
    }
  }
`;

const DELETE_USERRECIPE_MUTATION = gql`
  mutation DeleteUserRecipeMutation($id: String!) {
    deleteUserRecipe(id: $id) {
      id
    }
  }
`;
type ItemRecipe = {
  __typename: string;
  id: string;
  crafting_station_id: number;
  crafting_time: number;
  yields: number;
  Item_ItemRecipe_crafted_item_idToItem?: {
    __typename: string;
    id: number;
    name: string;
    image: string;
    category: string;
    type: string;
  };
  ItemRecipeItem?: {
    __typename: string;
    id: string;
    amount: number;
    Item: {
      __typename: string;
      id: number;
      name: string;
      image: string;
    };
  }[];
};
interface MaterialGridProps {
  itemRecipes: NonNullable<FindItemsMats["itemRecipes"]>;
  error?: RWGqlError;
}

export const MaterialGrid = ({ error, itemRecipes }: MaterialGridProps) => {
  const categoriesIcons = {
    Armor: "cloth-shirt",
    Tool: "stone-pick",
    Weapon: "assault-rifle",
    Resource: "stone",
    Fertilizer: "fertilizer",
    Structure: "wooden-foundation",
    Other: "any-craftable-resource",
    Consumable: "any-berry-seed",
  };

  const [deleteUserRecipe] = useMutation(DELETE_USERRECIPE_MUTATION, {
    onCompleted: () => {
      toast.success("Custom recipe deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteUserRecipeMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete profile " + id + "?")) {
      deleteUserRecipe({ variables: { id } });
    }
  };
  const { currentUser, isAuthenticated } = useAuth();

  const [search, setSearch] = useState<string>("");

  const [selectedCraftingStations, selectCraftingStations] = useState<number[]>(
    [107, 125]
  );

  const [viewBaseMaterials, setViewBaseMaterials] = useState<boolean>(false);

  const reducer = (state, action) => {
    switch (action.type) {
      case "ADD_AMOUNT_BY_NUM": {
        let itemIndex = state.findIndex((item) => item.id === action.item.id);
        const yields = action.item?.yields || 1;
        if (itemIndex !== -1) {
          return state.map((item, i) =>
            i === itemIndex
              ? {
                  ...item,
                  amount: item.amount + (action.index || 1) * yields,
                }
              : item
          );
        }
        return [
          ...state,
          {
            ...action.item,
            amount: action.index || 1, //* yields,
          },
        ];
      }
      case "CHANGE_AMOUNT": {
        const itemIndex = action.item;
        if (itemIndex !== -1) {
          return state.map((item, i) =>
            i === itemIndex ? { ...item, amount: action.index } : item
          );
        }
        return [...state, { ...action.item, amount: action.index }];
      }
      case "ADD_AMOUNT": {
        return state.map((item, i) => {
          const yields = item?.yields || 1;
          return i === action.index
            ? {
                ...item,
                amount: parseInt(item.amount) + parseInt(yields),
              }
            : item;
        });
      }
      case "REMOVE_AMOUNT": {
        return state.map((item, i) => {
          const yields = item?.yields || 1;
          return i === action.index
            ? {
                ...item,
                amount:
                  item.amount - yields < 1 ? yields : item.amount - yields,
              }
            : item;
        });
      }
      case "ADD": {
        const itemIndex = state.findIndex((item) => item.id === action.item.id);

        const yields = action.item?.yields || 1;
        if (itemIndex !== -1) {
          return state.map((item, i) =>
            i === itemIndex
              ? {
                  ...item,
                  amount: parseInt(item.amount || 0) + yields,
                }
              : item
          );
        }
        return [
          ...state,
          {
            ...action.item,
            amount: yields,
          },
        ];
      }
      case "REMOVE": {
        return state.filter((_, i) => i !== action.index);
      }
      case "REMOVE_BY_ID": {
        return state.filter((itm) => itm.id !== action.id);
      }
      case "RESET": {
        return [];
      }
      default: {
        return state;
      }
    }
  };

  let [recipes, setRecipes] = useReducer(reducer, []);

  const items = useMemo(() => {
    const recipesGroupedByItemId = groupBy(
      itemRecipes,
      "Item_ItemRecipe_crafted_item_idToItem.id"
    );

    const craftingStations: { [groupKey: string]: ItemRecipe[][] } = {};

    for (const [key, value] of Object.entries(recipesGroupedByItemId)) {
      Object.assign(craftingStations, {
        [key]: groupBy(value, "crafting_station_id"),
      });
    }

    const result: ItemRecipe[] = [];

    for (const recipePerCraftingstation of Object.values(craftingStations)) {
      const craftingStationIds = Object.keys(recipePerCraftingstation);
      // If the item is crafted in either chem bench, mortar, refining or industrial forge, we need to find the one that is selected
      if (
        craftingStationIds.some((id) =>
          [107, 607, 125, 600].includes(Number(id))
        )
      ) {
        const itemRecipeFilteredByCraftingStation = craftingStationIds
          .filter((k) => selectedCraftingStations.includes(parseInt(k)))
          .map((k) => recipePerCraftingstation[k][0]);

        if (itemRecipeFilteredByCraftingStation.length > 0) {
          result.push(itemRecipeFilteredByCraftingStation[0]);
        }
      } else {
        const craftingStation: ItemRecipe =
          recipePerCraftingstation[craftingStationIds[0]][0];
        result.push(craftingStation);
      }
    }

    recipes.forEach((recipe) => {
      setRecipes({ type: "REMOVE_BY_ID", id: recipe.id });
      let itemfound = result.find(
        (i) =>
          i.Item_ItemRecipe_crafted_item_idToItem.id ===
          parseInt(recipe.Item_ItemRecipe_crafted_item_idToItem.id)
      );
      if (itemfound) {
        setRecipes({
          type: "ADD_AMOUNT_BY_NUM",
          item: itemfound,
          index: recipe.amount, // / itemfound.yields,
        });
      }
    });
    return result;
  }, [selectedCraftingStations]);

  const categories = useMemo(() => {
    return groupBy(
      (items || [])
        .map((f) => f.Item_ItemRecipe_crafted_item_idToItem)
        .filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        ),
      "category"
    );
  }, [items, search]);

  const onAdd = ({ itemId }) => {
    if (!itemId) return;
    let chosenItem = items.find(
      (item) =>
        item.Item_ItemRecipe_crafted_item_idToItem.id === parseInt(itemId)
    );

    if (!chosenItem) return toast.error("Item could not be found");
    setRecipes({ type: "ADD", item: chosenItem });
  };

  const onAddAmount = (index) => {
    setRecipes({ type: "ADD_AMOUNT", index });
  };
  const onRemoveAmount = (index) => {
    setRecipes({ type: "REMOVE_AMOUNT", index });
  };

  const mergeItemRecipe = useCallback(getBaseMaterials, [
    recipes,
    selectedCraftingStations,
  ]);

  const [createRecipe, { loading }] = useMutation(CREATE_USERRECIPE_MUTATION, {
    onCompleted: (data) => {
      toast.success("Recipe created");
      console.log(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  });

  const saveRecipe = async (e) => {
    e.preventDefault();

    if (!recipes.length) return toast.error("No items to save");
    try {
      // TODO: Fix permission error
      // const { data, error } = await client.from("UserRecipe").insert([
      //   {
      //     user_id: currentUser.id,
      //     private: true,
      //     name: "test",
      //   },
      // ]);

      //       let { data, error } = await client.from("UserRecipe").select(`
      //   user_id,
      //   UserRecipeItemRecipe (
      //     id
      //   )
      // `);

      const input = {
        created_at: new Date().toISOString(),
        user_id: currentUser.id,
        private: true,
        UserRecipeItemRecipe: {
          create: recipes.map((u) => ({
            amount: u.amount,
            item_recipe_id: u.id,
          })),
        },
      };
      createRecipe({ variables: { input } });
    } catch (error) {
      return console.error(error);
    }

    // TODO: Fetch the recipe after created and add it to the list
  };

  return (
    <div className="mx-1 flex w-full flex-col gap-3">
      <UserRecipesCell
        onSelect={({ UserRecipeItemRecipe }) => {
          UserRecipeItemRecipe.forEach(({ item_recipe_id, amount }) => {
            let itemfound = items.find((item) => item.id === item_recipe_id);
            if (itemfound) {
              setRecipes({
                type: "ADD_AMOUNT_BY_NUM",
                item: itemfound,
                index: amount,
              });
            }
          });
        }}
      />

      <Form
        onSubmit={onAdd}
        error={error}
        className="flex h-full w-full space-x-3 sm:flex-row"
      >
        <FormError
          error={error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
        <div className="flex flex-col space-y-3">
          {isAuthenticated && (
            <button
              type="button"
              onClick={saveRecipe}
              className="rw-button rw-button-green"
              disabled={loading}
            >
              Save Recipe
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="rw-button-icon pointer-events-none"
                fill="currentColor"
              >
                <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={() => setRecipes({ type: "RESET" })}
            className="rw-button rw-button-red"
            title="Clear all items"
          >
            Clear
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              aria-hidden="true"
              className="rw-button-icon !w-4"
              fill="currentColor"
            >
              <path d="M380.2 453.7c5.703 6.75 4.859 16.84-1.891 22.56C375.3 478.7 371.7 480 368 480c-4.547 0-9.063-1.938-12.23-5.657L192 280.8l-163.8 193.6C25.05 478.1 20.53 480 15.98 480c-3.641 0-7.313-1.25-10.31-3.781c-6.75-5.719-7.594-15.81-1.891-22.56l167.2-197.7L3.781 58.32c-5.703-6.75-4.859-16.84 1.891-22.56c6.75-5.688 16.83-4.813 22.55 1.875L192 231.2l163.8-193.6c5.703-6.688 15.8-7.563 22.55-1.875c6.75 5.719 7.594 15.81 1.891 22.56l-167.2 197.7L380.2 453.7z" />
            </svg>
          </button>

          <div className="relative max-h-screen w-fit max-w-[14rem] overflow-y-auto rounded-lg border border-gray-200 bg-zinc-300 px-3 py-4 text-gray-900 will-change-scroll dark:border-zinc-700 dark:bg-zinc-600 dark:text-white">
            <ul className="relative space-y-2 font-medium">
              <li>
                <Label
                  name="search"
                  className="sr-only mb-2 text-sm text-gray-900 dark:text-white"
                >
                  Search
                </Label>
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
                    onChange={debounce((e) => {
                      setSearch(e.target.value);
                    }, 300)}
                  />
                </div>
              </li>
              {!items ||
                (items.length < 1 && (
                  <li className="flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700">
                    No items found
                  </li>
                ))}
              {Object.entries(categories).map(([category, categoryitems]) => (
                <li key={category}>
                  <details
                    open={Object.values(categories).length === 1}
                    className="[&>summary:after]:open:rotate-90"
                  >
                    <summary className="flex select-none items-center rounded-lg p-2 text-gray-900 after:absolute after:right-0 after:transform after:px-2 after:transition-transform after:duration-150 after:ease-in-out after:content-['>'] hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700">
                      <img
                        className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 dark:text-gray-400"
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${categoriesIcons[category]}.webp`}
                        alt={``}
                        loading="lazy"
                      />
                      <span className="ml-2">{category}</span>
                    </summary>

                    <ul className="py-2">
                      {Object.values(categories).length === 1 ||
                      categoryitems.every(({ type }) => !type)
                        ? categoryitems.map(({ id, type, image, name }) => (
                            <li key={`${category}-${type}-${id}`}>
                              <button
                                type="button"
                                className="flex w-full items-center rounded-lg p-2 text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700"
                                onClick={() => onAdd({ itemId: id })}
                              >
                                <img
                                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
                                  alt={name}
                                  className="mr-2 h-5 w-5"
                                  loading="lazy"
                                />
                                {name}
                              </button>
                            </li>
                          ))
                        : Object.entries(groupBy(categoryitems, "type")).map(
                            ([type, typeitems]) => (
                              <li key={`${category}-${type}`}>
                                <details className="">
                                  <summary className="flex w-full items-center justify-between rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700">
                                    <span className="">{type}</span>
                                    <span className="text-pea-800 ml-2 inline-flex h-3 w-3 items-center justify-center rounded-full text-xs dark:text-stone-300">
                                      {typeitems.length}
                                    </span>
                                  </summary>

                                  <ul className="py-2">
                                    {typeitems.map((item) => (
                                      <li
                                        key={`${category}-${type}-${item.id}`}
                                      >
                                        <button
                                          type="button"
                                          className="flex w-full items-center rounded-lg p-2 text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700"
                                          onClick={() =>
                                            onAdd({ itemId: item.id })
                                          }
                                        >
                                          <img
                                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${item.image}`}
                                            alt={item.name}
                                            className="mr-2 h-5 w-5"
                                            loading="lazy"
                                          />
                                          {item.name}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </details>
                              </li>
                            )
                          )}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full">
          <Table
            rows={mergeItemRecipe(viewBaseMaterials, items, ...recipes).slice(
              0,
              1
            )}
            className="animate-fade-in"
            toolbar={[
              <ToggleButton
                className=""
                offLabel="Materials"
                onLabel="Base materials"
                checked={viewBaseMaterials}
                onChange={(e) => setViewBaseMaterials(e.currentTarget.checked)}
              />,
              <button
                className="rw-button rw-button-gray rw-button-small"
                onClick={() =>
                  generatePDF(
                    recipes.map((r) => ({
                      name: r.Item_ItemRecipe_crafted_item_idToItem.name,
                      amount: r.amount,
                    }))
                  )
                }
              >
                PDF
              </button>,
            ]}
            columns={[
              ...mergeItemRecipe(viewBaseMaterials, items, ...recipes).map(
                ({ Item_ItemRecipe_crafted_item_idToItem, amount }) => ({
                  field: Item_ItemRecipe_crafted_item_idToItem.id,
                  header: Item_ItemRecipe_crafted_item_idToItem.name,
                  className: "w-0 text-center",
                  render: ({ value }) => {
                    return (
                      <div
                        className="flex flex-col items-center justify-center"
                        key={`${value}-${Item_ItemRecipe_crafted_item_idToItem.id}`}
                      >
                        <img
                          src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${Item_ItemRecipe_crafted_item_idToItem.image}`}
                          className="h-6 w-6"
                          loading="lazy"
                        />
                        <span className="text-sm">{formatNumber(amount)}</span>
                      </div>
                    );
                  },
                })
              ),
            ]}
          />

          <div className="my-3 space-y-3">
            <ToggleButton
              offLabel="Mortar And Pestle"
              onLabel="Chemistry Bench"
              checked={selectedCraftingStations.includes(607)}
              onChange={(e) => {
                if (e.target.checked) {
                  return selectCraftingStations((prev) => [
                    ...prev.filter((h) => h !== 107),
                    607,
                  ]);
                }
                return selectCraftingStations((prev) => [
                  ...prev.filter((h) => h !== 607),
                  107,
                ]);
              }}
            />

            <ToggleButton
              offLabel="Refining Forge"
              onLabel="Industrial Forge"
              checked={selectedCraftingStations.includes(600)}
              onChange={(e) => {
                if (e.target.checked) {
                  return selectCraftingStations((prev) => [
                    ...prev.filter((h) => h !== 125),
                    600,
                  ]);
                }
                return selectCraftingStations((prev) => [
                  ...prev.filter((h) => h !== 600),
                  125,
                ]);
              }}
            />
          </div>

          <Table
            rows={recipes}
            className="animate-fade-in whitespace-nowrap"
            settings={{
              summary: true,
            }}
            columns={[
              {
                field: "Item_ItemRecipe_crafted_item_idToItem",
                header: "Name",
                className: "w-0",
                render: ({ rowIndex, value: { name, image } }) => {
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        setRecipes({ type: "REMOVE", index: rowIndex });
                      }}
                      className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-red-500"
                      title={`Remove ${name}`}
                    >
                      <img
                        className="h-8 w-8"
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
                        loading="lazy"
                      />
                    </button>
                  );
                },
              },
              {
                field: "amount",
                header: "Amount",
                numeric: true,
                className: "w-0 text-center",
                render: ({ rowIndex, value }) => (
                  <div
                    className="flex flex-row items-center"
                    key={`materialcalculator-${rowIndex}}`}
                  >
                    <button
                      type="button"
                      disabled={value === 1}
                      className="relative mx-2 h-8 w-8 rounded-full border border-black text-lg font-semibold text-black hover:bg-white hover:text-black dark:border-white dark:text-white"
                      onClick={() => onRemoveAmount(rowIndex)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={value}
                      className="rw-input w-16 p-3 text-center"
                      onChange={(e) => {
                        setRecipes({
                          type: "CHANGE_AMOUNT",
                          item: rowIndex,
                          index:
                            parseInt(e.target.value) > 0 ? e.target.value : 1,
                        });
                      }}
                    />
                    <button
                      type="button"
                      className="relative mx-2 h-8 w-8 rounded-full border border-black text-lg font-semibold text-black hover:bg-white hover:text-black dark:border-white dark:text-white"
                      onClick={() => onAddAmount(rowIndex)}
                    >
                      +
                    </button>
                  </div>
                ),
              },
              {
                field: "crafting_time",
                header: "Time pr item",
                numeric: true,
                className: "w-0 text-center",
                valueFormatter: ({ row, value }) => {
                  return value * row.amount;
                },
                render: ({ value }) => {
                  return `${timeFormatL(value, true)}`;
                },
              },
              {
                field: "Item_ItemRecipe_crafted_item_idToItem",
                header: "Ingredients",
                numeric: false,
                render: ({ row }) => {
                  return mergeItemRecipe(false, items, {
                    ...row,
                  })
                    .sort(
                      (a, b) =>
                        a.Item_ItemRecipe_crafted_item_idToItem.id -
                        b.Item_ItemRecipe_crafted_item_idToItem.id
                    )
                    .map(
                      (
                        {
                          Item_ItemRecipe_crafted_item_idToItem: {
                            id,
                            name,
                            image,
                          },
                          amount,
                        },
                        i
                      ) => (
                        <div
                          className="inline-flex min-h-full min-w-[3rem] flex-col items-center justify-center"
                          id={`${id}-${i * Math.random()}${i}`}
                          key={`${id}-${i * Math.random()}${i}`}
                        >
                          <img
                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
                            className="h-6 w-6"
                            title={name}
                            alt={name}
                          />
                          <span className="text-sm text-black dark:text-white">
                            {formatNumber(amount)}
                          </span>
                        </div>
                      )
                    );
                },
              },
            ]}
          />
        </div>
      </Form>
    </div>
  );
};
