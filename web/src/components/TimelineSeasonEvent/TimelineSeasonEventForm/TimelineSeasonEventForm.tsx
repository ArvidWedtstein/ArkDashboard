import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
  TextAreaField,
  CheckboxField,
} from "@redwoodjs/forms";

import type {
  EditTimelineSeasonEventById,
  NewTimelineSeasonEvent,
  UpdateTimelineSeasonEventInput,
} from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import Lookup from "src/components/Util/Lookup/Lookup";
import FileUpload, {
  FileUpload2,
} from "src/components/Util/FileUpload/FileUpload";
import { useState } from "react";
import TagInput from "src/components/Util/TagInput/TagInput";

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
    // props.onSave(data, props?.timelineSeasonEvent?.id);
  };

  return (
    <div className="my-3 rw-form-wrapper">
      {/* <Form<FormTimelineSeasonEvent>
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
          options={props?.maps.map((map) => ({
            label: map.name,
            value: map.id,
            image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${map.icon}`,
          }))}
          name="map_id"
          defaultValue={props.timelineSeasonEvent?.map_id}
          placeholder="Select a map"
        />

        <FieldError name="map_id" className="rw-field-error" />

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

        <FileUpload2
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

        <div className="relative max-w-sm">
          <TextField
            name="tags" // OLD
            defaultValue={props.timelineSeasonEvent?.tags}
            className="rw-float-input peer"
            errorClassName="rw-float-input rw-input-error"
            placeholder=" "
          />
          <Label
            name="tags"
            className="rw-float-label"
            errorClassName="rw-float-label rw-label-error"
          >
            Tags
          </Label>
        </div>

        <div className="rw-button-group">
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
        </div>
      </Form> */}

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
        <div className="shadow-lg border border-zinc-500 rounded-lg overflow-hidden">
          <TextField
            name="title"
            defaultValue={props.timelineSeasonEvent?.title}
            className="text-zinc-500 w-full font-medium text-lg pt-2.5 pb-2 px-3 block outline-none bg-transparent"
            errorClassName="rw-float-input rw-input-error"
            placeholder="Title"
          />
          <TextAreaField
            name="content"
            defaultValue={props.timelineSeasonEvent?.content}
            className="text-zinc-500 w-full text-sm py-0 block px-3 outline-none bg-transparent"
            errorClassName="rw-float-input rw-input-error"
            placeholder="Write a description..."
          />
          <div aria-hidden="true" className="">
            <div className="py-2">
              <div className="h-6"></div>
            </div>
            <div className="h-0.5"></div>
            <div className="py-2">
              <div className="py-0.5">
                <div className="h-6"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0.5 left-0.5 bottom-0">
          <div className="px-3 py-1 flex justify-end flex-nowrap space-x-1">
            <div className="shrink-0">
              <div className="relative">
                <button className="rw-button rw-button-small rw-button-gray !rounded-full">
                  <svg
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="hidden sm:block ml-2 whitespace-nowrap text-ellipsis">Tag</span>
                </button>

                {/* TODO: replace with lookup */}
                {/* <ul className="text-sm ring-opacity-5 ring-black py-3 bg-zinc-100  rounded-lg w-52 max-h-56 mt-1 z-10 absolute right-0 dark:bg-zinc-600">
                  <li className="py-2 px-3 select-none relative">
                    <div className="flex items-center">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="block overflow-hidden whitespace-nowrap text-ellipsis font-medium ml-3">test</span>
                    </div>
                  </li>
                </ul> */}
              </div>
            </div>
            <div className="shrink-0">
              <div className="relative">
                <button className="rw-button rw-button-small rw-button-gray !rounded-full">
                  <svg
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="hidden sm:block ml-2 whitespace-nowrap text-ellipsis">Tag</span>
                </button>

                {/* TODO: replace with lookup */}
                {/* <ul className="text-sm ring-opacity-5 ring-black py-3 bg-zinc-100  rounded-lg w-52 max-h-56 mt-1 z-10 absolute right-0 dark:bg-zinc-600">
                  <li className="py-2 px-3 select-none relative">
                    <div className="flex items-center">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="block overflow-hidden whitespace-nowrap text-ellipsis font-medium ml-3">test</span>
                    </div>
                  </li>
                </ul> */}
              </div>
            </div>
          </div>
          <div className="py-2 px-3 border-t border-zinc-500 flex justify-between items-center">
            <div className="flex">
              <button className="py-2 px-3 rounded-full inline-flex items-center -ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-4 h-4 -ml-1 mr-2 block">
                  <path fill-rule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clip-rule="evenodd"></path>
                </svg>
                <span className="italic text-sm">Attach file</span>
              </button>
            </div>
            <div className="shrink-0">
              <button className="rw-button rw-button-blue rw-button-medium">Create</button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default TimelineSeasonEventForm;
