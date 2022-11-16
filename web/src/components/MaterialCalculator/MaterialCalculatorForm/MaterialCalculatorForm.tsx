import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
  ImageField,
  NumberField,
} from '@redwoodjs/forms'

import type { EditBasespotById, UpdateBasespotInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'

import arkitems from '../../../../public/arkitems.json'
import { useReducer, useState } from 'react'




interface MaterialCalculatorFormProps {
  error?: RWGqlError
  loading?: boolean
}

const MaterialCalculatorForm = (props: MaterialCalculatorFormProps) => {
  let { itemStats, items } = arkitems
  items = items.map(v => ({ ...v, amount: 1 }))
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
  const onSubmit = (data) => {
    let item = items.find((item) => item.name.toLowerCase() === data.itemName.toLowerCase())

    setItem({ type: "ADD", item: item });
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
    <div className="rw-form-wrapper container mx-auto">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="itemName"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>

        <TextField
          name="itemName"
          defaultValue={""}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: false }}
        />


        <FieldError name="itemName" className="rw-field-error" />

        <div className="container mx-auto bg-slate-500">
          <ul className="py-4">
            <li className="border-0 border-b-2 py-4 text-white">
              <div className=" flex flex-row items-center w-fit pl-4">
                Total
              </div>
            </li>
            {item.map((item, i) => (
              <li className="" key={`${item.id}+${i}`}>
                <div className="flex flex-row items-center w-fit pl-4">
                  <button type="button" onClick={() => onRemove(i)} className="hover:bg-red-500 relative text-white rounded-full w-10 h-10 flex items-center justify-center">
                    <ImageField className="w-8 h-8" name="itemimage" src={"https://www.arkresourcecalculator.com/assets/images/80px-" + item.image} />
                  </button>
                  <button type="button" className="bg-slate-200 relative text-black mx-2 rounded-full w-8 h-8" onClick={() => onRemoveAmount(i)}>
                    -
                  </button>
                  <p
                    defaultValue={item.amount}
                    className="rw-input w-10 text-white"
                  >{item.amount}</p>
                  <button type="button" className="bg-slate-200 relative text-black mx-2 rounded-full w-8 h-8" onClick={() => onAddAmount(i)}>
                    +
                  </button>
                  {item.recipe.map((recipe, t) => (
                    <div className="flex flex-col justify-center items-center ml-2" key={`${recipe}-${i}${t}`}>
                      <img src={`https://www.arkresourcecalculator.com/assets/images/80px-${items.find((item) => item.itemId === recipe.itemId).image}`} className="w-6 h-6" title={items.find((item) => item.itemId === recipe.itemId).name} alt={items.find((item) => item.itemId === recipe.itemId).name} />
                      <span className="text-sm text-white">{recipe.count * item.amount}</span>
                    </div>
                  ))}
                </div>
              </li >
            ))}
          </ul >
        </div >


        <div className="rw-button-group">
          <Submit
            disabled={props.loading}
            className="rw-button rw-button-blue"
          >
            Save
          </Submit>
        </div>
      </Form >
    </div >
  )
}

export default MaterialCalculatorForm
