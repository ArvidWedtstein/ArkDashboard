import {
  Form,
  FormError,
  RWGqlError,
} from "@redwoodjs/forms";
import { useCallback, useMemo, useReducer, useState } from "react";

import {
  formatNumber,
  generatePDF,
  getBaseMaterials,
  groupBy,
  timeFormatL,
} from "src/lib/formatters";
import Table from "src/components/Util/Table/Table";
import ToggleButton from "src/components/Util/ToggleButton/ToggleButton";
import {
  FindItemsMats,
} from "types/graphql";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/dist/toast";
import { useAuth } from "src/auth";
import { QUERY } from "../MaterialCalculatorCell";
import UserRecipesCell from "src/components/UserRecipe/UserRecipesCell";
import ItemList from "src/components/Util/ItemList/ItemList";

const CREATE_USERRECIPE_MUTATION = gql`
  mutation CreateUserRecipe($input: CreateUserRecipeInput!) {
    createUserRecipe(input: $input) {
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

  const { currentUser, isAuthenticated } = useAuth();

  const [search, setSearch] = useState<string>("");

  const [selectedCraftingStations, selectCraftingStations] = useState<number[]>(
    [107, 125]
  );

  const [viewBaseMaterials, setViewBaseMaterials] = useState<boolean>(false);

  type RecipeActionType = "ADD_AMOUNT_BY_NUM" | "CHANGE_AMOUNT" | "ADD_AMOUNT" | "REMOVE_AMOUNT" | "ADD" | "REMOVE" | "REMOVE_BY_ID" | "RESET";
  interface RecipeAction {
    type: RecipeActionType;
    payload?: {
      amount?: number;
      index?: number;
      item?: ItemRecipe;
    };
  }
  interface RecipeState extends ItemRecipe {
    amount: number;
  }
  const reducer = (state: RecipeState[], action: RecipeAction) => {
    const { type, payload } = action;
    switch (type) {
      case "ADD_AMOUNT_BY_NUM": {
        let itemIndex = state.findIndex((item) => item.id === payload.item.id);
        const yields = payload.item?.yields || 1;
        if (itemIndex !== -1) {
          return state.map((item, i) =>
            i === itemIndex
              ? {
                ...item,
                amount: item.amount + (payload.amount || 1) * yields,
              }
              : item
          );
        }
        return [
          ...state,
          {
            ...payload.item,
            amount: payload.amount || 1, //* yields,
          },
        ];
      }
      case "CHANGE_AMOUNT": {
        const itemIndex = payload.index;
        if (itemIndex !== -1) {
          return state.map((item, i) =>
            i === itemIndex ? { ...item, amount: payload.amount } : item
          );
        }
        return state;
      }
      case "ADD_AMOUNT": {
        return state.map((item, i) => {
          const yields = item?.yields || 1;
          return i === payload.index
            ? {
              ...item,
              amount: item.amount + yields,
            }
            : item;
        });
      }
      case "REMOVE_AMOUNT": {
        return state.map((item, i) => {
          const yields = item?.yields || 1;
          return i === payload.index
            ? {
              ...item,
              amount:
                item.amount - yields < 1 ? yields : item.amount - yields,
            }
            : item;
        });
      }
      case "ADD": {
        const itemIndex = state.findIndex((item) => item.id === payload.item.id);

        const yields = payload.item?.yields || 1;
        if (itemIndex !== -1) {
          return state.map((item, i) =>
            i === itemIndex
              ? {
                ...item,
                amount: (item.amount || 0) + yields,
              }
              : item
          );
        }
        return [
          ...state,
          {
            ...payload.item,
            amount: yields,
          },
        ];
      }
      case "REMOVE": {
        return state.filter((_, i) => i !== payload.index);
      }
      case "REMOVE_BY_ID": {
        return state.filter((itm) => itm.id !== payload.item.id);
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
      setRecipes({ type: "REMOVE_BY_ID", payload: { item: recipe } });
      let itemfound = result.find(
        (i) =>
          i.Item_ItemRecipe_crafted_item_idToItem.id ===
          recipe.Item_ItemRecipe_crafted_item_idToItem.id
      );
      if (itemfound) {
        setRecipes({
          type: "ADD_AMOUNT_BY_NUM",
          payload: { item: itemfound, amount: recipe.amount }, // / itemfound.yields,
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
    setRecipes({ type: "ADD", payload: { item: chosenItem } });
  };

  const mergeItemRecipe = useCallback(getBaseMaterials, [
    recipes,
    selectedCraftingStations,
  ]);

  const [createRecipe, { loading }] = useMutation(CREATE_USERRECIPE_MUTATION, {
    onCompleted: (data) => {
      toast.success("Recipe created");
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
                payload: {
                  item: itemfound,
                  amount: amount,
                },
              });
            }
          });
        }}
      />

      <Form
        onSubmit={onAdd}
        error={error}
        className="flex h-full w-full flex-col gap-3 sm:flex-row"
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
                className="rw-button-icon-end pointer-events-none"
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
              className="rw-button-icon-end !w-4"
              fill="currentColor"
            >
              <path d="M380.2 453.7c5.703 6.75 4.859 16.84-1.891 22.56C375.3 478.7 371.7 480 368 480c-4.547 0-9.063-1.938-12.23-5.657L192 280.8l-163.8 193.6C25.05 478.1 20.53 480 15.98 480c-3.641 0-7.313-1.25-10.31-3.781c-6.75-5.719-7.594-15.81-1.891-22.56l167.2-197.7L3.781 58.32c-5.703-6.75-4.859-16.84 1.891-22.56c6.75-5.688 16.83-4.813 22.55 1.875L192 231.2l163.8-193.6c5.703-6.688 15.8-7.563 22.55-1.875c6.75 5.719 7.594 15.81 1.891 22.56l-167.2 197.7L380.2 453.7z" />
            </svg>
          </button>

          <ItemList
            defaultSearch={false}
            onSearch={(e) => setSearch(e)}
            options={Object.entries(
              groupBy(
                (items || [])
                  .map((f) => f.Item_ItemRecipe_crafted_item_idToItem)
                  .filter((item) =>
                    item.name.toLowerCase().includes(search.toLowerCase())
                  ),
                "category"
              )
            ).map(([k, v]) => ({
              label: k,
              icon: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${categoriesIcons[k]}.webp`,
              value: v.every(({ type }) => !type)
                ? v.map((itm) => ({
                  ...itm,
                  label: itm.name,
                  icon: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${itm.image}`,
                  value: [],
                }))
                : Object.entries(groupBy(v, "type")).map(([type, v2]) => {
                  return {
                    label: type,
                    value: v2.map((itm) => ({
                      label: itm.name,
                      ...itm,
                      icon: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${itm.image}`,
                    })),
                  };
                }),
            }))}
            onSelect={(item) => {
              onAdd({ itemId: item.id });
            }}
          />
        </div>
        <div className="w-full">
          <Table
            rows={mergeItemRecipe(viewBaseMaterials, items, ...recipes).slice(0, 1)}
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
                render: ({ rowIndex, value: { name, image } }) => (
                  <button
                    type="button"
                    onClick={() => {
                      setRecipes({ type: "REMOVE", payload: { index: rowIndex } });
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
                ),
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
                      onClick={() => setRecipes({ type: "REMOVE_AMOUNT", payload: { index: rowIndex } })}
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
                          payload: { index: rowIndex, amount: parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 1 },
                        });
                      }}
                    />
                    <button
                      type="button"
                      className="relative mx-2 h-8 w-8 rounded-full border border-black text-lg font-semibold text-black hover:bg-white hover:text-black dark:border-white dark:text-white"
                      onClick={() => setRecipes({ type: "ADD_AMOUNT", payload: { index: rowIndex } })}
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
                valueFormatter: ({ row, value }) => value * row.amount,
                render: ({ value }) => `${timeFormatL(value, true)}`,
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
