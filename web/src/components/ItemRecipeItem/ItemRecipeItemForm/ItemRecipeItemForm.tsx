import {
  Form,
  FormError,
} from '@redwoodjs/forms'

import type {
  NewItemRecipe,
  UpdateItemRecipeItemInput,
} from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import { Input } from 'src/components/Util/Input/Input'
import { Lookup } from 'src/components/Util/Lookup/Lookup'

type FormItemRecipeItem = NonNullable<{
  __typename?: "ItemRecipeItem";
  id: string;
  amount: number;
  item_id: number;
  item_recipe_id: string;
}>

interface ItemRecipeItemFormProps {
  itemRecipeItem?: {
    __typename?: "ItemRecipeItem";
    id: string;
    amount: number;
    item_id: number;
    item_recipe_id: string;
  },
  onSave: (
    data: UpdateItemRecipeItemInput,
    id?: string,
  ) => void
  error: RWGqlError
  loading: boolean
  items: NewItemRecipe["items"]
}

const ItemRecipeItemForm = (props: ItemRecipeItemFormProps) => {
  const onSubmit = (data: FormItemRecipeItem) => {
    props.onSave({
      ...data,
      amount: parseInt(data.amount.toString()),
      created_at: new Date().toISOString(),
      item_recipe_id: props.itemRecipeItem?.item_recipe_id
    }, props?.itemRecipeItem?.id);
  }
  return (
    <div className="rw-form-wrapper">
      <Form<FormItemRecipeItem> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Lookup
          label="Item"
          name="item_id"
          loading={props.loading}
          isOptionEqualToValue={(opt, val) => opt.id === val.id}
          getOptionValue={(opt) => opt.id}
          getOptionLabel={(opt) => opt.name}
          defaultValue={props.itemRecipeItem?.item_id}
          options={props?.items || []}
          validation={{ required: true }}
        />

        <Input
          label="Amount"
          name="amount"
          defaultValue={props.itemRecipeItem?.amount}
          validation={{ valueAsNumber: true, required: true, setValueAs: (v) => parseInt(v) }}
          type="number"
        />
      </Form>
    </div>
  )
}

export default ItemRecipeItemForm
