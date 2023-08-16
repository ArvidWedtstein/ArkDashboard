import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  TextAreaField,
  Submit,
  useForm,
  useFieldArray,
  useFormContext,
} from "@redwoodjs/forms";

import type { EditMapById, UpdateMapInput } from "types/graphql";
import type {
  Control,
  FieldValues,
  RWGqlError,
  UseFormRegister,
} from "@redwoodjs/forms";
import Map from "src/components/Util/Map/Map";

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
          {fields.map((cr: { lat?: number, lon?: number, id?: number | string }, index) => (
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
          ))}
        </div>
        <div>
          <Map
            map_id={2}
            pos={fields.map((cr: { lat?: number, lon?: number, id?: number | string }) => ({ lat: cr.lat, lon: cr.lon }))}
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
  // TODO: Fix inputs
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

        <Label
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>

        <TextField
          name="name"
          defaultValue={props.map?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="img"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Image
        </Label>

        <TextField
          name="img"
          defaultValue={props.map?.img}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="img" className="rw-field-error" />

        <MapInput name="oil_veins" register={register} control={control} />

        <MapInput name="water_veins" register={register} control={control} />

        <MapInput name="wyvern_nests" register={register} control={control} />

        <MapInput
          name="ice_wyvern_nests"
          register={register}
          control={control}
        />

        <MapInput name="gas_veins" register={register} control={control} />

        <MapInput
          name="deinonychus_nests"
          register={register}
          control={control}
        />

        <MapInput name="charge_nodes" register={register} control={control} />

        <MapInput name="plant_z_nodes" register={register} control={control} />

        <MapInput name="drake_nests" register={register} control={control} />

        <MapInput name="glitches" register={register} control={control} />

        <MapInput
          name="magmasaur_nests"
          register={register}
          control={control}
        />

        <MapInput name="mutagen_bulbs" register={register} control={control} />

        <MapInput name="notes" register={register} control={control} />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  );
};

export default MapForm;
