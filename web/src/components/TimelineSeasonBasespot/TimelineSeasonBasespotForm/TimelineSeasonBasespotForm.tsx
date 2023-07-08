import {
  Form,
  FormError,
  FieldError,
  Label,
  DatetimeLocalField,
  TextField,
  Submit,
} from "@redwoodjs/forms";

import type {
  EditTimelineSeasonBasespotById,
  UpdateTimelineSeasonBasespotInput,
} from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import Lookup from "src/components/Util/Lookup/Lookup";

type FormTimelineSeasonBasespot = NonNullable<
  EditTimelineSeasonBasespotById["timelineSeasonBasespot"]
>;

interface TimelineSeasonBasespotFormProps {
  timelineSeasonBasespot?: EditTimelineSeasonBasespotById["timelineSeasonBasespot"];
  timeline_season_id?: string;
  onSave: (
    data: UpdateTimelineSeasonBasespotInput,
    id?: FormTimelineSeasonBasespot["id"]
  ) => void;
  error: RWGqlError;
  loading: boolean;
}

const TimelineSeasonBasespotForm = (props: TimelineSeasonBasespotFormProps) => {
  const onSubmit = (data: FormTimelineSeasonBasespot) => {
    data.timeline_season_id = props.timeline_season_id;
    props.onSave(data, props?.timelineSeasonBasespot?.id);
  };

  return (
    <div className="rw-form-wrapper">
      <Form<FormTimelineSeasonBasespot> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <div className="relative max-w-sm">
          <DatetimeLocalField
            name="start_date"
            defaultValue={
              props.timelineSeasonBasespot?.start_date ??
              new Date(new Date().toString().split("GMT")[0] + " UTC")
                .toISOString()
                .split(".")[0]
                .toString()
                .slice(0, -3)
            }
            className="rw-float-input peer"
            errorClassName="rw-float-input rw-input-error"
            validation={{
              valueAsDate: true,
            }}
          />
          <Label
            name="start_date"
            className="rw-float-label"
            errorClassName="rw-float-label rw-label-error"
          >
            Start date
          </Label>

          <FieldError name="start_date" className="rw-field-error" />
        </div>

        {/* TODO: set enddate automatically when raid is registered in TimelineSeasonEvent form */}
        {/* <Label
          name="end_date"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          End date
        </Label>

        <DatetimeLocalField
          name="end_date"
          defaultValue={props.timelineSeasonBasespot?.end_date}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="end_date" className="rw-field-error" /> */}

        {/* TODO: Insert basespot lookup */}
        {/* <Label
          name="basespot_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Basespot id
        </Label>

        <TextField
          name="basespot_id"
          defaultValue={props.timelineSeasonBasespot?.basespot_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={null}
        />

        <FieldError name="basespot_id" className="rw-field-error" /> */}

        <Lookup
          options={[
            { label: "Valguero", value: 1 },
            { label: "The Island", value: 2 },
            { label: "The Center", value: 3 },
            { label: "Ragnarok", value: 4 },
            { label: "Aberration", value: 5 },
            { label: "Extinction", value: 6 },
            { label: "Scorched Earth", value: 7 },
            { label: "Genesis", value: 8 },
            { label: "Genesis 2", value: 9 },
            { label: "Crystal Isles", value: 10 },
            { label: "Fjordur", value: 11 },
            { label: "Lost Island", value: 12 },
          ]}
          name="map_id"
          defaultValue={props.timelineSeasonBasespot?.map}
          placeholder="Select a map"
          className="mt-3"
        />
        <FieldError name="map_id" className="rw-field-error" />

        <div className="rw-button-group">
          <div className="relative max-w-sm" role="textbox">
            <TextField
              name="latitude"
              defaultValue={props.timelineSeasonBasespot?.latitude ?? 0}
              className="rw-float-input peer"
              errorClassName="rw-float-input rw-input-error"
              validation={{ valueAsNumber: true }}
            />
            <Label
              name="latitude"
              className="rw-float-label"
              errorClassName="rw-float-label rw-label-error"
            >
              Latitude
            </Label>

            <FieldError name="latitude" className="rw-field-error" />
            <input type="hidden" />
          </div>
          <div className="relative max-w-sm" role="textbox">
            <input type="hidden" />
            <TextField
              name="longitude"
              defaultValue={props.timelineSeasonBasespot?.longitude ?? 0}
              className="rw-float-input peer"
              errorClassName="rw-float-input rw-input-error"
              validation={{ valueAsNumber: true }}
            />
            <Label
              name="longitude"
              className="rw-float-label"
              errorClassName="rw-float-label rw-label-error"
            >
              Longitude
            </Label>

            <FieldError name="longitude" className="rw-field-error" />
          </div>
        </div>

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="rw-button-icon-end pointer-events-none"
              fill="currentColor"
            >
              <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
            </svg>
          </Submit>
        </div>
      </Form>
    </div>
  );
};

export default TimelineSeasonBasespotForm;
