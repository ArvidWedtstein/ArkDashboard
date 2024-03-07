import {
  Form,
  FormError,
  FieldError,
  Label,
  useFieldArray,
  useForm,
} from "@redwoodjs/forms";

import type { EditItemById, UpdateItemInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { useEffect, useState } from "react";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import { useLazyQuery } from "@apollo/client";
import { Input } from "src/components/Util/Input/Input";
import FileUpload from "src/components/Util/FileUpload/FileUpload";
import Switch from "src/components/Util/Switch/Switch";
import Button, { ButtonGroup } from "src/components/Util/Button/Button";
import ColorInput from "src/components/Util/ColorInput/ColorInput";

type FormItem = NonNullable<EditItemById["item"]>;

interface ItemFormProps {
  item?: EditItemById["item"];
  onSave: (data: UpdateItemInput, id?: FormItem["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const ITEMQUERY = gql`
  query FindItemsByCategory($category: String!) {
    itemsByCategory(category: $category) {
      items {
        id
        name
        description
        image
        color
        type
        category
      }
      count
    }
  }
`;
const ItemForm = (props: ItemFormProps) => {
  const [loadItems, { called, loading, data }] = useLazyQuery(ITEMQUERY, {
    variables: {
      category: "Resource,Consumable,Structure,Armor,Weapon,Other,Tool",
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (!called && !loading) {
      loadItems();
    }
  }, []);

  const onSubmit = (data: FormItem) => {
    // data.ItemRecipe_ItemRecipe_crafted_item_idToItem["upsert"] =
    //   data.ItemRecipe_ItemRecipe_crafted_item_idToItem["upsert"].map(
    //     (u, i) => ({
    //       create: { ...u },
    //       update: { ...u },
    //       where: {
    //         id:
    //           props.item?.ItemRecipe_ItemRecipe_crafted_item_idToItem[i]?.id ||
    //           "00000000000000000000000000000000",
    //       },
    //     })
    //   );
    console.log(data);
    props.onSave(data, props?.item?.id);
  };

  const [craftable, setCraftable] = useState(false);

  const { register, control } = useForm({
    defaultValues: {
      stats: [],
      // "ItemRecipe_ItemRecipe_crafted_item_idToItem.upsert": [], // || props?.item?.ItemRecipe_ItemRecipe_crafted_item_idToItem ||
    },
  });
  const {
    fields: statFields,
    append: appendStat,
    remove: removeStat,
  } = useFieldArray({
    control,
    name: "stats", // the name of the field array in your form data
  });
  return (
    <Form<FormItem>
      onSubmit={onSubmit}
      error={props.error}
      className="flex w-auto flex-col"
    >
      <FormError
        error={props.error}
        wrapperClassName="rw-form-error-wrapper"
        titleClassName="rw-form-error-title"
        listClassName="rw-form-error-list"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="flex flex-col">
          <Input
            label="Name"
            name="name"
            defaultValue={props.item?.name}
            color="DEFAULT"
            helperText="Item name"
            validation={{
              required: true,
              minLength: 3,
              pattern: {
                value: /^[a-zA-Z0-9 ]*$/i,
                message: "Invalid name",
              },
            }}
          />

          <Input
            label="Description"
            name="description"
            rows={4}
            multiline
            defaultValue={props.item?.description}
            color="DEFAULT"
          />

          <ColorInput
            label="Color"
            name="color"
            margin="normal"
            defaultValue={props.item?.color}
          />
        </div>
        <FileUpload
          name="image"
          label="Image"
          defaultValue={props?.item?.image ? `Item/${props?.item?.image}` : null}
          valueFormatter={(filename, isUpload) => isUpload
            ? filename.includes('Item/')
              ? filename
              : `Item/${filename} `
            : filename
              ? filename.includes('Item/')
                ? filename.replaceAll('Item/', '')
                : filename
              : null}
          storagePath={`arkimages`}
        />
      </div>

      <div className="flex flex-wrap space-x-1">
        <Input
          label="Weight"
          name="weight"
          defaultValue={props.item?.weight || 0}
          color="DEFAULT"
          type="number"
          validation={{ valueAsNumber: true, setValueAs: (v) => Number(v) }}
          InputProps={{
            min: 0,
            endAdornment: (
              <img
                src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/weight.webp"
                className="w-5"
              />
            ),
          }}
        />

        <Input
          label="Max Stack"
          name="max_stack"
          defaultValue={props.item?.max_stack || 1}
          color="DEFAULT"
          type="number"
          validation={{ valueAsNumber: true }}
          InputProps={{
            min: 0,
          }}
        />

        <Input
          label="Blueprint"
          name="blueprint"
          defaultValue={props.item?.blueprint}
          color="DEFAULT"
          validation={{ valueAsNumber: true }}
          InputProps={{
            min: 0,
          }}
        />
      </div>
      <div className="flex flex-wrap space-x-1">
        <Input
          name="affinity"
          label="Affinity"
          margin="normal"
          type="number"
          defaultValue={props.item?.affinity}
        />
        <Input
          name="health"
          label="Health"
          margin="normal"
          type="number"
          defaultValue={props.item?.health}
          InputProps={{
            endAdornment: (
              <img
                src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/health.webp"
                className="w-5"
              />
            ),
          }}
        />

        <Input
          name="damage"
          label="Damage"
          margin="normal"
          type="number"
          validation={{ valueAsNumber: true }}
          defaultValue={props.item?.damage}
          InputProps={{
            endAdornment: (
              <img
                src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/melee_damage.webp"
                className="w-5"
              />
            ),
          }}
        />
      </div>
      <ButtonGroup>
        <Input
          label="Torpor"
          name="torpor"
          defaultValue={props.item?.torpor}
          color="DEFAULT"
          type="number"
          validation={{ valueAsNumber: true }}
          InputProps={{
            min: 0,
          }}
        />
        <Input
          label="Torpor Duration"
          name="torpor_duration"
          defaultValue={props.item?.torpor_duration}
          color="DEFAULT"
          type="number"
          validation={{ valueAsNumber: true }}
          InputProps={{
            min: 0,
            endAdornment: "s",
          }}
        />
      </ButtonGroup>

      <div className="flex flex-wrap space-x-1">
        <Lookup
          defaultValue={props.item?.category}
          name="category"
          label="Category"
          options={[
            "Armor",
            "Consumable",
            "Fertilizer",
            "Other",
            "Resource",
            "Structure",
            "Tool",
            "Weapon"
          ]}
          validation={{
            required: true,
          }}
        />

        <Lookup
          defaultValue={props.item?.type}
          name="type"
          label="Type"
          options={[
            "Attachment",
            "Chitin",
            "Cloth",
            "Flak",
            "Fur",
            "Ghillie",
            "Hazard",
            "Hide",
            "Riot",
            "Saddle",
            "Scuba",
            "Tek",
            "Other",
            "Dish",
            "Drug",
            "Egg",
            "Food",
            "Fungus",
            "Meat",
            "Plant",
            "Seed",
            "Tool",
            "Other",
            "Feces",
            "Adobe",
            "Building",
            "Crafting",
            "Electrical",
            "Elevator",
            "Greenhouse",
            "Metal",
            "Stone",
            "Tek",
            "Thatch",
            "Utility",
            "Vehicle",
            "Wood",
            "Artifact",
            "Coloring",
            "Navigation",
            "Tool",
            "Utility",
            "Ammunition",
            "Arrow",
            "Attachment",
            "Explosive",
            "Gun",
            "Other",
            "Shield",
            "Tool"
          ]}
        />
      </div>

      <Switch
        onLabel="Visible"
        defaultChecked={props.item?.visible}
        name="visible"
        helperText="Is this item visible to the public?"
      />
      {/* TODO: check why this resets category and type when creating new item */}
      <Switch
        onLabel="Craftable"
        defaultChecked={craftable}
        onChange={(e) => setCraftable(e.target.checked)}
      />

      {craftable && (
        <Input
          label="Engram Points"
          name="engram_points"
          defaultValue={props.item?.engram_points}
          type="number"
          validation={{ valueAsNumber: true }}
          helperText={"Engram points earned by crafting this item"}
        />
      )}

      <Label
        name="stats"
        className="rw-label text-black/60 dark:text-white/70"
        errorClassName="rw-label rw-label-error"
      >
        Stats
      </Label>

      {statFields.map((stat, index) => (
        <ButtonGroup className="my-2" key={`stat-${index}`}>
          <Lookup
            margin="none"
            defaultValue={stat.id}
            label="Stat Type"
            isOptionEqualToValue={(option, value) => option.value === value.value}
            getOptionValue={(opt) => opt.value}
            getOptionLabel={(option) => option.label}
            disabled={register(`stats.${index}.id`).disabled}
            required={register(`stats.${index}.id`).required}
            onBlur={register(`stats.${index}.id`).onBlur}
            onChange={register(`stats.${index}.id`).onChange}
            name={register(`stats.${index}.id`).name}
            ref={register(`stats.${index}.id`).ref}
            options={[
              { value: 2, label: "Armor" },
              { value: 3, label: "Hypothermal Insulation" },
              { value: 4, label: "Hyperthermal Insulation" },
              { value: 5, label: "Durability" },
              { value: 7, label: "Health" },
              { value: 8, label: "Food" },
              { value: 6, label: "Weapon Damage" },
              { value: 9, label: "Spoils" },
              { value: 10, label: "Torpor" },
              { value: 15, label: "Affinity" },
              { value: 16, label: "Ammo" },
              { value: 12, label: "Stamina" },
              { value: 13, label: "Cooldown" },
              { value: 14, label: "Fertilizer Points" },
              { value: 17, label: "Weight Reduction" },
              { value: 18, label: "Fuel" },
              { value: 19, label: "Gather" },
              { value: 11, label: "Water" },
              { value: 20, label: "Other" },
            ]}
          />

          <Input
            label={"Value"}
            {...register(`stats.${index}.value`)}
            type="number"
            defaultValue={stat.value}
            margin="none"
          />
          <Button
            variant="contained"
            color="error"
            onClick={() => removeStat(index)}
          >
            Remove
          </Button>

        </ButtonGroup>
      ))}

      <div className="flex justify-start">
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => appendStat({ id: 0, value: 0 })}
          startIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
            </svg>
          }
        >
          Add Stat
        </Button>
      </div>

      <FieldError name="stats" className="rw-field-error" />

      <Button
        color="success"
        variant="contained"
        permission="basespot_create"
        disabled={props.loading}
        type="submit"
        className="my-3"
        name="save"
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
    </Form>
  );
};

export default ItemForm;
