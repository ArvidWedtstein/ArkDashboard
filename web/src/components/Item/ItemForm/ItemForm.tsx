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
  useFieldArray,
  useForm,
} from "@redwoodjs/forms";

import type { EditItemById, UpdateItemInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { useReducer, useState } from "react";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import Lookup from "src/components/Util/Lookup/Lookup";
import arkitems from "../../../../public/arkitems.json";

type FormItem = NonNullable<EditItemById["item"]>;

interface ItemFormProps {
  item?: EditItemById["item"];
  onSave: (data: UpdateItemInput, id?: FormItem["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const ItemForm = (props: ItemFormProps) => {
  const onSubmit = (data: FormItem) => {
    // delete data["craftable"];

    console.log(data);

    props.onSave(data, props?.item?.id);
  };

  const [craftable, setCraftable] = useState(false);

  const { register, control } = useForm({
    defaultValues: {
      stats: [],
      recipe: [],
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
    name: "recipe", // the name of the field array in your form data
  });

  const reducer = (state, action) => {
    const { type, item, id, amount = 1 } = action;
    switch (type) {
      case "UPDATE_AMOUNT": {
        const itemIndex = state.findIndex((i) => i.id === item.id);

        if (itemIndex === -1) {
          return [...state, { ...item, amount }];
        }

        return state.map((i, index) => {
          if (index === itemIndex) {
            return { ...i, amount: i.amount + amount };
          }
          return i;
        });
      }

      case "ADD": {
        const exists = state.some((i) => i.id === item.id);

        if (exists) {
          return state.map((i) => {
            if (i.id === item.id) {
              return { ...i, amount: i.amount + 1 };
            }
            return i;
          });
        }

        return [...state, item];
      }

      case "REMOVE": {
        return state.filter((i) => i.id !== id);
      }

      case "RESET": {
        return [];
      }

      default: {
        return state;
      }
    }
  };

  let [recipe, setRecipe] = useReducer(
    reducer,
    props.item?.recipe
      ? (props.item?.recipe as any[]).map((f) => {
        let i = arkitems.items.find((i) => i.id === f.itemId);
        return { ...i, amount: f.count };
      })
      : []
  );

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
              <div>
                <Label
                  name="req_level"
                  className="rw-label"
                  errorClassName="rw-label rw-label-error"
                >
                  Required level
                </Label>

                <TextField
                  name="req_level"
                  defaultValue={
                    props.item?.req_level ? props.item.req_level.toString() : 0
                  }
                  className="rw-input"
                  errorClassName="rw-input rw-input-error"
                  validation={{
                    valueAsNumber: true,
                  }}
                />
                <p className="rw-helper-text">
                  Player level required to craft this item
                </p>
                <FieldError name="req_level" className="rw-field-error" />
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
                  name="crafted_in"
                  className="rw-label"
                  errorClassName="rw-label rw-label-error"
                >
                  Crafted in
                </Label>

                <CheckboxGroup
                  name="crafted_in"
                  defaultValue={props.item?.crafted_in}
                  options={[
                    {
                      value: "606",
                      label: "Beer Barrel",
                      image:
                        "https://arkids.net/image/item/120/beer-barrel.png",
                    },
                    {
                      value: "39",
                      label: "Campfire",
                      image: "https://arkids.net/image/item/120/campfire.png",
                    },
                    {
                      value: "607",
                      label: "Chemistry Bench",
                      image:
                        "https://arkids.net/image/item/120/chemistry-bench.png",
                    },
                    {
                      value: "128",
                      label: "Cooking Pot",
                      image:
                        "https://arkids.net/image/item/120/cooking-pot.png",
                    },
                    {
                      value: "127",
                      label: "Compost Bin",
                      image:
                        "https://arkids.net/image/item/120/compost-bin.png",
                    },
                    {
                      value: "185",
                      label: "Fabricator",
                      image: "https://arkids.net/image/item/120/fabricator.png",
                    },
                    {
                      value: "601",
                      label: "Industrial Cooker",
                      image:
                        "https://arkids.net/image/item/120/industrial-cooker.png",
                    },
                    {
                      value: "600",
                      label: "Industrial Forge",
                      image:
                        "https://arkids.net/image/item/120/industrial-forge.png",
                    },
                    {
                      value: "360",
                      label: "Industrial Grill",
                      image:
                        "https://arkids.net/image/item/120/industrial-grill.png",
                    },
                    {
                      value: "618",
                      label: "Industrial Grinder",
                      image:
                        "https://arkids.net/image/item/120/industrial-grinder.png",
                    },
                    {
                      value: "107",
                      label: "Mortar And Pestle",
                      image:
                        "https://arkids.net/image/item/120/mortar-and-pestle.png",
                    },
                    {
                      value: "126",
                      label: "Refining Forge",
                      image:
                        "https://arkids.net/image/item/120/refining-forge.png",
                    },
                    {
                      value: "129",
                      label: "Smithy",
                      image: "https://arkids.net/image/item/120/smithy.png",
                    },
                    {
                      value: "609",
                      label: "Tek Replicator",
                      image:
                        "https://arkids.net/image/item/120/tek-replicator.png",
                    },
                  ]}
                />
                <FieldError name="crafted_in" className="rw-field-error" />
              </div>
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

                {recipeFields.map((recipe, index) => (
                  <div
                    className="rounded-md bg-zinc-800 p-3"
                    key={`recipe-${index}`}
                  >
                    <CheckboxGroup
                      defaultValue={recipe.crafting_station}
                      validation={{ single: true }}
                      options={[
                        {
                          value: "606",
                          label: "Beer Barrel",
                          image:
                            "https://arkids.net/image/item/120/beer-barrel.png",
                        },
                        {
                          value: "39",
                          label: "Campfire",
                          image:
                            "https://arkids.net/image/item/120/campfire.png",
                        },
                        {
                          value: "607",
                          label: "Chemistry Bench",
                          image:
                            "https://arkids.net/image/item/120/chemistry-bench.png",
                        },
                        {
                          value: "128",
                          label: "Cooking Pot",
                          image:
                            "https://arkids.net/image/item/120/cooking-pot.png",
                        },
                        {
                          value: "127",
                          label: "Compost Bin",
                          image:
                            "https://arkids.net/image/item/120/compost-bin.png",
                        },
                        {
                          value: "185",
                          label: "Fabricator",
                          image:
                            "https://arkids.net/image/item/120/fabricator.png",
                        },
                        {
                          value: "601",
                          label: "Industrial Cooker",
                          image:
                            "https://arkids.net/image/item/120/industrial-cooker.png",
                        },
                        {
                          value: "600",
                          label: "Industrial Forge",
                          image:
                            "https://arkids.net/image/item/120/industrial-forge.png",
                        },
                        {
                          value: "360",
                          label: "Industrial Grill",
                          image:
                            "https://arkids.net/image/item/120/industrial-grill.png",
                        },
                        {
                          value: "618",
                          label: "Industrial Grinder",
                          image:
                            "https://arkids.net/image/item/120/industrial-grinder.png",
                        },
                        {
                          value: "107",
                          label: "Mortar And Pestle",
                          image:
                            "https://arkids.net/image/item/120/mortar-and-pestle.png",
                        },
                        {
                          value: "126",
                          label: "Refining Forge",
                          image:
                            "https://arkids.net/image/item/120/refining-forge.png",
                        },
                        {
                          value: "129",
                          label: "Smithy",
                          image: "https://arkids.net/image/item/120/smithy.png",
                        },
                        {
                          value: "609",
                          label: "Tek Replicator",
                          image:
                            "https://arkids.net/image/item/120/tek-replicator.png",
                        },
                      ]}
                    />
                    <div
                      className="rw-button-group justify-start"
                      role="group"
                      key={`recipe-${index}`}
                    >
                      <Lookup
                        {...register(`recipe.${index}.item_id`)}
                        group={"type"}
                        options={arkitems.items
                          .filter((f) =>
                            [
                              "Consumable",
                              "Resource",
                              "Other",
                              "Structure",
                              "Building",
                              "Tool",
                            ].includes(f.type)
                          )
                          .map((item) => {
                            return {
                              type: item.type,
                              label: item.name,
                              value: item.id,
                              image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${item.image}`,
                            };
                          })}
                        search={true}
                        className="!mt-0 !rounded-none !rounded-l-md"
                        defaultValue={recipe.item_id}
                        filterFn={(item, search) => {
                          return item.label
                            .toLowerCase()
                            .includes(search.toLowerCase());
                        }}
                      />
                      <input
                        {...register(`recipe.${index}.amount`, {
                          required: true,
                        })}
                        type="number"
                        className="rw-input mt-0"
                        defaultValue={recipe.amount}
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
                        item_id: 7,
                        amount: 1,
                        crafting_station: "129",
                      })
                    }
                  >
                    Add Recipe
                  </button>
                </div>

                {/* <Lookup
                  items={arkitems.items.filter((item) => item.type === 'Resource').map((item) => ({
                    ...item, image: `https://arkids.net/image/item/120/${item.name
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
                <div className="rw-button-group justify-start">
                  <img
                    className="rw-input mt-0 h-20 w-20 rounded-l-lg"
                    src={
                      `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${props.item?.image}` ||
                      "data:image/jpeg;base64,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"
                    }
                  />
                  <TextField
                    name="yields"
                    defaultValue={props.item?.yields ? props.item.yields : 1}
                    className="rw-input mt-0 w-20"
                    errorClassName="rw-input rw-input-error"
                    validation={{ valueAsNumber: true }}
                  />
                </div>
                <p className="rw-helper-text">
                  The amount of this item gained when crafting
                </p>
                <FieldError name="yields" className="rw-field-error" />
              </div>
            </div>
          </fieldset>
        )}

        <Label
          name="type"
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
        </SelectField>

        <FieldError name="category" className="rw-field-error" />

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
