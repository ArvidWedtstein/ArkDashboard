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
      </Form>
    </div>
  );
};

export default TimelineSeasonPersonForm;
