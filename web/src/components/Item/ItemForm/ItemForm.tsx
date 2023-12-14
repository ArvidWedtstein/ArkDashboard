import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  useFieldArray,
  useForm,
} from "@redwoodjs/forms";

import type { EditItemById, UpdateItemInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { useEffect, useState } from "react";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import { useLazyQuery } from "@apollo/client";
import { Input, InputOutlined } from "src/components/Util/Input/Input";
import FileUpload from "src/components/Util/FileUpload/FileUpload";
import Switch from "src/components/Util/Switch/Switch";
import EditItemRecipeCell from "src/components/ItemRecipe/EditItemRecipeCell";
import ItemRecipesList from "src/components/ItemRecipe/ItemRecipes/ItemRecipes";
import ItemRecipesCell from "src/components/ItemRecipe/ItemRecipesCell";
import NewItemRecipe from "src/components/ItemRecipe/NewItemRecipe/NewItemRecipe";
import Button from "src/components/Util/Button/Button";
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
  // const {
  //   fields: recipeFields,
  //   append: appendRecipe,
  //   remove: removeRecipe,
  // } = useFieldArray({
  //   control,
  //   name: "ItemRecipe_ItemRecipe_crafted_item_idToItem.upsert", // the name of the field array in your form data
  // });

  return (
    <div className="rw-form-wrapper">
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

            <InputOutlined
              name="color"
              label="Color"
              margin="normal"
              type="text"
              placeholder="#ff0000"
              defaultValue={props.item?.color}
              validation={{
                pattern: {
                  value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i,
                  message: "Invalid color",
                },
              }}
            />
            {/* TODO: test*/}
            <ColorInput label="Color" />
          </div>
          <FileUpload
            name="image"
            label="Image"
            defaultValue={props?.item?.image}
            storagePath={`arkimages/Item`}
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
          <InputOutlined
            name="affinity"
            label="Affinity"
            margin="normal"
            type="number"
            defaultValue={props.item?.affinity}
          />
          <InputOutlined
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

          <InputOutlined
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
        <div className="flex flex-wrap">
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
            SuffixProps={{
              style: {
                borderRadius: "0.375rem 0 0 0.375rem",
                marginRight: "-0.5px",
              },
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
            SuffixProps={{
              style: {
                borderRadius: "0 0.375rem 0.375rem 0",
                marginLeft: "-0.5px",
              },
            }}
          />
        </div>

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
        {/* TODO: checkj why dis reset category and type */}
        <Switch
          onLabel="Craftable"
          defaultChecked={craftable}
          onChange={(e) => setCraftable(e.target.checked)}
        />

        {/* TODO: show list of itemrecipes */}
        {craftable && (
          <>{props.item?.id ? <ItemRecipesCell /> : <NewItemRecipe />}</>
        )}

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
                {/* TODO: redo replace. / Move to own form */}
                <Label
                  name="recipe"
                  className="rw-label"
                  errorClassName="rw-label rw-label-error"
                >
                  Recipe
                </Label>

                {/* {recipeFields.map(
                  (
                    recipe: {
                      id?: number | string;
                      crafting_station?: string;
                      item_id?: number;
                      amount?: number;
                      yields?: number;
                    },
                    index
                  ) => (
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
                      <div
                        className="rw-button-group items-center justify-start"
                        role="group"
                        key={`recipe-${index}`}
                      >
                        <Lookup
                          margin="none"
                          {...register(
                            `ItemRecipe_ItemRecipe_crafted_item_idToItem.upsert.${index}.item_id`,
                            {
                              required: true,
                            }
                          )}
                          name={`ItemRecipe_ItemRecipe_crafted_item_idToItem.upsert.${index}.item_id`}
                          label={"Item"}
                          options={data.itemsByCategory.items.map((item) => ({
                            category: item.category,
                            type: item.type,
                            label: item.name,
                            value: item.id,
                            image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${item.image?.replaceAll(
                              " ",
                              "-"
                            )}`,
                          }))}
                          className="!mt-0 !rounded-none !rounded-l-md"
                          defaultValue={[recipe.item_id.toString()]}
                          filterFn={(item, search) => {
                            if (!search) return true;
                            return item.label
                              .toLowerCase()
                              .includes(search.toLowerCase());
                          }}
                        />
                        <InputOutlined
                          type="number"
                          label="Amount"
                          defaultValue={recipe.amount}
                          {...register(
                            `ItemRecipe_ItemRecipe_crafted_item_idToItem.upsert.${index}.amount`,
                            {
                              required: true,
                            }
                          )}
                        />

                        <InputOutlined
                          type="number"
                          label="Yields"
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
                          className="rw-button rw-button-red rw-button-large !ml-0 rounded-none  !rounded-r-md"
                          onClick={() => removeRecipe(index)}
                        >
                          Remove Recipe
                        </button>
                      </div>
                    </div>
                  )
                )}
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
                </div> */}

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
          name="stats"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Stats
        </Label>

        {statFields.map((stat, index) => (
          <div
            className="rw-button-group mt-2 justify-start"
            role="group"
            key={`stat-${index}`}
          >
            <Lookup
              margin="none"
              defaultValue={stat.id}
              label="Stat Type"
              {...register(`stats.${index}.id`)}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              getOptionLabel={(option) => option.label}
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

            {/* TODO: fix */}
            <InputOutlined
              label={"Value"}
              {...register(`stats.${index}.value`)}
              type="number"
              defaultValue={stat.value}
            />
            {/* <select
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
            /> */}
            <button
              type="button"
              className="rw-button rw-button-red rw-button-large !ml-0 rounded-none !rounded-r-md"
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
          <Button
            color="success"
            variant="outlined"
            permission="basespot_create"
            disabled={props.loading}
            type="submit"
            name="save"
            endIcon={(
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

export default ItemForm;
