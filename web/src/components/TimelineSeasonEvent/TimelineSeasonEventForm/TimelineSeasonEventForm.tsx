import {
  Form,
  FormError,
  FieldError,
  Label,
  DatetimeLocalField,
  TextField,
  Submit,
} from '@redwoodjs/forms'

import { timeTag as formatDatetime } from 'src/lib/formatters'

import type {
  EditTimelineSeasonEventById,
  UpdateTimelineSeasonEventInput,
} from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'

type FormTimelineSeasonEvent = NonNullable<
  EditTimelineSeasonEventById['timelineSeasonEvent']
>

interface TimelineSeasonEventFormProps {
  timelineSeasonEvent?: EditTimelineSeasonEventById['timelineSeasonEvent']
  onSave: (
    data: UpdateTimelineSeasonEventInput,
    id?: FormTimelineSeasonEvent['id']
  ) => void
  error: RWGqlError
  loading: boolean
}

const TimelineSeasonEventForm = (props: TimelineSeasonEventFormProps) => {
  const onSubmit = (data: FormTimelineSeasonEvent) => {
    props.onSave(data, props?.timelineSeasonEvent?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormTimelineSeasonEvent> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="updated_at"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Updated at
        </Label>

        <DatetimeLocalField
          name="updated_at"
          defaultValue={formatDatetime(props.timelineSeasonEvent?.updated_at)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="updated_at" className="rw-field-error" />

        <Label
          name="timeline_season_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Timeline season id
        </Label>

        <TextField
          name="timeline_season_id"
          defaultValue={props.timelineSeasonEvent?.timeline_season_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="timeline_season_id" className="rw-field-error" />

        <Label
          name="title"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Title
        </Label>

        <TextField
          name="title"
          defaultValue={props.timelineSeasonEvent?.title}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="title" className="rw-field-error" />

        <Label
          name="content"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Content
        </Label>

        <TextField
          name="content"
          defaultValue={props.timelineSeasonEvent?.content}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="content" className="rw-field-error" />

        <Label
          name="map_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Map id
        </Label>

        <TextField
          name="map_id"
          defaultValue={props.timelineSeasonEvent?.map_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="map_id" className="rw-field-error" />

        <Label
          name="latitude"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Latitude
        </Label>

        <TextField
          name="latitude"
          defaultValue={props.timelineSeasonEvent?.latitude}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="latitude" className="rw-field-error" />

        <Label
          name="longitude"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Longitude
        </Label>

        <TextField
          name="longitude"
          defaultValue={props.timelineSeasonEvent?.longitude}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="longitude" className="rw-field-error" />

        <Label
          name="images"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Images
        </Label>

        <TextField
          name="images"
          defaultValue={props.timelineSeasonEvent?.images}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="images" className="rw-field-error" />

        <Label
          name="created_by"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Created by
        </Label>

        <TextField
          name="created_by"
          defaultValue={props.timelineSeasonEvent?.created_by}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="created_by" className="rw-field-error" />

        <Label
          name="tags"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Tags
        </Label>

        <TextField
          name="tags"
          defaultValue={props.timelineSeasonEvent?.tags}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="tags" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="rw-button-icon pointer-events-none"
              fill="currentColor"
            >
              <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
            </svg>
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default TimelineSeasonEventForm
