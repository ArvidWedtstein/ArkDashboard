import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  CheckboxField,
  Submit,
} from '@redwoodjs/forms'

import type { EditMapRegionById, UpdateMapRegionInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'

type FormMapRegion = NonNullable<EditMapRegionById['mapRegion']>

interface MapRegionFormProps {
  mapRegion?: EditMapRegionById['mapRegion']
  onSave: (data: UpdateMapRegionInput, id?: FormMapRegion['id']) => void
  error: RWGqlError
  loading: boolean
}

const MapRegionForm = (props: MapRegionFormProps) => {
  const onSubmit = (data: FormMapRegion) => {
    props.onSave(data, props?.mapRegion?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormMapRegion> onSubmit={onSubmit} error={props.error}>
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
          defaultValue={props.mapRegion?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="map_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Map id
        </Label>

        <TextField
          name="map_id"
          defaultValue={props.mapRegion?.map_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="map_id" className="rw-field-error" />

        <Label
          name="wind"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Wind
        </Label>

        <TextField
          name="wind"
          defaultValue={props.mapRegion?.wind}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="wind" className="rw-field-error" />

        <Label
          name="temperature"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Temperature
        </Label>

        <TextField
          name="temperature"
          defaultValue={props.mapRegion?.temperature}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="temperature" className="rw-field-error" />

        <Label
          name="priority"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Priority
        </Label>

        <TextField
          name="priority"
          defaultValue={props.mapRegion?.priority}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="priority" className="rw-field-error" />

        <Label
          name="outside"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Outside
        </Label>

        <CheckboxField
          name="outside"
          defaultChecked={props.mapRegion?.outside}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="outside" className="rw-field-error" />

        <Label
          name="start_x"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Start x
        </Label>

        <TextField
          name="start_x"
          defaultValue={props.mapRegion?.start_x}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="start_x" className="rw-field-error" />

        <Label
          name="start_y"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Start y
        </Label>

        <TextField
          name="start_y"
          defaultValue={props.mapRegion?.start_y}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="start_y" className="rw-field-error" />

        <Label
          name="start_z"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Start z
        </Label>

        <TextField
          name="start_z"
          defaultValue={props.mapRegion?.start_z}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="start_z" className="rw-field-error" />

        <Label
          name="end_x"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          End x
        </Label>

        <TextField
          name="end_x"
          defaultValue={props.mapRegion?.end_x}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="end_x" className="rw-field-error" />

        <Label
          name="end_y"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          End y
        </Label>

        <TextField
          name="end_y"
          defaultValue={props.mapRegion?.end_y}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="end_y" className="rw-field-error" />

        <Label
          name="end_z"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          End z
        </Label>

        <TextField
          name="end_z"
          defaultValue={props.mapRegion?.end_z}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="end_z" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="rw-button-icon-end pointer-events-none"
              fill="currentColor"
            >
              <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
            </svg>
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default MapRegionForm
