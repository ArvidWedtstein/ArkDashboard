import {
  Form,
  FormError,
  FieldError,
  Label,
  DatetimeLocalField,
  TextField,
} from "@redwoodjs/forms";

import type {
  EditTimelineSeasonBasespotById,
  NewTimelineSeasonBasespot,
  UpdateTimelineSeasonBasespotInput,
} from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import { Input } from "src/components/Util/Input/Input";
import DatePicker from "src/components/Util/DatePicker/DatePicker";
import Button from "src/components/Util/Button/Button";

type FormTimelineSeasonBasespot = NonNullable<
  EditTimelineSeasonBasespotById["timelineSeasonBasespot"]
>;

interface TimelineSeasonBasespotFormProps {
  timelineSeasonBasespot?: EditTimelineSeasonBasespotById["timelineSeasonBasespot"];
  timeline_season_id?: string;
  maps?: NewTimelineSeasonBasespot["maps"];
  basespots?: NewTimelineSeasonBasespot["basespots"];
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

        <DatePicker
          label="Start Date"
          name="start_date"
          defaultValue={new Date(props.timelineSeasonBasespot?.start_date) ??
            new Date()}
        />


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

        <Lookup
          options={props?.basespots || []}
          name="basespot_id"
          label="Basespot"
          getOptionValue={(opt) => opt.id}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          defaultValue={props.timelineSeasonBasespot?.basespot_id}
          placeholder="Select a basespot"
        />

        <FieldError name="basespot_id" className="rw-field-error" />

        <Lookup
          options={props?.maps || []}
          name="map_id"
          label="Map"
          getOptionLabel={(option) => option.name}
          getOptionValue={(opt) => opt.id}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionImage={(option) => `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${option.icon}`}
          defaultValue={props.timelineSeasonBasespot?.map_id}
          placeholder="Select a map"
        />

        <Input
          color="DEFAULT"
          label="Latitude"
          name="latitude"
          type="number"
          defaultValue={props.timelineSeasonBasespot?.latitude ?? 0}
          validation={{
            valueAsNumber: true
          }}
          SuffixProps={{
            style: {
              borderRadius: '0.375rem 0 0 0.375rem',
              marginRight: '-0.5px'
            }
          }}
        />
        <Input
          color="DEFAULT"
          label="Longitude"
          name="longitude"
          type="number"
          defaultValue={props.timelineSeasonBasespot?.longitude ?? 0}
          validation={{
            valueAsNumber: true
          }}
          SuffixProps={{
            style: {
              borderRadius: '0 0.375rem 0.375rem 0',
              marginLeft: '-0.5px'
            }
          }}
        />

        {/* <br /> */}
        {/* <Button
          type="submit"
          color="success"
          variant="outlined"
          disabled={props.loading}
          startIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="pointer-events-none"
              fill="currentColor"
            >
              <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
            </svg>
          }
        >
          Save
        </Button> */}
      </Form>
    </div>
  );
};

export default TimelineSeasonBasespotForm;
