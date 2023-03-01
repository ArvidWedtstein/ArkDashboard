import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  TextAreaField,
  Submit,
  SelectField,
  ColorField,
  CheckboxField,
} from "@redwoodjs/forms";

import type { EditItemById, UpdateItemInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { useState } from "react";

type FormItem = NonNullable<EditItemById["item"]>;

interface ItemFormProps {
  item?: EditItemById["item"];
  onSave: (data: UpdateItemInput, id?: FormItem["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const ItemForm = (props: ItemFormProps) => {
  const onSubmit = (data: FormItem) => {
    delete data["craftable"]
    console.log(data)

    props.onSave(data, props?.item?.id);
  };

  const [craftable, setCraftable] = useState(false);
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
          defaultValue={props.item?.weight ? props.item.weight : 0}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="weight" className="rw-field-error" />

        <Label
          name="craftable"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Craftable
        </Label>

        <CheckboxField
          name="craftable"
          defaultChecked={true}
          onChange={(e) => setCraftable(e.target.checked)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />


        {craftable && (
          <>
            <Label
              name="engram_points"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Engram points
            </Label>

            <TextField
              name="engram_points"
              defaultValue={props.item?.engram_points ? props.item.engram_points.toString() : 0}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ valueAsNumber: true }}
            />
            <p className="rw-helper-text">Engram points earned by crafting this item</p>

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
              defaultValue={props.item?.crafting_time ? props.item.crafting_time.toString() : 0}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ valueAsNumber: true }}
            />
            <p className="rw-helper-text">Time needed to craft this item</p>

            <FieldError name="crafting_time" className="rw-field-error" />

            <Label
              name="req_level"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Required level
            </Label>

            <TextField
              name="req_level"
              defaultValue={props.item?.req_level}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{
                valueAsNumber: true
              }}
            />
            <p className="rw-helper-text">Player level required to craft this item</p>
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
              defaultValue={props.item?.yields ? props.item.yields : 1}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ valueAsNumber: true }}
            />
            <p className="rw-helper-text">The amount of this item gained when crafting</p>
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
            <p className="rw-helper-text">Items needed for crafting this item</p>

            <FieldError name="recipe" className="rw-field-error" />

            <Label
              name="crafted_in"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Crafted in
            </Label>

            <SelectField
              name="crafted_in"
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              multiple
              validation={{
                required: false,
                valueAsNumber: true
              }}
            >
              <option value={606}>Beer Barrel</option>
              <option>Campfire</option>
              <option>Chemistry Bench</option>
              <option>Cooking Pot</option>
              <option>Compost Bin</option>
              <option>Fabricator</option>
              <option>Industrial Cooker</option>
              <option>Industrial Forge</option>
              <option>Industrial Grill</option>
              <option>Industrial Grinder</option>
              <option>Mortar And Pestle</option>
              <option>Refining Forge</option>
              <option>Smithy</option>
              <option>Tek Replicator</option>
            </SelectField>

            {/* <TextField
          name="crafted_in"
          defaultValue={props.item?.crafted_in}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        /> */}

            <FieldError name="crafted_in" className="rw-field-error" />
          </>
        )}
        <Label
          name="category"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Category
        </Label>

        {/* <SelectField
          name="category"
          className="rw-input"
          defaultValue={props.item.stats}
          errorClassName="rw-input rw-input-error"
          multiple
          validation={{
            required: false,
          }}
        >
          <option>Saddle</option>
          <option>Structure</option>
          <option>Weapon</option>
          <option>Resource</option>
          <option>Tool</option>
          <option>Ammunition</option>
          <option>Consumable</option>
          <option>Tek</option>
          <option>Building</option>
          <option>Crafting</option>
          <option>Armor</option>
          <option>Egg</option>
          <option>Attachment</option>
          <option>Other</option>
        </SelectField> */}

        <FieldError name="category" className="rw-field-error" />

        {/* TODO: If structure category selected, show input for durability etc */}

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
          required={false}
        />

        <FieldError name="stats" className="rw-field-error" />

        <Label
          name="color"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Color
        </Label>

        <ColorField
          name="color"
          defaultValue={props.item?.color}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="color" className="rw-field-error" />

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
          validation={{ required: false, valueAsJSON: true }}
        />

        <FieldError name="effects" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div >
  );
};

export default ItemForm;
