import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  TextAreaField,
  CheckboxField,
  Submit,
} from '@redwoodjs/forms'

import type { EditLootcrateById, UpdateLootcrateInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'




type FormLootcrate = NonNullable<EditLootcrateById['lootcrate']>

interface LootcrateFormProps {
  lootcrate?: EditLootcrateById['lootcrate']
  onSave: (data: UpdateLootcrateInput, id?: FormLootcrate['id']) => void
  error: RWGqlError
  loading: boolean
}

const LootcrateForm = (props: LootcrateFormProps) => {
  const onSubmit = (data: FormLootcrate) => {
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    props.onSave(data, props?.lootcrate?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormLootcrate> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
      
        <Label
          name="blueprint"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Blueprint
        </Label>
        
          <TextField
            name="blueprint"
            defaultValue={props.lootcrate?.blueprint}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="blueprint" className="rw-field-error" />

        <Label
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>
        
          <TextField
            name="name"
            defaultValue={props.lootcrate?.name}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="map"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Map
        </Label>
        
          <TextField
            name="map"
            defaultValue={props.lootcrate?.map}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="map" className="rw-field-error" />

        <Label
          name="level_requirement"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Level requirement
        </Label>
        
          <TextAreaField
            name="level_requirement"
            defaultValue={JSON.stringify(props.lootcrate?.level_requirement)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsJSON: true }}
          />
        

        <FieldError name="level_requirement" className="rw-field-error" />

        <Label
          name="decay_time"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Decay time
        </Label>
        
          <TextAreaField
            name="decay_time"
            defaultValue={JSON.stringify(props.lootcrate?.decay_time)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsJSON: true }}
          />
        

        <FieldError name="decay_time" className="rw-field-error" />

        <Label
          name="no_repeat_in_sets"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          No repeat in sets
        </Label>
        
          <CheckboxField
            name="no_repeat_in_sets"
            defaultChecked={props.lootcrate?.no_repeat_in_sets}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="no_repeat_in_sets" className="rw-field-error" />

        <Label
          name="quality_multiplier"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Quality multiplier
        </Label>
        
          <TextAreaField
            name="quality_multiplier"
            defaultValue={JSON.stringify(props.lootcrate?.quality_multiplier)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsJSON: true }}
          />
        

        <FieldError name="quality_multiplier" className="rw-field-error" />

        <Label
          name="set_qty"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Set qty
        </Label>
        
          <TextAreaField
            name="set_qty"
            defaultValue={JSON.stringify(props.lootcrate?.set_qty)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsJSON: true }}
          />
        

        <FieldError name="set_qty" className="rw-field-error" />

        <Label
          name="color"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Color
        </Label>
        
          <TextField
            name="color"
            defaultValue={props.lootcrate?.color}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="color" className="rw-field-error" />

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

export default LootcrateForm
