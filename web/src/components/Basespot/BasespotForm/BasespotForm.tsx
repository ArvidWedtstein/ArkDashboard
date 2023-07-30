import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
  TextAreaField,
  useForm,
} from "@redwoodjs/forms";

import type {
  EditBasespotById,
  NewBasespot,
  UpdateBasespotInput,
} from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import FileUpload from "src/components/Util/FileUpload/FileUpload";
import { useEffect, useState } from "react";
import MapPicker from "src/components/Util/MapPicker/MapPicker";
import Lookup from "src/components/Util/Lookup/Lookup";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";

type FormBasespot = NonNullable<EditBasespotById["basespot"]>;

interface BasespotFormProps {
  basespot?: EditBasespotById["basespot"];
  maps?: NewBasespot["maps"];
  basespotTypes?: NewBasespot["basespotTypes"];
  onSave: (data: UpdateBasespotInput, id?: FormBasespot["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const BasespotForm = (props: BasespotFormProps) => {
  const formMethods = useForm<FormBasespot>();
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

  const [map, setMap] = useState(props?.basespot?.map_id || 2);

  const onSubmit = (data: FormBasespot) => {
    data.map_id = parseInt(data.map_id.toString() || map.toString());

    if (thumbnailUrl) data.thumbnail = thumbnailUrl;

    if (props.basespot?.id) {
      data.published = false;
    }
    props.onSave(data, props?.basespot?.id);
  };

  useEffect(() => {
    if (props.basespot?.map_id) {
      setMap(props.basespot.map_id);
    }
  }, []);
  {
    /* <div className="relative border-b ">
          <input
            type="text"
            id="floating_outlined"
            className="border-1 focus:border-pea-600 dark:focus:border-pea-500 peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white"
            placeholder=" "
          />
          <label
            htmlFor="floating_outlined"
            className="peer-focus:text-pea-600 peer-focus:dark:text-pea-500 absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:text-gray-400"
          >
            Floating outlined
          </label>
        </div> */
  }
  return (
    <div className="rw-form-wrapper">
      <Form<FormBasespot>
        onSubmit={onSubmit}
        formMethods={formMethods}
        error={props.error}
      >
        <div className="rw-segment-header px-0 lg:flex lg:items-center lg:justify-between">
          <h2 className="rw-heading rw-heading-primary min-w-0 flex-1">
            {props?.basespot?.id ? "Edit" : "Create"} Basespot{" "}
            {props.basespot?.name}
          </h2>
          <div className="flex space-x-2">
            <button
              type="button"
              className="rw-button rw-button-medium rw-button-red-outline hidden sm:block"
              onClick={() => history.back()}
            >
              Cancel
            </button>
            <Submit
              disabled={props.loading}
              className="rw-button rw-button-medium rw-button-gray-outline"
            >
              Save
            </Submit>

            <button
              disabled={props.loading}
              className="rw-button rw-button-medium rw-button-green"
            >
              Publish
            </button>
          </div>
        </div>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
        <div className="relative">
          <Label
            name="name"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Name
          </Label>

          <TextField
            name="name"
            defaultValue={props.basespot?.name}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
          <FieldError name="name" className="rw-field-error" />
        </div>

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextAreaField
          name="description"
          defaultValue={props.basespot?.description}
          className="rw-input w-full min-w-max"
          errorClassName="rw-input rw-input-error"
          emptyAs={""}
          rows={5}
          validation={{ required: true }}
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="map_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Map
        </Label>

        <Lookup
          defaultValue={props.basespot?.map_id || map}
          options={
            props?.maps.map((map) => ({
              label: map.name,
              value: Number(map.id),
              image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${map.icon}`,
            })) || []
          }
          onSelect={(e) => {
            if (!e || !e.value) return setMap(null);
            setMap(parseInt(e.value.toString()));
            formMethods.setValue("map_id", parseInt(e.value.toString()));
          }}
          name="map_id"
          disabled={props.loading}
        />

        <FieldError name="map_id" className="rw-field-error" />

        <MapPicker
          className="mt-3"
          url={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${
            props?.maps?.find((x) => x.id === map)?.img
          }`}
          valueProp={{ ...props?.basespot }}
          onChanges={(e) => {
            formMethods.setValue("latitude", e.latitude);
            formMethods.setValue("longitude", e.longitude);
          }}
        />

        <div className="flex flex-row items-start">
          <div className="group relative z-0 mb-6">
            <Label
              name="latitude"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Latitude
            </Label>

            <TextField
              name="latitude"
              defaultValue={props?.basespot?.latitude}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              emptyAs={null}
              validation={{ required: true, valueAsNumber: true }}
            />
            <FieldError name="latitude" className="rw-field-error" />
          </div>
          <div className="relative z-0 mx-6 mb-6">
            <Label
              name="longitude"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Longitude
            </Label>

            <TextField
              name="longitude"
              defaultValue={props?.basespot?.longitude}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              emptyAs={null}
              validation={{ valueAsNumber: true, required: true }}
            />
            <FieldError name="longitude" className="rw-field-error" />
          </div>
        </div>

        <Label
          name="type"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Basespot Type
        </Label>
        {/* TODO: fix icons here */}
        <CheckboxGroup
          name="type"
          form={true}
          validation={{ required: true, single: true }}
          defaultValue={[props?.basespot?.type]}
          options={
            props.basespotTypes
              ? props?.basespotTypes.map((type) => ({
                  value: type.type.toLowerCase(),
                  label: type.type,
                  image: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12"
                      viewBox="0 0 576 512"
                      fill="currentColor"
                    >
                      <path d="M320 33.8V160H48.5C100.2 82.8 188.1 32 288 32c10.8 0 21.5 .6 32 1.8zM352 160V39.1C424.9 55.7 487.2 99.8 527.5 160H352zM29.9 192H96V320H0c0-46 10.8-89.4 29.9-128zM192 320H128V192H448V320H384v32H576v80c0 26.5-21.5 48-48 48H352V352c0-35.3-28.7-64-64-64s-64 28.7-64 64V480H48c-26.5 0-48-21.5-48-48V352H192V320zm288 0V192h66.1c19.2 38.6 29.9 82 29.9 128H480z" />
                    </svg>
                  ),
                }))
              : [
                  {
                    value: "cave",
                    label: "Cave",
                    image: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12"
                        viewBox="0 0 576 512"
                        fill="currentColor"
                      >
                        <path d="M320 33.8V160H48.5C100.2 82.8 188.1 32 288 32c10.8 0 21.5 .6 32 1.8zM352 160V39.1C424.9 55.7 487.2 99.8 527.5 160H352zM29.9 192H96V320H0c0-46 10.8-89.4 29.9-128zM192 320H128V192H448V320H384v32H576v80c0 26.5-21.5 48-48 48H352V352c0-35.3-28.7-64-64-64s-64 28.7-64 64V480H48c-26.5 0-48-21.5-48-48V352H192V320zm288 0V192h66.1c19.2 38.6 29.9 82 29.9 128H480z" />
                      </svg>
                    ),
                  },
                  {
                    value: "waterfall",
                    label: "Waterfall",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-double-doorframe.webp",
                  },
                  {
                    value: "floating island",
                    label: "Floating Island",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-dinosaur-gateway.webp",
                  },
                  {
                    value: "rathole",
                    label: "Rathole",
                    image: (
                      <svg
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-20 w-20"
                        viewBox="0 0 376.000000 270.000000"
                      >
                        <g
                          transform="translate(0.000000,270.000000) scale(0.100000,-0.100000)"
                          fill="currentColor"
                          stroke="none"
                        >
                          <path
                            d="M1185 1651 c-77 -19 -152 -88 -173 -160 -17 -54 -17 -808 0 -862 15
             -51 69 -114 122 -142 41 -22 44 -22 635 -25 679 -3 669 -4 746 73 72 72 75 90
             75 525 0 435 -3 453 -75 525 -60 60 -122 78 -262 73 -101 -3 -106 -4 -129 -31
             l-24 -28 0 -277 c0 -215 -3 -291 -15 -336 -38 -146 -162 -235 -313 -224 -123
             9 -219 80 -261 192 -20 53 -21 76 -21 342 0 309 -3 328 -55 352 -28 13 -200
             15 -250 3z m217 -393 l3 -303 31 -65 c56 -119 161 -198 294 -222 155 -27 325
             52 405 189 48 81 55 135 55 430 l0 273 99 0 c107 0 140 -13 185 -73 20 -28 21
             -38 21 -427 0 -389 -1 -399 -21 -427 -11 -15 -36 -38 -54 -50 l-33 -23 -591 0
             c-666 0 -638 -3 -683 76 -22 39 -23 44 -23 424 0 380 1 385 23 424 34 60 74
             76 189 76 l97 0 3 -302z"
                          />
                        </g>
                      </svg>
                    ),
                  },
                  {
                    value: "underwater rathole",
                    label: "Underwater Rathole",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-hatchframe.webp",
                  },
                  {
                    value: "underwater cave",
                    label: "Underwater Cave",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/giant-stone-hatchframe.webp",
                  },
                  {
                    value: "ceiling",
                    label: "Ceiling",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/giant-stone-hatchframe.webp",
                  },
                ]
          }
        />

        <FieldError name="type" className="rw-field-error" />

        <Label
          name="level"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Difficulty
        </Label>
        <CheckboxGroup
          name="level"
          form={true}
          validation={{ required: true, single: true }}
          defaultValue={[props.basespot?.level]}
          options={[
            {
              value: "starter",
              label: "Starter",
              image: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12"
                  viewBox="0 0 576 512"
                  fill="currentColor"
                >
                  <path d="M320 33.8V160H48.5C100.2 82.8 188.1 32 288 32c10.8 0 21.5 .6 32 1.8zM352 160V39.1C424.9 55.7 487.2 99.8 527.5 160H352zM29.9 192H96V320H0c0-46 10.8-89.4 29.9-128zM192 320H128V192H448V320H384v32H576v80c0 26.5-21.5 48-48 48H352V352c0-35.3-28.7-64-64-64s-64 28.7-64 64V480H48c-26.5 0-48-21.5-48-48V352H192V320zm288 0V192h66.1c19.2 38.6 29.9 82 29.9 128H480z" />
                </svg>
              ),
            },
            {
              value: "beginner",
              label: "Beginner",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-double-doorframe.webp",
            },
            {
              value: "intermediate",
              label: "Intermediate",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-double-doorframe.webp",
            },
            {
              value: "advanced",
              label: "Advanced",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-double-doorframe.webp",
            },
            {
              value: "expert",
              label: "Expert",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-double-doorframe.webp",
            },
          ]}
        />
        <FieldError name="level" className="rw-field-error" />

        <Label
          name="estimated_for_players"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Estimated for players
        </Label>

        <TextField
          name="estimated_for_players"
          defaultValue={props.basespot?.estimated_for_players}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="estimated_for_players" className="rw-field-error" />

        {/* TODO make a selector for thumbnail */}
        {props.basespot?.id && (
          <>
            <Label
              name="base_images"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Base Images
            </Label>

            <FileUpload
              multiple={false}
              name="base_images"
              storagePath={`basespotimages/${props?.basespot?.id}`}
              onUpload={(url) => {
                setThumbnailUrl(url);
              }}
            />

            <FieldError name="base_images" className="rw-field-error" />
          </>
        )}

        {props.basespot?.id && (
          <>
            <Label
              name="thumbnail"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Thumbnail
            </Label>

            <FileUpload
              multiple={false}
              name="thumbnail"
              storagePath={`basespotimages/${props?.basespot?.id}`}
              onUpload={(url) => {
                setThumbnailUrl(url);
              }}
            />

            <FieldError name="thumbnail" className="rw-field-error" />
          </>
        )}

        {/* TODO: Fix select list for turretsetup images */}
        {/*
        <Label
          name="turretsetup_image"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Turret Setup image
        </Label>

        <TextField
          name="turretsetup_image"
          defaultValue={props.basespot?.turretsetup_image}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="turretsetup_image" className="rw-field-error" /> */}
      </Form>
    </div>
  );
};

export default BasespotForm;
