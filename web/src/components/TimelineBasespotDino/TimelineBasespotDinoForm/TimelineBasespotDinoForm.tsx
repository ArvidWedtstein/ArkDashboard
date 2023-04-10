import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  Submit,
} from '@redwoodjs/forms'

import type { EditTimelineBasespotDinoById, UpdateTimelineBasespotDinoInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'



const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}


type FormTimelineBasespotDino = NonNullable<EditTimelineBasespotDinoById['timelineBasespotDino']>

interface TimelineBasespotDinoFormProps {
  timelineBasespotDino?: EditTimelineBasespotDinoById['timelineBasespotDino']
  onSave: (data: UpdateTimelineBasespotDinoInput, id?: FormTimelineBasespotDino['id']) => void
  error: RWGqlError
  loading: boolean
}

const TimelineBasespotDinoForm = (props: TimelineBasespotDinoFormProps) => {
  const onSubmit = (data: FormTimelineBasespotDino) => {
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    props.onSave(data, props?.timelineBasespotDino?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormTimelineBasespotDino> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
      
        <Label
          name="timelinebasespot_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Timelinebasespot id
        </Label>
        
          <TextField
            name="timelinebasespot_id"
            defaultValue={props.timelineBasespotDino?.timelinebasespot_id}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="timelinebasespot_id" className="rw-field-error" />

        <Label
          name="dino_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Dino id
        </Label>
        
          <TextField
            name="dino_id"
            defaultValue={props.timelineBasespotDino?.dino_id}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="dino_id" className="rw-field-error" />

        <Label
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>
        
          <TextField
            name="name"
            defaultValue={props.timelineBasespotDino?.name}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="birth_date"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Birth date
        </Label>
        
          <DatetimeLocalField
            name="birth_date"
            defaultValue={formatDatetime(props.timelineBasespotDino?.birth_date)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="birth_date" className="rw-field-error" />

        <Label
          name="death_date"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Death date
        </Label>
        
          <DatetimeLocalField
            name="death_date"
            defaultValue={formatDatetime(props.timelineBasespotDino?.death_date)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="death_date" className="rw-field-error" />

        <Label
          name="death_cause"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Death cause
        </Label>
        
          <TextField
            name="death_cause"
            defaultValue={props.timelineBasespotDino?.death_cause}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="death_cause" className="rw-field-error" />

        <Label
          name="level_wild"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Level wild
        </Label>
        
          <TextField
            name="level_wild"
            defaultValue={props.timelineBasespotDino?.level_wild}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="level_wild" className="rw-field-error" />

        <Label
          name="level"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Level
        </Label>
        
          <TextField
            name="level"
            defaultValue={props.timelineBasespotDino?.level}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="level" className="rw-field-error" />

        <Label
          name="health"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Health
        </Label>
        
          <TextField
            name="health"
            defaultValue={props.timelineBasespotDino?.health}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="health" className="rw-field-error" />

        <Label
          name="stamina"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Stamina
        </Label>
        
          <TextField
            name="stamina"
            defaultValue={props.timelineBasespotDino?.stamina}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="stamina" className="rw-field-error" />

        <Label
          name="oxygen"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Oxygen
        </Label>
        
          <TextField
            name="oxygen"
            defaultValue={props.timelineBasespotDino?.oxygen}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="oxygen" className="rw-field-error" />

        <Label
          name="food"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Food
        </Label>
        
          <TextField
            name="food"
            defaultValue={props.timelineBasespotDino?.food}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="food" className="rw-field-error" />

        <Label
          name="weight"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Weight
        </Label>
        
          <TextField
            name="weight"
            defaultValue={props.timelineBasespotDino?.weight}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="weight" className="rw-field-error" />

        <Label
          name="melee_damage"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Melee damage
        </Label>
        
          <TextField
            name="melee_damage"
            defaultValue={props.timelineBasespotDino?.melee_damage}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="melee_damage" className="rw-field-error" />

        <Label
          name="movement_speed"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Movement speed
        </Label>
        
          <TextField
            name="movement_speed"
            defaultValue={props.timelineBasespotDino?.movement_speed}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="movement_speed" className="rw-field-error" />

        <Label
          name="torpor"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Torpor
        </Label>
        
          <TextField
            name="torpor"
            defaultValue={props.timelineBasespotDino?.torpor}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="torpor" className="rw-field-error" />

        <Label
          name="gender"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Gender
        </Label>
        
          <TextField
            name="gender"
            defaultValue={props.timelineBasespotDino?.gender}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="gender" className="rw-field-error" />

        <Label
          name="wild_health"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Wild health
        </Label>
        
          <TextField
            name="wild_health"
            defaultValue={props.timelineBasespotDino?.wild_health}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true, required: true }}
          />
        

        <FieldError name="wild_health" className="rw-field-error" />

        <Label
          name="wild_stamina"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Wild stamina
        </Label>
        
          <TextField
            name="wild_stamina"
            defaultValue={props.timelineBasespotDino?.wild_stamina}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="wild_stamina" className="rw-field-error" />

        <Label
          name="wild_oxygen"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Wild oxygen
        </Label>
        
          <TextField
            name="wild_oxygen"
            defaultValue={props.timelineBasespotDino?.wild_oxygen}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="wild_oxygen" className="rw-field-error" />

        <Label
          name="wild_food"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Wild food
        </Label>
        
          <TextField
            name="wild_food"
            defaultValue={props.timelineBasespotDino?.wild_food}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="wild_food" className="rw-field-error" />

        <Label
          name="wild_weight"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Wild weight
        </Label>
        
          <TextField
            name="wild_weight"
            defaultValue={props.timelineBasespotDino?.wild_weight}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="wild_weight" className="rw-field-error" />

        <Label
          name="wild_melee_damage"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Wild melee damage
        </Label>
        
          <TextField
            name="wild_melee_damage"
            defaultValue={props.timelineBasespotDino?.wild_melee_damage}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="wild_melee_damage" className="rw-field-error" />

        <Label
          name="wild_movement_speed"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Wild movement speed
        </Label>
        
          <TextField
            name="wild_movement_speed"
            defaultValue={props.timelineBasespotDino?.wild_movement_speed}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="wild_movement_speed" className="rw-field-error" />

        <Label
          name="wild_torpor"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Wild torpor
        </Label>
        
          <TextField
            name="wild_torpor"
            defaultValue={props.timelineBasespotDino?.wild_torpor}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true }}
          />
        

        <FieldError name="wild_torpor" className="rw-field-error" />

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

export default TimelineBasespotDinoForm
