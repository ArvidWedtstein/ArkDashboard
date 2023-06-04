import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

import type { EditItemRecipeById, UpdateItemRecipeInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'

type FormItemRecipe = NonNullable<EditItemRecipeById['itemRecipe']>

interface ItemRecipeFormProps {
  itemRecipe?: EditItemRecipeById['itemRecipe']
  onSave: (data: UpdateItemRecipeInput, id?: FormItemRecipe['id']) => void
  error: RWGqlError
  loading: boolean
}

const ItemRecipeForm = (props: ItemRecipeFormProps) => {
  const onSubmit = (data: FormItemRecipe) => {
    props.onSave(data, props?.itemRecipe?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormItemRecipe> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="crafted_item_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Crafted item id
        </Label>

        <TextField
          name="crafted_item_id"
          defaultValue={props.itemRecipe?.crafted_item_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="crafted_item_id" className="rw-field-error" />

        <Label
          name="crafting_station_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Crafting station id
        </Label>

        <TextField
          name="crafting_station_id"
          defaultValue={props.itemRecipe?.crafting_station_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="crafting_station_id" className="rw-field-error" />

        <Label
          name="crafting_time"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Crafting time
        </Label>

        <TextField
          name="crafting_time"
          defaultValue={props.itemRecipe?.crafting_time}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="crafting_time" className="rw-field-error" />

        <Label
          name="yields"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Yields
        </Label>

        <TextField
          name="yields"
          defaultValue={props.itemRecipe?.yields}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true, required: true }}
        />

        <FieldError name="yields" className="rw-field-error" />

        <Label
          name="required_level"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Required level
        </Label>

        <TextField
          name="required_level"
          defaultValue={props.itemRecipe?.required_level}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="required_level" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ItemRecipeForm
