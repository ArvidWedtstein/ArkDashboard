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
  DeleteBasespotMutationVariables,
  EditBasespotById,
  NewBasespot,
  UpdateBasespotInput,
  permission,
} from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import FileUpload from "src/components/Util/FileUpload/FileUpload";
import { useEffect, useState } from "react";
import MapPicker from "src/components/Util/MapPicker/MapPicker";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import { useMutation } from "@apollo/client";
import { toast } from "@redwoodjs/web/dist/toast";
import { navigate, routes } from "@redwoodjs/router";
import Toast from "src/components/Util/Toast/Toast";
import { useAuth } from "src/auth";
import Switch from "src/components/Util/Switch/Switch";
import Button from "src/components/Util/Button/Button";
import { Input, InputOutlined } from "src/components/Util/Input/Input";

type FormBasespot = NonNullable<EditBasespotById["basespot"]>;

interface BasespotFormProps {
  basespot?: EditBasespotById["basespot"];
  maps?: NewBasespot["maps"];
  basespotTypes?: NewBasespot["basespotTypes"];
  onSave: (data: UpdateBasespotInput, id?: FormBasespot["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const DELETE_BASESPOT_MUTATION = gql`
  mutation DeleteBasespotMutation($id: String!) {
    deleteBasespot(id: $id) {
      id
    }
  }
`;

const BasespotForm = (props: BasespotFormProps) => {
  const { currentUser } = useAuth();
  const formMethods = useForm<FormBasespot>();

  const [map, setMap] = useState(props?.basespot?.map_id || 2);

  const onSubmit = (data: FormBasespot, publish?: boolean) => {
    data.map_id = parseInt(data.map_id.toString() || map.toString());

    data.published = publish;

    props.onSave(data, props?.basespot?.id);
  };

  const [deleteBasespot] = useMutation(DELETE_BASESPOT_MUTATION, {
    onCompleted: () => {
      toast.success("Basespot deleted");
      navigate(routes.basespots());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteBasespotMutationVariables["id"]) => {
    toast.custom((t) => (
      <Toast
        t={t}
        title={"Are you sure you want to delete basespot?"}
        message={<p>Are you sure you want to delete basespot {id}?</p>}
        primaryAction={() => deleteBasespot({ variables: { id } })}
        actionType="YesNo"
      />
    ));
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
        onSubmit={(e, btn) =>
          onSubmit(e, (btn.nativeEvent as any)?.submitter?.name === "publish")
        }
        formMethods={formMethods}
        error={props.error}
      >
        <div className="rw-segment-header px-0 lg:flex lg:items-center lg:justify-between">
          <h2 className="rw-heading rw-heading-primary min-w-0 flex-1">
            {props?.basespot?.id ? "Edit" : "Create"} Basespot{" "}
            {props.basespot?.name}
          </h2>
          <div className="flex space-x-2">
            <Button
              color="error"
              variant="outlined"
              permission="basespot_delete"
              disabled={!props?.basespot?.id}
              onClick={() => onDeleteClick(props?.basespot?.id)}
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80c-15.1 0-29.4 7.125-38.4 19.25L112 64H16C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16 0-8.8-7.2-16-16-16zm-280 0l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zm248 64c-8.8 0-16 7.2-16 16v288c0 26.47-21.53 48-48 48H112c-26.47 0-48-21.5-48-48V144c0-8.8-7.16-16-16-16s-16 7.2-16 16v288c0 44.1 35.89 80 80 80h224c44.11 0 80-35.89 80-80V144c0-8.8-7.2-16-16-16zM144 416V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16zm96 0V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16zm96 0V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16z" />
                </svg>
              }
            >
              Delete
            </Button>
            <Button
              color="error"
              variant="outlined"
              permission="basespot_delete"
              onClick={() => history.back()}
            >
              Cancel
            </Button>

            {/* TODO: implement publishing/saving */}
            <Button
              color="success"
              variant="outlined"
              permission="basespot_create"
              disabled={props.loading}
              type="submit"
              name="save"
              title={
                "Save. Unpublished changes will not be visible to the public."
              }
            >
              Save
            </Button>

            <Button
              color="success"
              variant="outlined"
              permission="basespot_create"
              disabled={props.loading}
              type="submit"
              name="publish"
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M498.1 5.629C492.7 1.891 486.4 0 480 0c-5.461 0-10.94 1.399-15.88 4.223l-448 255.1C5.531 266.3-.6875 277.8 .0625 289.1s8.375 22.86 19.62 27.55l103.2 43.01l61.85 146.5C186.2 510.6 189.2 512 191.1 512c2.059 0 4.071-.8145 5.555-2.24l85.75-82.4l120.4 50.16c4.293 1.793 8.5 2.472 12.29 2.472c6.615 0 12.11-2.093 15.68-4.097c8.594-4.828 14.47-13.31 15.97-23.05l64-415.1C513.5 24.72 508.3 12.58 498.1 5.629zM32 288l380.1-217.2l-288.2 255.5L32 288zM200.7 462.3L151.1 344.9l229.5-203.4l-169.5 233.1c-2.906 4-3.797 9.094-2.438 13.84c1.374 4.75 4.844 8.594 9.438 10.41l34.4 13.76L200.7 462.3zM416.7 443.3l-167.7-66.56l225.7-310.3L416.7 443.3z" />
                </svg>
              }
            >
              Publish
            </Button>
          </div>
        </div>

        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
        <div className="flex md:flex-col flex-wrap justify-start">
          <Input
            name="name"
            label="Name"
            margin="normal"
            defaultValue={props.basespot?.name}
            validation={{ required: true }}
          />

          <Input
            name="description"
            label="Description"
            multiline
            margin="normal"
            defaultValue={props.basespot?.name}
            validation={{ required: true }}
            rows={5}
          />
        </div>

        <Lookup
          name="map_id"
          label="Map"
          disabled={props.loading}
          loading={props.loading}
          defaultValue={props.basespot?.map_id || map}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          getOptionImage={(option) => `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${option.icon}`}
          options={props?.maps}
          onSelect={(e) => {
            if (!e) return setMap(null);
            setMap(e.id);
            // formMethods.setValue("map_id", parseInt(e[0].value.toString()));
          }}
        />

        <MapPicker
          className="mt-3"
          url={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${props?.maps?.find((x) => x.id === map)?.img
            }`}
          valueProp={{ ...props?.basespot }}
          onChanges={(e) => {
            formMethods.setValue("latitude", e.latitude);
            formMethods.setValue("longitude", e.longitude);
          }}
        />

        <div className="flex flex-row items-start space-x-3">
          <Input
            name="latitude"
            label="Latitude"
            margin="normal"
            defaultValue={props?.basespot?.latitude}
            validation={{ required: true, valueAsNumber: true }}
          />

          <Input
            name="longitude"
            label="Longitude"
            margin="normal"
            defaultValue={props?.basespot?.longitude}
            validation={{ required: true, valueAsNumber: true }}
          />
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
          defaultValue={props?.basespot?.type || "cave"}
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
                    <svg fillRule="evenodd" xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, 400,400" className="h-12 fill-current">
                      <path id="path0" d="M178.628 14.217 C 173.142 22.290,163.841 43.690,157.959 61.772 L 147.264 94.649 135.940 83.324 C 114.307 61.692,96.611 72.813,73.827 122.359 C 50.372 173.365,7.851 323.977,1.371 379.000 L -1.101 400.000 71.131 400.000 L 143.364 400.000 146.179 387.000 C 167.231 289.748,226.097 292.919,257.549 393.000 C 259.534 399.317,266.593 400.000,329.874 400.000 L 400.000 400.000 400.000 388.440 C 400.000 346.420,353.648 175.499,334.578 147.202 C 319.647 125.046,301.278 128.040,288.178 154.765 C 275.010 181.631,274.738 181.510,266.290 145.000 C 237.242 19.455,206.368 -26.606,178.628 14.217 M227.664 83.120 C 233.907 102.304,244.860 142.846,252.006 173.213 C 267.465 238.916,274.234 244.065,289.843 202.000 C 302.001 169.233,308.623 156.000,312.862 156.000 C 322.718 156.000,351.544 244.560,367.667 324.372 C 372.292 347.267,376.994 370.050,378.114 375.000 C 380.146 383.972,379.995 384.000,328.708 384.000 L 277.264 384.000 266.640 356.921 C 229.895 263.263,161.270 273.102,126.588 377.000 C 122.441 389.422,19.105 387.450,21.786 375.000 C 51.283 238.021,92.033 114.231,113.488 96.425 C 118.743 92.063,121.239 94.268,130.814 111.725 C 147.996 143.053,153.990 139.219,171.672 85.584 C 179.725 61.155,189.643 36.089,193.710 29.881 L 201.105 18.595 208.710 33.417 C 212.892 41.570,221.422 63.936,227.664 83.120" />
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
          defaultValue={props.basespot?.level || "starter"}
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

        <Input
          label="Estimated for (n) players"
          name="estimated_for_players"
          margin="normal"
          defaultValue={props.basespot?.estimated_for_players}
        />
        <br />
        <Label
          name="base_images"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Images of the base
        </Label>

        <FileUpload
          name="base_images"
          thumbnail
          multiple
          defaultValue={props?.basespot?.base_images
            ?.split(",")
            .map(
              (f) =>
                `M${props?.basespot?.map_id}-${props?.basespot?.id}/${f.trim()}`
            )
            .join(",")}
          storagePath={
            props.basespot?.id ? `basespotimages` : "basespotimages/temp"
          }
        />

        <FieldError name="base_images" className="rw-field-error" />

        <Label
          name="has_air"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Has Air?
        </Label>

        <Switch
          className=""
          name="has_air"
          offLabel="no air"
          onLabel="has air"
          defaultChecked={props.basespot?.has_air || true}
        />

        <FieldError name="has_air" className="rw-field-error" />

        {/* TODO: Phase out Turretsetup_image? */}
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
