import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  TextAreaField,
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
        
          <TextAreaField
            name="health"
            defaultValue={JSON.stringify(props.timelineBasespotDino?.health)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsJSON: true }}
          />
        

        <FieldError name="health" className="rw-field-error" />

        <Label
          name="stamina"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Stamina
        </Label>
        
          <TextAreaField
            name="stamina"
            defaultValue={JSON.stringify(props.timelineBasespotDino?.stamina)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsJSON: true }}
          />
        

        <FieldError name="stamina" className="rw-field-error" />

        <Label
          name="oxygen"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Oxygen
        </Label>
        
          <TextAreaField
            name="oxygen"
            defaultValue={JSON.stringify(props.timelineBasespotDino?.oxygen)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsJSON: true }}
          />
        

        <FieldError name="oxygen" className="rw-field-error" />

        <Label
          name="food"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Food
        </Label>
        
          <TextAreaField
            name="food"
            defaultValue={JSON.stringify(props.timelineBasespotDino?.food)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsJSON: true }}
          />
        

        <FieldError name="food" className="rw-field-error" />

        <Label
          name="weight"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Weight
        </Label>
        
          <TextAreaField
            name="weight"
            defaultValue={JSON.stringify(props.timelineBasespotDino?.weight)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsJSON: true }}
          />
        

        <FieldError name="weight" className="rw-field-error" />

        <Label
          name="melee_damage"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Melee damage
        </Label>
        
          <TextAreaField
            name="melee_damage"
            defaultValue={JSON.stringify(props.timelineBasespotDino?.melee_damage)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsJSON: true }}
          />
        

        <FieldError name="melee_damage" className="rw-field-error" />

        <Label
          name="movement_speed"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Movement speed
        </Label>
        
          <TextAreaField
            name="movement_speed"
            defaultValue={JSON.stringify(props.timelineBasespotDino?.movement_speed)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsJSON: true }}
          />
        

        <FieldError name="movement_speed" className="rw-field-error" />

        <Label
          name="torpor"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Torpor
        </Label>
        
          <TextAreaField
            name="torpor"
            defaultValue={JSON.stringify(props.timelineBasespotDino?.torpor)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsJSON: true }}
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
