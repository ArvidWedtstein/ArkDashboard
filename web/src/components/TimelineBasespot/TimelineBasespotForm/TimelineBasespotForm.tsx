import {
  Form,
  FormError,
  FieldError,
  Label,
  DatetimeLocalField,
  TextField,
  TextAreaField,
  Submit,
  SelectField,
  useForm,
} from '@redwoodjs/forms'

import type { EditTimelineBasespotById, UpdateTimelineBasespotInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import Lookup from 'src/components/Util/Lookup/Lookup'
import { useAuth } from '@redwoodjs/auth'
import { useEffect, useState } from 'react'



const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}


type FormTimelineBasespot = NonNullable<EditTimelineBasespotById['timelineBasespot']>

interface TimelineBasespotFormProps {
  timelineBasespot?: EditTimelineBasespotById['timelineBasespot']
  onSave: (data: UpdateTimelineBasespotInput, id?: FormTimelineBasespot['id']) => void
  error: RWGqlError
  loading: boolean
}

const TimelineBasespotForm = (props: TimelineBasespotFormProps) => {
  let { isAuthenticated, client: supabase } = useAuth();
  let [basespots, setBasespots] = useState([])
  let [selectedBasespot, setSelectedBasespot] = useState(null)
  const onSubmit = (data: FormTimelineBasespot) => {
    if (selectedBasespot) {
      data.map = selectedBasespot?.map
      data.location = { lat: selectedBasespot?.latitude, lon: selectedBasespot?.longitude }
    }
    props.onSave(data, props?.timelineBasespot?.id)
  }
  const getBasespots = async () => {
    let { data, error, status } = await supabase
      .from("basespot")
      .select(
        `id, name, map, latitude, longitude`
      )

    if (error && status !== 406) {
      throw error;
    }
    if (data) {
      setBasespots(data)
    }
  }
  useEffect(() => {
    getBasespots()
    props?.timelineBasespot?.basespot_id ? setSelectedBasespot(basespots.find((b) => b.id === props?.timelineBasespot?.basespot_id)) : null
  }, [])


  // let { handleSubmit, control } = useForm<FormTimelineBasespot>({
  //   defaultValues: {
  //     timeline_id: props?.timelineBasespot?.timeline_id,
  //     startDate: formatDatetime(props?.timelineBasespot?.startDate),
  //     endDate: formatDatetime(props?.timelineBasespot?.endDate),
  //     basespot_id: props?.timelineBasespot?.basespot_id,
  //     location: props?.timelineBasespot?.location,
  //     map: props?.timelineBasespot?.map,


  //   },
  // })
  return (
    <div className="rw-form-wrapper">
      <Form<FormTimelineBasespot> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />


        <Label
          name="timeline_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Timeline id
        </Label>

        <TextField
          name="timeline_id"
          defaultValue={props.timelineBasespot?.timeline_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />


        <FieldError name="timeline_id" className="rw-field-error" />

        <div className="flex flex-row justify-between">
          <div className="w-1/2">

            <Label
              name="startDate"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Start date
            </Label>

            <DatetimeLocalField
              name="startDate"
              defaultValue={formatDatetime(props.timelineBasespot?.startDate)}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              emptyAs={null}
              validation={{ required: true }}
            />

            <FieldError name="startDate" className="rw-field-error" />
          </div>
          <div className="w-1/2">
            <Label
              name="endDate"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              End date
            </Label>

            <DatetimeLocalField
              name="endDate"
              defaultValue={formatDatetime(props.timelineBasespot?.endDate)}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
            />


            <FieldError name="endDate" className="rw-field-error" />
          </div>
        </div>

        <Label
          name="basespot_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Basespot
        </Label>
        <Lookup
          value={props.timelineBasespot?.basespot_id ? basespots.find((b) => b.id === props.timelineBasespot?.basespot_id).name : null}
          items={basespots}
          onChange={(e) => setSelectedBasespot(e)}
        >
          {!!selectedBasespot ? selectedBasespot.name : "Choose Basespot"}
        </Lookup>
        <TextField
          name="basespot_id"
          defaultValue={props.timelineBasespot?.basespot_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />


        <FieldError name="basespot_id" className="rw-field-error" />

        <Label
          name="tribeName"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Tribe name
        </Label>

        <TextField
          name="tribeName"
          defaultValue={props.timelineBasespot?.tribeName}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />


        <FieldError name="tribeName" className="rw-field-error" />

        <Label
          name="map"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Map
        </Label>

        <SelectField
          className="rw-input"
          name="map"
          defaultValue={props.timelineBasespot?.map || selectedBasespot?.map}
          validation={{ required: true }}
          errorClassName="rw-input rw-input-error"
          disabled={!(!!props.timelineBasespot?.basespot_id)}
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
        {/* <TextField
          name="map"
          defaultValue={props.timelineBasespot?.map}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        /> */}

        <FieldError name="map" className="rw-field-error" />

        <Label
          name="server"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Server
        </Label>

        <TextField
          name="server"
          defaultValue={props.timelineBasespot?.server}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />


        <FieldError name="server" className="rw-field-error" />

        <Label
          name="region"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Region
        </Label>

        <TextField
          name="region"
          defaultValue={props.timelineBasespot?.region}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />


        <FieldError name="region" className="rw-field-error" />

        <Label
          name="season"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Season
        </Label>

        <TextField
          name="season"
          defaultValue={props.timelineBasespot?.season}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />


        <FieldError name="season" className="rw-field-error" />

        <Label
          name="cluster"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Cluster
        </Label>

        <TextField
          name="cluster"
          defaultValue={props.timelineBasespot?.cluster}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />


        <FieldError name="cluster" className="rw-field-error" />

        <Label
          name="location"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Location
        </Label>

        <TextAreaField
          name="location"
          defaultValue={JSON.stringify(props.timelineBasespot?.location)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />


        <FieldError name="location" className="rw-field-error" />

        <Label
          name="players"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Players
        </Label>

        <TextField
          name="players"
          defaultValue={props.timelineBasespot?.players}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={""}
          validation={{ required: true }}
        />


        <FieldError name="players" className="rw-field-error" />

        <Label
          name="raided_by"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Raided by
        </Label>

        <TextField
          name="raided_by"
          defaultValue={props.timelineBasespot?.raided_by}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />


        <FieldError name="raided_by" className="rw-field-error" />

        <Label
          name="raidcomment"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Raidcomment
        </Label>

        <TextAreaField
          name="raidcomment"
          defaultValue={props.timelineBasespot?.raidcomment}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />


        <FieldError name="raidcomment" className="rw-field-error" />

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

export default TimelineBasespotForm
