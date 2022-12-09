import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
  SelectField,
} from "@redwoodjs/forms";

import type { EditBasespotById, UpdateBasespotInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import Avatar from "src/components/Avatar/Avatar";
import { useState } from "react";
import FileUpload from "src/components/Util/FileUpload/FileUpload";

type FormBasespot = NonNullable<EditBasespotById["basespot"]>;

interface BasespotFormProps {
  basespot?: EditBasespotById["basespot"];
  onSave: (data: UpdateBasespotInput, id?: FormBasespot["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const BasespotForm = (props: BasespotFormProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const onSubmit = (data: FormBasespot) => {
    data.image = thumbnailUrl;
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

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextField
          name="description"
          defaultValue={props.basespot?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="description" className="rw-field-error" />

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
          validation={{ valueAsNumber: true, required: true }}
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
          defaultValue={props.basespot?.longitude}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true, required: true }}
        />

        <FieldError name="longitude" className="rw-field-error" />

        <Label
          name="image"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Image
        </Label>

        <FileUpload
          onUpload={(url) => {
            console.log("Fileupload")
            console.log(url)
            setThumbnailUrl(URL.createObjectURL(url));
          }} />
        <Avatar
          className="max-w-150-px absolute -mt-16 h-auto rounded-full border-none align-middle shadow-xl"
          url={props.basespot?.image}
          size={150}
          storage="basespotimages/thumbnails"
          editable={true}
          onUpload={(url) => {
            console.log("Avatarupload")
            console.log(url)
            setThumbnailUrl(URL.createObjectURL(url));
          }}
        />

        {/* <TextField
          name="image"
          defaultValue={props.basespot?.image}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        /> */}

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
