import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  TextAreaField,
  CheckboxField,
  Submit,
  ColorField,
  NumberField,
} from "@redwoodjs/forms";

import type { EditLootcrateById, UpdateLootcrateInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import Input from "src/components/Util/Input/Input";

type FormLootcrate = NonNullable<EditLootcrateById["lootcrate"]>;

interface LootcrateFormProps {
  lootcrate?: EditLootcrateById["lootcrate"];
  onSave: (data: UpdateLootcrateInput, id?: FormLootcrate["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const LootcrateForm = (props: LootcrateFormProps) => {
  const onSubmit = (data: FormLootcrate) => {
    props.onSave(data, props?.lootcrate?.id);
  };

  return (
    <div className="rw-form-wrapper">
      <Form<FormLootcrate> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Input
          name="name"
          defaultValue={props.lootcrate?.name}
          helperText="Required level to open this lootcrate"
          validation={{ required: true }}
        />


        <Input
          name="blueprint"
          defaultValue={props.lootcrate?.blueprint}
          helperText="Lootcrate blueprint"
        />

        <Input
          name="required_level"
          label="Required Level"
          type="number"
          defaultValue={0}
          helperText="Required level to open this lootcrate"
        />


        <Label
          name="quality_mult"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Quality multiplier
        </Label>

        <TextAreaField
          name="quality_mult"
          defaultValue={JSON.stringify(props.lootcrate?.quality_mult)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />

        <FieldError name="quality_mult" className="rw-field-error" />

        <Label
          name="set_qty"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Set qty
        </Label>

        <TextAreaField
          name="set_qty"
          defaultValue={JSON.stringify(props.lootcrate?.set_qty)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />

        <FieldError name="set_qty" className="rw-field-error" />

        <Label
          name="repeat_in_sets"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Repeat in sets
        </Label>

        <CheckboxField
          name="repeat_in_sets"
          defaultChecked={props.lootcrate?.repeat_in_sets}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="repeat_in_sets" className="rw-field-error" />

        <Label
          name="color"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Color
        </Label>

        <ColorField
          name="color"
          defaultValue={props.lootcrate?.color}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <TextField
          name="color"
          defaultValue={props.lootcrate?.color}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="color" className="rw-field-error" />

        <Label
          name="image"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Image
        </Label>

        {/* TODO: image lookup */}
        <TextField
          name="image"
          defaultValue={props.lootcrate?.image}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="image" className="rw-field-error" />

        <Label
          name="type"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Type
        </Label>

        <TextField
          name="type"
          defaultValue={props.lootcrate?.type}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="type" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
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
      </Form >
    </div >
  );
};

export default LootcrateForm;
