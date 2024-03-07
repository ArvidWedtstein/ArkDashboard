import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
  TextAreaField,
} from "@redwoodjs/forms";

import type {
  EditTimelineSeasonEventById,
  NewTimelineSeasonEvent,
  UpdateTimelineSeasonEventInput,
} from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import FileUpload from "src/components/Util/FileUpload/FileUpload";
import { useState } from "react";
import { ButtonGroup } from "src/components/Util/Button/Button";
import { Input } from "src/components/Util/Input/Input";
import Switch from "src/components/Util/Switch/Switch";
import Badge from "src/components/Util/Badge/Badge";

type FormTimelineSeasonEvent = NonNullable<
  EditTimelineSeasonEventById["timelineSeasonEvent"]
>;

interface TimelineSeasonEventFormProps {
  timelineSeasonEvent?: EditTimelineSeasonEventById["timelineSeasonEvent"];
  timeline_season_id?: string;
  maps?: NewTimelineSeasonEvent["maps"];
  onSave: (
    data: UpdateTimelineSeasonEventInput,
    id?: FormTimelineSeasonEvent["id"]
  ) => void;
  error: RWGqlError;
  loading: boolean;
}

const TimelineSeasonEventForm = (props: TimelineSeasonEventFormProps) => {
  const [tags, setTags] = useState<string[]>(
    props?.timelineSeasonEvent?.tags.trim()
      .split(", ")
      .filter((t) => t !== "") || []
  );
  const onSubmit = (data: FormTimelineSeasonEvent) => {
    data.timeline_season_id = props.timeline_season_id;
    // data.images = data.images + files.join(", ");
    data.tags = tags.join(', ');
    props.onSave(data, props?.timelineSeasonEvent?.id);
  };

  return (
    <Form<FormTimelineSeasonEvent>
      onSubmit={onSubmit}
      error={props.error}
      className="space-y-1"
    >
      <FormError
        error={props.error}
        wrapperClassName="rw-form-error-wrapper"
        titleClassName="rw-form-error-title"
        listClassName="rw-form-error-list"
      />


      <Input
        name="title"
        label="Title"
        defaultValue={props.timelineSeasonEvent?.title}
      />

      <br />

      <Input
        name="content"
        label="Content"
        defaultValue={props.timelineSeasonEvent?.content}
        multiline
      />

      <br />

      <Switch
        offLabel="Raid?"
        name="raid"
        onChange={(e) => setTags((prev) => e.currentTarget.checked ? [...prev, 'raid'] : prev.filter(f => f !== 'raid'))}
      />

      <Lookup
        options={props?.maps || []}
        getOptionLabel={(option) => option.name}
        loading={props.loading}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionValue={(opt) => opt.id}
        getOptionImage={(option) =>
          `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${option.icon}`
        }
        name="map_id"
        label="Map"
        defaultValue={props.timelineSeasonEvent?.map_id}
      />

      {tags.some((t => t === 'raid')) && (
        <ButtonGroup>
          <Input
            name="latitude"
            label="Latitude"
            defaultValue={props.timelineSeasonEvent?.latitude}
            InputProps={{
              inputProps: {
                inputMode: 'decimal'
              }
            }}
          />
          <Input
            name="longitude"
            label="Longitude"
            defaultValue={props.timelineSeasonEvent?.longitude}
            InputProps={{
              inputProps: {
                inputMode: 'decimal'
              }
            }}
          />
        </ButtonGroup>
      )}

      <FileUpload
        className="relative !w-full"
        storagePath="timelineeventimages"
        defaultValue={props?.timelineSeasonEvent?.images}
        multiple
        name="images"
      />

      <div className="flex space-x-1 flex-wrap">
        {tags.map((tag, idx) => (
          <Badge key={`tag-${idx}`} standalone size="small" variant="outlined" color="secondary" content={tag} onClick={(e) => setTags(tags.filter((t, i) => i !== idx))} />
        ))}
      </div>

      <Input
        name="tags"
        label="Tags"
        defaultValue={tags.join(', ')}
        onChange={(e) => {
          if (e.target.value.includes(',')) {
            if (e.target.value.trim().length > 0) {
              setTags((prev) => [...prev, e.target.value.replace(',', '').trim()]);
            }
            e.target.value = "";
          }
        }}
      />
    </Form>
  );
};

export default TimelineSeasonEventForm;
