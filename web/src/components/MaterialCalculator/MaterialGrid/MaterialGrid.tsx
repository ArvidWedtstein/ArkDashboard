import {
  CheckboxField,
  Form,
  FormError,
  ImageField,
  Label,
  RWGqlError,
  SearchField,
} from "@redwoodjs/forms";
import { useCallback, useMemo, useReducer, useRef, useState } from "react";

import {
  formatNumber,
  getBaseMaterials,
  groupBy,
  timeFormatL,
  timeTag,
} from "src/lib/formatters";
import debounce from "lodash.debounce";
import Table from "src/components/Util/Table/Table";
import ToggleButton from "src/components/Util/ToggleButton/ToggleButton";

interface MaterialGridProps {
  itemRecs: any[];
  error?: RWGqlError;
}

export const MaterialGrid = ({ error, itemRecs }: MaterialGridProps) => {
  const [search, setSearch] = useState("");
  const [craftingStations, setCraftingStations] = useState<any>([107, 125]);
  const ammoRefCurrent = useRef(null);

  const [viewBaseMaterials, setViewBaseMaterials] = useState(false);
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
            amount: (action.index || 1) * yields,
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
          (item) => parseInt(item.id) === parseInt(action.item.id)
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
    const craftedItems = groupBy(itemRecs, "crafted_item_id");
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
        .map((f) => f.Item_ItemRec_crafted_item_idToItem)
        .filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        ),
      "category"
    );
  }, [items, search]);

  const onAdd = ({ itemId }) => {
    if (!itemId) return;
    let item = items.find(
      (item) => parseInt(item.crafted_item_id) === parseInt(itemId)
    );

    // loadItem({ variables: { item_recipe_id: [itm.recipe_id] } });
    setItem({ type: "ADD", item: item });
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

  const addTurretTower = useCallback(() => {
    // let turretTower = {
    //   size: 14 * 14,
    //   cage_height: 22,
    //   top_turret_height: 7,
    //   total_height: 22 + 7,
    //   heavy_turrets: 60,
    //   tek_turrets: 65,
    //   hatchframe_layers: 3,
    //   turret_ring_levels: [
    //     {
    //       height: 10,
    //       hasGenerator: false,
    //     },
    //     {
    //       height: 14,
    //       hasGenerator: true,
    //     },
    //     {
    //       height: 18,
    //       hasGenerator: false,
    //     },
    //     {
    //       height: 29,
    //       hasGenerator: true,
    //     }
    //   ] // 13, 16, 19, 22?
    // }
    // const amountCenterDoorframes = turretTower.total_height * 8
    // const amountOutsideDoorframes = (Math.sqrt(turretTower.size) * 4) * turretTower.cage_height
    // const amountGiantHatchframes = (turretTower.size / 4) * (turretTower.hatchframe_layers + 1) // +1 for the top of cage
    // const amountCenterHatchframes = 8 * turretTower.turret_ring_levels.length
    // const amountTekGen = turretTower.turret_ring_levels.filter((f) => f.hasGenerator === true).length
    // let towerItems = {
    //   172: turretTower.size, // Metal Foundation
    //   621: amountGiantHatchframes + amountCenterHatchframes + amountTekGen, // Giant Metal Hatchframe
    //   622: amountTekGen, // Giant Metal Hatchframe for Tek Generator
    //   179: amountTekGen * 8, // Metal Walls to protect Tek Generator
    //   168: amountTekGen * 3, // Metal Ceiling to protect Tek Generator
    //   169: amountTekGen, // Metal Hatchframe to protect Tek Generator
    //   178: amountTekGen, // Metal Trapdoor to protect Tek Generator
    //   770: amountOutsideDoorframes + amountCenterDoorframes, // Metal Double Doorframe
    //   686: turretTower.heavy_turrets, // Heavy Turret
    //   681: turretTower.tek_turrets, // Tek Turret
    //   676: amountTekGen, // Tek Generator
    // }
    let towerItems = {
      168: 14,
      169: 2,
      172: 196,
      178: 2,
      179: 16,
      621: 230,
      622: 2,
      676: 2,
      681: 65,
      686: 60,
      770: 1464,
    };

    if (ammoRefCurrent.current.value && ammoRefCurrent.current.value > 0) {
      towerItems[246] =
        parseInt(ammoRefCurrent.current.value) * towerItems[686];
    }

    for (const [key, value] of Object.entries(towerItems)) {
      let itemfound = items.find(
        (item) => parseInt(item.crafted_item_id) === parseInt(key)
      );
      if (itemfound) {
        setItem({ type: "ADD_AMOUNT_BY_NUM", item: itemfound, index: value });
      }
    }
  }, []);

  const mergeItemRecipe = useCallback(getBaseMaterials, [
    item,
    craftingStations,
  ]);

  const clear = () => {
    setItem({ type: "RESET" });
  };

  return (
    <Form
      onSubmit={onAdd}
      // config={{ mode: "onBlur" }}
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
        <div className="rw-button-group !m-0">
          <input
            name="ammoperturret"
            className="rw-input w-32 min-w-0"
            placeholder="Ammo per turret"
            title="Ammo Per Turret"
            ref={ammoRefCurrent}
          />
          <button
            data-testid="turrettowerbtn"
            type="button"
            onClick={addTurretTower}
            className="rw-button rw-button-gray p-2"
          >
            Turret Tower
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="rw-button-icon pointer-events-none"
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              <path d="M207.1 64C207.1 99.35 179.3 128 143.1 128C108.7 128 79.1 99.35 79.1 64C79.1 28.65 108.7 0 143.1 0C179.3 0 207.1 28.65 207.1 64zM143.1 16C117.5 16 95.1 37.49 95.1 64C95.1 90.51 117.5 112 143.1 112C170.5 112 191.1 90.51 191.1 64C191.1 37.49 170.5 16 143.1 16zM15.06 315.8C12.98 319.7 8.129 321.1 4.232 319.1C.3354 316.1-1.136 312.1 .9453 308.2L50.75 214.1C68.83 181.1 104.1 160 142.5 160H145.5C183.9 160 219.2 181.1 237.3 214.1L287.1 308.2C289.1 312.1 287.7 316.1 283.8 319.1C279.9 321.1 275 319.7 272.9 315.8L223.1 222.5C207.8 193.9 178 175.1 145.5 175.1H142.5C110 175.1 80.16 193.9 64.86 222.5L15.06 315.8zM72 280C76.42 280 80 283.6 80 288V476C80 487 88.95 496 99.1 496C111 496 119.1 487 119.1 476V392C119.1 378.7 130.7 368 143.1 368C157.3 368 168 378.7 168 392V476C168 487 176.1 496 187.1 496C199 496 207.1 487 207.1 476V288C207.1 283.6 211.6 280 215.1 280C220.4 280 223.1 283.6 223.1 288V476C223.1 495.9 207.9 512 187.1 512C168.1 512 152 495.9 152 476V392C152 387.6 148.4 384 143.1 384C139.6 384 135.1 387.6 135.1 392V476C135.1 495.9 119.9 512 99.1 512C80.12 512 64 495.9 64 476V288C64 283.6 67.58 280 72 280V280zM438 400L471.9 490.4C475.8 500.8 468.1 512 456.9 512H384C375.2 512 368 504.8 368 496V400H352C334.3 400 320 385.7 320 368V224C320 206.3 334.3 192 352 192H368V160C368 148.2 374.4 137.8 384 132.3V16H376C371.6 16 368 12.42 368 8C368 3.582 371.6 0 376 0H416C424.8 0 432 7.164 432 16V132.3C441.6 137.8 448 148.2 448 160V269.3L464 264V208C464 199.2 471.2 192 480 192H496C504.8 192 512 199.2 512 208V292.5C512 299.4 507.6 305.5 501.1 307.6L448 325.3V352H496C504.8 352 512 359.2 512 368V384C512 392.8 504.8 400 496 400L438 400zM416 141.5V16H400V141.5L392 146.1C387.2 148.9 384 154.1 384 160V384H496V368H432V160C432 154.1 428.8 148.9 423.1 146.1L416 141.5zM456.9 496L420.9 400H384V496H456.9zM448 308.5L496 292.5V208H480V275.5L448 286.2V308.5zM336 224V368C336 376.8 343.2 384 352 384H368V208H352C343.2 208 336 215.2 336 224z" />
            </svg>
          </button>
        </div>

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

        <div className="relative max-h-[36rem] w-fit max-w-[14rem] overflow-y-auto rounded-lg border border-gray-200 bg-stone-200 px-3 py-4 text-gray-900 will-change-scroll dark:border-zinc-700 dark:bg-zinc-600 dark:text-white">
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
          header={true}
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
              title="pedo-fil"
              className="rw-button rw-button-gray p-2"
            >
              PDF
            </button>,
          ]}
          columns={[
            ...mergeItemRecipe(viewBaseMaterials, items, ...item).map(
              ({ Item_ItemRec_crafted_item_idToItem, amount }) => ({
                field: Item_ItemRec_crafted_item_idToItem.id,
                label: Item_ItemRec_crafted_item_idToItem.name,
                className: "w-0 text-center",
                renderCell: ({ rowIndex }) => {
                  return (
                    <div
                      className="flex flex-col items-center justify-center"
                      key={`${Item_ItemRec_crafted_item_idToItem.id}-${rowIndex}`}
                    >
                      <img
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${Item_ItemRec_crafted_item_idToItem.image}`}
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
          summary={true}
          hover={false}
          columns={[
            {
              field: "Item_ItemRec_crafted_item_idToItem",
              label: "Name",
              className: "w-0",
              renderCell: ({ rowIndex, value: { name, image } }) => {
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
              label: "Amount",
              numeric: true,
              className: "w-0 text-center",
              renderCell: ({ rowIndex, value }) => (
                <div
                  className="flex flex-row items-center"
                  key={`${rowIndex}+${Math.random()}`}
                >
                  <button
                    type="button"
                    className="relative mx-2 h-8 w-8 rounded-full border border-black text-lg font-semibold text-black hover:bg-white hover:text-black dark:border-white dark:text-white"
                    onClick={() => onRemoveAmount(rowIndex)}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    defaultValue={value}
                    className="rw-input w-16 p-3 text-center"
                    onChange={(e) => {
                      onChangeAmount(rowIndex, e.target.value);
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
              label: "Time pr item",
              numeric: false,
              className: "w-0 text-center",
              valueFormatter: ({ row, value }) => {
                return `${timeFormatL(value * row.amount, true)}`;
              },
            },
            {
              field: "Item_ItemRec_crafted_item_idToItem",
              label: "Ingredients",
              numeric: false,
              className: "text-center flex flex-row justify-start items-center",
              renderCell: ({ row }) => {
                return mergeItemRecipe(false, items, {
                  ...row,
                })
                  .sort(
                    (a, b) =>
                      a.Item_ItemRec_crafted_item_idToItem.id -
                      b.Item_ItemRec_crafted_item_idToItem.id
                  )
                  .map(
                    (
                      {
                        Item_ItemRec_crafted_item_idToItem: { id, name, image },
                        amount,
                      },
                      i
                    ) => (
                      <div
                        className="min-w-16 ml-2 flex min-w-[3rem] flex-col items-center justify-center"
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
  );
};
