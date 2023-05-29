import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
  SelectField,
  ColorField,
  useFieldArray,
  useForm,
  NumberField,
} from "@redwoodjs/forms";

import type { EditItemById, UpdateItemInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { useEffect, useState } from "react";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import Lookup from "src/components/Util/Lookup/Lookup";
import { useLazyQuery } from "@apollo/client";

type FormItem = NonNullable<EditItemById["item"]>;

interface ItemFormProps {
  item?: EditItemById["item"];
  onSave: (data: any | UpdateItemInput, id?: FormItem["id"]) => void;
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
    onCompleted: (data) => {
      console.log(data);
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
    data.ItemRecipe_ItemRecipe_crafted_item_idToItem["upsert"] =
      data.ItemRecipe_ItemRecipe_crafted_item_idToItem["upsert"].map(
        (u, i) => ({
          create: { ...u },
          update: { ...u },
          where: {
            id:
              props.item?.ItemRecipe_ItemRecipe_crafted_item_idToItem[i]?.id ||
              "00000000000000000000000000000000",
          },
        })
      );

    props.onSave(data, props?.item?.id);
  };

  const [craftable, setCraftable] = useState(false);

  const { register, control } = useForm({
    defaultValues: {
      stats: [],
      "ItemRecipe_ItemRecipe_crafted_item_idToItem.upsert":
        props?.item?.ItemRecipe_ItemRecipe_crafted_item_idToItem || [],
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
  const {
    fields: recipeFields,
    append: appendRecipe,
    remove: removeRecipe,
  } = useFieldArray({
    control,
    name: "ItemRecipe_ItemRecipe_crafted_item_idToItem.upsert", // the name of the field array in your form data
  });

  return (
    <div className="rw-form-wrapper">
      <Form<FormItem>
        onSubmit={onSubmit}
        error={props.error}
        className="w-auto"
      >
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

        <details className="rw-form-group group">
          <summary className="inline-flex items-center">
            Stats
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
          <div>
            <div>
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
            </div>
          </div>
          <div>
            <div>
              <Label
                name="weight"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Weight
              </Label>

              <TextField
                name="weight"
                defaultValue={props.item?.weight || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="weight" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="max_stack"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Max stack
              </Label>

              <TextField
                name="max_stack"
                defaultValue={props.item?.max_stack || 1}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="max_stack" className="rw-field-error" />
            </div>
          </div>
        </details>

        <label className="rw-label">Craftable</label>
        <input
          type="checkbox"
          defaultChecked={craftable}
          onChange={(e) => setCraftable(e.target.checked)}
          className="rw-input mt-3"
        />

        {craftable && (
          <fieldset className="rw-form-group">
            <legend>Crafting</legend>
            <div>
              <div>
                <Label
                  name="engram_points"
                  className="rw-label"
                  errorClassName="rw-label rw-label-error"
                >
                  Engram points
                </Label>

                <TextField
                  name="engram_points"
                  defaultValue={
                    props.item?.engram_points
                      ? props.item.engram_points.toString()
                      : 0
                  }
                  className="rw-input"
                  errorClassName="rw-input rw-input-error"
                  validation={{ valueAsNumber: true }}
                />
                <p className="rw-helper-text">
                  Engram points earned by crafting this item
                </p>

                <FieldError name="engram_points" className="rw-field-error" />
              </div>
            </div>
            <div>
              <div>
                <Label
                  name="crafting_time"
                  className="rw-label"
                  errorClassName="rw-label rw-label-error"
                >
                  Crafting time
                </Label>

                <TextField
                  name="crafting_time"
                  defaultValue={
                    props.item?.crafting_time
                      ? props.item.crafting_time.toString()
                      : 0
                  }
                  className="rw-input"
                  errorClassName="rw-input rw-input-error"
                  validation={{ valueAsNumber: true }}
                />
                <p className="rw-helper-text">Time needed to craft this item</p>

                <FieldError name="crafting_time" className="rw-field-error" />
              </div>
              {/* <div>
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
              </div> */}
            </div>
            <div>
              <div>
                <Label
                  name="recipe"
                  className="rw-label"
                  errorClassName="rw-label rw-label-error"
                >
                  Recipe
                </Label>

                {recipeFields.map((recipe: any, index) => (
                  <div
                    className="rounded-md bg-zinc-800 p-3"
                    key={`recipe-${index}`}
                  >
                    <p>{recipe.crafting_station}</p>
                    <CheckboxGroup
                      defaultValue={[recipe?.crafting_station?.toString()]}
                      validation={{ single: true, valueAsNumber: true }}
                      name={`ItemRecipe_ItemRecipe_crafted_item_idToItem.upsert.${index}.crafting_station`}
                      options={[
                        {
                          value: 606,
                          label: "Beer Barrel",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/beer-barrel.png",
                        },
                        {
                          value: 39,
                          label: "Campfire",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/campfire.png",
                        },
                        {
                          value: 607,
                          label: "Chemistry Bench",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/chemistry-bench.png",
                        },
                        {
                          value: 128,
                          label: "Cooking Pot",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/cooking-pot.png",
                        },
                        {
                          value: 127,
                          label: "Compost Bin",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/compost-bin.png",
                        },
                        {
                          value: 185,
                          label: "Fabricator",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/fabricator.png",
                        },
                        {
                          value: 601,
                          label: "Industrial Cooker",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/industrial-cooker.png",
                        },
                        {
                          value: 600,
                          label: "Industrial Forge",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/industrial-forge.png",
                        },
                        {
                          value: 360,
                          label: "Industrial Grill",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/industrial-grill.png",
                        },
                        {
                          value: 618,
                          label: "Industrial Grinder",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/industrial-grinder.png",
                        },
                        {
                          value: 107,
                          label: "Mortar And Pestle",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/mortar-and-pestle.png",
                        },
                        {
                          value: 125,
                          label: "Refining Forge",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/refining-forge.png",
                        },
                        {
                          value: 126,
                          label: "Smithy",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/smithy.png",
                        },
                        {
                          value: 652,
                          label: "Tek Replicator",
                          image:
                            "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/tek-replicator.png",
                        },
                      ]}
                    />
                    <div
                      className="rw-button-group justify-start"
                      role="group"
                      key={`recipe-${index}`}
                    >
                      {/* TODO: Group By crafting station */}
                      <Lookup
                        // {...register(
                        //   `ItemRecipe_ItemRecipe_crafted_item_idToItem.upsert.${index}.item_id`,
                        //   {
                        //     required: true,
                        //   }
                        // )}
                        name={`ItemRecipe_ItemRecipe_crafted_item_idToItem.upsert.${index}.item_id`}
                        group={"category"}
                        options={data.itemsByCategory.items.map((item) => ({
                          category: item.category,
                          type: item.type,
                          label: item.name,
                          value: item.id,
                          image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${item.image}`,
                        }))}
                        search={true}
                        className="!mt-0 !rounded-none !rounded-l-md"
                        defaultValue={recipe.item_id}
                        filterFn={(item, search) => {
                          if (!search) return true;
                          return item.label
                            .toLowerCase()
                            .includes(search.toLowerCase());
                        }}
                      />
                      <NumberField
                        className="rw-input mt-0"
                        defaultValue={recipe.amount}
                        {...register(
                          `ItemRecipe_ItemRecipe_crafted_item_idToItem.upsert.${index}.amount`,
                          {
                            required: true,
                          }
                        )}
                      />
                      <NumberField
                        className="rw-input mt-0"
                        defaultValue={recipe.yields}
                        {...register(
                          `ItemRecipe_ItemRecipe_crafted_item_idToItem.upsert.${index}.yields`,
                          {
                            required: true,
                          }
                        )}
                      />
                      <FieldError
                        name={`ItemRecipe_ItemRecipe_crafted_item_idToItem.upsert.${index}.yields`}
                        className="rw-field-error"
                      />

                      <button
                        type="button"
                        className="rw-button rw-button-red !ml-0 rounded-none !rounded-r-md"
                        onClick={() => removeRecipe(index)}
                      >
                        Remove Recipe
                      </button>
                    </div>
                  </div>
                ))}
                <div className="rw-button-group justify-start">
                  <button
                    type="button"
                    className="rw-button rw-button-gray"
                    onClick={() =>
                      appendRecipe({
                        item_id: 1,
                        amount: 1,
                        crafting_station: 126,
                        yields: 1,
                      })
                    }
                  >
                    Add Recipe
                  </button>
                </div>

                {/* <Lookup
                  items={arkitems.items.filter((item) => item.type === 'Resource').map((item) => ({
                    ...item, image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${item.name
                      .replaceAll(" ", "-")
                      .replace("plant-species-y", "plant-species-y-trap")}.png`
                  }))}
                  search={true}
                  name="recipe"
                  onSelect={(e) => setRecipe({ type: "ADD", item: { ...e, amount: 1 } })} //  setRecipe((d) => [...d, e])
                /> */}

                {/* <div className="mt-2 flex flex-col">
                  {recipe.map((rec) => (
                    <div className="rw-button-group !mt-0 mb-0 justify-start text-sm font-medium">
                      <span
                        onClick={() => {
                          setRecipe({ type: "REMOVE", id: rec.id });
                        }}
                        className="rw-input mt-0 inline-flex min-w-full items-center"
                      >
                        <img
                          className="mr-2 h-4"
                          src={rec.image}
                          alt={rec.name}
                        />
                        <span className="block truncate text-left">
                          {rec.name}
                        </span>
                      </span>
                      <input
                        className="rw-input mt-0 w-20"
                        defaultValue={rec.amount}
                        onChange={(e) => {
                          setRecipe({
                            type: "UPDATE_AMOUNT",
                            item: rec,
                            amount: e.target.value,
                          });
                        }}
                      />
                    </div>
                  ))}
                </div> */}

                <p className="rw-helper-text">
                  Items needed for crafting this item
                </p>

                {/* <FieldError name="recipe" className="rw-field-error" /> */}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  className="m-2 h-10 w-10 fill-current"
                >
                  <path d="M374.6 310.6l-160 160C208.4 476.9 200.2 480 192 480s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 370.8V64c0-17.69 14.33-31.1 31.1-31.1S224 46.31 224 64v306.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0S387.1 298.1 374.6 310.6z" />
                </svg>
                <p className="rw-helper-text">
                  The amount of this item gained when crafting
                </p>
                <FieldError name="yields" className="rw-field-error" />
              </div>
            </div>
          </fieldset>
        )}

        <Label
          name="category"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Category
        </Label>

        <SelectField
          name="category"
          className="rw-input"
          defaultValue={props.item?.category}
          errorClassName="rw-input rw-input-error"
          validation={{
            required: true,
          }}
        >
          <option>Armor</option>
          <option>Consumable</option>
          <option>Fertilizer</option>
          <option>Other</option>
          <option>Resource</option>
          <option>Structure</option>
          <option>Tool</option>
          <option>Weapon</option>
        </SelectField>

        <FieldError name="category" className="rw-field-error" />

        <Label
          name="type"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Type
        </Label>

        <SelectField
          name="type"
          className="rw-input"
          defaultValue={props.item?.type}
          errorClassName="rw-input rw-input-error"
          validation={{
            required: false,
          }}
        >
          <optgroup label="Armor">
            <option>Attachment</option>
            <option>Chitin</option>
            <option>Cloth</option>
            <option>Flak</option>
            <option>Fur</option>
            <option>Ghillie</option>
            <option>Hazard</option>
            <option>Hide</option>
            <option>Riot</option>
            <option>Saddle</option>
            <option>Scuba</option>
            <option>Tek</option>
            <option value={null}>Other</option>
          </optgroup>
          <optgroup label="Consumable">
            <option>Dish</option>
            <option>Drug</option>
            <option>Egg</option>
            <option>Food</option>
            <option>Fungus</option>
            <option>Meat</option>
            <option>Other</option>
            <option>Plant</option>
            <option>Seed</option>
            <option>Tool</option>
          </optgroup>
          <optgroup label="Fertilizer">
            <option>Feces</option>
          </optgroup>
          <optgroup label="Other">
            <option>Artifact</option>
            <option>Coloring</option>
            <option>Navigation</option>
            <option>Other</option>
            <option>Tool</option>
            <option>Utility</option>
          </optgroup>
          <optgroup label="Resource">
            <option>Other</option>
          </optgroup>
          <optgroup label="Structure">
            <option>Adobe</option>
            <option>Building</option>
            <option>Crafting</option>
            <option>Electrical</option>
            <option>Elevator</option>
            <option>Greenhouse</option>
            <option>Metal</option>
            <option>Stone</option>
            <option>Tek</option>
            <option>Thatch</option>
            <option>Utility</option>
            <option>Vehicle</option>
            <option>Wood</option>
            <option value={null}>Other</option>
          </optgroup>
          <optgroup label="Tool">
            <option value={null}>Other</option>
          </optgroup>
          <optgroup label="Weapon">
            <option>Ammunition</option>
            <option>Arrow</option>
            <option>Attachment</option>
            <option>Explosive</option>
            <option>Gun</option>
            <option>Other</option>
            <option>Shield</option>
            <option>Tool</option>
            <option value={null}>Other stuff</option>
          </optgroup>
        </SelectField>

        <FieldError name="type" className="rw-field-error" />

        <Label
          name="stats"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Stats
        </Label>

        {statFields.map((stat, index) => (
          <div
            className="rw-button-group !mt-0 justify-start"
            role="group"
            key={`stat-${index}`}
          >
            <select
              className="rw-input mt-0"
              defaultValue={stat.id}
              {...register(`stats.${index}.id`)}
            >
              <optgroup label="Consumable">
                <option value={8}>Food</option>
                <option value={9}>Spoils</option>
                <option value={10}>Torpor</option>
                <option value={15}>Affinity</option>
                <option value={12}>Stamina</option>
                <option value={11}>Water</option>
                <option value={7}>Health</option>
              </optgroup>
              <optgroup label="Tool/Armor">
                <option value={2}>Armor</option>
                <option value={3}>Hypothermal Insulation</option>
                <option value={4}>Hyperthermal Insulation</option>
                <option value={5}>Durability</option>
                <option value={6}>Weapon Damage</option>
                <option value={16}>Ammo For Item</option>
                <option value={17}>Weight Reduction</option>
                <option value={19}>Gather Efficiency</option>
                <option value={18}>Fuel</option>
              </optgroup>
              <optgroup label="Structure">
                <option value={7}>Health</option>
                <option value={18}>Fuel</option>
              </optgroup>
              <option value={13}>Cooldown</option>
              <option value={14}>Fertilizer Points</option>
              <option value={20}>Other</option>
            </select>
            <input
              {...register(`stats.${index}.value`, { required: true })}
              type="number"
              className="rw-input mt-0"
              defaultValue={stat.value}
            />
            <button
              type="button"
              className="rw-button rw-button-red !ml-0 rounded-none !rounded-r-md"
              onClick={() => removeStat(index)}
            >
              Remove Stat
            </button>
          </div>
        ))}
        <div className="rw-button-group justify-start">
          <button
            type="button"
            className="rw-button rw-button-gray"
            onClick={() => appendStat({ id: 0, value: 0 })}
          >
            Add Stat
          </button>
        </div>

        {/* <div className="flex flex-col">
          {stats && stats.map((stat, index) =>
            <div className="rw-button-group !mt-0 justify-start" key={`stat-${index}`}>
              <select
                className="rw-input mt-0"
                defaultValue={stat.id}
                onChange={(e) => {
                  setStatType(e.target.selectedOptions[0].value)
                }}>
                <option value={2}>Armor</option>
                <option value={3}>Hypothermal Insulation</option>
                <option value={4}>Hyperthermal Insulation</option>
                <option value={5}>Durability</option>
                <option value={7}>Health</option>
                <option value={8}>Food</option>
                <option value={6}>Weapon Damage</option>
                <option value={9}>Spoils</option>
                <option value={10}>Torpor</option>
                <option value={15}>Affinity</option>
                <option value={16}>Ammo</option>
                <option value={12}>Stamina</option>
                <option value={13}>Cooldown</option>
                <option value={14}>Fertilizer Points</option>
                <option value={17}>Weight Reduction</option>
                <option value={18}>Fuel</option>
                <option value={19}>Gather</option>
                <option value={11}>Water</option>
              </select>
              <input name="value" type="number" className="rw-input mt-0 !rounded-r-md" defaultValue={stat.value} />
              <button className="rw-button rw-button-red" onClick={() => setStats((s) => s.filter((v) => v.id !== stat.id))}>
                Remove Stat
              </button>
            </div>
          )}
        </div>
        <div className="rw-button-group justify-start">
          <select
            className="rw-input mt-0"
            defaultValue={statType}
            onChange={(e) => {
              setStatType(e.target.selectedOptions[0].value)
            }}>
            <option value={2}>Armor</option>
            <option value={3}>Hypothermal Insulation</option>
            <option value={4}>Hyperthermal Insulation</option>
            <option value={5}>Durability</option>
            <option value={7}>Health</option>
            <option value={8}>Food</option>
            <option value={6}>Weapon Damage</option>
            <option value={9}>Spoils</option>
            <option value={10}>Torpor</option>
            <option value={15}>Affinity</option>
            <option value={16}>Ammo</option>
            <option value={12}>Stamina</option>
            <option value={13}>Cooldown</option>
            <option value={14}>Fertilizer Points</option>
            <option value={17}>Weight Reduction</option>
            <option value={18}>Fuel</option>
            <option value={19}>Gather</option>
            <option value={11}>Water</option>
          </select>
          <input name="value" type="number" className="rw-input mt-0 !rounded-r-md" defaultValue={statValue} onChange={(e) => setStatValue(e.currentTarget.valueAsNumber)} />
          <button className="rw-button rw-button-green" onClick={addStat}>
            Add stat
          </button>
        </div> */}

        <FieldError name="stats" className="rw-field-error" />

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
