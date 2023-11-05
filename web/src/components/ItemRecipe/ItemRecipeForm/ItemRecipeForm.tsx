import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from "@redwoodjs/forms";

import type { EditItemRecipeById, UpdateItemRecipeInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import { InputOutlined } from "src/components/Util/Input/Input";
import { Lookup } from "src/components/Util/Lookup/Lookup";

type FormItemRecipe = NonNullable<EditItemRecipeById["itemRecipe"]>;

interface ItemRecipeFormProps {
  itemRecipe?: EditItemRecipeById["itemRecipe"];
  onSave: (data: UpdateItemRecipeInput, id?: FormItemRecipe["id"]) => void;
  error: RWGqlError;
  loading: boolean;
  item_id?: number;
}

const ItemRecipeForm = (props: ItemRecipeFormProps) => {
  const onSubmit = (data: FormItemRecipe) => {
    props.onSave(data, props?.itemRecipe?.id);
  };

  return (
    <div className="rw-form-wrapper">
      <Form<FormItemRecipe> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        {/* TODO: fix data */}
        <Lookup
          margin="none"
          name="crafted_item_id"
          label={"Item"}
          // options={data.itemsByCategory.items.map((item) => ({
          //   category: item.category,
          //   type: item.type,
          //   label: item.name,
          //   value: item.id,
          //   image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${item.image}`,
          // }))}
          options={[{ label: "test", value: 1 }]}
          defaultValue={props.itemRecipe?.crafted_item_id}
          validation={{ required: true }}
        />

        <Label
          name="crafting_station_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Crafting Station
        </Label>

        <CheckboxGroup
          defaultValue={[props.itemRecipe?.crafting_station_id?.toString()]}
          validation={{ single: true, valueAsNumber: true }}
          name="crafting_station_id"
          options={[
            {
              value: 606,
              label: "Beer Barrel",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/beer-barrel.webp",
            },
            {
              value: 39,
              label: "Campfire",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/campfire.webp",
            },
            {
              value: 607,
              label: "Chemistry Bench",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/chemistry-bench.webp",
            },
            {
              value: 128,
              label: "Cooking Pot",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/cooking-pot.webp",
            },
            {
              value: 127,
              label: "Compost Bin",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/compost-bin.webp",
            },
            {
              value: 185,
              label: "Fabricator",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/fabricator.webp",
            },
            {
              value: 601,
              label: "Industrial Cooker",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/industrial-cooker.webp",
            },
            {
              value: 600,
              label: "Industrial Forge",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/industrial-forge.webp",
            },
            {
              value: 360,
              label: "Industrial Grill",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/industrial-grill.webp",
            },
            {
              value: 618,
              label: "Industrial Grinder",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/industrial-grinder.webp",
            },
            {
              value: 107,
              label: "Mortar And Pestle",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/mortar-and-pestle.webp",
            },
            {
              value: 125,
              label: "Refining Forge",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/refining-forge.webp",
            },
            {
              value: 126,
              label: "Smithy",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/smithy.webp",
            },
            {
              value: 652,
              label: "Tek Replicator",
              image:
                "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/tek-replicator.webp",
            },
          ]}
        />

        <FieldError name="crafting_station_id" className="rw-field-error" />

        <InputOutlined
          margin="normal"
          name="crafting_time"
          defaultValue={props.itemRecipe?.crafting_time}
          type="number"
          label="Crafting Time"
          validation={{ valueAsNumber: true }}
        />
        <InputOutlined
          margin="normal"
          name="yields"
          defaultValue={props.itemRecipe?.yields ?? 1}
          type="number"
          label="Yields"
          validation={{ valueAsNumber: true, required: true }}
        />
        <InputOutlined
          margin="normal"
          name="required_level"
          defaultValue={props.itemRecipe?.required_level ?? 0}
          type="number"
          label="Required Level"
        />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  );
};

export default ItemRecipeForm;
