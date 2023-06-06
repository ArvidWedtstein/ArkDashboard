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
  getBaseMaterials,
  groupBy,
  timeFormatL,
} from "src/lib/formatters";
import debounce from "lodash.debounce";
import Table from "src/components/Util/Table/Table";
import ToggleButton from "src/components/Util/ToggleButton/ToggleButton";
import { CreateUserRecipeInput, FindItemsMats } from "types/graphql";
import clsx from "clsx";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/dist/toast";
import { useAuth } from "src/auth";


const CREATE_USERRECIPE_MUTATION = gql`
  mutation CreateUserRecipe($input: CreateUserRecipeInput!) {
    createUserRecipe(input: $input) {
      id
    }
  }
`

interface MaterialGridProps {
  itemRecipes: NonNullable<FindItemsMats["itemRecipes"]>;
  userRecipesByID?: NonNullable<FindItemsMats["userRecipesByID"]>;
  error?: RWGqlError;
}

export const MaterialGrid = ({ error, itemRecipes, userRecipesByID }: MaterialGridProps) => {
  const { currentUser, isAuthenticated } = useAuth();
  // TODO: Fix Types
  const [search, setSearch] = useState<string>("");
  const [craftingStations, setCraftingStations] = useState<any>([107, 125]);

  const [viewBaseMaterials, setViewBaseMaterials] = useState<boolean>(false);
  const toggleBaseMaterials = useCallback(
    (e) => {
      setViewBaseMaterials(e.currentTarget.checked);
    },
    [viewBaseMaterials]
  );

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
            amount: (action.index || 1) //* yields,
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
              amount: item.amount - yields,
            }
            : item;
        });
      }
      case "ADD": {
        const itemIndex = state.findIndex(
          (item) => item.id === action.item.id
        );

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
        return state.filter((itm, i) => itm.id !== action.id);
      }
      case "RESET": {
        return [];
      }
      default: {
        return state;
      }
    }
  };

  let [item, setItem] = useReducer(reducer, []);

  const items = useMemo(() => {
    const craftedItems = groupBy(itemRecipes, "crafted_item_id");
    const craftingStation = {};

    for (const [key, value] of Object.entries(craftedItems)) {
      craftingStation[key] = groupBy(value as any, "crafting_station_id");
    }
    const result = [];
    for (const v of Object.values(craftingStation)) {
      if (
        Object.keys(v).some((f) => [107, 607, 125, 600].includes(Number(f)))
      ) {
        const t = Object.entries(v)
          .filter(([k, _]) => {
            return craftingStations.includes(Number(k));
          })
          .map(([_, v]) => {
            return Object.values(v)[0];
          });
        t[0] && result.push(t[0]);
      } else {
        const craftingStation = Object.values(Object.values(v)[0])[0];
        result.push(craftingStation);
      }
    }
    item.forEach((item) => {
      setItem({ type: "REMOVE_BY_ID", id: item.id });
      let itemfound = result.find(
        (item2) =>
          parseInt(item2.crafted_item_id) === parseInt(item.crafted_item_id)
      );
      if (itemfound) {
        setItem({
          type: "ADD_AMOUNT_BY_NUM",
          item: itemfound,
          index: item.amount / itemfound.yields,
        });
      }
    });

    return result;
  }, [craftingStations]);

  const categories = useMemo(() => {
    return groupBy(
      items
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
      (item) => parseInt(item.crafted_item_id) === parseInt(itemId)
    );

    setItem({ type: "ADD", item: chosenItem });
  };

  const onAddAmount = (index) => {
    setItem({ type: "ADD_AMOUNT", index });
  };
  const onRemoveAmount = (index) => {
    setItem({ type: "REMOVE_AMOUNT", index });
  };
  const onChangeAmount = debounce((index, amount) => {
    setItem({ type: "CHANGE_AMOUNT", item: index, index: amount });
  }, 500);

  const clear = () => {
    setItem({ type: "RESET" });
  };

  const mergeItemRecipe = useCallback(getBaseMaterials, [
    item,
    craftingStations,
  ]);

  const [createRecipe, { loading, error: recipeError }] = useMutation(
    CREATE_USERRECIPE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Recipe created')
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const saveRecipe = (e) => {
    e.preventDefault();
    const recipe: CreateUserRecipeInput = {
      name: '',
      user_id: currentUser.id,
      created_at: new Date().toISOString(),
      private: true,
      updated_at: new Date().toISOString(),
      // UserRecipeItemRecipe: item.map(({ id, amount }) => ({
      //   item_recipe_id: id,
      //   amount: amount,
      // })),
    };
    console.log(recipe, typeof recipe)
    createRecipe({ variables: { recipe } })

  }

  return (
    <div className="w-full flex flex-col gap-3 mx-1">
      <div className="flex flex-row dark:text-stone-100 gap-5 overflow-x-auto py-3">
        {userRecipesByID.map(({ id, created_at, name, UserRecipeItemRecipe }) => (
          <div className="transition hover:border-pea-500 min-w-fit p-4 bg-stone-300 dark:bg-zinc-700 rounded-lg shadow w-fit border border-transparent" key={id} onClick={() => {
            UserRecipeItemRecipe.forEach(({ item_recipe_id, amount }) => {
              let itemfound = items.find(
                (item) => item.id === item_recipe_id
              );
              setItem({ type: "ADD_AMOUNT_BY_NUM", item: itemfound, index: amount });
            });
          }}>
            <div className="flex justify-between items-center mb-4 space-x-3">
              <div className="p-1 w-12 h-12 rounded bg-white">
                {name === 'Cage Turret Tower' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 320 336">
                    <path fill="#000000" stroke="none"
                      d="
M188.999878,270.360046
	C156.356644,270.359344 124.213432,270.359039 92.070221,270.357910
	C90.404778,270.357849 88.736168,270.283478 87.074516,270.361115
	C83.252411,270.539673 80.179565,269.327454 80.128532,265.091278
	C80.078117,260.907227 82.974106,259.560974 86.888199,259.625610
	C93.714684,259.738312 100.544380,259.657623 107.372734,259.654572
	C114.560135,259.651367 114.672043,259.669189 115.895233,252.666382
	C119.498161,232.039490 123.009750,211.396622 126.541779,190.757385
	C127.073875,187.648071 126.834709,185.693176 122.656418,185.037125
	C114.558167,183.765625 110.021690,177.456726 109.837852,168.408813
	C109.700020,161.625473 109.810638,154.837112 109.810638,148.705551
	C108.216194,147.294952 107.234886,147.696045 106.251160,147.775787
	C103.103935,148.030945 101.241623,146.370926 100.320671,143.528473
	C99.333206,140.480713 101.175011,138.754974 103.511238,137.552200
	C111.207970,133.589584 118.957466,129.729202 126.697113,125.850327
	C136.223160,121.076149 145.817001,116.432739 155.262314,111.504318
	C158.844727,109.635063 161.930649,109.519524 165.596191,111.392906
	C181.898376,119.724594 198.325180,127.812103 214.683472,136.034576
	C217.733505,137.567673 221.770462,138.697662 220.818329,143.299591
	C219.868866,147.888596 216.150452,148.355576 211.265366,147.307983
	C211.265366,153.928299 211.188065,160.010529 211.291840,166.089661
	C211.364258,170.331863 210.816177,174.386215 208.702957,178.130402
	C206.399734,182.211258 202.661713,184.563660 198.263916,185.068756
	C194.418930,185.510345 193.952835,187.331696 194.473282,190.391495
	C196.897186,204.641968 199.311478,218.894104 201.725815,233.146194
	C202.946472,240.351883 204.279449,247.541473 205.326584,254.772385
	C205.853577,258.411469 207.439972,259.860504 211.235397,259.732361
	C218.721298,259.479614 226.222717,259.729004 233.716095,259.638000
	C237.658203,259.590149 241.070007,260.475647 240.954132,265.102783
	C240.839630,269.675873 237.364456,270.391205 233.467331,270.371368
	C218.811874,270.296844 204.155746,270.353027 188.999878,270.360046
M129.353729,136.889236
	C127.716599,137.706543 126.125862,138.639603 124.433067,139.318008
	C120.428917,140.922729 121.046173,144.303665 121.445503,147.371964
	C121.866478,150.606583 124.701920,149.615662 126.659607,149.620972
	C149.125198,149.682022 171.591019,149.669922 194.056763,149.649521
	C199.317719,149.644745 200.833740,147.585602 199.652634,142.552246
	C199.145111,140.389404 197.419189,139.787491 195.822433,138.984131
	C185.124146,133.601547 174.369125,128.329681 163.729202,122.834686
	C161.357285,121.609711 159.510208,121.747528 157.232788,122.914543
	C148.203705,127.541260 139.091812,132.006348 129.353729,136.889236
M166.499878,174.656662
	C174.317612,174.655945 182.135361,174.662003 189.953079,174.652756
	C199.060333,174.641983 200.323669,173.185272 199.795959,164.159531
	C199.634750,161.402451 198.626572,160.325455 195.886154,160.330826
	C172.266769,160.377045 148.647247,160.351013 125.027779,160.367844
	C123.719139,160.368774 122.386421,160.352432 121.581795,161.810730
	C118.318031,167.726028 122.285934,174.619019 129.072601,174.643372
	C141.214890,174.686951 153.357422,174.656021 166.499878,174.656662
M182.779404,199.407684
	C185.530807,196.756439 183.368820,193.760620 183.318237,190.935318
	C183.241302,186.637390 181.094452,185.112457 176.646057,185.245911
	C165.858978,185.569534 155.055054,185.295731 144.258926,185.385605
	C142.130539,185.403320 138.842438,184.354736 138.563400,187.671738
	C138.218506,191.771744 134.383362,196.170761 139.084503,200.113052
	C145.065811,205.128830 151.113251,210.074463 156.913925,215.292938
	C159.523010,217.640121 161.368790,217.806900 164.060028,215.371368
	C169.967606,210.025085 176.165878,204.999985 182.779404,199.407684
M133.794052,256.121124
	C132.967773,257.060791 131.544113,257.571472 131.559494,259.259705
	C150.934158,259.259705 170.250854,259.259705 190.817352,259.259705
	C180.758026,250.525253 171.624451,242.562271 162.448105,234.648880
	C160.065918,232.594604 158.499420,234.640244 156.905518,236.019760
	C149.354965,242.554642 141.826721,249.115311 133.794052,256.121124
M187.967896,219.418839
	C187.462906,217.034546 187.755692,214.440140 185.777832,211.760208
	C180.323074,216.330338 174.970642,220.814728 169.216125,225.636017
	C176.868027,232.157150 183.838898,238.097916 190.809769,244.038681
	C191.195953,243.778412 191.582123,243.518158 191.968307,243.257904
	C190.692993,235.584946 189.417694,227.911987 187.967896,219.418839
M141.028931,216.489685
	C138.982040,215.001389 137.452469,212.707687 134.480194,211.983719
	C132.404663,222.679123 130.449005,233.009415 129.097260,245.071671
	C137.292328,238.060074 144.285828,232.076553 151.725922,225.710907
	C148.040894,222.535919 144.803497,219.746597 141.028931,216.489685
z"/>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full pointer-events-none p-2"
                    fill="#000000"

                    viewBox="0 0 512 512"
                  >
                    <path d="M207.1 64C207.1 99.35 179.3 128 143.1 128C108.7 128 79.1 99.35 79.1 64C79.1 28.65 108.7 0 143.1 0C179.3 0 207.1 28.65 207.1 64zM143.1 16C117.5 16 95.1 37.49 95.1 64C95.1 90.51 117.5 112 143.1 112C170.5 112 191.1 90.51 191.1 64C191.1 37.49 170.5 16 143.1 16zM15.06 315.8C12.98 319.7 8.129 321.1 4.232 319.1C.3354 316.1-1.136 312.1 .9453 308.2L50.75 214.1C68.83 181.1 104.1 160 142.5 160H145.5C183.9 160 219.2 181.1 237.3 214.1L287.1 308.2C289.1 312.1 287.7 316.1 283.8 319.1C279.9 321.1 275 319.7 272.9 315.8L223.1 222.5C207.8 193.9 178 175.1 145.5 175.1H142.5C110 175.1 80.16 193.9 64.86 222.5L15.06 315.8zM72 280C76.42 280 80 283.6 80 288V476C80 487 88.95 496 99.1 496C111 496 119.1 487 119.1 476V392C119.1 378.7 130.7 368 143.1 368C157.3 368 168 378.7 168 392V476C168 487 176.1 496 187.1 496C199 496 207.1 487 207.1 476V288C207.1 283.6 211.6 280 215.1 280C220.4 280 223.1 283.6 223.1 288V476C223.1 495.9 207.9 512 187.1 512C168.1 512 152 495.9 152 476V392C152 387.6 148.4 384 143.1 384C139.6 384 135.1 387.6 135.1 392V476C135.1 495.9 119.9 512 99.1 512C80.12 512 64 495.9 64 476V288C64 283.6 67.58 280 72 280V280zM438 400L471.9 490.4C475.8 500.8 468.1 512 456.9 512H384C375.2 512 368 504.8 368 496V400H352C334.3 400 320 385.7 320 368V224C320 206.3 334.3 192 352 192H368V160C368 148.2 374.4 137.8 384 132.3V16H376C371.6 16 368 12.42 368 8C368 3.582 371.6 0 376 0H416C424.8 0 432 7.164 432 16V132.3C441.6 137.8 448 148.2 448 160V269.3L464 264V208C464 199.2 471.2 192 480 192H496C504.8 192 512 199.2 512 208V292.5C512 299.4 507.6 305.5 501.1 307.6L448 325.3V352H496C504.8 352 512 359.2 512 368V384C512 392.8 504.8 400 496 400L438 400zM416 141.5V16H400V141.5L392 146.1C387.2 148.9 384 154.1 384 160V384H496V368H432V160C432 154.1 428.8 148.9 423.1 146.1L416 141.5zM456.9 496L420.9 400H384V496H456.9zM448 308.5L496 292.5V208H480V275.5L448 286.2V308.5zM336 224V368C336 376.8 343.2 384 352 384H368V208H352C343.2 208 336 215.2 336 224z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="font-semibold">{name || "Your Custom Recipe"}</h3>
              </div>
            </div>
            <div className="mt-4 inline-block float-right text-xs">
              <span className="relative inline-block mx-1">{new Date(created_at).toLocaleString("en-GB", {
                dateStyle: "long",
              })}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2" className="inline-block w-1 h-1">
                <circle fill="currentColor" r="1" cx="1" cy="1" />
              </svg>
              <span className="relative inline-block mx-1">{new Date(created_at).toLocaleString("en-GB", {
                timeStyle: "short",
              })}</span>
            </div>
          </div>
        ))}
      </div>
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
            onClick={clear}
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

          <div className="relative max-h-screen w-fit max-w-[14rem] overflow-y-auto rounded-lg border border-gray-200 bg-stone-200 px-3 py-4 text-gray-900 will-change-scroll dark:border-zinc-700 dark:bg-zinc-600 dark:text-white">
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
              {Object.entries(categories).map(
                ([category, categoryitems]: any) => (
                  <li key={category}>
                    <details open={Object.values(categories).length === 1}>
                      <summary className="flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700">
                        <svg
                          className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                        </svg>
                        <span className="ml-2">{category}</span>
                      </summary>

                      <ul className="py-2">
                        {Object.values(categories).length === 1 ||
                          categoryitems.every((item, i, a) => {
                            return !item.type;
                          })
                          ? categoryitems.map((item) => (
                            <li key={`${category}-${item.type}-${item.id}`}>
                              <button
                                type="button"
                                className="flex w-full items-center rounded-lg p-2 text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700"
                                onClick={() => onAdd({ itemId: item.id })}
                              >
                                <img
                                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${item.image}`}
                                  alt={item.name}
                                  className="mr-2 h-5 w-5"
                                />
                                {item.name}
                              </button>
                            </li>
                          ))
                          : Object.entries(groupBy(categoryitems, "type")).map(
                            ([type, typeitems]: any) => (
                              <li key={`${category}-${type}`}>
                                <details className="">
                                  <summary className="flex w-full items-center justify-between rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700">
                                    {/* <svg
                                    aria-hidden="true"
                                    className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                                  </svg> */}
                                    <span className="ml-2">{type}</span>
                                    <span className="text-pea-800 dark:bg-pea-900 dark:text-pea-300 bg-pea-100 ml-2 inline-flex h-3 w-3 items-center justify-center rounded-full p-3 text-sm">
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
                                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${item.image}`}
                                            alt={item.name}
                                            className="mr-2 h-5 w-5"
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
                )
              )}
            </ul>
          </div>
        </div>
        <div className="w-full">
          <Table
            rows={mergeItemRecipe(viewBaseMaterials, items, ...item).slice(0, 1)}
            className="animate-fade-in"
            toolbar={[
              <ToggleButton
                className="ml-2"
                offLabel="Materials"
                onLabel="Base materials"
                checked={viewBaseMaterials}
                onChange={toggleBaseMaterials}
              />,
              <button
                data-testid="turrettowerbtn"
                type="button"
                // onClick={() => generatePDF()}
                title="generate pedo-fil"
                className="rw-button rw-button-gray p-2"
              >
                PDF
              </button>,
            ]}
            columns={[
              ...mergeItemRecipe(viewBaseMaterials, items, ...item).map(
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
                          src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${Item_ItemRecipe_crafted_item_idToItem.image}`}
                          className="h-6 w-6"
                        />
                        <span className="text-sm">{formatNumber(amount)}</span>
                      </div>
                    );
                  },
                })
              ),
            ]}
          />

          <ToggleButton
            offLabel="Mortar And Pestle"
            onLabel="Chemistry Bench"
            checked={craftingStations.includes(607)}
            onChange={(e) => {
              if (e.target.checked) {
                return setCraftingStations((prev) => [
                  ...prev.filter((h) => h !== 107),
                  607,
                ]);
              }
              return setCraftingStations((prev) => [
                ...prev.filter((h) => h !== 607),
                107,
              ]);
            }}
          />

          <ToggleButton
            offLabel="Refining Forge"
            onLabel="Industrial Forge"
            checked={craftingStations.includes(600)}
            onChange={(e) => {
              if (e.target.checked) {
                return setCraftingStations((prev) => [
                  ...prev.filter((h) => h !== 125),
                  600,
                ]);
              }
              return setCraftingStations((prev) => [
                ...prev.filter((h) => h !== 600),
                125,
              ]);
            }}
          />

          <Table
            rows={item}
            className="animate-fade-in my-4 whitespace-nowrap"
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
                        setItem({ type: "REMOVE", index: rowIndex });
                      }}
                      className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-red-500"
                      title={`Remove ${name}`}
                    >
                      <img
                        className="h-8 w-8"
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${image}`}
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
                      defaultValue={value}
                      // value={value}
                      className="rw-input w-16 p-3 text-center"
                      onChange={(e) => {
                        debounce(() => {
                          onChangeAmount(rowIndex, parseInt(e.target.value) > 0 ? e.target.value : 1);
                          if (parseInt(e.target.value) < 1) {
                            e.target.value = parseInt(e.target.value) > 0 ? e.target.value : "1";
                          }
                        }, 300)();
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
                numeric: false,
                className: "w-0 text-center",
                valueFormatter: ({ row, value }) => {
                  return `${timeFormatL(value * row.amount, true)}`;
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
                          Item_ItemRecipe_crafted_item_idToItem: { id, name, image },
                          amount,
                        },
                        i
                      ) => (
                        <div
                          className="inline-flex min-w-[3rem] flex-col items-center justify-center min-h-full"
                          id={`${id}-${i * Math.random()}${i}`}
                          key={`${id}-${i * Math.random()}${i}`}
                        >
                          <img
                            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${image}`}
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
          {/* {loading && (
          <div className="m-16 flex items-center justify-center text-white">
            <p className="mr-4">LOADING</p>
            <div className="dot-revolution"></div>
          </div>
        )} */}
        </div>
      </Form>
    </div>
  );
};
