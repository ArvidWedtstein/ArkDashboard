import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  Submit,
  SelectField,
  NumberField,
  TextAreaField,
  MonthField,
  useForm,
} from "@redwoodjs/forms";

import type { EditBasespotById, UpdateBasespotInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import FileUpload from "src/components/Util/FileUpload/FileUpload";
import { useEffect, useRef, useState } from "react";
import MapPicker from "src/components/Util/MapPicker/MapPicker";
import Lookup from "src/components/Util/Lookup/Lookup";

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, "");
  }
};

type FormBasespot = NonNullable<EditBasespotById["basespot"]>;

interface BasespotFormProps {
  basespot?: EditBasespotById["basespot"];
  onSave: (data: UpdateBasespotInput, id?: FormBasespot["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const BasespotForm = (props: BasespotFormProps) => {
  const formMethods = useForm<FormBasespot>();
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [defenseImages, setDefenseImages] = useState([]);

  const basename = useRef(null);
  const [map, setMap] = useState(props.basespot?.Map || 2);

  const onSubmit = (data: FormBasespot) => {
    console.log(data);
    data.Map = parseInt(data.Map.toString() || map.toString());
    if (thumbnailUrl) data.image = thumbnailUrl;
    props.onSave(data, props?.basespot?.id);
  };

  useEffect(() => {
    if (props.basespot?.Map) {
      setMap(props.basespot.Map);
    }
  }, []);

  return (
    <div className="rw-form-wrapper">
      <Form<FormBasespot>
        onSubmit={onSubmit}
        formMethods={formMethods}
        error={props.error}
      >
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
        {/* <div className="relative border-b ">
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
        </div> */}
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
            ref={basename}
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
          className="rw-input min-w-[300px]"
          errorClassName="rw-input rw-input-error"
          emptyAs={""}
          rows={5}
          validation={{ required: true }}
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="Map"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Map
        </Label>

        {/* <SelectField
          name="Map"
          defaultValue={props.basespot?.Map || map}
          validation={{
            required: true,
            validate: {
              matchesInitialValue: (value) => {
                return (
                  value !== "Please select an option" || "Select an Option"
                );
              },
            },
          }}
        >
          <option>Please select an option</option>
          <option value={1}>Valguero</option>
          <option value={2}>The Island</option>
          <option value={3}>The Center</option>
          <option value={4}>Ragnarok</option>
          <option value={5}>Aberration</option>
          <option value={6}>Extinction</option>
          <option value={7}>Scorched Earth</option>
          <option value={8}>Genesis</option>
          <option value={9}>Genesis 2</option>
          <option value={10}>Crystal Isles</option>
          <option value={11}>Fjordur</option>
          <option value={12}>Lost Island</option>
        </SelectField> */}
        <Lookup
          defaultValue={props.basespot?.Map || map}
          items={[
            { name: "Valguero", value: 1 },
            { name: "The Island", value: 2 },
            { name: "The Center", value: 3 },
            { name: "Ragnarok", value: 4 },
            { name: "Abberation", value: 5 },
            { name: "Extinction", value: 6 },
            { name: "Scorched Earth", value: 7 },
            { name: "Genesis", value: 8 },
            { name: "Genesis 2", value: 9 },
            { name: "Crystal Isles", value: 10 },
            { name: "Fjordur", value: 11 },
            { name: "Lost Island", value: 12 },
          ]}
          name="Map"
        />

        <FieldError name="Map" className="rw-field-error" />

        <MapPicker
          className="mt-2"
          map={map.toString()}
          valueProp={{ ...props.basespot }}
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
              defaultValue={props.basespot?.latitude}
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
              defaultValue={props.basespot?.longitude}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              emptyAs={null}
              validation={{ valueAsNumber: true, required: true }}
            />
            <FieldError name="longitude" className="rw-field-error" />
          </div>
        </div>

        <Label
          name="image"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Image
        </Label>

        <FileUpload
          multiple={false}
          name="image"
          storagePath={`basespotimages/${
            props.basespot.id
            // basename.current?.value.replaceAll(" ", "") ||
            // props.basespot?.name.replaceAll(" ", "")
          }`}
          onUpload={(url) => {
            setThumbnailUrl(url);
          }}
        />

        <FieldError name="image" className="rw-field-error" />

        <Label
          name="estimatedForPlayers"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Estimated for players
        </Label>

        <TextField
          name="estimatedForPlayers"
          defaultValue={props.basespot?.estimatedForPlayers}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="estimatedForPlayers" className="rw-field-error" />

        {/* <Label
          name="defenseImages"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Defense images
        </Label>

        <TextField
          name="defenseImages"
          defaultValue={props.basespot?.defenseImages}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: false }}
          emptyAs={"undefined"}
        /> */}

        <FieldError name="defenseImages" className="rw-field-error" />

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

        <FieldError name="turretsetup_image" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  );
};

export default BasespotForm;
