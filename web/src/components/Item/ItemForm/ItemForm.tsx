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

    // props.onSave(data, props?.item?.id);
  };
  const [stats, setStats] = useState([]);
  const [statType, setStatType] = useState(null);
  const [statValue, setStatValue] = useState(0);
  const [craftable, setCraftable] = useState(false);

  const addStat = (data) => {
    data.preventDefault()

    if (stats.filter((stat) => stat.id === statType).length > 0) return
    setStats([...stats, { id: statType, value: statValue }]);
    setStatType(null);
    setStatValue(0);
  }
  return (
    <div className="rw-form-wrapper">
      <Form<FormItem> onSubmit={onSubmit} error={props.error} className="w-auto">
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
          defaultChecked={craftable}
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
              defaultValue={props.item?.req_level ? props.item.req_level.toString() : 0}
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
              defaultValue={props.item?.crafted_in}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              multiple
              emptyAs={null}
              validation={{
                required: false,
              }}
            >
              <option value={606}>Beer Barrel</option>
              <option value={39}>Campfire</option>
              <option value={607}>Chemistry Bench</option>
              <option value={128}>Cooking Pot</option>
              <option value={127}>Compost Bin</option>
              <option value={185}>Fabricator</option>
              <option value={601}>Industrial Cooker</option>
              <option value={600}>Industrial Forge</option>
              <option value={360}>Industrial Grill</option>
              <option value={618}>Industrial Grinder</option>
              <option value={107}>Mortar And Pestle</option>
              <option value={125}>Refining Forge</option>
              <option value={126}>Smithy</option>
              <option value={652}>Tek Replicator</option>
            </SelectField>


            <FieldError name="crafted_in" className="rw-field-error" />
          </>
        )}
        <Label
          name="type"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Category
        </Label>

        <SelectField
          name="type"
          className="rw-input"
          // defaultValue={props.item?.type}
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

        <FieldError name="type" className="rw-field-error" />

        {/* TODO: If structure category selected, show input for durability etc */}

        <Label
          name="stats"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Stats
        </Label>

        <div className="flex flex-col">
          {stats && stats.map((stat, index) =>
            <div className="rw-button-group !mt-0 justify-start">
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
              <button className="rw-button rw-button-green" onClick={() => setStats((s) => s.filter((v) => v.id !== stat.id))}>
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
        </div>


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
