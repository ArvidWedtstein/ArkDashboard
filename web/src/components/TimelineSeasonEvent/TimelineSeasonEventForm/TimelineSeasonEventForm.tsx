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
import TagInput from "src/components/Util/TagInput/TagInput";
import Button from "src/components/Util/Button/Button";

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
  const [files, setFiles] = useState<string[]>([]);
  const [raid, isRaid] = useState<boolean>(false);
  const onSubmit = (data: FormTimelineSeasonEvent) => {
    data.timeline_season_id = props.timeline_season_id;
    // data.images = data.images + files.join(", ");
    console.log(data);
    props.onSave(data, props?.timelineSeasonEvent?.id);
  };

  return (
    <div className="">
      {props.timelineSeasonEvent?.id && (
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

          <div className="relative max-w-sm">
            <TextField
              name="title"
              defaultValue={props.timelineSeasonEvent?.title}
              className="rw-float-input peer"
              errorClassName="rw-float-input rw-input-error"
              placeholder=" "
            />
            <Label
              name="title"
              className="rw-float-label"
              errorClassName="rw-float-label rw-label-error"
            >
              Title
            </Label>
            <FieldError name="title" className="rw-field-error" />
          </div>

          <div className="relative max-w-sm">
            <TextAreaField
              name="content"
              defaultValue={props.timelineSeasonEvent?.content}
              className="rw-float-input peer"
              errorClassName="rw-float-input rw-input-error"
              placeholder=" "
            />
            <Label
              name="content"
              className="rw-float-label"
              errorClassName="rw-float-label rw-label-error"
            >
              Content
            </Label>
            <FieldError name="content" className="rw-field-error" />
          </div>

          <Label
            name="raid"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Raid?
          </Label>
          <input
            type="checkbox"
            className="rw-input"
            name="raid"
            checked={raid}
            onChange={(e) => isRaid(e.currentTarget.checked)}
          />

          <Lookup
            options={props?.maps || []}
            getOptionLabel={(option) => option.name}
            loading={props.loading}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionImage={(option) =>
              `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${option.icon}`
            }
            name="map_id"
            label="Map"
            defaultValue={props.timelineSeasonEvent?.map_id}
          />

          {raid && (
            <>
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
                emptyAs={0}
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
                emptyAs={0}
              />

              <FieldError name="longitude" className="rw-field-error" />
            </>
          )}

          <FileUpload
            className="relative !w-full"
            storagePath="timelineeventimages"
            defaultValue={props?.timelineSeasonEvent?.images}
            multiple
            name="images"
          />

          <TagInput
            name="tags"
            defaultValue={`${props.timelineSeasonEvent?.tags || ""}${raid ? "raid" : ""
              }`}
          />

          <FieldError name="tags" className="rw-field-error" />

          {/* <div className="rw-button-group">
          <Submit
            disabled={props.loading} // OLD
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
        </div> */}
        </Form>
      )}

      {!props.timelineSeasonEvent?.id && (
        <Form<FormTimelineSeasonEvent>
          onSubmit={onSubmit}
          error={props.error}
          className="relative"
        >
          <FormError
            error={props.error}
            wrapperClassName="rw-form-error-wrapper"
            titleClassName="rw-form-error-title"
            listClassName="rw-form-error-list"
          />
          <div className="overflow-hidden">
            <TextField
              name="title"
              defaultValue={props.timelineSeasonEvent?.title}
              className="block w-full bg-transparent px-3 pt-2.5 pb-2 text-lg font-medium text-zinc-500 outline-none dark:text-zinc-300"
              errorClassName="rw-float-input rw-input-error"
              placeholder="Title"
            />
            <TextAreaField
              name="content"
              defaultValue={props.timelineSeasonEvent?.content}
              className="block w-full bg-transparent py-0 px-3 text-sm text-zinc-500 outline-none dark:text-zinc-300"
              errorClassName="rw-float-input rw-input-error"
              placeholder="Write a description..."
            />
            <TagInput
              name="tags"
              placeholder="Tags"
              className="mb-2 px-2"
              tagClassName="rw-button rw-button-small rw-button-gray !rounded-full"
              inputClassName="dark:text-zinc-300 text-zinc-500 text-sm py-0 px-3 outline-none bg-transparent"
              defaultValue={`${props.timelineSeasonEvent?.tags || ""}${raid ? "raid" : ""
                }`}
            />
            <FileUpload
              className="relative !w-full !rounded-none border-none !bg-transparent"
              storagePath="timelineeventimages"
              defaultValue={props?.timelineSeasonEvent?.images}
              multiple
              name="images"
            />
            <div aria-hidden="true" className="">
              <div className="h-12 py-2" />
            </div>
          </div>
          <div className="absolute right-0.5 left-0.5 bottom-0">
            <div className="flex items-center justify-between border-t border-zinc-500 py-2 px-3">
              <div className="flex">
                <button
                  className="-ml-2 inline-flex items-center rounded-full py-2 px-3"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="-ml-1 mr-2 block h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-sm italic">Attach file</span>
                </button>
              </div>
              <div className="shrink-0">
                <Button type="submit" size="small" variant="contained" color="success">Create</Button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default TimelineSeasonEventForm;
