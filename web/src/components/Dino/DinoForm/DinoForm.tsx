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

import type { EditDinoById, UpdateDinoInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'




type FormDino = NonNullable<EditDinoById['dino']>

interface DinoFormProps {
  dino?: EditDinoById['dino']
  onSave: (data: UpdateDinoInput, id?: FormDino['id']) => void
  error: RWGqlError
  loading: boolean
}

const DinoForm = (props: DinoFormProps) => {
  const onSubmit = (data: FormDino) => {
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    props.onSave(data, props?.dino?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormDino> onSubmit={onSubmit} error={props.error}>
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
            defaultValue={props.dino?.name}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="synonyms"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Synonyms
        </Label>
        
          <TextField
            name="synonyms"
            defaultValue={props.dino?.synonyms}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="synonyms" className="rw-field-error" />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>
        
          <TextField
            name="description"
            defaultValue={props.dino?.description}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="taming_notice"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Taming notice
        </Label>
        
          <TextField
            name="taming_notice"
            defaultValue={props.dino?.taming_notice}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="taming_notice" className="rw-field-error" />

        <Label
          name="can_destroy"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Can destroy
        </Label>
        
          <TextField
            name="can_destroy"
            defaultValue={props.dino?.can_destroy}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="can_destroy" className="rw-field-error" />

        <Label
          name="immobilized_by"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Immobilized by
        </Label>
        
          <TextField
            name="immobilized_by"
            defaultValue={props.dino?.immobilized_by}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="immobilized_by" className="rw-field-error" />

        <Label
          name="base_stats"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Base stats
        </Label>
        
          <TextAreaField
            name="base_stats"
            defaultValue={JSON.stringify(props.dino?.base_stats)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsJSON: true }}
          />
        

        <FieldError name="base_stats" className="rw-field-error" />

        <Label
          name="gather_eff"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Gather eff
        </Label>
        
          <TextAreaField
            name="gather_eff"
            defaultValue={JSON.stringify(props.dino?.gather_eff)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsJSON: true }}
          />
        

        <FieldError name="gather_eff" className="rw-field-error" />

        <Label
          name="exp_per_kill"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Exp per kill
        </Label>
        
          <TextField
            name="exp_per_kill"
            defaultValue={props.dino?.exp_per_kill}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="exp_per_kill" className="rw-field-error" />

        <Label
          name="fits_through"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Fits through
        </Label>
        
          <TextField
            name="fits_through"
            defaultValue={props.dino?.fits_through}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="fits_through" className="rw-field-error" />

        <Label
          name="egg_min"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Egg min
        </Label>
        
          <TextField
            name="egg_min"
            defaultValue={props.dino?.egg_min}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="egg_min" className="rw-field-error" />

        <Label
          name="egg_max"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Egg max
        </Label>
        
          <TextField
            name="egg_max"
            defaultValue={props.dino?.egg_max}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="egg_max" className="rw-field-error" />

        <Label
          name="tdps"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Tdps
        </Label>
        
          <TextField
            name="tdps"
            defaultValue={props.dino?.tdps}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="tdps" className="rw-field-error" />

        <Label
          name="eats"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Eats
        </Label>
        
          <TextField
            name="eats"
            defaultValue={props.dino?.eats}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="eats" className="rw-field-error" />

        <Label
          name="maturation_time"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Maturation time
        </Label>
        
          <TextField
            name="maturation_time"
            defaultValue={props.dino?.maturation_time}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="maturation_time" className="rw-field-error" />

        <Label
          name="weight_reduction"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Weight reduction
        </Label>
        
          <TextAreaField
            name="weight_reduction"
            defaultValue={JSON.stringify(props.dino?.weight_reduction)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsJSON: true }}
          />
        

        <FieldError name="weight_reduction" className="rw-field-error" />

        <Label
          name="incubation_time"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Incubation time
        </Label>
        
          <TextField
            name="incubation_time"
            defaultValue={props.dino?.incubation_time}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="incubation_time" className="rw-field-error" />

        <Label
          name="affinity_needed"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Affinity needed
        </Label>
        
          <TextField
            name="affinity_needed"
            defaultValue={props.dino?.affinity_needed}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="affinity_needed" className="rw-field-error" />

        <Label
          name="aff_inc"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Aff inc
        </Label>
        
          <TextField
            name="aff_inc"
            defaultValue={props.dino?.aff_inc}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="aff_inc" className="rw-field-error" />

        <Label
          name="flee_threshold"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Flee threshold
        </Label>
        
          <TextField
            name="flee_threshold"
            defaultValue={props.dino?.flee_threshold}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="flee_threshold" className="rw-field-error" />

        <Label
          name="hitboxes"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Hitboxes
        </Label>
        
          <TextAreaField
            name="hitboxes"
            defaultValue={JSON.stringify(props.dino?.hitboxes)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsJSON: true }}
          />
        

        <FieldError name="hitboxes" className="rw-field-error" />

        <Label
          name="drops"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Drops
        </Label>
        
          <TextField
            name="drops"
            defaultValue={props.dino?.drops}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="drops" className="rw-field-error" />

        <Label
          name="food_consumption_base"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Food consumption base
        </Label>
        
          <TextField
            name="food_consumption_base"
            defaultValue={props.dino?.food_consumption_base}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="food_consumption_base" className="rw-field-error" />

        <Label
          name="food_consumption_mult"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Food consumption mult
        </Label>
        
          <TextField
            name="food_consumption_mult"
            defaultValue={props.dino?.food_consumption_mult}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="food_consumption_mult" className="rw-field-error" />

        <Label
          name="disable_ko"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Disable ko
        </Label>
        
          <CheckboxField
            name="disable_ko"
            defaultChecked={props.dino?.disable_ko}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="disable_ko" className="rw-field-error" />

        <Label
          name="violent_tame"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Violent tame
        </Label>
        
          <CheckboxField
            name="violent_tame"
            defaultChecked={props.dino?.violent_tame}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="violent_tame" className="rw-field-error" />

        <Label
          name="taming_bonus_attr"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Taming bonus attr
        </Label>
        
          <TextField
            name="taming_bonus_attr"
            defaultValue={props.dino?.taming_bonus_attr}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="taming_bonus_attr" className="rw-field-error" />

        <Label
          name="disable_food"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Disable food
        </Label>
        
          <CheckboxField
            name="disable_food"
            defaultChecked={props.dino?.disable_food}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="disable_food" className="rw-field-error" />

        <Label
          name="disable_mult"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Disable mult
        </Label>
        
          <CheckboxField
            name="disable_mult"
            defaultChecked={props.dino?.disable_mult}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="disable_mult" className="rw-field-error" />

        <Label
          name="water_movement"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Water movement
        </Label>
        
          <CheckboxField
            name="water_movement"
            defaultChecked={props.dino?.water_movement}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="water_movement" className="rw-field-error" />

        <Label
          name="admin_note"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Admin note
        </Label>
        
          <TextField
            name="admin_note"
            defaultValue={props.dino?.admin_note}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="admin_note" className="rw-field-error" />

        <Label
          name="base_points"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Base points
        </Label>
        
          <TextField
            name="base_points"
            defaultValue={props.dino?.base_points}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="base_points" className="rw-field-error" />

        <Label
          name="method"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Method
        </Label>
        
          <TextField
            name="method"
            defaultValue={props.dino?.method}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="method" className="rw-field-error" />

        <Label
          name="knockout"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Knockout
        </Label>
        
          <TextField
            name="knockout"
            defaultValue={props.dino?.knockout}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="knockout" className="rw-field-error" />

        <Label
          name="non_violent_food_affinity_mult"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Non violent food affinity mult
        </Label>
        
          <TextField
            name="non_violent_food_affinity_mult"
            defaultValue={props.dino?.non_violent_food_affinity_mult}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="non_violent_food_affinity_mult" className="rw-field-error" />

        <Label
          name="non_violent_food_rate_mult"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Non violent food rate mult
        </Label>
        
          <TextField
            name="non_violent_food_rate_mult"
            defaultValue={props.dino?.non_violent_food_rate_mult}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="non_violent_food_rate_mult" className="rw-field-error" />

        <Label
          name="taming_interval"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Taming interval
        </Label>
        
          <TextField
            name="taming_interval"
            defaultValue={props.dino?.taming_interval}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="taming_interval" className="rw-field-error" />

        <Label
          name="base_taming_time"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Base taming time
        </Label>
        
          <TextField
            name="base_taming_time"
            defaultValue={props.dino?.base_taming_time}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="base_taming_time" className="rw-field-error" />

        <Label
          name="exp_per_kill_adj"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Exp per kill adj
        </Label>
        
          <TextField
            name="exp_per_kill_adj"
            defaultValue={props.dino?.exp_per_kill_adj}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="exp_per_kill_adj" className="rw-field-error" />

        <Label
          name="disable_tame"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Disable tame
        </Label>
        
          <CheckboxField
            name="disable_tame"
            defaultChecked={props.dino?.disable_tame}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="disable_tame" className="rw-field-error" />

        <Label
          name="x_variant"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          X variant
        </Label>
        
          <CheckboxField
            name="x_variant"
            defaultChecked={props.dino?.x_variant}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="x_variant" className="rw-field-error" />

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

export default DinoForm
