import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  TextAreaField,
  Submit,
} from '@redwoodjs/forms'

import type { EditMapById, UpdateMapInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'




type FormMap = NonNullable<EditMapById['map']>

interface MapFormProps {
  map?: EditMapById['map']
  onSave: (data: UpdateMapInput, id?: FormMap['id']) => void
  error: RWGqlError
  loading: boolean
}

const MapForm = (props: MapFormProps) => {
  const onSubmit = (data: FormMap) => {
    props.onSave(data, props?.map?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormMap> onSubmit={onSubmit} error={props.error}>
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
          defaultValue={props.map?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />


        <FieldError name="name" className="rw-field-error" />

        <Label
          name="loot_crates"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Loot crates
        </Label>

        <TextAreaField
          name="loot_crates"
          defaultValue={JSON.stringify(props.map?.loot_crates)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />


        <FieldError name="loot_crates" className="rw-field-error" />

        <Label
          name="oil_veins"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Oil veins
        </Label>

        <TextAreaField
          name="oil_veins"
          defaultValue={JSON.stringify(props.map?.oil_veins)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />


        <FieldError name="oil_veins" className="rw-field-error" />

        <Label
          name="water_veins"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Water veins
        </Label>

        <TextAreaField
          name="water_veins"
          defaultValue={JSON.stringify(props.map?.water_veins)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />


        <FieldError name="water_veins" className="rw-field-error" />

        <Label
          name="wyvern_nests"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Wyvern nests
        </Label>

        <TextAreaField
          name="wyvern_nests"
          defaultValue={JSON.stringify(props.map?.wyvern_nests)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />


        <FieldError name="wyvern_nests" className="rw-field-error" />

        <Label
          name="ice_wyvern_nests"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Ice wyvern nests
        </Label>

        <TextAreaField
          name="ice_wyvern_nests"
          defaultValue={JSON.stringify(props.map?.ice_wyvern_nests)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />


        <FieldError name="ice_wyvern_nests" className="rw-field-error" />

        <Label
          name="gas_veins"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Gas veins
        </Label>

        <TextAreaField
          name="gas_veins"
          defaultValue={JSON.stringify(props.map?.gas_veins)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />


        <FieldError name="gas_veins" className="rw-field-error" />

        <Label
          name="deinonychus_nests"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Deinonychus nests
        </Label>

        <TextAreaField
          name="deinonychus_nests"
          defaultValue={JSON.stringify(props.map?.deinonychus_nests)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />


        <FieldError name="deinonychus_nests" className="rw-field-error" />

        <Label
          name="charge_nodes"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Charge nodes
        </Label>

        <TextAreaField
          name="charge_nodes"
          defaultValue={JSON.stringify(props.map?.charge_nodes)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />


        <FieldError name="charge_nodes" className="rw-field-error" />

        <Label
          name="plant_z_nodes"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Plant z nodes
        </Label>

        <TextAreaField
          name="plant_z_nodes"
          defaultValue={JSON.stringify(props.map?.plant_z_nodes)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />


        <FieldError name="plant_z_nodes" className="rw-field-error" />

        <Label
          name="drake_nests"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Drake nests
        </Label>

        <TextAreaField
          name="drake_nests"
          defaultValue={JSON.stringify(props.map?.drake_nests)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />


        <FieldError name="drake_nests" className="rw-field-error" />

        <Label
          name="glitches"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Glitches
        </Label>

        <TextAreaField
          name="glitches"
          defaultValue={JSON.stringify(props.map?.glitches)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />


        <FieldError name="glitches" className="rw-field-error" />

        <Label
          name="magmasaur_nests"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Magmasaur nests
        </Label>

        <TextAreaField
          name="magmasaur_nests"
          defaultValue={JSON.stringify(props.map?.magmasaur_nests)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />


        <FieldError name="magmasaur_nests" className="rw-field-error" />

        <Label
          name="poison_trees"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Poison trees
        </Label>

        <TextAreaField
          name="poison_trees"
          defaultValue={JSON.stringify(props.map?.poison_trees)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />


        <FieldError name="poison_trees" className="rw-field-error" />

        <Label
          name="mutagen_bulbs"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Mutagen bulbs
        </Label>

        <TextAreaField
          name="mutagen_bulbs"
          defaultValue={JSON.stringify(props.map?.mutagen_bulbs)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />


        <FieldError name="mutagen_bulbs" className="rw-field-error" />

        <Label
          name="carniflora"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Carniflora
        </Label>

        <TextAreaField
          name="carniflora"
          defaultValue={JSON.stringify(props.map?.carniflora)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />

        <FieldError name="carniflora" className="rw-field-error" />


        <Label
          name="notes"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Notes
        </Label>

        <TextAreaField
          name="notes"
          defaultValue={JSON.stringify(props.map?.notes)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />

        <FieldError name="notes" className="rw-field-error" />

        <Label
          name="img"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Image
        </Label>

        <TextField
          name="img"
          defaultValue={props.map?.img}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />


        <FieldError name="img" className="rw-field-error" />

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

export default MapForm
