import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

import type { EditBasespotById, UpdateBasespotInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'




type FormBasespot = NonNullable<EditBasespotById['basespot']>

interface BasespotFormProps {
  basespot?: EditBasespotById['basespot']
  onSave: (data: UpdateBasespotInput, id?: FormBasespot['id']) => void
  error: RWGqlError
  loading: boolean
}

const BasespotForm = (props: BasespotFormProps) => {
  const onSubmit = (data: FormBasespot) => {

    props.onSave(data, props?.basespot?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormBasespot> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>

          <TextField
            name="name"
            defaultValue={props.basespot?.name}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />


        <FieldError name="name" className="rw-field-error" />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

          <TextField
            name="description"
            defaultValue={props.basespot?.description}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />


        <FieldError name="description" className="rw-field-error" />

        <Label
          name="latitude"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Latitude
        </Label>

          <TextField
            name="latitude"
            defaultValue={props.basespot?.latitude}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true, required: true }}
          />


        <FieldError name="latitude" className="rw-field-error" />

        <Label
          name="longitude"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Longitude
        </Label>

          <TextField
            name="longitude"
            defaultValue={props.basespot?.longitude}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true, required: true }}
          />


        <FieldError name="longitude" className="rw-field-error" />

        <Label
          name="image"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Image
        </Label>

          <TextField
            name="image"
            defaultValue={props.basespot?.image}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />


        <FieldError name="image" className="rw-field-error" />

        <Label
          name="Map"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Map
        </Label>

          <TextField
            name="Map"
            defaultValue={props.basespot?.Map}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />


        <FieldError name="Map" className="rw-field-error" />

        <Label
          name="estimatedForPlayers"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Estimated for players
        </Label>

          <TextField
            name="estimatedForPlayers"
            defaultValue={props.basespot?.estimatedForPlayers}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />


        <FieldError name="estimatedForPlayers" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit
            disabled={props.loading}
            className="rw-button rw-button-blue"
          >
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default BasespotForm
