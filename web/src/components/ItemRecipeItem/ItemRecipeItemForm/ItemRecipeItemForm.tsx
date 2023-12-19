import {
  Form,
  FormError,
} from '@redwoodjs/forms'

import type {
  EditItemRecipeItemById,
  NewItemRecipeItem,
  UpdateItemRecipeItemInput,
} from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import { Input } from 'src/components/Util/Input/Input'
import Button from 'src/components/Util/Button/Button'
import { Lookup } from 'src/components/Util/Lookup/Lookup'

type FormItemRecipeItem = NonNullable<EditItemRecipeItemById['itemRecipeItem']>

interface ItemRecipeItemFormProps {
  itemRecipeItem?: EditItemRecipeItemById['itemRecipeItem']
  onSave: (
    data: UpdateItemRecipeItemInput,
    id?: FormItemRecipeItem['id']
  ) => void
  error: RWGqlError
  loading: boolean
  items: NewItemRecipeItem["items"]
}

const ItemRecipeItemForm = (props: ItemRecipeItemFormProps) => {
  const onSubmit = (data: FormItemRecipeItem) => {
    props.onSave({
      ...data,
      amount: parseInt(data.amount.toString()),
      created_at: new Date().toISOString()
    }, props?.itemRecipeItem?.id)
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

        <Input
          label="Item recipe id"
          name="item_recipe_id"
          defaultValue={props.itemRecipeItem?.item_recipe_id}
          validation={{ required: true }}
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

        {/* <div className="rw-button-group">
          <Button
            variant="outlined"
            color="success"
            type="submit"
            disabled={props.loading}
            permission="gamedata_create"
            startIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="pointer-events-none"
                fill="currentColor"
              >
                <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
              </svg>
            }
          >
            Save
          </Button>
        </div> */}
      </Form>
    </div>
  )
}

export default ItemRecipeItemForm
