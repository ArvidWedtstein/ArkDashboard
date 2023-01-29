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
} from "@redwoodjs/forms";

import type { EditBasespotById, UpdateBasespotInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import FileUpload from "src/components/Util/FileUpload/FileUpload";
import { useRef, useState } from "react";

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
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [defenseImages, setDefenseImages] = useState([]);

  const basename = useRef(null);
  const onSubmit = (data: FormBasespot) => {
    data.image && (data.image = thumbnailUrl);

    props.onSave(data, props?.basespot?.id);
  };

  return (
    <div className="rw-form-wrapper">
      <Form<FormBasespot> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
        {/* <div  className="relative">
    <input type="text" id="floating_outlined"  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
    <label htmlFor="floating_outlined"  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Floating outlined</label>
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
        </div>

        <FieldError name="name" className="rw-field-error" />

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
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={""}
          validation={{ required: true }}
        />

        <FieldError name="description" className="rw-field-error" />

        <div className="flex flex-row items-start">
          <div className="group relative z-0 mb-6">
            <Label
              name="latitude"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Latitude
            </Label>

            <NumberField
              name="latitude"
              defaultValue={props.basespot?.latitude}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              emptyAs={null}
              validation={{ valueAsNumber: true, required: true }}
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

            <NumberField
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
          storagePath={`basespotimages/${
            basename.current?.value.replaceAll(" ", "") ||
            props.basespot?.name.replaceAll(" ", "")
          }`}
          onUpload={(url) => {
            setThumbnailUrl(url);
          }}
        />

        <FieldError name="image" className="rw-field-error" />

        <Label
          name="Map"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Map
        </Label>

        <SelectField
          className="rw-input"
          name="Map"
          defaultValue={props.basespot?.Map}
          validation={{ required: true }}
          errorClassName="rw-input rw-input-error"
        >
          <option value="TheIsland">The Island</option>
          <option value="TheCenter">The Center</option>
          <option value="ScorchedEarth">Scorched Earth</option>
          <option value="Ragnarok">Ragnarok</option>
          <option value="Abberation">Abberation</option>
          <option value="Extinction">Extinction</option>
          <option value="Gen1">Genesis</option>
          <option value="Gen2">Genesis 2</option>
          <option value="Valguero">Valguero</option>
          <option value="CrystalIsles">Crystal Isles</option>
          <option value="Fjordur">Fjordur</option>
          <option value="LostIsland">Lost Island</option>
        </SelectField>

        <FieldError name="Map" className="rw-field-error" />

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
          Turretsetup image
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
