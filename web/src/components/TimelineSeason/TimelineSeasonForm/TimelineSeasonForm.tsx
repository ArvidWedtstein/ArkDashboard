import {
  Form,
  FormError,
  FieldError,
  Label,
  DatetimeLocalField,
  TextField,
  Submit,
} from "@redwoodjs/forms";

import { timeTag as formatDatetime } from "src/lib/formatters";

import type {
  EditTimelineSeasonById,
  UpdateTimelineSeasonInput,
} from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import Button, { ButtonGroup } from "src/components/Util/Button/Button";
import { Input } from "src/components/Util/Input/Input";
import DatePicker from "src/components/Util/DatePicker/DatePicker";

type FormTimelineSeason = NonNullable<EditTimelineSeasonById["timelineSeason"]>;

interface TimelineSeasonFormProps {
  timelineSeason?: EditTimelineSeasonById["timelineSeason"];
  onSave: (
    data: UpdateTimelineSeasonInput,
    id?: FormTimelineSeason["id"]
  ) => void;
  error: RWGqlError;
  loading: boolean;
}

const TimelineSeasonForm = (props: TimelineSeasonFormProps) => {
  const onSubmit = (data: FormTimelineSeason) => {
    props.onSave(data, props?.timelineSeason?.id);
  };

  return (
    <Form<FormTimelineSeason> onSubmit={onSubmit} error={props.error}>
      <FormError
        error={props.error}
        wrapperClassName="rw-form-error-wrapper"
        titleClassName="rw-form-error-title"
        listClassName="rw-form-error-list"
      />

      <ButtonGroup>
        <Input
          label="Server"
          name="server"
          defaultValue={props.timelineSeason?.server}
        />

        <Input
          label="Cluster"
          name="cluster"
          defaultValue={props.timelineSeason?.cluster}
        />
      </ButtonGroup>

      <br />

      <ButtonGroup>
        <Input
          label="Season"
          name="season"
          defaultValue={props.timelineSeason?.season}
        />

        <DatePicker
          name="season_start_date"
          label="Season Start"
          defaultValue={new Date(props.timelineSeason?.season_start_date || new Date())}
        />

        <DatePicker
          name="season_end_date"
          label="Season End"
          defaultValue={new Date(props.timelineSeason?.season_end_date || new Date())}
        />
      </ButtonGroup>

      <br />

      <Input
        label="Tribe Name"
        name="tribe_name"
        defaultValue={props.timelineSeason?.tribe_name}
      />

      <br />

      <Button type="submit" variant="contained" color="success" disabled={props.loading} startIcon={(
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-5 pointer-events-none"
          fill="currentColor"
        >
          <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
        </svg>
      )}>
        Save
      </Button>
    </Form>
  );
};

export default TimelineSeasonForm;
