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
import clsx from 'clsx'
import { RouteAnnouncement } from '@redwoodjs/router'

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

        <fieldset className="rw-form-group">
          <legend>Base Duration</legend>
          <div>
            <div>
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
            <div>
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
                emptyAs={null}
              />

              <FieldError name="endDate" className="rw-field-error" />
            </div>
          </div>
        </fieldset>


        <Label
          name="basespot_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Basespot
        </Label>

        <Lookup
          defaultValue={props.timelineBasespot?.basespot_id ? basespots.find((b) => b.id === props.timelineBasespot?.basespot_id).name : null}
          items={basespots}
          onChange={(e) => setSelectedBasespot(e)}
          name="basespot_id"
        >
          {!!selectedBasespot ? selectedBasespot.name : "Choose Basespot"}
        </Lookup>

        {/* <TextField
          name="basespot_id"
          defaultValue={props.timelineBasespot?.basespot_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        /> */}


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

        {/* TODO: Replace with maps from db */}

        <Lookup items={[
          { name: "Valguero", value: "1" },
          { name: "The Island", value: "2" },
          { name: "The Center", value: "3" },
          { name: "Ragnarok", value: "4" },
          { name: "Abberation", value: "5" },
          { name: "Extinction", value: "6" },
          { name: "Scorched Earth", value: "7" },
          { name: "Genesis", value: "8" },
          { name: "Genesis 2", value: "9" },
          { name: "Crystal Isles", value: "10" },
          { name: "Fjordur", value: "11" },
          { name: "Lost Island", value: "12" }
        ]} name="map" defaultValue={props.timelineBasespot?.map || selectedBasespot?.map} disabled={!(!props.timelineBasespot?.basespot_id)} />

        <FieldError name="map" className="rw-field-error" />

        <fieldset className="rw-form-group">
          <legend>Server Info</legend>
          <div>
            <div>
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
            </div>
            <div>
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
            </div>
          </div>
          <div>
            <div>
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
            </div>
            <div>
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
            </div>
          </div>
        </fieldset>


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
          defaultValue={props.timelineBasespot?.players.join(", ")}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={""}
          validation={{
            required: false,
            setValueAs: (e) =>
              e.length > 0 ? e.split(",").map((s) => s.trim()) : null,
          }}
        />
        <p className="rw-helper-text">
          Player names, comma seperated
        </p>

        <FieldError name="players" className="rw-field-error" />

        {(true || !props.timelineBasespot?.endDate) && (
          <fieldset className="rw-form-group">
            <legend>Raid Info</legend>
            <div>
              <div>
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
                <p className="rw-helper-text">The name of the tribe you got raided by</p>

                <FieldError name="raided_by" className="rw-field-error" />
              </div>
              <div>
                <Label
                  name="raidcomment"
                  className="rw-label"
                  errorClassName="rw-label rw-label-error"
                >
                  Raid Comment
                </Label>

                <TextAreaField
                  name="raidcomment"
                  defaultValue={props.timelineBasespot?.raidcomment}
                  className="rw-input"
                  errorClassName="rw-input rw-input-error"
                />

                <FieldError name="raidcomment" className="rw-field-error" />
              </div>
            </div>
          </fieldset>
        )}

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
