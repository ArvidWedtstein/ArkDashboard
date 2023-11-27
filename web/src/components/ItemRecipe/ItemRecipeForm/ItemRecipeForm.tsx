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
import { Input, InputOutlined } from "src/components/Util/Input/Input";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import Button from "src/components/Util/Button/Button";

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


        <Input
          label="Crating Time"
          name="crafting_time"
          color="DEFAULT"
          variant="outlined"
          type="number"
          defaultValue={props.itemRecipe?.crafting_time || 0}
          validation={{ valueAsNumber: true }}
          InputProps={{
            endAdornment: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" shapeRendering="auto" className="w-4 fill-current">
                <path shapeRendering={"auto"} d="M256 16C247.2 16 240 23.16 240 32v80C240 120.8 247.2 128 256 128s16-7.156 16-16V48.59C379.3 56.81 464 146.7 464 256c0 114.7-93.31 208-208 208S48 370.7 48 256c0-48.84 17.28-96.34 48.66-133.7c5.688-6.75 4.812-16.84-1.969-22.53S77.84 94.94 72.16 101.7C35.94 144.8 16 199.6 16 256c0 132.3 107.7 240 239.1 240S496 388.3 496 256S388.3 16 256 16zM244.7 267.3C247.8 270.4 251.9 272 256 272s8.188-1.562 11.31-4.688c6.25-6.25 6.25-16.38 0-22.62l-80-80c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62L244.7 267.3z" />
              </svg>
            )
          }}
          SuffixProps={{
            style: {
              borderRadius: "0.375rem 0 0 0.375rem",
              marginRight: "-0.5px",
            },
          }}
        />
        <Input
          label="Yields"
          name="yields"
          color="DEFAULT"
          variant="outlined"
          type="number"
          defaultValue={props.itemRecipe?.yields || 1}
          validation={{ valueAsNumber: true, required: true }}
          SuffixProps={{
            style: {
              borderRadius: "0",
              marginRight: "-0.5px",
              marginLeft: '-0.5px'
            },
          }}
        />
        <Input
          label="Required Level"
          name="required_level"
          color="DEFAULT"
          variant="outlined"
          type="number"
          defaultValue={props.itemRecipe?.required_level || 0}
          validation={{ valueAsNumber: true }}
          InputProps={{
            endAdornment: 'lvl'
          }}
          SuffixProps={{
            style: {
              borderRadius: "0 0.375rem 0.375rem 0",
              marginLeft: '-0.5px'
            },
          }}
        />

        <div className="rw-button-group">
          <Button
            type="submit"
            color="success"
            variant="outlined"
            disabled={props.loading}
            startIcon={(
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className=" pointer-events-none"
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

export default ItemRecipeForm;
