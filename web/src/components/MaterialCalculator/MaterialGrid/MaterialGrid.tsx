import { FieldError, Form, FormError, ImageField, Label, RWGqlError, SelectField, TextField } from "@redwoodjs/forms";
import { useReducer } from "react";
import { useForm } from 'react-hook-form'
import Lookup from "src/components/Lookup/Lookup";
import { combineBySummingKeys, merge, mergeRecipe } from 'src/lib/formatters'
interface MaterialGridProps {
  items: any;
  error?: RWGqlError;
}
export const MaterialGrid = ({ items, error }: MaterialGridProps) => {
  const formMethods = useForm()
  const reducer = (state, action) => {
    switch (action.type) {
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
            {/* <SelectField
              name="itemName"

              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              validation={{ required: false }}
              errorClassName="rw-input rw-input-error"
            >
              {items.map((item) => {
                return <option key={item.id + `${Math.random()}`} value={item.name}>{item.name}</option>
              })}
            </SelectField> */}
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button type="button" className="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                <svg aria-hidden="true" className="mr-2 w-4 h-4 fill-current" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path></svg>
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