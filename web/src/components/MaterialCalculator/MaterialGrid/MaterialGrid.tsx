import { RWGqlError } from "@redwoodjs/forms";
import {
  Fragment,
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import {
  ArrayElement,
  Log,
  dynamicSort,
  formatNumber,
  getBaseMaterials,
  groupBy,
  timeFormatL,
} from "src/lib/formatters";
import Table from "src/components/Util/Table/Table";
import { FindItemsForMaterialCalculator, FindItemsMats } from "types/graphql";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/dist/toast";
import { useAuth } from "src/auth";
import { ITEMRECIPEITEMQUERY, TESTQUERY } from "../MaterialCalculatorCell";
import UserRecipesCell, {
  QUERY as USERRECIPEQUERY,
} from "src/components/UserRecipe/UserRecipesCell";
import ItemList from "src/components/Util/ItemList/ItemList";
import { useLazyQuery } from "@apollo/client";
import Switch from "src/components/Util/Switch/Switch";
import Button from "src/components/Util/Button/Button";
import { Input } from "src/components/Util/Input/Input";
import { ToggleButton, ToggleButtonGroup } from "src/components/Util/ToggleButton/ToggleButton";
import List, { ListItem } from "src/components/Util/List/List";
import Collapse from "src/components/Util/Collapse/Collapse";
import clsx from "clsx";

const CREATE_USERRECIPE_MUTATION = gql`
  mutation CreateUserRecipe($input: CreateUserRecipeInput!) {
    createUserRecipe(input: $input) {
      id
    }
  }
`;


// TODO: remove
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
  Item?: ItemRecipe["Item_ItemRecipe_crafted_item_idToItem"];
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
interface RecipeState extends ItemRecipe {
  // Item?: ItemRecipe["Item_ItemRecipe_crafted_item_idToItem"];
  amount: number;
}
interface MaterialGridProps {
  itemRecipes: NonNullable<FindItemsMats["itemRecipes"]>;
  error?: RWGqlError;
}

const TreeBranch = memo(({ itemRecipe }: { itemRecipe: RecipeState }) => {
  const { Item, amount, crafting_time } = itemRecipe;
  const imageUrl = `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${Item?.image}`;
  return (
    <li className="relative -ml-1 -mr-1 inline-block list-none px-2 pt-4 text-center align-top before:absolute before:top-0 before:right-1/2 before:h-4 before:w-1/2 before:border-t before:border-zinc-500 before:content-[''] after:absolute after:top-0 after:right-auto after:left-1/2 after:h-4 after:w-1/2 after:border-t after:border-l after:border-zinc-500 after:content-[''] first:before:border-0 first:after:rounded-tl-2xl last:before:rounded-tr-2xl last:before:border-r last:before:border-zinc-500 last:after:border-0 only:pt-0 only:before:hidden only:after:hidden">
      {Item && (
        <div
          className="animate-fade-in relative inline-flex h-16 w-16 items-center justify-center rounded-lg border border-zinc-500 p-2 text-center"
          title={Item.name}
        >
          <img className="h-8 w-8" src={imageUrl} alt={Item.name} />
          <div className="absolute bottom-0 right-0 inline-flex h-6 w-full items-end justify-end bg-transparent p-1 text-xs font-bold">
            {formatNumber(amount)}
          </div>
          <div className="absolute top-0 right-0 inline-flex h-6 w-full items-start justify-end bg-transparent p-1 text-xs font-medium">
            {timeFormatL(crafting_time, true)}
          </div>
        </div>
      )}
      {itemRecipe?.ItemRecipeItem?.length > 0 && (
        <ul className="relative whitespace-nowrap py-4 text-center before:absolute before:top-0 before:left-1/2 before:h-4 before:w-0 before:border-l before:border-zinc-500 before:content-[''] after:clear-both after:table after:content-['']">
          {itemRecipe?.ItemRecipeItem.map((subItemRecipe, i) => (
            <TreeBranch
              key={`subItem-${subItemRecipe?.Item?.id}`}
              itemRecipe={subItemRecipe as RecipeState}
            />
          ))}
        </ul>
      )}
    </li>
  );
});

export const MaterialGrid = ({ error, itemRecipes }: MaterialGridProps) => {
  const { currentUser, isAuthenticated, client } = useAuth();

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

  // TODO: redo this, cant be more effective than fetching on load
  const [loadItems, { called, loading: load, data }] = useLazyQuery<FindItemsForMaterialCalculator>(
    // ITEMRECIPEITEMQUERY,
    TESTQUERY,
    {
      initialFetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-only",
      variables: {
        ids: itemRecipes.map((f) => f.id),
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  useEffect(() => {
    if (!called && !load) {
      loadItems();
    }
  }, []);

  const [query, setQuery] = useState<string>("");
  const deferredQuery = useDeferredValue(query);
  const [viewBaseMaterials, setViewBaseMaterials] = useState<boolean>(false);

  // TODO: redo
  const [craftingStations, setCraftingStations] = useState({
    "mortar-chem": "107",
    "forge": "125",
    "cooking": "128",
    "grill": "39"
  });
  // New
  // const [craftingStationsActive, setCraftingStationsActive] = useState({
  //   "mortar-chem": [
  //     {
  //       id: 107,
  //       name: 'Mortar & Pestle',
  //       active: true,
  //     },
  //     {
  //       id: 607,
  //       name: 'Chemistry Bench',
  //       active: false,
  //     }
  //   ],
  //   "forge": [
  //     {
  //       id: 125,
  //       name: 'Refining Forge',
  //       active: true,
  //     },
  //     {
  //       id: 600,
  //       name: 'Industrial Forge',
  //       active: false,
  //     }
  //   ],
  //   "cooking": [
  //     {
  //       id: 128,
  //       name: 'Cooking Pot',
  //       active: true,
  //     },
  //     {
  //       id: 601,
  //       name: 'Industrial Cooker',
  //       active: false
  //     }
  //   ],
  //   "grill": [
  //     {
  //       id: 39,
  //       name: 'Campfire',
  //       active: true,
  //     },
  //     {
  //       id: 360,
  //       name: 'Industrial Grill',
  //       active: false,
  //     }
  //   ]
  // });

  type RecipeActionType =
    | "ADD_AMOUNT_BY_NUM"
    | "CHANGE_AMOUNT"
    | "ADD"
    | "REMOVE"
    | "REMOVE_BY_ID"
    | "RESET"
    | "CRAFTING_STATION";
  type RecipeAction = {
    type: RecipeActionType;
    payload?: {
      itemRecipeItems?: ItemRecipe["ItemRecipeItem"];
      amount?: number;
      index?: number;
      item?: ItemRecipe
      // | ArrayElement<MaterialGridProps["itemRecipes"]> & {
      //   ItemRecipeItem?: {
      //     __typename: string;
      //     id: string;
      //     amount: number;
      //     Item: {
      //       __typename: string;
      //       id: number;
      //       name: string;
      //       image: string;
      //     };
      //   }[];
      // };
    };
    payloads?: {
      amount?: number;
      index?: number;
      item?: ItemRecipe;
    }[];
  }

  const reducer = (state: RecipeState[], action: RecipeAction) => {
    const { type, payload } = action;
    switch (type) {
      case "ADD_AMOUNT_BY_NUM":
      case "ADD": {
        const itemIndex = state.findIndex(
          (item) => item.id === payload.item.id
        );

        let amountToAdd = payload.amount || 1;

        if (itemIndex !== -1) {
          return state.map((item, i) =>
            i === itemIndex
              ? {
                ...item,
                amount: (item.amount + amountToAdd) % payload.item?.yields === 0 ? (item.amount + amountToAdd) : (item.amount + amountToAdd) + (payload.item?.yields - (item.amount + amountToAdd) % payload.item?.yields)
              }
              : item
          );
        }

        return [
          ...state,
          {
            ...payload.item,
            amount: amountToAdd % payload.item?.yields === 0 ? amountToAdd : amountToAdd + (payload.item?.yields - amountToAdd % payload.item?.yields),
          },
        ];
      }
      case "CHANGE_AMOUNT": {
        const itemIndex = payload.index;
        console.log("CHANGE AMOUNT", payload)
        if (itemIndex !== -1) {
          return state.map((item, i) => {
            let remainder = payload.amount % item.yields;
            return i === itemIndex ? { ...item, amount: remainder === 0 ? payload.amount : payload.amount + (item.yields - remainder) } : item
          });
        }
        return state;
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
      case "CRAFTING_STATION": {
        const selectedCraftingStation = (id: number) => Object.values(craftingStations).some(c => parseInt(c) === id)
        return state.map((recipe) => {
          let yields = recipe.yields;
          let crafting_time = recipe.crafting_time;

          // TODO: add calculations for the othetr crafting stations too.
          if (recipe.crafting_station_id === 107) {
            let originalRecipe = itemRecipes.find((rec) => rec.id === parseInt(recipe.id));

            yields = selectedCraftingStation(607) ? originalRecipe.yields * 6 : originalRecipe.yields;
            crafting_time = selectedCraftingStation(607) ? originalRecipe.crafting_time / 2 : originalRecipe.crafting_time;
          }

          return ({
            ...recipe,
            yields: yields,
            crafting_time: crafting_time,
            amount: recipe.amount % yields === 0 ? recipe.amount : recipe.amount + (yields - recipe.amount % yields)
          })
        })
      }
      default: {
        return state;
      }
    }
  };

  let [recipes, setRecipes] = useReducer(reducer, []);

  // TODO: scrap this
  const items = useMemo(() => {
    console.log('ITEMS')

    const result: ItemRecipe[] = [];

    for (const recipe of itemRecipes) {
      result.push({
        ...recipe as unknown as ItemRecipe,
        // ItemRecipeItem:
        //   data?.itemRecipeItemsByIds.filter(
        //     (iri) =>
        //       iri.item_recipe_id ==
        //       recipe.id
        //   ) || recipe.ItemRecipeItem,
      });
    }

    const modifiedRecipes = [...recipes];

    for (const recipe of modifiedRecipes) {
      const itemfound = itemRecipes.find(
        (i) =>
          i.Item_ItemRecipe_crafted_item_idToItem.id ===
          recipe.Item_ItemRecipe_crafted_item_idToItem.id
      ) as unknown as ItemRecipe;
      if (itemfound) {
        // setRecipes({ type: "REMOVE_BY_ID", payload: { item: itemfound } });

        // If Mortar Pestle


        // recipe.crafting_station_id === 107 && craftingStations["mortar-chem"] === '607'
        let amountToAdd = recipe.amount || 0;
        let yields = itemfound.yields || 1;

        if (recipe.crafting_station_id === 107 && craftingStations["mortar-chem"] === '607') {
          console.log('CHEM BENCH')


          yields *= 6
          amountToAdd = amountToAdd < yields ? yields : amountToAdd
        }
        // setRecipes({
        //   type: "ADD_AMOUNT_BY_NUM",
        //   payload: {
        //     item: {
        //       ...itemfound,
        //       ItemRecipeItem: data.itemRecipeItemsByIds.filter(
        //         (iri) => iri.item_recipe_id == itemfound.id
        //       ),
        //     },
        //     amount: amountToAdd > yields ? amountToAdd / yields : amountToAdd,
        //   },
        // });
      }
    }
    return result;
  }, [craftingStations]);

  // Item recipe is selected from menu
  const onAdd = (itemId: ArrayElement<MaterialGridProps["itemRecipes"]>["Item_ItemRecipe_crafted_item_idToItem"]["id"]) => {
    if (!itemId) return;

    let chosenItem = itemRecipes.find(
      (item) =>
        item.Item_ItemRecipe_crafted_item_idToItem.id === itemId
    );

    if (!chosenItem) return toast.error("Item could not be found");
    if (!data) return toast.error("Items not loaded");

    let yields = chosenItem.yields || 1;
    let crafting_time = chosenItem.crafting_time || 0;

    // TODO: make generic function for calculating crafting stations? or make a own array of all recipes with the adjusted rates?
    if (chosenItem.crafting_station_id === 107 && Object.values(craftingStations).some(c => parseInt(c) === 607)) {
      yields *= 6
      crafting_time /= 2
    }
    let item = {
      ...chosenItem,
      yields: yields,
      crafting_time: crafting_time,
      // ItemRecipeItem: data.itemRecipeItemsByIds.filter(
      //   (iri) => iri.item_recipe_id == chosenItem.id
      // ),
    } as unknown as ItemRecipe

    // console.log('ITEM', item)
    setRecipes({
      type: "ADD",
      payload: {
        item
      },
    });
  };

  let materials = [];
  let usedCraftingStations: number[] = []
  const newFindBaseMaterials = (
    item: ArrayElement<FindItemsForMaterialCalculator["items"]>,//ArrayElement<FindItemsMats["itemRecipes"]>,
    amount: number,
    yields: number = 1,
  ) => {

    console.log('ITEM', item)
    if (item?.itemRecipes.length == 0) {
      return console.warn('NO RECIPES')
    }
    if (!usedCraftingStations.some((c) => c === item.itemRecipes[0].crafting_station_id)) {
      usedCraftingStations.push(item?.itemRecipes[0].crafting_station_id)
    }

    if (item.itemRecipes.length == 0) {
      return console.warn(`${item.name} has no recipe`)
    }
    // Loop through child Items.
    item.itemRecipes[0].ItemRecipeItem.forEach((itemRecipeItem) => {
      let itemRecipe = data.items.find((ir) => ir.id === itemRecipeItem.resource_item_id);

      if (!itemRecipe) {
        return console.warn(`Item was not found`);
      }

      if (itemRecipe.itemRecipes.length > 0 && itemRecipe.itemRecipes[0].ItemRecipeItem.length > 0) {
        return newFindBaseMaterials(itemRecipe, itemRecipeItem.amount * amount, itemRecipe.itemRecipes[0].yields);
      }

      if (!usedCraftingStations.some((c) => c === itemRecipe.itemRecipes[0]?.crafting_station_id)) {
        usedCraftingStations.push(itemRecipe.itemRecipes[0]?.crafting_station_id)
      }


      let material = materials.find(
        (m) => m.id === itemRecipe.id
      );

      const count = (itemRecipeItem.amount * amount) / yields;

      if (material) {
        material = {
          ...material,
          amount: material.amount + count,
          crafting_time: material.crafting_time + (itemRecipe.itemRecipes[0]?.crafting_time || 0)
        }
      } else {
        materials.push({
          ...itemRecipe,
          amount: count,
          crafting_time: count * (itemRecipe.itemRecipes[0]?.crafting_time || 0),
        });
      }
    });
  }

  const testMaterialCalculation = () => {
    let item = data.items.find((item) => item.id === 109)
    // let recipe = itemRecipes.find((recipe) => recipe.Item_ItemRecipe_crafted_item_idToItem.id === 109)
    if (item.itemRecipes.length > 0) {

      newFindBaseMaterials(item, 1, 1);
    }

    console.log("MATERIALS", materials)
  }

  // Go through each crafting station? For crafting time reduction osv..
  // 128 - cooking pot
  // 601 - ind cook
  //
  // 107 - mortar and pestle
  // 607 - chem bench
  //
  // 125 - refining forge
  // 600 - ind forge
  //
  // 39 - campfire
  // 360 - ind grill
  //
  // 618 - ind grinder
  // 126 - smithy
  // 606 - beer barrel
  // 652 - tek replicator
  // 185 - fabricator
  // 525 - Castoroides Saddle
  // 572 - Thorny Dragon Saddle
  // 214 - Argentavis Saddle
  // 800 - Desmodus Saddle
  // 531 - Equus Saddle

  // Output all used crafting stations?

  const getBaseMaterials = (
    baseMaterials: boolean = false,
    path: boolean = false,
    items: ItemRecipe[],
    crafting_stations: number[],
    ...objects: RecipeState[]
  ): RecipeState[] => {
    let materials = [];
    let usedCraftingStations: number[] = []


    const findBaseMaterials = (
      item: ItemRecipe,
      amount: number,
      yields: number = 1
    ) => {
      // If has no crafting recipe, return
      if (!item?.ItemRecipeItem || item.ItemRecipeItem.length === 0) {
        return;
      }
      if (!usedCraftingStations.some((c) => c === item.crafting_station_id)) {
        usedCraftingStations.push(item.crafting_station_id)
      }
      item?.ItemRecipeItem.map((recipeItem) => {
        let newRecipe = items.find(
          (recipe) => recipe.Item_ItemRecipe_crafted_item_idToItem.id === recipeItem.Item.id
        );
        let craftedItemAmount = recipeItem.amount;

        if (!usedCraftingStations.some((c) => c === newRecipe?.crafting_station_id)) {
          usedCraftingStations.push(newRecipe.crafting_station_id)
        }

        if (!baseMaterials || !newRecipe?.ItemRecipeItem?.length || !recipeItem.Item) {
          const materialId = newRecipe
            ? newRecipe.Item_ItemRecipe_crafted_item_idToItem.id
            : recipeItem.Item.id;

          let crafting_time = newRecipe?.crafting_time || 0

          // TODO: remove this hardcode and add as modifier to craftingstation in db instead.
          if (newRecipe.crafting_station_id === 107 && crafting_stations.some(c => c === 607)) {
            crafting_time /= 2
          }

          if (newRecipe.crafting_station_id === 125 && crafting_stations.some(c => c === 600)) {
            crafting_time /= 20;
          }

          // Basically a check for if material already exists
          let material = materials.find(
            (m) => m.Item_ItemRecipe_crafted_item_idToItem.id === materialId
          );

          const count = (craftedItemAmount * amount) / yields;


          Log(newRecipe, material, amount, count)
          if (material) {
            // TODO: recalculate
            material.amount += count;
            material.crafting_time += count * (newRecipe?.crafting_time || 1);
          } else {
            material = {
              ...(newRecipe || { Item_ItemRecipe_crafted_item_idToItem: recipeItem.Item }), // !FIX
              amount: count,
              crafting_time: count * crafting_time,
            };
            materials.push(material);
          }

        } else if (newRecipe) {
          // Dig down deeper
          findBaseMaterials(newRecipe, craftedItemAmount * amount, newRecipe.yields);
        }
      })
    };

    const getRecipeById = (recipeId: number, crafting_stations?: any[]) => {
      return items.find(
        (recipe) => recipe.Item_ItemRecipe_crafted_item_idToItem.id === recipeId
      );
    };

    const recipeTree = (recipe, amount: number = 1) => {
      if (!recipe.ItemRecipeItem)
        return {
          ...recipe,
          amount: recipe.amount * amount,
          crafting_time: recipe.amount * (recipe.crafting_time || 1),
        };

      const processedItems = recipe.ItemRecipeItem.map((itemRecipeItem) => {
        const processedItem = {
          ...itemRecipeItem,
          amount: (itemRecipeItem.amount * recipe.amount) / recipe.yields,
          crafting_time:
            (itemRecipeItem.amount / recipe.yields) * (recipe.crafting_time || 1),
        };

        const nestedRecipe = getRecipeById(itemRecipeItem.Item.id);

        if (nestedRecipe) {
          processedItem.Item = {
            ...processedItem.Item,
            ...nestedRecipe.Item_ItemRecipe_crafted_item_idToItem,
          };

          if (nestedRecipe.ItemRecipeItem) {
            processedItem.ItemRecipeItem = nestedRecipe.ItemRecipeItem.map(
              (nestedItemRecipeItem) =>
                recipeTree(nestedItemRecipeItem, processedItem.amount)
            );
          }
        }
        return processedItem;
      });
      return {
        ...recipe,
        crafting_time: (recipe.crafting_time || 1) * amount,
        Item: recipe.Item_ItemRecipe_crafted_item_idToItem,
        ItemRecipeItem: processedItems,
      };
    };

    objects.forEach((item) => {
      if (path) {
        materials.push(recipeTree(item, item.amount));
      } else findBaseMaterials(item, item.amount, item.yields);
    });

    Log(materials)
    Log(usedCraftingStations)
    return materials;
  };

  const mergeItemRecipe = useCallback(getBaseMaterials, [
    recipes,
    craftingStations,
  ]);

  const [createRecipe, { loading }] = useMutation(CREATE_USERRECIPE_MUTATION, {
    onError: (error) => {
      toast.error(error.message);
    },
    refetchQueries: [{ query: USERRECIPEQUERY }],
    awaitRefetchQueries: true,
  });

  const saveRecipe = async (e) => {
    e.preventDefault();

    if (!recipes.length) return toast.error("No items to save");
    try {
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
      toast.promise(createRecipe({ variables: { input } }), {
        loading: "Creating recipe...",
        success: <b>Recipe saved!</b>,
        error: <b>Failed to create recipe.</b>,
      });
    } catch (error) {
      return console.error(error);
    }
  };

  // Custom User Recipe Handling
  const onRecipeSelect = async ({ UserRecipeItemRecipe }) => {
    if (UserRecipeItemRecipe && UserRecipeItemRecipe.length > 0) {
      UserRecipeItemRecipe.forEach(async ({ item_recipe_id, amount }) => {
        let itemfound = items.find((item) => item.id === item_recipe_id);
        if (itemfound && data) {
          setRecipes({
            type: "ADD",
            payload: {
              item: {
                ...itemfound,
                // ItemRecipeItem: data.itemRecipeItemsByIds
                //   ? data.itemRecipeItemsByIds.filter(
                //     (iri) => iri.item_recipe_id === item_recipe_id
                //   )
                //   : [],
              },
              amount: amount,
            },
          });
        }
      });
    }
  };

  const handleCraftingStationChange = (_, value: string) => {
    setCraftingStations((prev) => ({
      ...prev,
      [value === "107" || value === "607"
        ? "mortar-chem"
        : value === "125" || value === "600"
          ? "forge"
          : value === "128" || value === "601"
            ? "cooking"
            : "grill"
      ]: value,
    }))
    setRecipes({
      type: "CRAFTING_STATION",
    });
  }



  return (
    <div className="mx-1 flex w-full max-w-full flex-col gap-3">
      <UserRecipesCell onSelect={onRecipeSelect} />

      <section className="flex h-full w-full flex-col gap-3 sm:flex-row">
        <div className="flex flex-col space-y-1">
          <div className="flex">
            <Button color="success" variant="outlined" disabled={loading || recipes.length === 0} permission="authenticated" onClick={saveRecipe} startIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                fill="currentColor"
              >
                <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
              </svg>
            }>
              Save Recipe
            </Button>
            <Button
              color="warning"
              variant="outlined"
              disabled={loading}
              permission="authenticated"
              onClick={testMaterialCalculation}
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                >
                  <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
                </svg>
              }>
              Test Gunpowder
            </Button>

          </div>

          <Button title="Clear all items" color="error" variant="outlined" disabled={loading} onClick={() => setRecipes({ type: "RESET" })} startIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              aria-hidden="true"
              fill="currentColor"
            >
              <path d="M380.2 453.7c5.703 6.75 4.859 16.84-1.891 22.56C375.3 478.7 371.7 480 368 480c-4.547 0-9.063-1.938-12.23-5.657L192 280.8l-163.8 193.6C25.05 478.1 20.53 480 15.98 480c-3.641 0-7.313-1.25-10.31-3.781c-6.75-5.719-7.594-15.81-1.891-22.56l167.2-197.7L3.781 58.32c-5.703-6.75-4.859-16.84 1.891-22.56c6.75-5.688 16.83-4.813 22.55 1.875L192 231.2l163.8-193.6c5.703-6.688 15.8-7.563 22.55-1.875c6.75 5.719 7.594 15.81 1.891 22.56l-167.2 197.7L380.2 453.7z" />
            </svg>
          }>
            Clear
          </Button>

          <ItemList
            defaultSearch={false}
            onSearch={(e) => setQuery(e)}
            onSelect={(_, item) => onAdd(parseInt(item.id.toString()))}
            options={
              Object.entries(groupBy(itemRecipes
                .filter((recipe) => recipe?.Item_ItemRecipe_crafted_item_idToItem.name.includes(deferredQuery.toLowerCase())), "Item_ItemRecipe_crafted_item_idToItem.category"))
                .sort()
                .map(([category, categoryRecipes]) => {
                  return ({
                    label: category,
                    icon: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${categoriesIcons[category]}.webp`,
                    value: categoryRecipes.every(({ Item_ItemRecipe_crafted_item_idToItem: { type } }) => !type)
                      ? categoryRecipes.map(({ Item_ItemRecipe_crafted_item_idToItem: { name, image } }) => ({
                        label: name,
                        icon: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`,
                      }))
                      : Object.entries(groupBy(categoryRecipes, "Item_ItemRecipe_crafted_item_idToItem.type")).sort().map(([type, typeRecipes]) => ({
                        label: type,
                        value: typeRecipes.map(({ Item_ItemRecipe_crafted_item_idToItem: { id, name, image } }) => ({
                          label: name,
                          id,
                          icon: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`,
                        }))
                      }))
                  })
                })
            }
          />
        </div>
        <div className="w-full overflow-hidden">
          <div className="flex flex-row items-stretch space-x-3">
            <ToggleButtonGroup
              orientation="horizontal"
              size="medium"
              value={craftingStations["mortar-chem"]}
              exclusive
              enforce
              onChange={handleCraftingStationChange}
              // TODO: fix to check for underlying itemrecipes too.
              disabled={!recipes.some(({ crafting_station_id }) => crafting_station_id === 107 || crafting_station_id === 607)}
            >
              <ToggleButton value={"107"}>
                <img
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/mortar-and-pestle.webp`}
                  loading="lazy"
                  className="w-12"
                />
              </ToggleButton>
              <ToggleButton value={"607"}>
                <img
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/chemistry-bench.webp`}
                  loading="lazy"
                  className="w-12"
                />
              </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              orientation="horizontal"
              size="medium"
              value={craftingStations.forge}
              exclusive
              enforce
              onChange={handleCraftingStationChange}
              disabled={!recipes.some(({ crafting_station_id }) => crafting_station_id === 125 || crafting_station_id === 600)}
            >
              <ToggleButton value={"125"}>
                <img
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/refining-forge.webp`}
                  loading="lazy"
                  className="w-12"
                />
              </ToggleButton>
              <ToggleButton value={"600"}>
                <img
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/industrial-forge.webp`}
                  loading="lazy"
                  className="w-12"
                />
              </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              orientation="horizontal"
              size="medium"
              value={craftingStations.cooking}
              exclusive
              enforce
              onChange={handleCraftingStationChange}
              disabled={!recipes.some(({ crafting_station_id }) => crafting_station_id === 128 || crafting_station_id === 601)}
            >
              <ToggleButton value={"128"}>
                <img
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/cooking-pot.webp`}
                  loading="lazy"
                  className="w-12"
                />
              </ToggleButton>
              <ToggleButton value={"601"}>
                <img
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/industrial-cooker.webp`}
                  loading="lazy"
                  className="w-12"
                />
              </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              orientation="horizontal"
              size="medium"
              value={craftingStations.grill}
              exclusive
              enforce
              onChange={handleCraftingStationChange}
              disabled={!recipes.some(({ crafting_station_id }) => crafting_station_id === 39 || crafting_station_id === 360)}
            >
              <ToggleButton value={"39"}>
                <img
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/campfire.webp`}
                  loading="lazy"
                  className="w-12"
                />
              </ToggleButton>
              <ToggleButton value={"360"}>
                <img
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/industrial-grill.webp`}
                  loading="lazy"
                  className="w-12"
                />
              </ToggleButton>
            </ToggleButtonGroup>

            <div>
              <ToggleButton className="h-full" selected={viewBaseMaterials} onChange={() => setViewBaseMaterials(!viewBaseMaterials)} value={"showBaseMaterials"}>
                <span>Base Materials</span>
              </ToggleButton>
            </div>

          </div>

          <Table
            className="animate-fade-in !divide-opacity-50 whitespace-nowrap mt-2"
            rows={recipes.map((recipe, i) => {
              return {
                ...recipe,
                // collapseContent: (
                //   <div className="flex flex-col items-start justify-center gap-3 divide-y divide-zinc-500 p-4">
                //     <div className="tree">
                //       <ul className="relative whitespace-nowrap py-4 text-center after:clear-both after:table after:content-['']">
                //         {mergeItemRecipe(viewBaseMaterials, true, items, Object.values(craftingStations).map(Number), {
                //           ...recipe,
                //         }).map((itemrecipe, i) => (
                //           <TreeBranch
                //             key={`tree-${i}`}
                //             itemRecipe={itemrecipe as RecipeState}
                //           />
                //         ))}
                //       </ul>
                //     </div>
                //   </div>
                // ),
              };
            })}
            settings={{
              columnSelector: true,
              borders: {
                vertical: true,
                horizontal: true,
              },
            }}
            columns={[
              {
                field: "Item_ItemRecipe_crafted_item_idToItem",
                header: "Name",
                render: ({ rowIndex, value: { name, image } }) => (
                  <Button
                    variant="icon"
                    color="error"
                    size="large"
                    title={`Remove ${name}`}
                    onClick={() => {
                      setRecipes({
                        type: "REMOVE",
                        payload: { index: rowIndex },
                      });
                    }}
                  >
                    <div className="h-8 w-8">
                      <img
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
                        loading="lazy"
                      />
                    </div>
                  </Button>
                ),
              },
              {
                field: "amount",
                header: "Amount",
                datatype: "number",
                aggregate: "sum",
                className: "text-center min-w-[16rem]",
                render: ({ rowIndex, value, row }) => (
                  <Input
                    color="primary"
                    value={value}
                    fullWidth
                    onChange={(e) => {
                      setRecipes({
                        type: "CHANGE_AMOUNT",
                        payload: {
                          index: rowIndex,
                          amount:
                            parseInt(e.target.value) > 0
                              ? parseInt(e.target.value)
                              : 1,
                        },
                      });
                    }}
                    InputProps={{
                      className: "w-fit",
                      endAdornment: (
                        <Fragment>
                          <Button
                            variant="icon"
                            color="secondary"
                            aria-valuetext={value}
                            disabled={value === 1}
                            onClick={() =>
                              setRecipes({
                                type: "CHANGE_AMOUNT",
                                payload: {
                                  index: rowIndex,
                                  amount:
                                    value - row.yields < 1
                                      ? row.yields
                                      : value - row.yields,
                                },
                              })
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 448 512"
                              className="h-3.5 w-3.5"
                              fill="currentColor"
                            >
                              <path d="M432 256C432 264.8 424.8 272 416 272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h384C424.8 240 432 247.2 432 256z" />
                            </svg>
                          </Button>
                          <span className="mx-1 h-8 w-px bg-current opacity-30" />
                          <Button
                            variant="icon"
                            color="secondary"
                            disabled={value >= 10000}
                            onClick={() =>
                              setRecipes({
                                type: "CHANGE_AMOUNT",
                                payload: {
                                  index: rowIndex,
                                  amount: value + row.yields,
                                },
                              })
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 448 512"
                              className="h-3.5 w-3.5"
                              fill="currentColor"
                            >
                              <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                            </svg>
                          </Button>
                        </Fragment>
                      ),
                    }}
                  />
                ),
              },
              {
                field: "crafting_time",
                header: "Time pr item",
                datatype: "number",
                aggregate: "sum",
                className: "w-0 text-center",
                valueFormatter: ({ row, value }) =>
                  parseFloat(value.toString()) * row.amount,
                render: ({ value }) => `${timeFormatL(value, true)}`,
              },
              ...(mergeItemRecipe(
                viewBaseMaterials,
                false,
                items,
                Object.values(craftingStations).map(Number),
                ...recipes
              ).map(({ Item_ItemRecipe_crafted_item_idToItem }) => ({
                field: Item_ItemRecipe_crafted_item_idToItem.name,
                header: Item_ItemRecipe_crafted_item_idToItem.name,
                datatype: "number",
                aggregate: "sum" as const,
                className: "w-0 text-center",
                // valueFormatter: ({ row, value }) => {
                //   const itm = mergeItemRecipe(false, false, items, Object.values(craftingStations).map(Number), {
                //     ...row,
                //   }).filter(
                //     (v) =>
                //       v.Item_ItemRecipe_crafted_item_idToItem.id ===
                //       Item_ItemRecipe_crafted_item_idToItem.id
                //   );
                //   return itm.length > 0 ? itm[0].amount : 0;
                // },
                // render: ({ row }) => {
                //   const itm = mergeItemRecipe(false, false, items, {
                //     ...row,
                //   }).filter(
                //     (v) =>
                //       v.Item_ItemRecipe_crafted_item_idToItem.id ===
                //       Item_ItemRecipe_crafted_item_idToItem.id
                //   );
                //   return (
                //     itm.length > 0 && (
                //       <div
                //         className="inline-flex min-h-full min-w-[3rem] flex-col items-center justify-center"
                //         key={`value`}
                //       >
                //         <img
                //           src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${itm[0].Item_ItemRecipe_crafted_item_idToItem.image}`}
                //           className="h-6 w-6"
                //         />
                //         <span className="text-sm text-black dark:text-white">
                //           {formatNumber(itm[0].amount)}
                //         </span>
                //       </div>
                //     )
                //   );
                // },
              })) as any[]),
              // OLD
              // {
              //   field: "Item_ItemRecipe_crafted_item_idToItem",
              //   header: "Ingredients",
              //   datatype: 'number',
              //   aggregate: "sum",
              //   render: ({ row }) => {
              //     return mergeItemRecipe(viewBaseMaterials, false, items, {
              //       ...row,
              //     })
              //       .sort(
              //         (a, b) =>
              //           a.Item_ItemRecipe_crafted_item_idToItem.id -
              //           b.Item_ItemRecipe_crafted_item_idToItem.id
              //       )
              //       .map(
              //         (
              //           {
              //             Item_ItemRecipe_crafted_item_idToItem: {
              //               id,
              //               name,
              //               image,
              //             },
              //             amount,
              //           },
              //           i
              //         ) => (
              //           <div
              //             className="inline-flex min-h-full min-w-[4rem] flex-col items-center justify-center"
              //             id={`${id}-${i * Math.random()}${i}`}
              //             key={`${id}-${i * Math.random()}${i}`}
              //           >
              //             <img
              //               src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
              //               className="h-6 w-6"
              //               title={name}
              //               alt={name}
              //             />
              //             <span className="text-sm text-black dark:text-white">
              //               {formatNumber(amount)}
              //             </span>
              //           </div>
              //         )
              //       );
              //   },
              // },
            ]}
          />
        </div>
      </section>
    </div>
  );
};
