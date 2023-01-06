import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  Submit,
} from '@redwoodjs/forms'

import type { EditTribeById, UpdateTribeInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'



const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}


type FormTribe = NonNullable<EditTribeById['tribe']>

interface TribeFormProps {
  tribe?: EditTribeById['tribe']
  onSave: (data: UpdateTribeInput, id?: FormTribe['id']) => void
  error: RWGqlError
  loading: boolean
}

const TribeForm = (props: TribeFormProps) => {
  const onSubmit = (data: FormTribe) => {
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    props.onSave(data, props?.tribe?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormTribe> onSubmit={onSubmit} error={props.error}>
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
            defaultValue={props.tribe?.name}
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
            defaultValue={props.tribe?.description}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="updated_at"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Updated at
        </Label>
        
          <DatetimeLocalField
            name="updated_at"
            defaultValue={formatDatetime(props.tribe?.updated_at)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="updated_at" className="rw-field-error" />

        <Label
          name="createdBy"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Created by
        </Label>
        
          <TextField
            name="createdBy"
            defaultValue={props.tribe?.createdBy}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="createdBy" className="rw-field-error" />

        <Label
          name="updatedBy"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Updated by
        </Label>
        
          <TextField
            name="updatedBy"
            defaultValue={props.tribe?.updatedBy}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="updatedBy" className="rw-field-error" />

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

export default TribeForm
