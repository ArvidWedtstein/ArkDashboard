import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  Submit,
  SelectField,
  NumberField,
  TextAreaField,
} from '@redwoodjs/forms'

import type { EditBasespotById, UpdateBasespotInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import FileUpload from 'src/components/Util/FileUpload/FileUpload'
import { useRef, useState } from 'react'



const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}


type FormBasespot = NonNullable<EditBasespotById['basespot']>

interface BasespotFormProps {
  basespot?: EditBasespotById['basespot']
  onSave: (data: UpdateBasespotInput, id?: FormBasespot['id']) => void
  error: RWGqlError
  loading: boolean
}

const BasespotForm = (props: BasespotFormProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [defenseImages, setDefenseImages] = useState([]);

  const basename = useRef(null);
  const onSubmit = (data: FormBasespot) => {
    data.image && (data.image = thumbnailUrl);

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
          ref={basename}
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

        <TextAreaField
          name="description"
          defaultValue={props.basespot?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={""}
          validation={{ required: true }}
        />


        <FieldError name="description" className="rw-field-error" />

        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-6 group">
            <Label
              name="latitude"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Latitude
            </Label>

            <NumberField
              name="latitude"
              defaultValue={props.basespot?.latitude}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              emptyAs={null}
              validation={{ valueAsNumber: true, required: true }}
            />
            <FieldError name="latitude" className="rw-field-error" />
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <Label
              name="longitude"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Longitude
            </Label>

            <NumberField
              name="longitude"
              defaultValue={props.basespot?.longitude}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              emptyAs={null}
              validation={{ valueAsNumber: true, required: true }}
            />
            <FieldError name="longitude" className="rw-field-error" />
          </div>
        </div>

        <Label
          name="image"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Image
        </Label>

        <FileUpload
          storagePath={`basespotimages/${basename.current?.value.replaceAll(" ", "") ||
            props.basespot?.name.replaceAll(" ", "")
            }`}
          onUpload={(url) => {
            setThumbnailUrl(url);
          }}
        />

        <FieldError name="image" className="rw-field-error" />

        <Label
          name="Map"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Map
        </Label>

        <SelectField
          className="rw-input"
          name="Map"
          defaultValue={props.basespot?.Map}
          validation={{ required: true }}
          errorClassName="rw-input rw-input-error"
        >
          <option value="TheIsland">The Island</option>
          <option value="TheCenter">The Center</option>
          <option value="ScorchedEarth">Scorched Earth</option>
          <option value="Ragnarok">Ragnarok</option>
          <option value="Abberation">Abberation</option>
          <option value="Extinction">Extinction</option>
          <option value="Gen1">Genesis</option>
          <option value="Gen2">Genesis 2</option>
          <option value="Valguero">Valguero</option>
          <option value="CrystalIsles">Crystal Isles</option>
          <option value="Fjordur">Fjordur</option>
          <option value="LostIsland">Lost Island</option>
        </SelectField>

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

        <Label
          name="defenseImages"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Defense images
        </Label>

        <TextField
          name="defenseImages"
          defaultValue={props.basespot?.defenseImages}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: false }}
          emptyAs={"undefined"}
        />


        <FieldError name="defenseImages" className="rw-field-error" />

        <Label
          name="turretsetup_image"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Turretsetup image
        </Label>

        <TextField
          name="turretsetup_image"
          defaultValue={props.basespot?.turretsetup_image}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />


        <FieldError name="turretsetup_image" className="rw-field-error" />

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
