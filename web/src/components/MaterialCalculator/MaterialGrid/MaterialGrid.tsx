import { RWGqlError } from "@redwoodjs/forms";
import {
  Fragment,
  memo,
  useDeferredValue,
  useMemo,
  useReducer,
  useState,
} from "react";

import {
  ArrayElement,
  formatNumber,
  groupBy,
  timeFormatL,
} from "src/lib/formatters";
import Table from "src/components/Util/Table/Table";
import { FindItemsMaterials } from "types/graphql";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/dist/toast";
import { useAuth } from "src/auth";
import UserRecipesCell, {
  QUERY as USERRECIPEQUERY,
} from "src/components/UserRecipe/UserRecipesCell";
import Button from "src/components/Util/Button/Button";
import { Input } from "src/components/Util/Input/Input";
import { ToggleButton, ToggleButtonGroup } from "src/components/Util/ToggleButton/ToggleButton";
import Badge from "src/components/Util/Badge/Badge";
import { routes } from "@redwoodjs/router";
import Toast from "src/components/Util/Toast/Toast";
import { Card } from "src/components/Util/Card/Card";
import TreeView from "src/components/Util/TreeView/TreeView";

const CREATE_USERRECIPE_MUTATION = gql`
  mutation CreateUserRecipe($input: CreateUserRecipeInput!) {
    createUserRecipe(input: $input) {
      id
    }
  }
`;


interface RecipeState extends ArrayElement<MaterialGridProps["craftingItems"]> {
  amount: number;
  crafting_time?: number;
  crafting_station?: ArrayElement<MaterialGridProps["craftingItems"]>;
  children?: RecipeState[];
  base_materials?: MaterialGridProps["craftingItems"];
}

