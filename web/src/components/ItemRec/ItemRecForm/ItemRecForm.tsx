import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

import type { EditItemRecById, UpdateItemRecInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'

type FormItemRec = NonNullable<EditItemRecById['itemRec']>

interface ItemRecFormProps {
  itemRec?: EditItemRecById['itemRec']
  onSave: (data: UpdateItemRecInput, id?: FormItemRec['id']) => void
  error: RWGqlError
  loading: boolean
}

const ItemRecForm = (props: ItemRecFormProps) => {
  const onSubmit = (data: FormItemRec) => {
    props.onSave(data, props?.itemRec?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormItemRec> onSubmit={onSubmit} error={props.error}>
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
          defaultValue={props.itemRec?.crafted_item_id}
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
          defaultValue={props.itemRec?.crafting_station_id}
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
          defaultValue={props.itemRec?.crafting_time}
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
          defaultValue={props.itemRec?.yields}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true, required: true }}
        />

        <FieldError name="yields" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ItemRecForm
