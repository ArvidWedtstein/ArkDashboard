import { FieldError, Form, FormError, ImageField, Label, RWGqlError, SelectField, TextField } from "@redwoodjs/forms";
import { useReducer } from "react";
import { useForm } from 'react-hook-form'
import Lookup from "src/components/Lookup/Lookup";
import { combineBySummingKeys, merge, mergeRecipe } from 'src/lib/formatters'
import { items } from 'public/arkitems.json'
interface MaterialGridProps {
  items: any;
  error?: RWGqlError;
}
export const MaterialGrid = ({ items, error }: MaterialGridProps) => {
  const formMethods = useForm()
  const reducer = (state, action) => {
    switch (action.type) {
      case 'ADD_AMOUNT_BY_NUM':
        action.item.amount = action.amount
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

  const addTurretTower = (() => {
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
      let itemfound = items.find((item) => item.itemId === parseInt(key))
      setItem({ type: "ADD_AMOUNT_BY_NUM", item: itemfound, amount: value });
    }

  });
  return (
    <>
      <div className="container-xl mx-auto bg-white p-3 ">
        <Form onSubmit={onAdd} error={error}>
          <FormError
            error={error}
            wrapperClassName="rw-form-error-wrapper"
            titleClassName="rw-form-error-title"
            listClassName="rw-form-error-list"
          />
          <Label
            name="itemName"
            className="rw-label text-white"
            errorClassName="rw-label rw-label-error"
          >
            Name
          </Label>

          <div className="relative flex flex-row space-x-3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <Lookup items={items} search={true} name="itemName" onChange={(e) => onAdd({ itemName: e })} />
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button type="button" onClick={addTurretTower} className="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                <svg aria-hidden="true" className="mr-2 w-4 h-4 fill-current" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path></svg>
                Turret Tower
              </button>
              <button type="button" className="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                <svg aria-hidden="true" className="mr-2 w-4 h-4 fill-current" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path></svg>
                Cliff Platform Turret Tower
              </button>
            </div>
            <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">+</button>
          </div>
          <FieldError name="itemName" className="rw-field-error" />

          <ul className="py-4">
            <li className="border-0 border-b-2 py-4">
              <div className=" flex flex-row items-center w-fit pl-4">
                Total
                <button type="button" className="bg-slate-200 relative text-black mx-2 rounded-full w-8 h-8">

                </button>
                <p
                  className="rw-input w-10 "
                ></p>
                <button type="button" className="bg-slate-200 relative text-black mx-2 rounded-full w-8 h-8" >

                </button>
                {Object.entries(mergeRecipe(...item)).map((k) => {
                  return (
                    <div key={k[0]} className="flex flex-col justify-center items-center ml-2">
                      <img src={`https://www.arkresourcecalculator.com/assets/images/80px-${items.find((item) => item.itemId === Number(k[0])).image}`} className="w-6 h-6" title={items.find((item) => item.itemId === Number(k[0])).name} />
                      {/* <p className="rw-input w-10 text-white">{items.find((item) => item.itemId === k[0]) ? items.find((item) => item.itemId === k[0]).name : k[1]}</p> */}
                      <span className="text-sm">{k[1]}</span>
                    </div>
                  )
                })}

              </div>
            </li>
            {item.map((item, i) => (
              <li className="" key={`${item.id}+${i}`}>
                <div className="flex flex-row items-center w-fit pl-4">
                  <button type="button" onClick={() => onRemove(i)} className="hover:bg-red-500 relative rounded-full w-10 h-10 flex items-center justify-center">
                    <ImageField className="w-8 h-8" name="itemimage" src={"https://www.arkresourcecalculator.com/assets/images/80px-" + item.image} />
                  </button>
                  <button type="button" className="bg-slate-200 relative text-black mx-2 rounded-full w-8 h-8" onClick={() => onRemoveAmount(i)}>
                    -
                  </button>
                  <p
                    defaultValue={item.amount}
                    className="rw-input w-10"
                  >{item.amount}</p>
                  <button type="button" className="bg-slate-200 relative text-black mx-2 rounded-full w-8 h-8" onClick={() => onAddAmount(i)}>
                    +
                  </button>
                  {item.recipe.map((recipe, t) => (
                    <div className="flex flex-col justify-center items-center ml-2" key={`${recipe}-${i}${t}`}>
                      <img src={`https://www.arkresourcecalculator.com/assets/images/80px-${items.find((item) => item.itemId === recipe.itemId).image}`} className="w-6 h-6" title={items.find((item) => item.itemId === recipe.itemId).name} alt={items.find((item) => item.itemId === recipe.itemId).name} />
                      <span className="text-sm">{recipe.count * item.amount}</span>
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