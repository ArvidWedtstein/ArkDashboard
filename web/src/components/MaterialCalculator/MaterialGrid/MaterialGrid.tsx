import { FieldError, Form, FormError, ImageField, Label, RWGqlError } from "@redwoodjs/forms";
import { useCallback, useMemo, useReducer } from "react";
import { useForm } from 'react-hook-form'
import Lookup from "src/components/Util/Lookup/Lookup";
import { calcItemCost, mergeRecipe } from 'src/lib/formatters'
import Table, { Taybul } from "src/components/Util/Table/Table";
import arkitems from '../../../../public/arkitems.json'
import LineChart from "src/components/Util/LineChart/LineChart";
interface MaterialGridProps {
  // items: any;
  error?: RWGqlError;
}
export const MaterialGrid = ({ error }: MaterialGridProps) => {
  let { itemStats, items: itemsark } = arkitems;
  const items = useMemo(() => {
    return itemsark.map(v => ({ ...v, amount: 1 }))
  }, [])
  const formMethods = useForm()

  const reducer = (state, action) => {
    switch (action.type) {
      case 'ADD_AMOUNT_BY_NUM':
        action.item.amount = action.index
        if (state.find((item) => item.itemId === action.item.itemId)) {
          return state.map((item, i) => {
            if (item.itemId === action.item.itemId) {
              return { ...item, amount: item.amount + action.index };
            } else {
              return item;
            }
          });
        }
        return [
          ...state,
          action.item
        ];
      case "ADD_AMOUNT":

        return state.map((item, i) => {
          if (i === action.index) {
            return { ...item, amount: item.amount + 1 };
          } else {
            return item;
          }
        });
      case "REMOVE_AMOUNT":
        return state.map((item, i) => {
          if (i === action.index) {
            return { ...item, amount: item.amount - 1 };
          } else {
            return item;
          }
        });
      case "ADD":
        // TODO: Check if item already exists in state, if it does add to amount
        return [
          ...state,
          action.item
        ];
      case "REMOVE":
        return state.filter((_, i) => i !== action.index)
      case "RESET":
        return []
      default:
        return state;
    }
  };

  let [item, setItem] = useReducer(reducer, [])

  const onAdd = (data) => {
    let itemfound = items.find((item) => item.name.toLowerCase() === data.itemName.toLowerCase())
    formMethods.reset()
    setItem({ type: "ADD", item: itemfound });
  }

  const onRemove = (index) => {
    setItem({ type: "REMOVE", index: index });
  }

  const onAddAmount = (index) => {
    setItem({ type: "ADD_AMOUNT", index: index });
  }
  const onRemoveAmount = (index) => {
    setItem({ type: "REMOVE_AMOUNT", index: index });
  }

  const turretTower = (() => {
    let turretTower = {
      size: 14 * 14,
      cage_height: 22,
      top_turret_height: 7,
      total_height: 22 + 7,
      heavy_turrets: 60,
      tek_turrets: 65,
      hatchframe_layers: 3,
      turret_ring_levels: [
        {
          height: 10,
          hasGenerator: false,
        },
        {
          height: 14,
          hasGenerator: true,
        },
        {
          height: 18,
          hasGenerator: false,
        },
        {
          height: 29,
          hasGenerator: true,
        }
      ] // 13, 16, 19, 22?
    }
    const amountCenterDoorframes = turretTower.total_height * 8
    const amountOutsideDoorframes = (Math.sqrt(turretTower.size) * 4) * turretTower.cage_height
    const amountGiantHatchframes = (turretTower.size / 4) * (turretTower.hatchframe_layers + 1) // +1 for the top of cage
    const amountCenterHatchframes = 8 * turretTower.turret_ring_levels.length
    const amountTekGen = turretTower.turret_ring_levels.filter((f) => f.hasGenerator === true).length
    let towerItems = {
      172: turretTower.size, // Metal Foundation
      621: amountGiantHatchframes + amountCenterHatchframes + amountTekGen, // Giant Metal Hatchframe
      622: amountTekGen, // Giant Metal Hatchframe for Tek Generator
      179: amountTekGen * 8, // Metal Walls to protect Tek Generator
      168: amountTekGen * 3, // Metal Ceiling to protect Tek Generator
      169: amountTekGen, // Metal Hatchframe to protect Tek Generator
      178: amountTekGen, // Metal Trapdoor to protect Tek Generator
      770: amountOutsideDoorframes + amountCenterDoorframes, // Metal Double Doorframe
      686: turretTower.heavy_turrets, // Heavy Turret
      681: turretTower.tek_turrets, // Tek Turret
      676: amountTekGen, // Tek Generator
    }

    for (const [key, value] of Object.entries(towerItems)) {
      let itemfound = items.find((item) => parseInt(item.itemId.toString()) === parseInt(key));
      if (itemfound) {
        setItem({ type: "ADD_AMOUNT_BY_NUM", item: itemfound, index: value });
      }
    }
  });

  const addTurretTower = useCallback(turretTower, [])
  const mergeItemRecipe = useCallback(mergeRecipe, [item])
  const clear = (() => {
    setItem({ type: "RESET" });
  })

  return (
    <>
      <div className="">
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
            {/* <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div> */}
            <Lookup items={items} search={true} name="itemName" onChange={(e) => onAdd({ itemName: e.name })} />
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button data-testid="turrettowerbtn" type="button" onClick={addTurretTower} className="first:rounded-l-lg last:rounded-r-lg rounded-none inline-flex items-center rw-button rw-button-green"> {/*py-2 px-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-secondary dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white*/}
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 w-4 h-4 fill-current stroke-current" fill="currentColor" viewBox="0 0 512 512"><path d="M207.1 64C207.1 99.35 179.3 128 143.1 128C108.7 128 79.1 99.35 79.1 64C79.1 28.65 108.7 0 143.1 0C179.3 0 207.1 28.65 207.1 64zM143.1 16C117.5 16 95.1 37.49 95.1 64C95.1 90.51 117.5 112 143.1 112C170.5 112 191.1 90.51 191.1 64C191.1 37.49 170.5 16 143.1 16zM15.06 315.8C12.98 319.7 8.129 321.1 4.232 319.1C.3354 316.1-1.136 312.1 .9453 308.2L50.75 214.1C68.83 181.1 104.1 160 142.5 160H145.5C183.9 160 219.2 181.1 237.3 214.1L287.1 308.2C289.1 312.1 287.7 316.1 283.8 319.1C279.9 321.1 275 319.7 272.9 315.8L223.1 222.5C207.8 193.9 178 175.1 145.5 175.1H142.5C110 175.1 80.16 193.9 64.86 222.5L15.06 315.8zM72 280C76.42 280 80 283.6 80 288V476C80 487 88.95 496 99.1 496C111 496 119.1 487 119.1 476V392C119.1 378.7 130.7 368 143.1 368C157.3 368 168 378.7 168 392V476C168 487 176.1 496 187.1 496C199 496 207.1 487 207.1 476V288C207.1 283.6 211.6 280 215.1 280C220.4 280 223.1 283.6 223.1 288V476C223.1 495.9 207.9 512 187.1 512C168.1 512 152 495.9 152 476V392C152 387.6 148.4 384 143.1 384C139.6 384 135.1 387.6 135.1 392V476C135.1 495.9 119.9 512 99.1 512C80.12 512 64 495.9 64 476V288C64 283.6 67.58 280 72 280V280zM438 400L471.9 490.4C475.8 500.8 468.1 512 456.9 512H384C375.2 512 368 504.8 368 496V400H352C334.3 400 320 385.7 320 368V224C320 206.3 334.3 192 352 192H368V160C368 148.2 374.4 137.8 384 132.3V16H376C371.6 16 368 12.42 368 8C368 3.582 371.6 0 376 0H416C424.8 0 432 7.164 432 16V132.3C441.6 137.8 448 148.2 448 160V269.3L464 264V208C464 199.2 471.2 192 480 192H496C504.8 192 512 199.2 512 208V292.5C512 299.4 507.6 305.5 501.1 307.6L448 325.3V352H496C504.8 352 512 359.2 512 368V384C512 392.8 504.8 400 496 400L438 400zM416 141.5V16H400V141.5L392 146.1C387.2 148.9 384 154.1 384 160V384H496V368H432V160C432 154.1 428.8 148.9 423.1 146.1L416 141.5zM456.9 496L420.9 400H384V496H456.9zM448 308.5L496 292.5V208H480V275.5L448 286.2V308.5zM336 224V368C336 376.8 343.2 384 352 384H368V208H352C343.2 208 336 215.2 336 224z" /></svg>
                Turret Tower
              </button>
              <button type="button" onClick={clear} className="first:rounded-l-lg last:rounded-r-lg rounded-none inline-flex items-center rw-button rw-button-red">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="mr-2 w-4 h-4 fill-current" fill="currentColor" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" /></svg>
                Clear
              </button>
            </div>

          </div>
          <FieldError name="itemName" className="rw-field-error" />
          {/* TODO: Fix heavy turret cost calculation */}
          {item.length > 0 &&
            <LineChart items={Object.entries(mergeItemRecipe(...item)).map(([key, value], i) => {
              return {
                name: items.find((itm) => parseInt(itm.itemId.toString()) === parseInt(key)).name,
                percent: Math.round(((100 * value) / Object.values(mergeItemRecipe(...item)).reduce((a, b) => a + b, 0) + Number.EPSILON) * 100) / 100,
                colorHEX: items.find((itm) => parseInt(itm.itemId.toString()) === parseInt(key)).color
              }
            })} />
          }
          {item.length > 0 &&
            <Taybul
              rows={[mergeItemRecipe(...item)]}
              columns={[
                {
                  field: 'name',
                  label: 'Item',
                }
              ]}
            />
          }
          {item.length > 0 &&
            <Table
              data={[mergeItemRecipe(...item)]}
              tableOptions={{
                header: false
              }}
              renderCell={({ id, amount }) =>
                <div className="flex flex-col justify-center items-center ml-2">
                  <img src={`https://www.arkresourcecalculator.com/assets/images/80px-${items.find((itm) => parseInt(itm.itemId.toString()) === parseInt(id)).image}`} className="w-6 h-6" />
                  <span className="text-sm">{amount}</span>
                </div>
              }
            />
          }
          <ul className="py-4 space-y-2">
            {item.map((item, i) => (
              <li className="" key={`${item.itemId}+${i * Math.random()}`}>
                <div className="flex flex-row items-center w-fit pl-4">
                  <button type="button" onClick={() => onRemove(i)} className="hover:bg-red-500 relative rounded-full w-10 h-10 flex items-center justify-center">
                    <ImageField className="w-8 h-8" name="itemimage" src={"https://www.arkresourcecalculator.com/assets/images/80px-" + item.image} />
                  </button>
                  <button type="button" className="border border-black dark:border-white relative dark:text-white text-black hover:bg-white hover:text-black mx-2 rounded-full w-8 h-8 text-lg font-semibold" onClick={() => onRemoveAmount(i)}>
                    -
                  </button>
                  <p
                    defaultValue={item.amount}
                    className="rw-input w-16 p-3 text-center"
                  >{item.amount}</p>
                  <button type="button" className="border border-black dark:border-white relative dark:text-white text-black hover:bg-white hover:text-black mx-2 rounded-full w-8 h-8 text-lg font-semibold" onClick={() => onAddAmount(i)}>
                    +
                  </button>
                  {item.recipe.sort((a, b) => a.itemId - b.itemId).map((recipe, t) => (
                    <div className="flex flex-col justify-center items-center ml-2 min-w-16 w-10" id={`${recipe.itemId}-${i * Math.random()}${t}`} key={`${recipe.itemId}-${t * Math.random()}${i}`}>
                      <img src={`https://www.arkresourcecalculator.com/assets/images/80px-${items.find((itm) => parseInt(itm.itemId.toString()) === parseInt(recipe.itemId)).image}`} className="w-6 h-6" title={items.find((itm) => parseInt(itm.itemId.toString()) === parseInt(recipe.itemId)).name} alt={items.find((itm) => parseInt(itm.itemId.toString()) === parseInt(recipe.itemId)).name} />
                      <span className="text-sm text-black dark:text-white">{recipe.count * item.amount}</span>
                    </div>
                  ))}
                </div>
              </li >
            ))}
          </ul >
        </Form>
      </div >
    </>
  )
}