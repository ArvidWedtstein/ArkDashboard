import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  TextAreaField,
  Submit,
} from "@redwoodjs/forms";

import type { EditItemById, UpdateItemInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";

type FormItem = NonNullable<EditItemById["item"]>;

interface ItemFormProps {
  item?: EditItemById["item"];
  onSave: (data: UpdateItemInput, id?: FormItem["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const ItemForm = (props: ItemFormProps) => {
  const onSubmit = (data: FormItem) => {
    props.onSave(data, props?.item?.id);
  };

  return (
    <div className="rw-form-wrapper">
      <Form<FormItem> onSubmit={onSubmit} error={props.error}>
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
          defaultValue={props.item?.name}
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
          defaultValue={props.item?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="image"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Image
        </Label>

        <TextField
          name="image"
          defaultValue={props.item?.image}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="image" className="rw-field-error" />

        <Label
          name="max_stack"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Max stack
        </Label>

        <TextField
          name="max_stack"
          defaultValue={props.item?.max_stack}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="max_stack" className="rw-field-error" />

        <Label
          name="weight"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Weight
        </Label>

        <TextField
          name="weight"
          defaultValue={props.item?.weight}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="weight" className="rw-field-error" />

        <Label
          name="engram_points"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Engram points
        </Label>

        <TextField
          name="engram_points"
          defaultValue={props.item?.engram_points}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="engram_points" className="rw-field-error" />

        <Label
          name="crafting_time"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Crafting time
        </Label>

        <TextField
          name="crafting_time"
          defaultValue={props.item?.crafting_time}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="crafting_time" className="rw-field-error" />

        <Label
          name="req_level"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Req level
        </Label>

        <TextField
          name="req_level"
          defaultValue={props.item?.req_level}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="req_level" className="rw-field-error" />

        <Label
          name="yields"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Yields
        </Label>

        <TextField
          name="yields"
          defaultValue={props.item?.yields}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="yields" className="rw-field-error" />

        <Label
          name="recipe"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Recipe
        </Label>

        <TextAreaField
          name="recipe"
          defaultValue={JSON.stringify(props.item?.recipe)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />

        <FieldError name="recipe" className="rw-field-error" />

        <Label
          name="stats"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Stats
        </Label>

        <TextAreaField
          name="stats"
          defaultValue={JSON.stringify(props.item?.stats)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />

        <FieldError name="stats" className="rw-field-error" />

        <Label
          name="color"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Color
        </Label>

        <TextField
          name="color"
          defaultValue={props.item?.color}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="color" className="rw-field-error" />

        <Label
          name="crafted_in"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Crafted in
        </Label>

        <TextField
          name="crafted_in"
          defaultValue={props.item?.crafted_in}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="crafted_in" className="rw-field-error" />

        <Label
          name="effects"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Effects
        </Label>

        <TextField
          name="effects"
          defaultValue={props.item?.effects}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="effects" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  );
};

export default ItemForm;
