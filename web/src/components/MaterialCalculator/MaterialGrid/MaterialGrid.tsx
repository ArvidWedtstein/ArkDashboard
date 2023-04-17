import {
  CheckboxField,
  FieldError,
  Form,
  FormError,
  ImageField,
  Label,
  RWGqlError,
} from "@redwoodjs/forms";
import { useCallback, useMemo, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import Lookup from "src/components/Util/Lookup/Lookup";
import { getBaseMaterials } from "src/lib/formatters";
import debounce from "lodash.debounce";
import Table from "src/components/Util/Table/Table";
interface MaterialGridProps {
  items: any;
  error?: RWGqlError;
}
export const MaterialGrid = ({ error, items: arkitems }: MaterialGridProps) => {
  const items = useMemo(() => {
    return arkitems.map((v) => ({ ...v, amount: 1 * v.yields }));
  }, []);
  const formMethods = useForm();

  const reducer = (state, action) => {
    switch (action.type) {
      case "ADD_AMOUNT_BY_NUM": {
        let itemIndex = state.findIndex((item) => item.id === action.item.id);

        if (itemIndex !== -1) {
          return state.map((item, i) => {
            if (i === itemIndex) {
              return { ...item, amount: item.amount + action.index };
            }
            return item;
          });
        }
        return [...state, { ...action.item, amount: action.index }];
      }
      case "CHANGE_AMOUNT": {
        let itemIndex = action.item;
        if (itemIndex !== -1) {
          return state.map((item, i) => {
            if (i == itemIndex) {
              return { ...item, amount: action.index };
            }
            return item;
          });
        }
        return [...state, { ...action.item, amount: action.index }];
      }
      case "ADD_AMOUNT": {
        return state.map((item, i) => {
          if (i === action.index) {
            return { ...item, amount: item.amount + 1 * item.yields };
          }
          return item;
        });
      }
      case "REMOVE_AMOUNT": {
        return state.map((item, i) => {
          if (i === action.index) {
            return { ...item, amount: item.amount - 1 * item.yields };
          }
          return item;
        });
      }
      case "ADD": {
        const itemIndex = state.findIndex(
          (item) => item.name.toLowerCase() === action.item.name.toLowerCase()
        );
        if (itemIndex !== -1) {
          return state.map((item, i) => {
            if (i === itemIndex) {
              return { ...item, amount: item.amount + 1 * item.yields };
            }
            return item;
          });
        }
        return [...state, action.item];
      }
      case "REMOVE": {
        return state.filter((_, i) => i !== action.index);
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

  const onAdd = (data) => {
    // TODO: optimize this. items gets looped through twice
    let itemfound = items.find(
      (item) => item.name.toLowerCase() === data.itemName.toLowerCase()
    );
    formMethods.reset();
    if (itemfound) setItem({ type: "ADD", item: itemfound });
  };

  const onRemove = (index) => {
    setItem({ type: "REMOVE", index: index });
  };

  const onAddAmount = (index) => {
    setItem({ type: "ADD_AMOUNT", index: index });
  };
  const onRemoveAmount = (index) => {
    setItem({ type: "REMOVE_AMOUNT", index: index });
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
    for (const [key, value] of Object.entries(towerItems)) {
      let itemfound = items.find(
        (item) => parseInt(item.id.toString()) === parseInt(key)
      );
      if (itemfound) {
        setItem({ type: "ADD_AMOUNT_BY_NUM", item: itemfound, index: value });
      }
    }
  }, []);

  const mergeItemRecipe = useCallback(getBaseMaterials, [item]);

  const clear = () => {
    setItem({ type: "RESET" });
  };

  const [viewBaseMaterials, setViewBaseMaterials] = useState(false);
  const toggleBaseMaterials = useCallback(
    (e) => {
      setViewBaseMaterials(e.currentTarget.checked);
    },
    [viewBaseMaterials]
  );

  return (
    <Form onSubmit={onAdd} error={error}>
      <FormError
        error={error}
        wrapperClassName="rw-form-error-wrapper"
        titleClassName="rw-form-error-title"
        listClassName="rw-form-error-list"
      />
      <Label
        name="itemName"
        className="rw-label my-3"
        errorClassName="rw-label rw-label-error"
      >
        Name
      </Label>

      <div className="relative flex flex-row space-x-3">
        <Lookup
          options={items.map((item) => {
            return {
              label: item.name,
              value: item.id,
              image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${item.image}`,
            };
          })}
          group={"category"}
          search={true}
          name="itemName"
          onSelect={(e) => onAdd({ itemName: e.name })}
        />
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            data-testid="turrettowerbtn"
            type="button"
            onClick={addTurretTower}
            className="rw-button rw-button-green inline-flex items-center rounded-none first:rounded-l-lg last:rounded-r-lg"
          >
            {/*py-2 px-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-secondary dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white*/}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4 fill-current stroke-current"
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              <path d="M207.1 64C207.1 99.35 179.3 128 143.1 128C108.7 128 79.1 99.35 79.1 64C79.1 28.65 108.7 0 143.1 0C179.3 0 207.1 28.65 207.1 64zM143.1 16C117.5 16 95.1 37.49 95.1 64C95.1 90.51 117.5 112 143.1 112C170.5 112 191.1 90.51 191.1 64C191.1 37.49 170.5 16 143.1 16zM15.06 315.8C12.98 319.7 8.129 321.1 4.232 319.1C.3354 316.1-1.136 312.1 .9453 308.2L50.75 214.1C68.83 181.1 104.1 160 142.5 160H145.5C183.9 160 219.2 181.1 237.3 214.1L287.1 308.2C289.1 312.1 287.7 316.1 283.8 319.1C279.9 321.1 275 319.7 272.9 315.8L223.1 222.5C207.8 193.9 178 175.1 145.5 175.1H142.5C110 175.1 80.16 193.9 64.86 222.5L15.06 315.8zM72 280C76.42 280 80 283.6 80 288V476C80 487 88.95 496 99.1 496C111 496 119.1 487 119.1 476V392C119.1 378.7 130.7 368 143.1 368C157.3 368 168 378.7 168 392V476C168 487 176.1 496 187.1 496C199 496 207.1 487 207.1 476V288C207.1 283.6 211.6 280 215.1 280C220.4 280 223.1 283.6 223.1 288V476C223.1 495.9 207.9 512 187.1 512C168.1 512 152 495.9 152 476V392C152 387.6 148.4 384 143.1 384C139.6 384 135.1 387.6 135.1 392V476C135.1 495.9 119.9 512 99.1 512C80.12 512 64 495.9 64 476V288C64 283.6 67.58 280 72 280V280zM438 400L471.9 490.4C475.8 500.8 468.1 512 456.9 512H384C375.2 512 368 504.8 368 496V400H352C334.3 400 320 385.7 320 368V224C320 206.3 334.3 192 352 192H368V160C368 148.2 374.4 137.8 384 132.3V16H376C371.6 16 368 12.42 368 8C368 3.582 371.6 0 376 0H416C424.8 0 432 7.164 432 16V132.3C441.6 137.8 448 148.2 448 160V269.3L464 264V208C464 199.2 471.2 192 480 192H496C504.8 192 512 199.2 512 208V292.5C512 299.4 507.6 305.5 501.1 307.6L448 325.3V352H496C504.8 352 512 359.2 512 368V384C512 392.8 504.8 400 496 400L438 400zM416 141.5V16H400V141.5L392 146.1C387.2 148.9 384 154.1 384 160V384H496V368H432V160C432 154.1 428.8 148.9 423.1 146.1L416 141.5zM456.9 496L420.9 400H384V496H456.9zM448 308.5L496 292.5V208H480V275.5L448 286.2V308.5zM336 224V368C336 376.8 343.2 384 352 384H368V208H352C343.2 208 336 215.2 336 224z" />
            </svg>
            Turret Tower
          </button>
          <button
            type="button"
            onClick={clear}
            className="rw-button rw-button-red inline-flex items-center rounded-none first:rounded-l-lg last:rounded-r-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="mr-2 h-4 w-4 fill-current"
              fill="currentColor"
              viewBox="0 0 352 512"
            >
              <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
            </svg>
            Clear
          </button>
        </div>
      </div>
      <FieldError name="itemName" className="rw-field-error" />

      {item.length > 0 && (
        <>
          <Table
            vertical={true}
            header={false}
            rows={mergeItemRecipe(
              viewBaseMaterials,
              ...item.map((i) => ({ ...i, itemId: i.id }))
            )}
            // rows={mergeItemRecipe(
            //   viewBaseMaterials,
            //   ...item.map((i) => ({ ...i, itemId: i.id }))
            // )}
            className="animate-fade-in my-4"
            caption={{
              title: "Item",
              content: (
                <div className="flex items-center">
                  <CheckboxField
                    name="flexCheckDefault"
                    className="rw-input inline-block"
                    onChange={toggleBaseMaterials}
                  />
                  <label className="inline-block" htmlFor="flexCheckDefault">
                    Base materials
                  </label>
                </div>
              ),
            }}
            columns={[
              {
                field: "name",
                label: "Name",
                className: "text-center",
              },
              {
                field: "amount",
                label: "Amount",
                className: "text-center",
                numeric: true,
                renderCell: ({ value, row }) => {
                  return (
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${row.image}`}
                        className="h-6 w-6"
                      />
                      <span className="text-sm">{value}</span>
                      <span className="sr-only">{value}</span>
                    </div>
                  );
                },
              },
            ]}
          />
          <Table
            rows={item}
            className="animate-fade-in my-4 whitespace-nowrap"
            summary={true}
            hover={true}
            columns={[
              {
                field: "name",
                label: "Name",
                className: "w-0",
                renderCell: ({ row, rowIndex }) => {
                  return (
                    <button
                      type="button"
                      onClick={() => onRemove(rowIndex)}
                      className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-red-500"
                    >
                      <ImageField
                        className="h-8 w-8"
                        name="itemimage"
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${row.image}`}
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
                renderCell: ({ row, rowIndex }) => {
                  return (
                    <div
                      className="flex flex-row items-center"
                      key={`${row.id}+${Math.random()}`}
                    >
                      <button
                        type="button"
                        className="relative mx-2 h-8 w-8 rounded-full border border-black text-lg font-semibold text-black hover:bg-white hover:text-black dark:border-white dark:text-white"
                        onClick={() => onRemoveAmount(rowIndex)}
                      >
                        -
                      </button>
                      {/* <p
                        defaultValue={row.amount}
                        className="rw-input w-16 p-3 text-center"
                      >
                        {row.amount}
                      </p> */}
                      <input
                        defaultValue={row.amount}
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
                  );
                },
              },
              // {
              //   field: "crafting_time",
              //   label: "Time",
              //   numeric: false,
              //   className: "w-0 text-center",
              //   valueFormatter: ({ value, row }) => {
              //     return value * row.amount + "s";
              //   },
              // },
              {
                field: "ItemRecipe_ItemRecipe_crafted_item_idToItem",
                label: "Ingredients",
                numeric: false,
                className:
                  "text-center flex flex-row justify-start items-center",
                renderCell: ({ row, value }) => {
                  return mergeItemRecipe(false, {
                    ...row,
                  })
                    .sort((a, b) => a.id - b.id)
                    .map((itm, i) => (
                      <div
                        className="min-w-16 ml-2 flex w-10 flex-col items-center justify-center"
                        id={`${itm.id}-${i * Math.random()}${i}`}
                        key={`${itm.id}-${i * Math.random()}${i}`}
                      >
                        <img
                          src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${itm.image}`}
                          className="h-6 w-6"
                          title={itm.name}
                          alt={itm.name}
                        />
                        <span className="text-sm text-black dark:text-white">
                          {itm.amount}
                        </span>
                      </div>
                    ));
                },
              },
            ]}
          />
        </>
      )}
    </Form>
  );
};
