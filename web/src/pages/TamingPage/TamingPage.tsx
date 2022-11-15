import { FieldError, Form, FormError, Label, Submit, TextField } from '@redwoodjs/forms'
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { useEffect, useState } from 'react'

import type { EditBasespotById, UpdateBasespotInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import { Card } from 'src/components/Card'
interface BasespotFormProps {
  error: RWGqlError
  loading: boolean
}
interface tameProps {
  name?: string
  status?: string
  level?: number
  tameMethod?: string
  tamingMultiplier?: number
  consumptionMultiplier?: number
  data?: any[]
}
const TamingPage = (props: BasespotFormProps) => {
  const [dino, setDino] = useState('')
  const [tame, setTame] = useState<any>()


  const onSubmit = (data) => {
    fetch(`https://ark-survival-evolved-tame-data.p.rapidapi.com?creature=${dino}&level=150&tamingMultiplier=1&consumptionMultiplier=1`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.ARK_KEY,
        'X-RapidAPI-Host': 'ark-survival-evolved-tame-data.p.rapidapi.com',
      }
    })
      .then((response) => response.json())
      .then((json) => setTame(json))
  }


  return (
    <>
    <MetaTags title="Taming" description="Taming page" />

    <h1 className="text-xl">TamingPage</h1>

    <div className="container text-center p-4">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
        <Label
          name="dino"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Dino
        </Label>

          <TextField
            name="dino"
            typeof='search'
            defaultValue={dino}
            className="rw-input"
            errorClassName="rw-input rw-input-error"

            onChange={(e) => setDino(e.target.value)}
          />


        <FieldError name="dino" className="rw-field-error" />

      </Form>
      <ul>
        <li>{tame?.name}</li>
        <li>{tame?.level}</li>
        <li>{tame?.tameMethod}</li>
        <li>{tame?.tamingMultiplier}</li>
        <li>{tame?.consumptionMultiplier}</li>

      </ul>
      <Card title={tame?.name} sub={tame ? `Level ${tame?.level}` : undefined} tamingFood={tame ? tame.data.splice(0, 1) : []}/>
    </div>
    </>
  )
}

export default TamingPage
// https://codepen.io/Tristangre97/pen/VgydBG


// Tek Gen calculator
// let radius = 2
// let elementshardamount = 0
// let fuelconsumptionrate = 1
// let elementamount = 20
// function base() {
//   return Math.abs(1+((radius - 1)* 0.33)) //don't round
// }
// function hourlyrate() {
//   return Math.abs(18 / base())
// }
// function shardsconverted() {
//   return Math.abs(elementshardamount / 100)
// }
// function elementtotal() {
// return Math.abs(elementamount) + Math.abs(shardsconverted());
// }
// function willlast() {
//   return Math.abs((elementtotal()) * hourlyrate()) * fuelconsumptionrate;
// }
// function secondstotal() {
// return Math.abs(willlast()   * 3600)
// }
// function days() {
//  return Math.floor(secondstotal() / (3600*24))
// }
// function hours() {
//   return parseInt(String(secondstotal() / 3600)) % 24
// }
// function minutes() {
//   return parseInt(String((secondstotal() % 3600) / 60))
// }
// function seconds() {
//   return parseInt(String(secondstotal() % 60))
// }