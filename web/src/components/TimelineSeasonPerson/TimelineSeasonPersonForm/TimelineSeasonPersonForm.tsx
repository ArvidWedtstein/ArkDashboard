import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
  SelectField,
} from "@redwoodjs/forms";
import type {
  EditTimelineSeasonPersonById,
  NewTimelineSeasonPerson,
  UpdateTimelineSeasonPersonInput,
} from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import { Input } from "src/components/Util/Input/Input";

type FormTimelineSeasonPerson = NonNullable<
  EditTimelineSeasonPersonById["timelineSeasonPerson"]
>;

interface TimelineSeasonPersonFormProps {
  timelineSeasonPerson?: EditTimelineSeasonPersonById["timelineSeasonPerson"];
  timeline_season_id?: string;
  profiles?: NewTimelineSeasonPerson["profiles"];
  onSave: (
    data: UpdateTimelineSeasonPersonInput,
    id?: FormTimelineSeasonPerson["id"]
  ) => void;
  error: RWGqlError;
  loading: boolean;
}

const TimelineSeasonPersonForm = (props: TimelineSeasonPersonFormProps) => {
  const onSubmit = (data: FormTimelineSeasonPerson) => {
    data.timeline_season_id = props.timeline_season_id;
    props.onSave(data, props?.timelineSeasonPerson?.id);
  };

  return (
    <div className="rw-form-wrapper">
      <Form<FormTimelineSeasonPerson> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Lookup
          name="user_id"
          label="User"
          options={props?.profiles ?? []}
          getOptionLabel={(option) => option.username}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionValue={(opt) => opt.id}
          defaultValue={props.timelineSeasonPerson?.user_id}
        />

        <Lookup
          name="permission"
          label="Role"
          options={[
            { label: 'Guest', value: 'guest' },
            { label: 'Member', value: 'member' },
            { label: 'Admin', value: 'admin' },
          ]}
          getOptionLabel={(option) => option.label}
          getOptionValue={(opt) => opt.value}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          defaultValue={props.timelineSeasonPerson?.user_id}
        />

        <Input
          name="ingame_name"
          fullWidth
          label="Ingame Name"
          color="DEFAULT"
          variant="outlined"
          defaultValue={props.timelineSeasonPerson?.ingame_name}
        />

        {/* {props?.timelineSeasonPerson && (
          <div className="rw-button-group">
            <Submit
              disabled={props.loading}
              className="rw-button rw-button-blue"
            >
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
        )} */}
      </Form>
    </div>
  );
};

export default TimelineSeasonPersonForm;
