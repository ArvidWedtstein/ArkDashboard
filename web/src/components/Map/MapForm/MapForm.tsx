import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
  useForm,
  useFieldArray,
} from "@redwoodjs/forms";

import type { EditMapById, UpdateMapInput } from "types/graphql";
import type {
  Control,
  FieldValues,
  RWGqlError,
  UseFormRegister,
} from "@redwoodjs/forms";
import Map from "src/components/Util/Map/Map";
import { Input, InputLabel } from "src/components/Util/Input/Input";
import FileUpload from "src/components/Util/FileUpload/FileUpload";
import Alert from "src/components/Util/Alert/Alert";
import Button from "src/components/Util/Button/Button";
import { Lookup } from "src/components/Util/Lookup/Lookup";

type FormMap = NonNullable<EditMapById["map"]>;

interface MapFormProps {
  map?: EditMapById["map"];
  onSave: (data: UpdateMapInput, id?: FormMap["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

interface MapInputProps {
  name: string;
  control: Control<FieldValues>;
  register: UseFormRegister<FieldValues>;
}
const MapInput = ({ name, control, register }: MapInputProps) => {
  const {
    fields: fields,
    append: append,
    remove: remove,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name, // the name of the field array in your form data
  });
  return (
    <details className="rw-form-group custom group">
      <summary className="inline-flex items-center capitalize">
        {name.replaceAll("_", " ")}
        <svg
          className="ml-1 h-4 w-4"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="group-open:block [&:not(open)]:hidden"
            d="M19 9l-7 7-7-7"
          ></path>
          <path
            className="group-open:hidden [&:not(open)]:block"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </summary>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col">
          {fields.map(
            (
              cr: { lat?: number; lon?: number; id?: number | string },
              index
            ) => (
              <div
                className="rw-button-group !mt-0 justify-start"
                role="group"
                key={cr.id}
              >
                <TextField
                  name={`${name}.${index}.lat`}
                  {...register(`${name}.${index}.lat`)}
                  defaultValue={cr.lat.toString()}
                  className="rw-input !mt-0 max-w-[7rem]"
                  errorClassName="rw-input rw-input-error"
                  title="Latitude"
                  placeholder="Latitude"
                />
                <TextField
                  name={`${name}.${index}.lon`}
                  {...register(`${name}.${index}.lon`)}
                  defaultValue={cr.lon.toString()}
                  className="rw-input !mt-0 max-w-[7rem]"
                  errorClassName="rw-input rw-input-error"
                  title="Longitude"
                  placeholder="Longitude"
                />
                <button
                  type="button"
                  className="rw-button rw-button-red !ml-0 rounded-none !rounded-r-md"
                  onClick={() => remove(index)}
                >
                  Remove
                </button>
              </div>
            )
          )}
        </div>
        <div>
          <Map
            map_id={2}
            pos={fields.map(
              (cr: { lat?: number; lon?: number; id?: number | string }) => ({
                lat: cr.lat,
                lon: cr.lon,
              })
            )}
          />
        </div>
      </div>
      <div className="rw-button-group justify-start">
        <button
          type="button"
          className="rw-button rw-button-gray !ml-0 capitalize"
          onClick={() => append({ lat: 50, lon: 50 })}
        >
          Add {name.replaceAll("_", " ")}
        </button>
      </div>
      <FieldError name={name} className="rw-field-error" />
    </details>
  );
};
const MapForm = (props: MapFormProps) => {
  // TODO: Fix inputs / Move inputs to own form
  // <DeepPartial<FormMap>>
  const { register, control, setValue } = useForm();

  const onSubmit = (data: FormMap) => {
    props.onSave(data, props?.map?.id);
  };
  return (
    <div className="rw-form-wrapper">
      <Form<FormMap> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Input
          label="Name"
          name="name"
          color="DEFAULT"
          defaultValue={props.map?.name}
          helperText="Name of this map"
        />

        <br />

        <Input
          label="Description"
          name="description"
          color="DEFAULT"
          multiline
          rows={5}
          defaultValue={props.map?.description}
          helperText="Description of this map"
        />

        <br />

        <Lookup
          label="Parent Map"
          name="parent_map_id"
          helperText="Parent Map, if this map is a child of another map"
          defaultValue={props.map?.parent_map_id}
          getOptionLabel={(val) => val.label}
          isOptionEqualToValue={(val, opt) => val.id === opt.id}
          getOptionValue={(opt) => opt.id}
          options={[
            { label: 'Valguero', id: 1 },
            { label: 'The Island', id: 2 },
            { label: 'The Center', id: 3 },
            { label: 'Ragnarok', id: 4 },
            { label: 'Aberration', id: 4 },
            { label: 'Extinction', id: 6 },
            { label: 'Scorched Earth', id: 7 },
            { label: 'Genesis 1', id: 8 },
            { label: 'Genesis 2', id: 9 },
            { label: 'Crystal Isles', id: 10 },
            { label: 'Fjordur', id: 11 },
            { label: 'Lost Island', id: 12 },
            { label: 'Jotunheim', id: 13 },
            { label: 'Vanaheim', id: 14 },
            { label: 'Asgard', id: 15 },
            { label: 'Midgard', id: 16 },
          ]}
        />

        <br />
        <Input
          label="Coordinates Shift Latitude"
          name="cord_shift_lat"
          color="DEFAULT"
          type="number"
          defaultValue={props.map?.cord_shift_lat}
          SuffixProps={{
            style: {
              borderRadius: "0.375rem 0 0 0.375rem",
              marginRight: '-0.5px'
            }
          }}
        />
        <Input
          label="Coordinates Shift Longitude"
          name="cord_shift_lon"
          color="DEFAULT"
          type="number"
          defaultValue={props.map?.cord_shift_lon}
          SuffixProps={{
            style: {
              borderRadius: "0 0.375rem 0.375rem 0",
              marginLeft: '-0.5px'
            }
          }}
        />
        <br />
        <Input
          label="Coordinates Multiplier Latitude"
          name="cord_mult_lat"
          color="DEFAULT"
          type="number"
          defaultValue={props.map?.cord_mult_lat}
          SuffixProps={{
            style: {
              borderRadius: "0.375rem 0 0 0.375rem",
              marginRight: '-0.5px'
            }
          }}
        />
        <Input
          label="Coordinates Multiplier Longitude"
          name="cord_mult_lon"
          color="DEFAULT"
          type="number"
          defaultValue={props.map?.cord_mult_lon}
          SuffixProps={{
            style: {
              borderRadius: "0 0.375rem 0.375rem 0",
              marginLeft: '-0.5px'
            }
          }}
        />
        <Alert variant="outlined" className="w-fit" severity="info" title={"Info"}>
          Unsed to calculate coordinates on map
        </Alert>

        <hr className="rw-divider mt-3 w-full fill-white bg-zinc-500 h-px" />

        <Input
          label="Boundaries"
          name="boundaries"
          color="DEFAULT"
          multiline
          rows={5}
          defaultValue={JSON.stringify(props.map?.boundaries, null, 2)}
        />
        <Alert variant="outlined" className="w-fit" severity="info" title={"Info"}>
          Boundaries are used to calculate map, when main map has submaps and these submaps go outside main map
        </Alert>
        <br />

        <Label
          name="img"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Image
        </Label>

        {/* TODO: Add option for topographic map too */}
        <FileUpload
          name="image"
          secondaryName="icon"
          label="Image"
          defaultValue={props?.map?.img}
          defaultSecondaryValue={props?.map?.icon}
          storagePath={`arkimages`}
        />


        <div className="rw-button-group">
          <Button
            type="submit"
            variant="outlined"
            color="success"
            disabled={props.loading}
            endIcon={(
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-4 pointer-events-none"
                fill="currentColor"
              >
                <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
              </svg>
            )}
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default MapForm;