const TreeBranch = memo(({ item, items }: { item: RecipeState, items: MaterialGridProps["craftingItems"] }) => {
  const { id, name, image, amount, crafting_time, children, itemRecipes, crafting_station } = item;

  const craftingStation = items.find((i) => i.id === itemRecipes?.[0]?.crafting_station_id)

  return (
    <li className="relative -ml-1 -mr-1 inline-block list-none px-2 pt-4 text-center align-top before:absolute before:top-0 before:right-1/2 before:h-4 before:w-1/2 before:border-t before:border-zinc-500 before:content-[''] after:absolute after:top-0 after:right-auto after:left-1/2 after:h-4 after:w-1/2 after:border-t after:border-l after:border-zinc-500 after:content-[''] first:before:border-0 first:after:rounded-tl-2xl last:before:rounded-tr-2xl last:before:border-r last:before:border-zinc-500 last:after:border-0 only:pt-0 only:before:hidden only:after:hidden">
      {item && (
        <Button
          className="text-xs w-full aspect-square max-w-[5rem] flex flex-col items-center justify-center"
          variant="outlined"
          color="DEFAULT"
          to={routes.item({ id })}
          title={craftingStation ? `${item.name} is crafted in ${craftingStation?.name}` : ''}
        >
          <img
            className="h-10 w-10 aspect-square p-1"
            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
            alt={name}
          />
          <span className="sr-only text-xs box-border w-full break-words whitespace-pre-wrap max-w-max">
            {name}
          </span>

          {craftingStation && (
            <Badge
              size="small"
              content={(
                <img
                  className="w-5"
                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${craftingStation.image}`}
                  alt={craftingStation.name}
                />
              )}
              variant="standard"
              color="DEFAULT"
              anchor={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              title={`${item.name} is crafted in ${craftingStation.name}`}
            />
          )}
          <Badge
            size="small"
            content={crafting_time === 0 ? 0 : timeFormatL(crafting_time, false)}
            variant="standard"
            color="none"
            className="absolute inset-0 lowercase w-full [&>span]:place-content-end [&>span]:translate-x-0 [&>span]:mt-2 [&>*]:!text-right ![&>span]:items-end [&>span]:justify-end"
          />
          <Badge
            size="small"
            content={amount}
            variant="standard"
            color="none"
            anchor={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            max={100000000}
            className="absolute inset-0 w-full [&>span]:place-content-end [&>span]:translate-x-0 [&>span]:mb-2.5 [&>span]:mr-0.5 [&>span]:text-right"
          />
        </Button>
      )}
      {children?.length > 0 && (
        <ul className="relative whitespace-nowrap py-4 text-center before:absolute before:top-0 before:left-1/2 before:h-4 before:w-0 before:border-l before:border-zinc-500 before:content-[''] after:clear-both after:table after:content-['']">
          {children.map((subItemRecipe, i) => (
            <TreeBranch
              key={`subItem-${subItemRecipe?.id}-${i}`}
              item={subItemRecipe}
              items={items}
            />
          ))}
        </ul>
      )}
    </li>
  );
});

interface MaterialGridProps {
  craftingItems: NonNullable<FindItemsMaterials["craftingItems"]>;
  error?: RWGqlError;
}

export const MaterialGrid = ({ error, craftingItems }: MaterialGridProps) => {
  const { currentUser } = useAuth();

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
  // TODO: Fix BaseMaterials.

  const [query, setQuery] = useState<string>("");
  const deferredQuery = useDeferredValue(query);
  const [viewBaseMaterials, setViewBaseMaterials] = useState<boolean>(false);

  // TODO: add Tek replicator and smithy too.
  const [craftingStations, setCraftingStations] = useState({
    "mortar-chem": [
      {
        id: 107,
        name: 'Mortar & Pestle',
        active: true,
      },
      {
        id: 607,
        name: 'Chemistry Bench',
        active: false,
      }
    ],
    "forge": [
      {
        id: 125,
        name: 'Refining Forge',
        active: true,
      },
      {
        id: 600,
        name: 'Industrial Forge',
        active: false,
      }
    ],
    "cooking": [
      {
        id: 128,
        name: 'Cooking Pot',
        active: true,
      },
      {
        id: 601,
        name: 'Industrial Cooker',
        active: false
      }
    ],
    "grill": [
      {
        id: 39,
        name: 'Campfire',
        active: true,
      },
      {
        id: 360,
        name: 'Industrial Grill',
        active: false,
      }
    ]
  });

  type RecipeActionType =
    | "ADD"
    | "REMOVE"
    | "RESET"
    | "CHANGE_AMOUNT"
    | "EDIT_AMOUNT";

  type RecipeAction = {
    type: RecipeActionType;
    payload?: {
      amount?: number;
      index?: number;
      item?: ArrayElement<MaterialGridProps["craftingItems"]>
    };
  }

  const reducer = (state: RecipeState[], action: RecipeAction) => {
    const { type, payload } = action;
    switch (type) {
      case "ADD": {
        const itemIndex = state.findIndex(({ id }) => id === payload.item.id);

        let amountToAdd = payload.amount || 1;

        if (itemIndex !== -1) {
          return state.map((item, i) =>
            i === itemIndex
              ? {
                ...item,
                amount: (item.amount + amountToAdd) % payload.item?.itemRecipes[0]?.yields === 0 ? (item.amount + amountToAdd) : (item.amount + amountToAdd) + (payload.item?.itemRecipes[0]?.yields - (item.amount + amountToAdd) % payload.item?.itemRecipes[0]?.yields)
              }
              : item
          );
        }

        return [
          ...state,
          {
            ...payload.item,
            amount: amountToAdd % payload.item?.itemRecipes[0]?.yields === 0 ? amountToAdd : amountToAdd + (payload.item?.itemRecipes[0]?.yields - amountToAdd % payload.item?.itemRecipes[0]?.yields),
          },
        ];
      }
      case "EDIT_AMOUNT": {
        const rowIndex = payload.index;

        if (rowIndex < 0) {
          return state;
        }

        return state.map((item, index) => {
          if (rowIndex != index) return item;

          let crafting_station = craftingItems.find(({ id }) => id === item.itemRecipes[0]?.crafting_station_id)

          for (const stationGroup in craftingStations) {
            const station = craftingStations[stationGroup].find(
              (s) => s.id === item.itemRecipes[0]?.crafting_station_id
            );

            if (station) {
              // Replace the crafting station only if the opposite one is active
              const activeStation = craftingStations[stationGroup].find(
                (s) => s.active
              );

              if (activeStation) {
                crafting_station = craftingItems.find(({ id }) => id === activeStation.id)
              }
            }
          }

          const recipeYields = item.itemRecipes[0]?.yields * crafting_station.item_production_multiplier || 1;

          const amount = payload.amount < item.amount ? item.amount - recipeYields : item.amount + recipeYields;

          return {
            ...item,
            amount: amount
          }
        });
      }
      case "CHANGE_AMOUNT": {
        let { index: itemIndex, amount = 0 } = payload;
        const normalizedAmount = isNaN(amount) ? 0 : amount;


        if (itemIndex === -1) {
          return;
        }

        // TODO: calculate yields here.
        return state.map((item, i) => {
          if (i === itemIndex) {
            const { itemRecipes } = item;
            const yields = itemRecipes[0]?.yields || 1;
            const remainder = normalizedAmount % yields;

            const newAmount = remainder === 0 ? normalizedAmount : normalizedAmount + (yields - remainder);

            return { ...item, amount: newAmount };
          }
          return item;
        });
      }
      case "REMOVE": {
        return state.filter((_, i) => i !== payload.index);
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

  // Item recipe is selected from menu
  const onAdd = (item_id: ArrayElement<MaterialGridProps["craftingItems"]>["id"]) => {
    if (!item_id) return;

    let chosenItem = craftingItems.find(({ id }) => id === item_id);

    if (!chosenItem) return toast.error("Item could not be found");

    setRecipes({
      type: "ADD",
      payload: {
        item: chosenItem
      },
    });
  };

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


  const getBaseMaterials = (
    baseMaterials: boolean = false,
    ...objects: RecipeState[]
  ): RecipeState[] => {
    let materials: RecipeState[] = [];

    function getBaseMaterial(item: RecipeState): RecipeState[] {
      if (!item.children || item.children.length === 0) {
        // This is a base material
        return [item];
      }

      // Recursively get base materials from children
      const baseMaterials: RecipeState[] = [];
      for (const child of item.children) {
        const childBaseMaterials = getBaseMaterial(child);
        baseMaterials.push(...childBaseMaterials);
      }

      return baseMaterials;
    }

    const calculateRecipe = (
      item: ArrayElement<MaterialGridProps["craftingItems"]>,
      amount: number = 0,
    ): RecipeState => {
      if (!item?.itemRecipes.length || !item.itemRecipes[0]) {
        console.warn(`${item.name} has no recipe`)
        return;
      }

      const children: RecipeState[] = [];

      const { ItemRecipeItem, crafting_station_id, crafting_time = 0, yields = 1 } = item.itemRecipes[0];


      let crafting_station = craftingItems.find(({ id }) => id === crafting_station_id)

      for (const stationGroup in craftingStations) {
        const station = craftingStations[stationGroup].find(
          (s) => s.id === crafting_station_id
        );

        if (station) {
          // Replace the crafting station only if the opposite one is active
          const activeStation = craftingStations[stationGroup].find(
            (s) => s.active
          );

          if (activeStation) {
            crafting_station = craftingItems.find(({ id }) => id === activeStation.id)
          }
        }
      }

      const { item_production_multiplier = 1, resource_consumption_multiplier = 1, crafting_speed_modifier = 1 } = crafting_station;


      // Loop through child Items.
      ItemRecipeItem.forEach((itemRecipeItem) => {
        let resourceItem = craftingItems.find((ir) => ir.id === itemRecipeItem.resource_item_id);
        let resourceItemRecipe = resourceItem?.itemRecipes?.[0];

        if (!resourceItem) {
          return console.warn(`Item was not found`);
        }

        const modifiedAmount = itemRecipeItem.amount * amount * (resource_consumption_multiplier / item_production_multiplier) / yields;

        if (resourceItemRecipe && resourceItemRecipe.ItemRecipeItem.length > 0) {
          const childNode = calculateRecipe(resourceItem, modifiedAmount);
          children.push(childNode);
        } else {
          children.push({
            ...resourceItem,
            amount: modifiedAmount,
            crafting_time: 0,
            children: [],
          })
        }
      });

      return {
        ...item,
        amount,
        crafting_time: amount * (crafting_time / crafting_speed_modifier),
        children: children.length > 0 ? children : [],
        itemRecipes: item.itemRecipes.map((d) => ({
          ...d,
          crafting_station_id: crafting_station.id
        })),
      }
    }

    // Loop through all items
    objects.forEach((item) => {
      const itemMaterials = calculateRecipe(item, item.amount);
      materials.push({
        ...itemMaterials,
        base_materials: getBaseMaterial(itemMaterials),
      });
    });

    return materials;
  };

  const calculatedRecipes = useMemo(() => {
    const materials = getBaseMaterials(
      viewBaseMaterials,
      ...recipes
    );
    return materials;
  }, [craftingStations, recipes, viewBaseMaterials])

  const getUniqueCraftingStationIds = (items: RecipeState[]): ArrayElement<RecipeState["itemRecipes"]>["crafting_station_id"][] => {
    const craftingStationIds: Set<ArrayElement<RecipeState["itemRecipes"]>["crafting_station_id"]> = new Set();

    const processItem = (item: RecipeState) => {
      item.itemRecipes.forEach((recipe) => {
        craftingStationIds.add(recipe.crafting_station_id);
        recipe.ItemRecipeItem.forEach((recipeItem) => {
          craftingStationIds.add(recipeItem.resource_item_id);
        });
      });

      item.children.forEach(processItem);
    };

    items.forEach(processItem);

    return Array.from(craftingStationIds);
  };

  const handleCraftingStationChange = (_, value: string) => {
    setCraftingStations((prevCraftingStations) => {
      // Toggle Active Crafting Station
      Object.keys(prevCraftingStations).forEach((category) => {
        if (prevCraftingStations[category].some((s) => s.id === Number(value))) {
          prevCraftingStations[category] = prevCraftingStations[category].map((s) => {
            return {
              ...s,
              active: !s.active
            }
          });
        }
      })
      return Object.entries(prevCraftingStations)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {}) as typeof prevCraftingStations
    });
  }

  // Custom Recipe Stuff
  const [createRecipe, { loading }] = useMutation(CREATE_USERRECIPE_MUTATION, {
    onError: (error) => {
      toast.error(error.message);
    },
    refetchQueries: [{ query: USERRECIPEQUERY }],
    awaitRefetchQueries: true,
  });

  const saveRecipe = async (e) => {
    e.preventDefault();
    try {

      if (!recipes.length) {
        return toast.error("No items to save");
      }

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
    if (!UserRecipeItemRecipe.length) {
      return toast.custom((t) => (
        <Toast
          t={t}
          title={"Something went wrong"}
          message={"Error loading recipe"}
          actionType="Ok"
          variant="warning"
        />
      ));
    }

    UserRecipeItemRecipe.forEach(async ({ item_recipe_id, amount }) => {
      let itemfound = craftingItems
        .filter(({ itemRecipes }) => itemRecipes.length > 0)
        .find((item) => item.itemRecipes[0].id === item_recipe_id);

      if (!itemfound) {
        return toast.custom((t) => (
          <Toast
            t={t}
            title={"Something went wrong"}
            message={"Item not found"}
            actionType="Ok"
            variant="error"
          />
        ));
      }

      setRecipes({
        type: "ADD",
        payload: {
          item: itemfound,
          amount: amount,
        },
      });
    });
  };

  return (
    <div className="mx-1 flex w-full max-w-full flex-col gap-3">
      <UserRecipesCell onSelect={onRecipeSelect} />

      <section className="flex h-full w-full flex-col gap-3 sm:flex-row">
        <div className="flex flex-col space-y-1">
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

          <Card variant="outlined" className="p-2 max-w-sm">
            <Input
              margin="none"
              size="small"
              className="mb-2"
              type="search"
              placeholder="Search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-4 fill-current"
                  >
                    <path d="M507.3 484.7l-141.5-141.5C397 306.8 415.1 259.7 415.1 208c0-114.9-93.13-208-208-208S-.0002 93.13-.0002 208S93.12 416 207.1 416c51.68 0 98.85-18.96 135.2-50.15l141.5 141.5C487.8 510.4 491.9 512 496 512s8.188-1.562 11.31-4.688C513.6 501.1 513.6 490.9 507.3 484.7zM208 384C110.1 384 32 305 32 208S110.1 32 208 32S384 110.1 384 208S305 384 208 384z" />
                  </svg>
                ),
                endAdornment: (query != "" && query.length > 0) && (
                  <Button variant="icon" color="DEFAULT" size="small" onClick={() => setQuery("")}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-4 fill-current">
                      <path d="M315.3 411.3c-6.253 6.253-16.37 6.253-22.63 0L160 278.6l-132.7 132.7c-6.253 6.253-16.37 6.253-22.63 0c-6.253-6.253-6.253-16.37 0-22.63L137.4 256L4.69 123.3c-6.253-6.253-6.253-16.37 0-22.63c6.253-6.253 16.37-6.253 22.63 0L160 233.4l132.7-132.7c6.253-6.253 16.37-6.253 22.63 0c6.253 6.253 6.253 16.37 0 22.63L182.6 256l132.7 132.7C321.6 394.9 321.6 405.1 315.3 411.3z" />
                    </svg>
                  </Button>
                )
              }}
            />
            <TreeView
              options={Object.entries(
                groupBy(craftingItems.filter((item) => item?.name.toLowerCase().includes(deferredQuery.toLowerCase()) && item.visible && item.itemRecipes.length > 0), "category")
              )
                .sort()
                .map(([category, categoryRecipes]) => {
                  return {
                    label: category,
                    icon: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${categoriesIcons[category]}.webp`,
                    children: categoryRecipes.every(({ type }) => !type) || categoryRecipes.length < 5
                      ? categoryRecipes
                        .filter((item) => item?.name.toLowerCase().includes(deferredQuery.toLowerCase()))
                        .map(({ id, name, image }) => ({
                          label: name,
                          id,
                          icon: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`,
                        }))
                      : Object.entries(groupBy(categoryRecipes, "type")).sort().map(([type, typeRecipes]) => ({
                        label: type,
                        children: typeRecipes
                          .filter((item) => item?.name.toLowerCase().includes(deferredQuery.toLowerCase()))
                          .map(({ id, name, image }) => ({
                            label: name,
                            id,
                            icon: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`,
                          }))
                      }))
                  }
                })
              }
              getOptionLabel={(opt) => opt.label}
              getOptionIcon={(opt) => opt.icon}
              getOptionCaption={(opt, level) => opt?.children && level > 0 ? formatNumber(opt?.children?.length) : ""}
              onOptionSelect={(opt, _, final) => {
                if (!final) return;
                onAdd(opt["id"])
              }}
            />
          </Card>
        </div>

        <div className="w-full overflow-hidden">
          <div className="flex flex-row items-stretch space-x-3">
            {Object.entries(craftingStations).map(([type, stations]) => {
              return (
                <ToggleButtonGroup
                  key={type}
                  orientation="horizontal"
                  size="medium"
                  exclusive
                  enforce
                  value={stations.find(({ active }) => active)?.id.toString()}
                  onChange={handleCraftingStationChange}
                  disabled={!getUniqueCraftingStationIds(calculatedRecipes).some((c) => stations.some((cr) => cr.id === c))}
                >
                  {stations.map((station) => {
                    const stationItem = craftingItems.find(({ id }) => id === station.id);
                    return (
                      <ToggleButton value={station.id.toString()} key={station.id}>
                        <img
                          src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${stationItem?.image || categoriesIcons["Other"]}`}
                          loading="lazy"
                          className="w-12"
                        />
                      </ToggleButton>
                    )
                  })}
                </ToggleButtonGroup>
              )
            })}

            <div>
              <ToggleButton className="h-full" selected={viewBaseMaterials} onChange={() => setViewBaseMaterials(!viewBaseMaterials)} value={"showBaseMaterials"}>
                <span>Base Materials</span>
              </ToggleButton>
            </div>
          </div>
          {/* TODO: implement datagrid instead? */}
          <Table
            className="animate-fade-in !divide-opacity-50 whitespace-nowrap mt-2"
            rows={calculatedRecipes.map((recipe) => {
              return {
                ...recipe,
                collapseContent: (
                  <div className="flex flex-col items-start justify-center gap-3 divide-y divide-zinc-500 p-4">
                    <div className="tree">
                      <ul className="relative whitespace-nowrap py-4 text-center after:clear-both after:table after:content-['']">
                        <TreeBranch
                          key={`tree-recipe`}
                          item={recipe}
                          items={craftingItems}
                        />
                      </ul>
                    </div>
                  </div>
                ),
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
                field: "name",
                header: "Name",
                render: ({ rowIndex, row, value }) => (
                  <Button
                    variant="icon"
                    color="error"
                    size="large"
                    title={`Remove ${value}`}
                    onClick={() => {
                      setRecipes({
                        type: "REMOVE",
                        payload: { index: rowIndex },
                      });
                    }}
                  >
                    <div className="h-8 w-8">
                      <img
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${row.image}`}
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
                className: "text-center min-w-[14rem]",
                render: ({ rowIndex, value }) => (
                  <Input
                    margin="none"
                    color="DEFAULT"
                    value={value || 0}
                    fullWidth
                    onChange={(e) => {
                      setRecipes({
                        type: "CHANGE_AMOUNT",
                        payload: {
                          index: rowIndex,
                          amount:
                            parseInt(e.target.value) < 0
                              ? 0
                              : parseInt(e.target.value),
                        },
                      });
                    }}
                    InputProps={{
                      className: "w-fit",
                      max: 1000000,
                      min: 0,
                      endAdornment: (
                        <Fragment>
                          <Button
                            variant="icon"
                            color="secondary"
                            aria-valuetext={value}
                            disabled={value === 1}
                            onClick={() => setRecipes({
                              type: "EDIT_AMOUNT",
                              payload: { index: rowIndex, amount: value - 1 }
                            })}
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
                            onClick={() => setRecipes({
                              type: "EDIT_AMOUNT",
                              payload: {
                                index: rowIndex,
                                amount: value + 1,
                              },
                            })}
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
                header: "Crafting Time",
                datatype: "number",
                aggregate: "sum",
                className: "w-0 text-center",
                render: ({ value }) => {
                  return `${timeFormatL(value, false)}`;
                },
              },
              ...Object.entries(groupBy(calculatedRecipes.flatMap(c => c[viewBaseMaterials ? "base_materials" : 'children']?.map((d) => ({ ...d, parent_item_id: c.id })) || []), 'id')).flatMap(([_, v]) => {
                return {
                  field: v[0].id.toString(),
                  header: v[0].name,
                  aggregate: "sum" as const,
                  datatype: "number" as const,
                  className: 'text-center',
                  valueFormatter: ({ row }) => {
                    let itemIsInCurrentRow = v.find((c) => c.id === v[0].id && row.id === c.parent_item_id);
                    return itemIsInCurrentRow ? itemIsInCurrentRow.amount : 0;
                  },
                  render: ({ value }) => {
                    return value > 0 && (
                      <div
                        className="inline-flex min-h-full min-w-[3rem] flex-col items-center justify-center"
                        key={`value`}
                      >
                        <img
                          src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${v[0].image}`}
                          className="h-6 w-6"
                        />
                        <span className="text-sm">
                          {formatNumber(value)}
                        </span>
                      </div>
                    )
                  }
                }
              }),

              // ...calculatedRecipes.flatMap(c => c.children).map(({ id, name, image, amount }) => {
              //   return {
              //     field: id.toString(),
              //     header: name,
              //     datatype: "number" as const,
              //     aggregate: "sum" as const,
              //     className: "w-0 text-center",
              //     valueFormatter: ({ row }) => {
              //       let itemIsInCurrentRow = row.children.some((c) => c.id === id);
              //       return itemIsInCurrentRow ? amount : 0;
              //     },
              //     render: ({ value }) => {
              //       return value > 0 && (
              //         <div
              //           className="inline-flex min-h-full min-w-[3rem] flex-col items-center justify-center"
              //           key={`value`}
              //         >
              //           <img
              //             src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
              //             className="h-6 w-6"
              //           />
              //           <span className="text-sm">
              //             {formatNumber(value)}
              //           </span>
              //         </div>
              //       )
              //     }
              //   }
              // })
              // ...(mergeItemRecipe(
              //   viewBaseMaterials,
              //   false,
              //   ...recipes
              // ).map(({ name, id }) => ({
              //   field: name,
              //   header: name,
              //   datatype: "number",
              //   aggregate: "sum" as const,
              //   className: "w-0 text-center",
              //   valueFormatter: ({ row, value }) => {
              //     // console.log(row, value)
              //     const itm = mergeItemRecipe(
              //       false,
              //       false,
              //       {
              //         ...row,
              //       }).filter(
              //         (v) =>
              //           v.id ===
              //           id
              //       );

              //     // console.log('ROW', row, id, value)
              //     return itm.length > 0 ? itm[0].amount : 0;
              //   },
              //   render: ({ row }) => {
              //     const itm = mergeItemRecipe(
              //       false,
              //       false,
              //       //  data.craftingItems,
              //       {
              //         ...row,
              //       }).filter(
              //         (v) =>
              //           v.id ===
              //           id
              //       );
              //     return (
              //       itm.length > 0 && (
              //         <div
              //           className="inline-flex min-h-full min-w-[3rem] flex-col items-center justify-center"
              //           key={`value`}
              //         >
              //           <img
              //             src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${itm[0].image}`}
              //             className="h-6 w-6"
              //           />
              //           <span className="text-sm text-black dark:text-white">
              //             {formatNumber(itm[0].amount)}
              //           </span>
              //         </div>
              //       )
              //     );
              //   },
              // })) as any[]),

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
