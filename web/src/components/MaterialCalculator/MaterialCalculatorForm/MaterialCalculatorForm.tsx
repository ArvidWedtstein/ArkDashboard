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

import arkitems from '../../../../public/arkitems.json'
import { MaterialGrid } from '../MaterialGrid/MaterialGrid'




interface MaterialCalculatorFormProps {
  error?: RWGqlError
  loading?: boolean
}

const MaterialCalculatorForm = (props: MaterialCalculatorFormProps) => {
  let { itemStats, items } = arkitems
  items = items.map(v => ({ ...v, amount: 1 }))


  return (
    <div className="rw-form-wrapper container mx-auto">

      <MaterialGrid items={items} error={props.error} />
    </div >
  )
}

export default MaterialCalculatorForm
