import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
  ImageField,
  NumberField,
} from '@redwoodjs/forms'

import type { EditBasespotById, UpdateBasespotInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import { MaterialGrid } from '../MaterialGrid/MaterialGrid'




interface MaterialCalculatorFormProps {
  error?: RWGqlError
  loading?: boolean
}

const MaterialCalculatorForm = (props: MaterialCalculatorFormProps) => {
  return (
    <div className="rw-form-wrapper container-xl mx-auto">

      <MaterialGrid error={props.error} />

    </div >
  )
}

export default MaterialCalculatorForm
