import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  TextAreaField,
  CheckboxField,
  Submit,
  useForm,
  useFieldArray,
  NumberField,
} from "@redwoodjs/forms";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import type { EditDinoById, UpdateDinoInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import { truncate } from "src/lib/formatters";
import { toast } from "@redwoodjs/web/toast";
import { useLazyQuery } from "@apollo/client";
import Disclosure from "src/components/Util/Disclosure/Disclosure";
import Stepper, { Step } from "src/components/Util/Stepper/Stepper";
import Input, { InputOutlined } from "src/components/Util/Input/Input";
import Switch from "src/components/Util/Switch/Switch";
import Alert from "src/components/Util/Alert/Alert";

type FormDino = NonNullable<EditDinoById["dino"]>;

interface DinoFormProps {
  dino?: EditDinoById["dino"];
  onSave: (data: UpdateDinoInput, id?: FormDino["id"]) => void;
  error?: RWGqlError;
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
const DinoForm = (props: DinoFormProps) => {
  const [disableFood, setDisableFood] = useState(
    props.dino?.disable_food ?? false
  );
  const [loadItems, { called, loading, data }] = useLazyQuery(ITEMQUERY, {
    variables: { category: "Resource,Consumable" },
    onCompleted: (data) => {
      console.log(data);
      toast.success("Items loaded");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!called && !loading) {
      loadItems();
    }
  }, []);

  // https://www.apollographql.com/docs/react/api/react/hooks/#uselazyquery

  // TODO: fix this
  const [basestat, setBasestat] = useState({
    d: { b: 0, t: 0, w: 0, a: [{ b: 0 }] },
    f: { b: 0, t: 0, w: 0 },
    h: { b: 0, t: 0, w: 0 },
    m: { b: 0, t: 0, w: null, a: { s: { b: 0 } } },
    o: { b: null, t: null, w: null },
    s: { b: 0, t: 0, w: 0 },
    t: { b: 0, t: null, w: 0 },
    w: { b: 0, t: 0, w: 0 },
  });

  const [movement, setMovement] = useState({
    w: {
      walk: {
        base: 0,
        sprint: 0,
      },
      swim: {
        base: 0,
        sprint: 0,
      },
      fly: {
        base: 0,
        sprint: 0,
      },
    },
    d: {
      walk: {
        base: 0,
        sprint: 0,
      },
      swim: {
        base: 0,
        sprint: 0,
      },
      fly: {
        base: 0,
        sprint: 0,
      },
    },
    staminaRates: {
      sprint: 0,
      swimOrFly: 0,
    },
  });

  type FormValues = {
    attack: any[];
    "DinoStat.create": { type: string; item_id: number; value: number }[];
    wr: any[];
  };
  const { register, control } = useForm<FormValues>({
    defaultValues: {
      attack: [],
      "DinoStat.create": [
        {
          type: "",
          value: 0,
          item_id: null,
        },
      ],
      wr: props?.dino?.DinoStat.filter(
        (f) => f.type === "weight_reduction"
      ) ?? [
          {
            type: "",
            value: 0,
            item_id: null,
          },
        ],
    },
  });

  const {
    fields: statFields,
    append: appendStat,
    remove: removeStat,
  } = useFieldArray({
    control,
    name: "DinoStat.create", // the name of the field array in your form data
  });

  const {
    fields: attackFields,
    append: appendAttack,
    remove: removeAttack,
  } = useFieldArray({
    control,
    name: "attack", // the name of the field array in your form data
  });

  const statEntries = useMemo(() => Object.entries(basestat), [basestat]);

  const [eats, setEats] = useState([]);

  const [useFoundationUnit, setUseFoundationUnit] = useState(false);

  const onSubmit = (data: FormDino) => {
    // data.eats = eats.map((f) => f.id.toString());
    // data.drops = ["12"];
    console.log(data);
    // delete data.immobilized_by
    // Test Dino Object
    // const d = {
    //   name: "test",
    //   description: "test",
    //   synonyms: "test",
    //   can_destroy: ["t"],
    //   fits_through: ["381"],
    //   immobilized_by: ["t"],
    //   carryable_by: ["t"],
    //   drops: ["11"],
    //   type: ["Ground"],
    //   eats: ["11"],
    //   // DinoStat: [
    //   //   {
    //   //     type: "gather_efficiency",
    //   //     value: 5,
    //   //     item_id: 8,
    //   //   },
    //   // ],
    // };
    // props.onSave(d, props?.dino?.id);
    props.onSave(data, props?.dino?.id);
  };

  // Movement is shown in game units. UE game units are 1 cm 1:1
  // A foundation is 300x300 game units, i.e 3x3 meters
  // https://ark.fandom.com/wiki/Game_units
  return (
    <div className="rw-form-wrapper">
      <Form<FormDino> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
        <Stepper>
          <Step title="General">
            <div className="flex flex-row items-start space-x-3">
              <InputOutlined
                label="Name"
                margin="normal"
                name="name"
                defaultValue={props.dino?.name}
                helperText="Dinos name"
                validation={{ required: true }}
              />

              <InputOutlined
                label="Synonyms"
                margin="normal"
                name="synonyms"
                defaultValue={props.dino?.synonyms}
                helperText="Other names for this dino, comma seperated"
                validation={{
                  required: false,
                  pattern: {
                    value: /^[A-Za-z\s,]+$/, // Regex pattern to allow only letters, spaces, and commas
                    message:
                      "Uh oh! Your dino is getting tongue-tied! Only text is allowed, no dino roars or growls!",
                  },
                }}
              />
            </div>

            <div className="flex flex-row items-start space-x-3">
              <InputOutlined
                label="Description"
                margin="normal"
                name="description"
                defaultValue={props.dino?.description}
                rows={3}
                type="textarea"
              />

              <InputOutlined
                label="Admin Note"
                margin="normal"
                name="admin_note"
                defaultValue={props.dino?.taming_notice}
                rows={3}
                helperText="Some admin related info about this dino"
                type="textarea"
              />
            </div>
          </Step>

          <Step title="Food" className="flex flex-col-reverse">
            <Switch
              name="disable_food"
              onLabel="Disable Food?"
              defaultChecked={disableFood || props.dino?.disable_food}
              onChange={(e) => {
                setDisableFood(e.target.checked);
              }}
            />

            <InputOutlined
              name="food_consumption_base"
              label="Food consumption base multiplier"
              defaultValue={props.dino?.food_consumption_base}
              type="number"
              emptyAs={0}
              validation={{ valueAsNumber: true }}
              margin="normal"
            />
            <InputOutlined
              name="non_violent_food_rate_mult"
              label="Non violent food rate multiplier"
              defaultValue={props.dino?.non_violent_food_rate_mult}
              type="number"
              emptyAs={0}
              validation={{ valueAsNumber: true }}
              margin="normal"
            />
          </Step>

          <Step title="Taming" className="flex flex-col">
            <InputOutlined
              label="Taming Notice"
              margin="normal"
              name="taming_notice"
              defaultValue={props.dino?.taming_notice}
              rows={3}
              helperText="Some info about the taming process of this dino"
              type="textarea"
            />

            <Switch
              name="tamable"
              onLabel="Tamable"
              defaultChecked={props.dino?.tamable}
            />

            <Switch
              name="disable_ko"
              onLabel="Disable KO"
              defaultChecked={props.dino?.disable_ko}
            />
            <p className="rw-helper-text">Can this dino be KO'd?</p>

            <Switch
              name="violent_tame"
              onLabel="Violent tame"
              defaultChecked={props.dino?.violent_tame}
            />
            <p className="rw-helper-text">Is this dino aggressive?</p>

            <InputOutlined
              label="Torpor Depletion per second"
              min={0}
              margin="normal"
              name="tdps"
              defaultValue={props.dino?.tdps}
              helperText="How much torpidity this dino looses per second"
              type="number"
              validation={{ valueAsNumber: true }}
            />

            <InputOutlined
              label="Affinity needed"
              min={0}
              margin="normal"
              name="affinity_needed"
              defaultValue={props.dino?.affinity_needed}
              helperText="Base Affinity needed to tame this dino. This will later be multiplied by the affinity increase per level"
              type="number"
              validation={{ valueAsNumber: true }}
            />

            <InputOutlined
              label="Affinity Increase Per Level"
              min={0}
              emptyAs={0}
              margin="normal"
              name="aff_inc"
              defaultValue={props.dino?.aff_inc}
              helperText="Affinity increase (per level).  "
              type="number"
              validation={{ valueAsNumber: true }}
            />

            {/* TODO: disable if disableFood? */}
            <InputOutlined
              label="Non violent food affinity multiplier"
              min={0}
              margin="normal"
              name="non_violent_food_affinity_mult"
              defaultValue={props.dino?.non_violent_food_affinity_mult}
              type="number"
              validation={{ valueAsNumber: true }}
            />

            <InputOutlined
              label="Flee Threshold"
              name="flee_threshold"
              min={0}
              margin="normal"
              defaultValue={props.dino?.flee_threshold}
              helperText="Chance of this dino fleeing while being tamed"
              type="number"
              validation={{ valueAsNumber: true }}
            />

            <InputOutlined
              label="Base Taming Time"
              name="base_taming_time"
              min={0}
              margin="normal"
              defaultValue={props.dino?.base_taming_time}
              helperText="Base taming time in seconds"
              type="number"
              validation={{ valueAsNumber: true }}
            />

            <InputOutlined
              label="Taming Interval"
              name="taming_interval"
              min={0}
              margin="normal"
              defaultValue={props.dino?.taming_interval}
              helperText="Taming interval in seconds"
              type="number"
              validation={{ valueAsNumber: true }}
            />

            <InputOutlined
              label="Taming Ineffectiveness"
              name="taming_ineffectiveness"
              min={0}
              margin="normal"
              defaultValue={props.dino?.taming_ineffectiveness}
              type="number"
              validation={{ valueAsNumber: true }}
            />

            {/* TODO: make hitboxes input */}
            {/* <Label
              name="hitboxes"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Hitboxes
            </Label>

            <TextAreaField
              name="hitboxes"
              defaultValue={JSON.stringify(props.dino?.hitboxes)}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              emptyAs={"undefined"}
              validation={{ valueAsJSON: true }}
            />

            <FieldError name="hitboxes" className="rw-field-error" /> */}
          </Step>
          <Step title="Stats">
            <Label
              name="base_stats"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Base stats
            </Label>
            {/* TODO: find a better solution for this crap */}
            <div className="grid w-fit grid-cols-3 divide-x divide-zinc-500 text-white">
              <div className="grid grid-rows-[8]">
                <InputOutlined
                  type="text"
                  name="health"
                  label="Base Health"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/health.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="stamina"
                  label="Base Stamina"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stamina.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="torpidity"
                  label="Base Torpidity"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/torpidity.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="oxygen"
                  label="Base Oxygen"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/oxygen.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="food"
                  label="Base Food"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/food.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="weight"
                  label="Base Weight"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/weight.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="melee_damage"
                  label="Base Melee Damage"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/melee_damage.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="movement_speed"
                  label="Base Movement Speed"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/movement_speed.webp"
                      className="h-4"
                    />
                  }
                />
              </div>
              <div className="grid grid-rows-[8]">
                <InputOutlined
                  type="text"
                  name="health"
                  label="Wild Health"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/health.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="stamina"
                  label="Wild Stamina"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stamina.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="torpidity"
                  label="Wild Torpidity"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/torpidity.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="oxygen"
                  label="Wild Oxygen"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/oxygen.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="food"
                  label="Wild Food"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/food.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="weight"
                  label="Wild Weight"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/weight.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="melee_damage"
                  label="Wild Melee Damage"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/melee_damage.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="movement_speed"
                  label="Wild Movement Speed"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/movement_speed.webp"
                      className="h-4"
                    />
                  }
                />
              </div>
              <div className="grid grid-rows-[8]">
                <InputOutlined
                  type="text"
                  name="health"
                  label="Tamed Health"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/health.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="stamina"
                  label="Tamed Stamina"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stamina.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="torpidity"
                  label="Tamed Torpidity"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/torpidity.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="oxygen"
                  label="Tamed Oxygen"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/oxygen.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="food"
                  label="Tamed Food"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/food.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="weight"
                  label="Tamed Weight"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/weight.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="melee_damage"
                  label="Tamed Melee Damage"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/melee_damage.webp"
                      className="h-4"
                    />
                  }
                />
                <InputOutlined
                  type="text"
                  name="movement_speed"
                  label="Tamed Movement Speed"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/movement_speed.webp"
                      className="h-4"
                    />
                  }
                />
              </div>
            </div>

            <div className="flex flex-row items-start space-x-3">
              <Lookup
                multiple
                closeOnSelect
                label="Carryable By"
                name="carryable_by"
                options={[
                  {
                    value: "e85015a5-8694-44e6-81d3-9e1fdd06061d",
                    label: "Pteranodon",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_pteranodon.webp",
                  },
                  {
                    value: "1e7966e7-d63d-483d-a541-1a6d8cf739c8",
                    label: "Tropeognathus",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_tropeognathus.webp",
                  },
                  {
                    value: "b8e304b3-ab46-4232-9226-c713e5a0d22c",
                    label: "Tapejara",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_tapejara.webp",
                  },
                  {
                    value: "da86d88a-3171-4fc9-b96d-79e8f59f1601",
                    label: "Griffin",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_griffin.webp",
                  },
                  {
                    value: "147922ce-912d-4ab6-b4b6-712a42a9d939",
                    label: "Desmodus",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_desmodus.webp",
                  },
                  {
                    value: "28971d02-8375-4bf5-af20-6acb20bf7a76",
                    label: "Argentavis",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_argentavis.webp",
                  },
                  {
                    value: "f924e5d6-832a-4fb3-abc0-2fa42481cee1",
                    label: "Crystal Wyvern",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_crystalwyvern.webp",
                  },
                  {
                    value: "7aec6bf6-357e-44ec-8647-3943ca34e666",
                    label: "Wyvern",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_wyvern.webp",
                  },
                  {
                    value: "2b938227-61c2-4230-b7da-5d4d55f639ae",
                    label: "Quetzal",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_quetzal.webp",
                  },
                  {
                    value: "b1d6f790-d15c-4813-a6c8-9e6f62fafb52",
                    label: "Tusoteuthis",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_tusoteuthis.webp",
                  },
                  {
                    value: "d670e948-055e-45e1-adf3-e56d63236238",
                    label: "Karkinos",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_karkinos.webp",
                  },
                  {
                    value: "52156470-6075-487b-a042-2f1d0d88536c",
                    label: "Kaprosuchus",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_kaprosuchus.webp",
                  },
                  {
                    value: "f723f861-0aa3-40b5-b2d4-6c48ec0ca683",
                    label: "Procoptodon",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_procoptodon.webp",
                  },
                  {
                    value: "human",
                    label: "Human",
                    image: "https://www.dododex.com/media/item/Pet.png",
                  },
                  {
                    value: "94708e56-483b-4eef-ad35-2b9ce0e9c669",
                    label: "Gigantopithecus",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_gigantopithecus.webp",
                  },
                ]}
              />

              <Lookup
                name="can_destroy"
                label="Can Destroy"
                helperText="Structuretypes this dino can destroy"
                options={[
                  { label: 'Thatch', value: 't', image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/thatch-wall.webp" },
                  { label: 'Wood', value: 'w', image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/wooden-wall.webp" },
                  { label: 'Adobe', value: 'a', image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/adobe-wall.webp" },
                  { label: 'Stone', value: 's', image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-wall.webp" },
                  { label: 'Greenhouse', value: 'g', image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/greenhouse-wall.webp" },
                  { label: 'Metal', value: 'm', image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/metal-wall.webp" },
                  { label: 'Tek', value: 'tk', image: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/tek-wall.webp" },
                ]}
              />
            </div>

            <InputOutlined
              name="exp_per_kill"
              label="Experience per kill"
              defaultValue={props.dino?.exp_per_kill || 0}
              helperText="Experience gained per kill"
              type="number"
              margin="normal"
              min={0}
              validation={{ valueAsNumber: true, min: 0 }}
            />

            <Switch
              name="ridable"
              onLabel="Ridable"
              defaultChecked={props.dino?.ridable}
              helperText="Is this dino ridable?"
            />

            <Switch
              name="mounted_weaponry"
              onLabel="Mounted Weaponry"
              defaultChecked={props.dino?.mounted_weaponry}
              helperText="Can you use weapons while riding this dino?"
            />


            <Switch
              name="disable_mult"
              onLabel="Disable multipliers"
              className="mt-5"
              defaultChecked={props.dino?.disable_mult}
            />

            <Label
              name="movement"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Movement
            </Label>

            <div className="grid grid-flow-row gap-5 text-black dark:text-white mt-3">
              {Object.entries(movement).map(([k, v], i) => (
                <div key={`m-${i}`}>
                  <p className="col-span-3">
                    {
                      {
                        w: "Forwards",
                        d: "Sideways",
                        staminaRates: "Stamina Rates",
                      }[k]
                    }
                  </p>
                  <div
                    className="relative grid grid-flow-col auto-cols-max gap-1"
                    key={`m-${i}`}
                  >
                    {Object.entries(v).map(([stattype, v2], i2) => (
                      <div
                        className="rounded bg-zinc-700 p-4"
                        key={`m-${i}-c-${i2}`}
                      >
                        <legend className="text-base font-medium capitalize pb-2 border-b border-spacing-6 w-full inline-flex items-center space-x-3">
                          {stattype === 'fly' && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-5 h-5 fill-current">
                              <path d="M624 480H17.11c-8.836 0-16 7.162-16 16c0 8.836 7.164 16 16 16H624c8.801 0 16-7.201 16-16C640 487.2 632.8 480 624 480zM80.49 371.3C88.24 379.4 98.86 384 109.1 384l127.1-.125c11.25-.125 22.38-2.625 32.5-7.625l283-140.4c29.25-14.38 52.88-34.5 68.38-58.13c18-27.25 22.38-50.25 13.25-68.38c-11.62-22.88-42-30.75-72.75-30.75c-26 0-52.5 6.5-78.75 19.62l-92.75 46L181.2 67.63C177.2 65.25 172.7 64 167.1 64c-4 0-7.875 .875-11.5 2.625l-64 31.75c-7.5 3.75-12.62 11-13.75 19.38C77.61 127 82.11 136.1 90.24 141l136.5 84.13l-84 41.63L75.99 233.9c-7.25-3.625-15.63-3.625-22.88 0l-39 19.38c-7 3.375-12.12 9.875-13.62 17.5s.5 15.62 5.625 21.5L80.49 371.3zM64.61 263.9l78.25 38.5l149.9-74.25L118.5 121.3l49.38-24.5l224 82.13l105-52c21.88-10.75 43.63-16.25 64.63-16.25c16.25 0 39.38 3.625 44.25 13.25c3.375 6.75-.875 20.25-11.38 36.25C581.1 179 562.6 195.4 538.5 207.3L255.4 347.5c-5.625 2.875-11.88 4.375-18.25 4.375L110.1 352c-2.375 0-4.625-1-6.375-2.625L36.49 277.8L64.61 263.9z" />
                            </svg>
                          )}
                          {stattype === 'swim' && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-5 h-5 fill-current">
                              <path d="M176 336C184.8 336 192 328.8 192 320c0-28.06 8.625-54.94 24.92-77.77L238.6 211.9C245.1 202.8 252.9 195 261.3 187.9l160.7 128.6C424.1 318.9 428.5 320 431.1 320c4.703 0 9.344-2.062 12.52-6c5.516-6.906 4.391-16.97-2.5-22.5L289.2 169.3c6.895-3.346 14.07-6.143 21.48-8.262c38.11-10.86 78.86-13.14 117.1-6.688l32.72 5.453c8.734 1.5 16.97-4.438 18.41-13.16c1.453-8.719-4.438-16.95-13.16-18.41l-32.72-5.453c-43.73-7.25-89.39-4.703-131.1 7.469C266 140.5 234.3 162.9 212.6 193.3L190.9 223.6C170.7 251.9 160 285.2 160 320C160 328.8 167.2 336 176 336zM104 240c39.77 0 72-32.24 72-72C176 128.2 143.8 96 104 96C64.24 96 32 128.2 32 168C32 207.8 64.24 240 104 240zM104 128C126.1 128 144 145.9 144 168S126.1 208 104 208S64 190.1 64 168S81.94 128 104 128zM562 383.1c-28.14-3.625-53.29-18.34-69.03-40.38c-6-8.438-20.04-8.438-26.04 0c-18.44 25.84-49.45 41.2-82.97 41.2c-33.52 0-64.53-15.35-82.97-41.2c-6.031-8.438-20.03-8.438-26.06 0c-18.44 25.84-49.45 41.2-82.97 41.2c-33.51 0-64.53-15.35-82.97-41.2C106 338.5 101.2 336 96 336s-10.02 2.5-13.02 6.719c-15.73 22.03-40.89 36.75-69.03 40.38c-8.766 1.125-14.95 9.156-13.83 17.94c1.125 8.75 9.029 15.06 17.92 13.81c29.98-3.875 57.48-17.47 77.94-38.09C120.6 401.6 155.3 416 192.1 416C228.9 416 263.4 401.6 288 376.8C312.6 401.6 347.3 416 384.1 416c36.78 0 71.28-14.41 95.9-39.25c20.45 20.62 47.95 34.22 77.94 38.09c8.951 1.375 16.79-5.062 17.92-13.81C576.1 392.3 570.8 384.2 562 383.1z" />
                            </svg>
                          )}
                          {stattype === 'sprint' && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-5 h-5 fill-current">
                              <path d="M512 224c-8.875 0-16 7.125-16 16S503.1 256 512 256s16-7.125 16-16S520.9 224 512 224zM602.9 191.2c-.625-.5-58.5-36-58.5-36c-2.5-1.625-9.75-5.125-18.38-7.5c-1.249-7.5-2.874-14.75-4.874-22.13C515.3 103.8 492.5 32 446.6 32c-38 0-44.25 41.88-44.5 43.38c-32.13-17.25-55.5-13.25-69.75 1C323.8 85.12 311.9 104.8 328 139.8C297 123.4 266.5 112 240 112c-45.75 0-86.25 18.38-117.9 52.38C108.6 151.2 90.88 144 72 144c-19.25 0-37.38 7.5-51 21.12c-28 28-28 73.75 0 101.8C34.62 280.5 52.75 288 72 288c12.75 0 24.75-3.625 35.5-9.75c3.625 6.25 7.625 12.38 12.88 18l54 58.5l-25 13.5C136 377.1 128 392.1 128 408.2V432c0 17.25 8.875 32.75 23.88 41.5C159.4 477.9 167.7 480 175.9 480c8.125 0 16.46-2.125 23.83-6.375l55.25-31.5l25.5 27.63C286.5 476.2 295 480 304 480h160c17.62 0 32-14.38 32-32c0-35.25-28.75-64-64-64H384l70.38-32h97C600.3 352 640 312.2 640 263.4C640 234.8 626.1 207.8 602.9 191.2zM96.25 246.9C71.75 266.1 49.38 250 43.62 244.2c-15.62-15.62-15.62-40.87 0-56.5c15.62-15.63 41-15.63 56.62 0C101.5 189 102.5 190.5 103.5 192C95.75 209.4 93.12 228.5 96.25 246.9zM183.9 445.9C173.4 451.9 160 444.2 160 432v-23.75c0-5.375 2.625-10.37 5.75-12.62l31-16.62l36 39L183.9 445.9zM551.4 320l-103.4-.0018L384 346.6v-2.25c0-49.75-33.38-93.1-81.25-107.6L260.4 224.6c-20.5-5.875-29.13 25-8.75 30.75L293.1 267.5C328.1 277.2 352 308.9 352 344.4V416h80c17.62 0 31.98 14.38 31.98 32L304 448L143.9 274.5C121.5 250.2 121.1 213.1 143 188.5C163.1 165.8 194.3 144 239.9 144C297.2 144 392.8 219.2 448 256c0-31.12-.5-30.75 3.5-43c-15.25-3.5-37.75-17.88-59.13-39.25c-31-31-47.62-64.38-37.38-74.75c10.75-10.75 45.13 7.875 74.75 37.38C433 139.6 436 142.9 438.9 146.2C427.2 101.6 430.8 64 446.6 64c13.88 0 32.88 30 43.62 70c4 15.25 6.25 29.87 6.875 42.5c14.25-1 25.03 3.351 30.65 6.101l56.48 34.66C599.1 227.9 608 244.1 608 263.4C608 294.6 582.6 320 551.4 320z" />
                            </svg>
                          )}
                          {stattype === 'walk' && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-5 h-5 fill-current">
                              <path d="M200 112C230.9 112 256 86.88 256 56S230.9 0 200 0S144 25.12 144 56S169.1 112 200 112zM200 32C213.2 32 224 42.77 224 56S213.2 80 200 80S176 69.23 176 56S186.8 32 200 32zM312.9 274.7l-38.84-25.89c-2.969-1.969-5.188-4.922-6.312-8.281l-16.78-50.36c-9.094-27.16-32.16-47.52-60.22-53.13l-19.31-3.859C151.8 129.3 131.6 132.8 114.6 143L61.94 174.6C55.88 178.2 50.59 183.2 46.69 189.1l-28 42.02C13.78 238.5 15.78 248.4 23.13 253.3c7.312 4.859 17.25 2.922 22.19-4.438l28-42.02c1.312-1.953 3.062-3.641 5.062-4.844l45.43-27.23L106.1 245.8c-7.375 29.59 2.406 60.3 25.56 80.13l74.66 64.02c2.375 2.047 4.125 4.75 5 7.75l29.34 102.8C242.6 507.4 249 512 256 512c1.438 0 2.938-.2031 4.406-.6094c8.5-2.438 13.41-11.28 10.97-19.78l-29.34-102.8c-2.656-9.078-7.812-17.11-14.94-23.2L152.4 301.6C138.6 289.7 132.7 271.3 137.1 253.5l22.26-89.03c1.926 .1445 3.82-.3027 5.744 .0723l19.34 3.859C201.3 171.8 215.1 184 220.6 200.3l16.78 50.34c3.375 10.06 10.06 18.84 18.91 24.77l38.88 25.91C297.8 303.1 300.9 304 304 304c5.156 0 10.22-2.5 13.31-7.125C322.2 289.5 320.2 279.6 312.9 274.7zM119.2 353.7c-7.906-3.891-17.5-.7656-21.47 7.156L68 420.2c-.75 1.5-1.75 2.891-3 4.125l-60.31 60.33c-6.25 6.25-6.25 16.38 0 22.62C7.813 510.4 11.91 512 16 512s8.188-1.562 11.31-4.688l60.31-60.33c3.688-3.688 6.719-7.891 9-12.47l29.69-59.36C130.3 367.3 127.1 357.6 119.2 353.7z" />
                            </svg>
                          )}
                          {stattype === 'swimOrFly' && (
                            <div className="inline-flex items-center space-x-1">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-5 h-5 fill-current">
                                <path d="M176 336C184.8 336 192 328.8 192 320c0-28.06 8.625-54.94 24.92-77.77L238.6 211.9C245.1 202.8 252.9 195 261.3 187.9l160.7 128.6C424.1 318.9 428.5 320 431.1 320c4.703 0 9.344-2.062 12.52-6c5.516-6.906 4.391-16.97-2.5-22.5L289.2 169.3c6.895-3.346 14.07-6.143 21.48-8.262c38.11-10.86 78.86-13.14 117.1-6.688l32.72 5.453c8.734 1.5 16.97-4.438 18.41-13.16c1.453-8.719-4.438-16.95-13.16-18.41l-32.72-5.453c-43.73-7.25-89.39-4.703-131.1 7.469C266 140.5 234.3 162.9 212.6 193.3L190.9 223.6C170.7 251.9 160 285.2 160 320C160 328.8 167.2 336 176 336zM104 240c39.77 0 72-32.24 72-72C176 128.2 143.8 96 104 96C64.24 96 32 128.2 32 168C32 207.8 64.24 240 104 240zM104 128C126.1 128 144 145.9 144 168S126.1 208 104 208S64 190.1 64 168S81.94 128 104 128zM562 383.1c-28.14-3.625-53.29-18.34-69.03-40.38c-6-8.438-20.04-8.438-26.04 0c-18.44 25.84-49.45 41.2-82.97 41.2c-33.52 0-64.53-15.35-82.97-41.2c-6.031-8.438-20.03-8.438-26.06 0c-18.44 25.84-49.45 41.2-82.97 41.2c-33.51 0-64.53-15.35-82.97-41.2C106 338.5 101.2 336 96 336s-10.02 2.5-13.02 6.719c-15.73 22.03-40.89 36.75-69.03 40.38c-8.766 1.125-14.95 9.156-13.83 17.94c1.125 8.75 9.029 15.06 17.92 13.81c29.98-3.875 57.48-17.47 77.94-38.09C120.6 401.6 155.3 416 192.1 416C228.9 416 263.4 401.6 288 376.8C312.6 401.6 347.3 416 384.1 416c36.78 0 71.28-14.41 95.9-39.25c20.45 20.62 47.95 34.22 77.94 38.09c8.951 1.375 16.79-5.062 17.92-13.81C576.1 392.3 570.8 384.2 562 383.1z" />
                              </svg>
                              <span className="font-light">/</span>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-5 h-5 fill-current">
                                <path d="M624 480H17.11c-8.836 0-16 7.162-16 16c0 8.836 7.164 16 16 16H624c8.801 0 16-7.201 16-16C640 487.2 632.8 480 624 480zM80.49 371.3C88.24 379.4 98.86 384 109.1 384l127.1-.125c11.25-.125 22.38-2.625 32.5-7.625l283-140.4c29.25-14.38 52.88-34.5 68.38-58.13c18-27.25 22.38-50.25 13.25-68.38c-11.62-22.88-42-30.75-72.75-30.75c-26 0-52.5 6.5-78.75 19.62l-92.75 46L181.2 67.63C177.2 65.25 172.7 64 167.1 64c-4 0-7.875 .875-11.5 2.625l-64 31.75c-7.5 3.75-12.62 11-13.75 19.38C77.61 127 82.11 136.1 90.24 141l136.5 84.13l-84 41.63L75.99 233.9c-7.25-3.625-15.63-3.625-22.88 0l-39 19.38c-7 3.375-12.12 9.875-13.62 17.5s.5 15.62 5.625 21.5L80.49 371.3zM64.61 263.9l78.25 38.5l149.9-74.25L118.5 121.3l49.38-24.5l224 82.13l105-52c21.88-10.75 43.63-16.25 64.63-16.25c16.25 0 39.38 3.625 44.25 13.25c3.375 6.75-.875 20.25-11.38 36.25C581.1 179 562.6 195.4 538.5 207.3L255.4 347.5c-5.625 2.875-11.88 4.375-18.25 4.375L110.1 352c-2.375 0-4.625-1-6.375-2.625L36.49 277.8L64.61 263.9z" />
                              </svg>
                            </div>
                          )}
                          <span className="grow">{stattype}</span>
                        </legend>
                        <div className="pt-3">
                          {typeof v2 === "object" ? (
                            Object.entries(v2).map(([k3, v3], i3) => (
                              <div
                                key={`m-${i}-c-${i2}-s-${i3}`}
                              >
                                <InputOutlined
                                  label={k3}
                                  margin="dense"
                                  type="text"
                                  defaultValue={truncate(
                                    (useFoundationUnit
                                      ? Number((v3 as number) / 300)
                                      : Number(v3)
                                    ).toFixed(2),
                                    6
                                  )}
                                  onChange={(e) => {
                                    setMovement((prevMovement) => {
                                      const newMovement = { ...prevMovement };
                                      newMovement[k][stattype][k3] = Number(e.target.value);
                                      return newMovement;
                                    })
                                  }}
                                />
                              </div>
                            ))
                          ) : (
                            <div
                              key={`m-${i}-c-${i2}`}
                            >
                              <InputOutlined
                                label={stattype}
                                margin="dense"
                                type="text"
                                defaultValue={truncate(
                                  (useFoundationUnit
                                    ? Number(v2 / 300)
                                    : Number(v2)
                                  ).toFixed(2),
                                  6
                                )}
                                onChange={(e) =>
                                  setMovement((prevMovement) => {
                                    const newMovement = { ...prevMovement };
                                    newMovement[k][stattype] = Number(e.target.value);
                                    return newMovement;
                                  })
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <FieldError name="movement" className="rw-field-error" />

            <Label
              name="base_points"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Base points
            </Label>

            <TextField
              name="base_points"
              defaultValue={props.dino?.base_points || 0}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              emptyAs={0}
              validation={{ valueAsNumber: true }}
            />

            <FieldError name="base_points" className="rw-field-error" />

            <Label
              name="x_variant"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              X variant
            </Label>

            <CheckboxField
              name="x_variant"
              defaultChecked={props.dino?.x_variant}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
            />
            <p className="rw-helper-text">Does this dino have a x-variant?</p>
            <FieldError name="x_variant" className="rw-field-error" />
          </Step>

          <Step title="Breeding">


            <div className="flex flex-row items-start space-x-3">
              <InputOutlined
                name="egg_min"
                label="Egg minimum temperature"
                defaultValue={props.dino?.egg_min || 0}
                helperText="Minimum temperature for the egg to hatch"
                type="number"
                margin="normal"
              />

              <InputOutlined
                name="egg_max"
                label="Egg maximum temperature"
                defaultValue={props.dino?.egg_max || 0}
                helperText="Maximum temperature for the egg to hatch"
                type="number"
                margin="normal"
              />
            </div>

            <div className="flex flex-row items-start space-x-3">
              <InputOutlined
                name="maturation_time"
                label="Maturation time"
                defaultValue={props.dino?.egg_min || 0}
                type="number"
                margin="normal"
              />

              <InputOutlined
                name="incubation_time"
                label="Incubation time"
                defaultValue={props.dino?.incubation_time}
                type="number"
                margin="normal"
              />
            </div>



          </Step>
        </Stepper>

        <Disclosure className="mt-5" title="Other" text_size="text-lg">
          <div>
            <div>
              {/* TODO: convert this to DinoStat Form */}
              {/* TODO: Find solution for this stuff */}
              {/* Add for fits_through, gather_eff, weight_red, immobilized_by, drops and the other types */}
              {/* <Label
                name="immobilized_by"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Immobilized by
              </Label>

              <CheckboxGroup
                name="immobilized_by"
                defaultValue={props.dino?.DinoStat.filter(
                  (d) => d.type === "immobilized_by"
                ).map((d) => d.item_id.toString())}
                options={[
                  {
                    value: "733",
                    label: "Lasso",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/lasso.png",
                  },
                  {
                    value: "1040",
                    label: "Bola",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/bola.png",
                  },
                  {
                    value: "725",
                    label: "Chain Bola",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/chain-bola.png",
                  },
                  {
                    value: "785",
                    label: "Net Projectile",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/net-projectile.png",
                  },
                  {
                    value: "1252",
                    label: "Plant Species Y Trap",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/plant-species-y-trap.png",
                  },
                  {
                    value: "383",
                    label: "Bear Trap",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/bear-trap.png",
                  },
                  {
                    value: "384",
                    label: "Large Bear Trap",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/large-bear-trap.png",
                  },
                ]}
              />

              <FieldError name="immobilized_by" className="rw-field-error" /> */}
              {/* <Label
                name="fits_through"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Fits through
              </Label>

              <CheckboxGroup
                name="fits_through"
                defaultValue={props.dino?.fits_through}
                options={[
                  {
                    value: "322",
                    label: "Doorframe",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stone-doorframe.png",
                  },
                  {
                    value: "1066",
                    label: "Double Doorframe",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stone-double-doorframe.png",
                  },
                  {
                    value: "143",
                    label: "Dinosaur Gateway",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stone-dinosaur-gateway.png",
                  },
                  {
                    value: "381",
                    label: "Behemoth Dino Gateway",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/behemoth-stone-dinosaur-gateway.png",
                  },
                  {
                    value: "316",
                    label: "Hatchframe",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stone-hatchframe.png",
                  },
                  {
                    value: "619",
                    label: "Giant Hatchframe",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/giant-stone-hatchframe.png",
                  },
                ]}
              />

              <FieldError name="fits_through" className="rw-field-error" /> */}
              <Label
                name="DinoStat.create.0.item_id"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Gather Efficiency
              </Label>

              {statFields
                // .filter((ge) => ge.type === "gather_efficiency")
                .map((ge, index) => {
                  const g = ge as any;
                  return (
                    g.type === "gather_efficiency" && (
                      <div
                        className="rw-button-group justify-start"
                        role="group"
                        key={`ge-${index}`}
                      >
                        <Lookup
                          key={ge.id}
                          // multiple
                          {...register(
                            `DinoStat.create.${index}.item_id` as const,
                            {
                              required: true,
                            }
                          )}
                          className="!w-full !rounded-none !rounded-l-md border-r-transparent"
                          options={data.itemsByCategory.items
                            .filter((i) => i.category === "Resource")
                            .map((item) => ({
                              type: item.type,
                              label: item.name,
                              value: item.id,
                              image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${item.image}`,
                            }))}
                          search={true}
                          // defaultValue={[ge.item_id]}
                          closeOnSelect={true}
                          filterFn={(item, search) => {
                            return item.label
                              .toLowerCase()
                              .includes(search.toLowerCase());
                          }}
                        />
                        <NumberField
                          {...register(
                            `DinoStat.create.${index}.value` as const,
                            {
                              required: true,
                              min: 0,
                              max: 5,
                              valueAsNumber: true,
                            }
                          )}
                          className="rw-input mt-0 max-w-[7rem]"
                          defaultValue={g.value}
                        />
                        <TextField
                          {...register(`DinoStat.create.${index}.type`, {
                            required: false,
                          } as const)}
                          className="rw-input mt-0 hidden max-w-[7rem]"
                        // defaultValue={g.type}
                        />
                        <button
                          type="button"
                          className="rw-button rw-button-red !ml-0 rounded-none !rounded-r-md"
                          onClick={() => removeStat(index)}
                        >
                          Remove
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="rw-button-icon-end"
                          >
                            <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
                          </svg>
                        </button>
                      </div>
                    )
                  );
                })}
              <div className="rw-button-group justify-start">
                <button
                  type="button"
                  className="rw-button rw-button-gray !ml-0"
                  onClick={() =>
                    appendStat({
                      item_id: 0,
                      type: "gather_efficiency",
                      value: 0,
                    })
                  }
                >
                  Add Gather Efficiency
                </button>
              </div>

              <FieldError
                name="DinoStat.create.0.item_id"
                className="rw-field-error"
              />
            </div>
            <div>
              <Label
                name="weight_reduction"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Weight reduction
              </Label>

              {statFields
                // .filter((stat) => stat.type === "weight_reduction")
                .map((wr, index) => {
                  const w = wr as any;
                  return (
                    w.type === "weight_reduction" && (
                      <div
                        className="rw-button-group justify-start"
                        role="group"
                        key={`wr-${index}`}
                      >
                        <Lookup
                          {...register(`DinoStat.create.${index}.item_id`)}
                          className="!mt-0 !rounded-none !rounded-l-md"
                          options={data.itemsByCategory.items
                            .filter((i) => i.category === "Resource")
                            .map((item) => ({
                              type: item.type,
                              label: item.name,
                              value: item.id,
                              image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${item.image}`,
                            }))}
                          search={true}
                          defaultValue={[w.item_id]}
                          filterFn={(item, search) => {
                            return item.label
                              .toLowerCase()
                              .includes(search.toLowerCase());
                          }}
                        />
                        <NumberField
                          {...register(`DinoStat.create.${index}.value`, {
                            required: true,
                            min: 0,
                            max: 100,
                            valueAsNumber: true,
                          })}
                          className="rw-input mt-0 max-w-[7rem]"
                          defaultValue={w.value}
                        />
                        <TextField
                          {...register(`DinoStat.create.${index}.type`)}
                          className="rw-input mt-0 hidden max-w-[7rem]"
                          defaultValue={w.type}
                        />
                        <button
                          type="button"
                          className="rw-button rw-button-red !ml-0 rounded-none !rounded-r-md"
                          onClick={() => removeStat(index)}
                        >
                          Remove
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="rw-button-icon-end"
                          >
                            <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
                          </svg>
                        </button>
                      </div>
                    )
                  );
                })}
              <div className="rw-button-group justify-start">
                <button
                  type="button"
                  className="rw-button rw-button-gray !ml-0"
                  onClick={() =>
                    appendStat({
                      item_id: 0,
                      type: "weight_reduction",
                      value: 0,
                    })
                  }
                >
                  Add Weight Reduction
                </button>
              </div>

              <FieldError name="weight_reduction" className="rw-field-error" />

              <Label
                name="drops"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Drops
              </Label>

              {statFields
                // .filter((ge) => ge.type === "drops")
                .map((dr, index) => {
                  const d = dr as any;
                  return (
                    d.type === "drops" && (
                      <div
                        className="rw-button-group !mt-0 justify-start"
                        role="group"
                        key={`drops-${index}`}
                      >
                        <Lookup
                          {...register(`DinoStat.create.${index}.item_id`, {
                            required: true,
                          })}
                          className="!mt-0 !rounded-none !rounded-l-md"
                          options={
                            data
                              ? data.itemsByCategory.items
                                .filter((i) => i.category === "Resource")
                                .map((item) => ({
                                  type: item.type,
                                  label: item.name,
                                  value: item.id,
                                  image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${item.image}`,
                                }))
                              : []
                          }
                          search={true}
                          defaultValue={[d.item_id]}
                          filterFn={(item, search) => {
                            return item.label
                              .toLowerCase()
                              .includes(search.toLowerCase());
                          }}
                        />
                        <TextField
                          {...register(`DinoStat.create.${index}.value`, {
                            required: false,
                          })}
                          emptyAs={null}
                          className="rw-input mt-0 hidden max-w-[7rem]"
                          defaultValue={d.value}
                        />
                        <TextField
                          {...register(`DinoStat.create.${index}.type`, {
                            required: false,
                          } as const)}
                          className="rw-input mt-0 hidden max-w-[7rem]"
                          defaultValue={d.type}
                        />
                        <button
                          type="button"
                          title="Close"
                          className="rw-button rw-button-red !ml-0 rounded-none !rounded-r-md"
                          onClick={() => removeStat(index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="rw-button-icon-end"
                          >
                            <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
                          </svg>
                        </button>
                      </div>
                    )
                  );
                })}
              <div className="rw-button-group justify-start">
                <button
                  type="button"
                  className="rw-button rw-button-gray !ml-0"
                  onClick={() =>
                    appendStat({ item_id: 0, value: null, type: "drops" })
                  }
                >
                  Add Drop
                </button>
              </div>

              <FieldError name="drops" className="rw-field-error" />
            </div>
          </div>

          <div>
            <div>
              {/* {props.dino?.ridable && (<> */}

              <Label
                name="saddle_id"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Saddle
              </Label>

              {statFields.map((sd, index) => {
                const s = sd as any;
                return (
                  s.type === "saddle" && (
                    <div
                      className="rw-button-group justify-start"
                      role="group"
                      key={`wr-${index}`}
                    >
                      <Lookup
                        {...register(`DinoStat.create.${index}.item_id`)}
                        className="!mt-0 !rounded-none !rounded-l-md"
                        options={data.itemsByCategory.items
                          .filter((i) => i.category === "Armor")
                          .map((item) => ({
                            type: item.type,
                            label: item.name,
                            value: item.id,
                            image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${item.image}`,
                          }))}
                        search={true}
                        defaultValue={[s.item_id]}
                        filterFn={(item, search) => {
                          return item.label
                            .toLowerCase()
                            .includes(search.toLowerCase());
                        }}
                      />
                      <NumberField
                        {...register(`DinoStat.create.${index}.value`, {
                          required: true,
                          min: 0,
                          max: 100,
                          valueAsNumber: true,
                        })}
                        className="rw-input mt-0 max-w-[7rem]"
                        defaultValue={s.value}
                      />
                      <TextField
                        {...register(`DinoStat.create.${index}.type`)}
                        className="rw-input mt-0 hidden max-w-[7rem]"
                        defaultValue={s.type}
                      />
                      <button
                        type="button"
                        className="rw-button rw-button-red !ml-0 rounded-none !rounded-r-md"
                        onClick={() => removeStat(index)}
                      >
                        Remove
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                          className="rw-button-icon-end"
                        >
                          <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
                        </svg>
                      </button>
                    </div>
                  )
                );
              })}
              <div className="rw-button-group justify-start">
                <button
                  type="button"
                  className="rw-button rw-button-gray !ml-0"
                  onClick={() =>
                    appendStat({
                      item_id: 0,
                      type: "saddle",
                      value: 0,
                    })
                  }
                >
                  Add Saddle
                </button>
              </div>

              <FieldError name="saddle_id" className="rw-field-error" />
              {/* </>)} */}
            </div>
          </div>

          <Label
            name="eats"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Eats
          </Label>

          <Lookup
            options={
              data
                ? data.itemsByCategory.items
                  .filter((i) => i.category === "Consumable")
                  .map((item) => ({
                    type: item.type,
                    label: item.name,
                    value: item.id,
                    image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${item.image}`,
                  }))
                : []
            }
            search={true}
            name="eats"
            onSelect={(e) => {
              setEats((d) => [
                ...d,
                { id: e[0].value, name: e[0].label, img: e[0].image },
              ]);
            }}
          />

          {eats.length > 0 ? (
            <div className="mt-2 w-48 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-zinc-500 dark:bg-zinc-600 dark:text-white">
              {eats.map((food, i) => (
                <button
                  key={`food-${i}`}
                  onClick={() =>
                    setEats((d) => d.filter((g) => g.id !== food.id))
                  }
                  className="transition-color block w-full cursor-pointer px-2 py-1 first:rounded-t-lg last:rounded-b-lg hover:ring hover:ring-red-500"
                >
                  {food.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="rw-helper-text">
              No food added yet. Does this dino even eat?
            </p>
          )}

          <FieldError name="eats" className="rw-field-error" />
        </Disclosure>

        <Disclosure title="Stats" text_size="text-lg">
          <div>
            {/* <Label
              name="base_stats"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Base stats
            </Label> */}
            {/* <div className="grid w-fit grid-cols-3 divide-x divide-zinc-500 text-white">
              <div className="grid grid-rows-[8]">
                <Input
                  type="text"
                  name="health"
                  label="Base Health"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/health.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="stamina"
                  label="Base Stamina"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stamina.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="torpidity"
                  label="Base Torpidity"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/torpidity.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="oxygen"
                  label="Base Oxygen"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/oxygen.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="food"
                  label="Base Food"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/food.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="weight"
                  label="Base Weight"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/weight.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="melee_damage"
                  label="Base Melee Damage"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/melee_damage.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="movement_speed"
                  label="Base Movement Speed"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/movement_speed.webp"
                      className="h-4"
                    />
                  }
                />
              </div>
              <div className="grid grid-rows-[8]">
                <Input
                  type="text"
                  name="health"
                  label="Wild Health"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/health.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="stamina"
                  label="Wild Stamina"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stamina.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="torpidity"
                  label="Wild Torpidity"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/torpidity.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="oxygen"
                  label="Wild Oxygen"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/oxygen.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="food"
                  label="Wild Food"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/food.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="weight"
                  label="Wild Weight"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/weight.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="melee_damage"
                  label="Wild Melee Damage"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/melee_damage.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="movement_speed"
                  label="Wild Movement Speed"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/movement_speed.webp"
                      className="h-4"
                    />
                  }
                />
              </div>
              <div className="grid grid-rows-[8]">
                <Input
                  type="text"
                  name="health"
                  label="Tamed Health"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/health.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="stamina"
                  label="Tamed Stamina"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stamina.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="torpidity"
                  label="Tamed Torpidity"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/torpidity.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="oxygen"
                  label="Tamed Oxygen"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/oxygen.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="food"
                  label="Tamed Food"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/food.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="weight"
                  label="Tamed Weight"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/weight.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="melee_damage"
                  label="Tamed Melee Damage"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/melee_damage.webp"
                      className="h-4"
                    />
                  }
                />
                <Input
                  type="text"
                  name="movement_speed"
                  label="Tamed Movement Speed"
                  icon={
                    <img
                      src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/movement_speed.webp"
                      className="h-4"
                    />
                  }
                />
              </div>
            </div> */}
            {/* <div className="flex flex-col capitalize text-white">
          <div className="flex flex-row items-center space-x-1">
            <p className="w-5"></p>
            <p className="w-20">Base</p>
            <p className="w-20">Wild inc.</p>
            <p className="w-20">Tamed inc.</p>
          </div>
          {statEntries.map(([stat, value], index) => (
            <div
              className="flex flex-row items-center space-x-1"
              key={`stat-${index}`}
            >
              <img
                title={
                  {
                    s: "Stamina",
                    w: "Weight",
                    o: "Oxygen",
                    d: "Melee Damage",
                    f: "Food",
                    m: "Movement Speed",
                    t: "Torpidity",
                    h: "Health",
                  }[stat]
                }
                className="h-6 w-6"
                src={
                  {
                    s: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/stamina.webp",
                    w: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/weight.webp",
                    o: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/oxygen.webp",
                    d: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/melee_damage.webp",
                    f: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/food.webp",
                    m: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/movement_speed.webp",
                    t: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/torpidity.webp",
                    h: "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/health.webp",
                  }[stat]
                }
                alt=""
              />
              {["b", "w", "t"].map((label, i) => (
                <input
                  key={`${label}-${i}`}
                  className="rw-input w-20"
                  defaultValue={JSON.stringify(value[label])}
                  placeholder={label}
                  onChange={(e) =>
                    setBasestat((b) => ({
                      ...b,
                      [stat]: {
                        ...b[stat],
                        [label]: Number(e.target.value),
                      },
                    }))
                  }
                />
              ))}
            </div>
          ))}
        </div> */}

            {/* <FieldError name="base_stats" className="rw-field-error" /> */}
          </div>
        </Disclosure>


        {/* <details className="rw-form-group group">
          <summary className="inline-flex items-center">
            Taming
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
                name="tamable"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Tamable
              </Label>

              <CheckboxField
                name="tamable"
                defaultChecked={props.dino?.tamable}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />
              <p className="rw-helper-text">If this dino is tamable</p>

              <FieldError name="tamable" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="disable_ko"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Disable ko
              </Label>

              <CheckboxField
                name="disable_ko"
                defaultChecked={props.dino?.disable_ko}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />
              <p className="rw-helper-text">Can this dino be KO'd?</p>
              <FieldError name="disable_ko" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="violent_tame"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Violent tame
              </Label>

              <CheckboxField
                name="violent_tame"
                defaultChecked={props.dino?.violent_tame}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />
              <p className="rw-helper-text">Is this dino aggressive?</p>
              <FieldError name="violent_tame" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="tdps"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Torpor Depletion per second
              </Label>

              <TextField
                name="tdps"
                defaultValue={props.dino?.tdps || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                emptyAs={0}
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="tdps" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="affinity_needed"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Affinity needed
              </Label>

              <TextField
                name="affinity_needed"
                defaultValue={props.dino?.affinity_needed || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="affinity_needed" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="aff_inc"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Affinity Increase Per Level
              </Label>

              <TextField
                name="aff_inc"
                defaultValue={props.dino?.aff_inc || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="aff_inc" className="rw-field-error" />
            </div>
            {!disableFood && (
              <div>
                <Label
                  name="non_violent_food_affinity_mult"
                  className="rw-label"
                  errorClassName="rw-label rw-label-error"
                >
                  Non violent food affinity multiplier
                </Label>

                <TextField
                  name="non_violent_food_affinity_mult"
                  defaultValue={props.dino?.non_violent_food_affinity_mult || 0}
                  className="rw-input"
                  errorClassName="rw-input rw-input-error"
                  validation={{ valueAsNumber: true }}
                />

                <FieldError
                  name="non_violent_food_affinity_mult"
                  className="rw-field-error"
                />
              </div>
            )}
          </div>
          <div>
            <div>
              <Label
                name="hitboxes"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Hitboxes
              </Label>

              <TextAreaField
                name="hitboxes"
                defaultValue={JSON.stringify(props.dino?.hitboxes)}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                emptyAs={"undefined"}
                validation={{ valueAsJSON: true }}
              />

              <FieldError name="hitboxes" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="flee_threshold"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Flee threshold
              </Label>

              <TextField
                name="flee_threshold"
                defaultValue={props.dino?.flee_threshold}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />
              <p className="rw-helper-text">
                Chances of this dino fleeing while being tamed
              </p>
              <FieldError name="flee_threshold" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="base_taming_time"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Base taming time
              </Label>

              <TextField
                name="base_taming_time"
                defaultValue={props.dino?.base_taming_time}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                emptyAs={0}
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="base_taming_time" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="taming_interval"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Taming interval
              </Label>

              <TextField
                name="taming_interval"
                defaultValue={props.dino?.taming_interval}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="taming_interval" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="taming_ineffectiveness"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Taming bonus attribute
              </Label>

              <TextField
                name="taming_ineffectiveness"
                defaultValue={props.dino?.taming_ineffectiveness}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                emptyAs={0}
                validation={{ valueAsNumber: true }}
              />

              <FieldError
                name="taming_ineffectiveness"
                className="rw-field-error"
              />
            </div>
          </div>
        </details> */}


        <Label
          name="attack"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Attacks
        </Label>

        {attackFields.map((atk, index) => (
          <div
            className="rw-button-group !mt-0 justify-start"
            role="group"
            key={`attack-${index}`}
          >
            <input
              {...register(`attack.${index}.name`, { required: true })}
              type="text"
              className="rw-input mt-0"
              defaultValue={atk.name}
              placeholder={"Name of attack"}
            />
            <input
              {...register(`attack.${index}.dmg`, { required: false })}
              type="number"
              className="rw-input mt-0 max-w-[8rem]"
              defaultValue={atk.dmg}
              placeholder={"Damage"}
            />
            <input
              {...register(`attack.${index}.radius`, { required: false })}
              type="number"
              className="rw-input mt-0 max-w-[8rem]"
              defaultValue={atk.radius}
              placeholder={"Radius"}
            />
            <input
              {...register(`attack.${index}.stamina`, { required: false })}
              type="number"
              className="rw-input mt-0 max-w-[8rem]"
              defaultValue={atk.stamina}
              placeholder={"Stamina drained per use"}
            />
            <input
              {...register(`attack.${index}.interval`, { required: false })}
              type="number"
              className="rw-input mt-0 max-w-[8rem]"
              defaultValue={atk.interval}
              placeholder={"Cooldown"}
            />
            <button
              type="button"
              className="rw-button rw-button-red !ml-0 rounded-none !rounded-r-md"
              onClick={() => removeAttack(index)}
            >
              Remove
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="rw-button-icon-end"
              >
                <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
              </svg>
            </button>
          </div>
        ))}
        <div className="rw-button-group justify-start">
          <button
            type="button"
            className="rw-button rw-button-gray"
            onClick={() =>
              appendAttack({
                name: "",
                dmg: null,
                radius: null,
                stamina: null,
                interval: null,
              })
            }
          >
            Add Attack
          </button>
        </div>
        {/*
        <TextField
          name="attack"
          defaultValue={JSON.stringify(props.dino?.attack)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={"undefined"}
          validation={{ valueAsJSON: true }}
        /> */}

        <FieldError name="attack" className="rw-field-error" />

        <Label
          name="type"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Dino Type {props.dino?.type}
        </Label>

        <CheckboxGroup
          name="type"
          defaultValue={props.dino?.type}
          validation={{
            required: true,
          }}
          options={[
            {
              value: "flyer",
              label: "Flyer",
              image:
                "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/7/78/Landing.png",
            },
            {
              value: "ground",
              label: "Ground",
              image:
                "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/f/f5/Slow.png",
            },
            {
              value: "water",
              label: "Water",
              image:
                "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/9/9d/Water.png",
            },
            {
              value: "amphibious",
              label: "Amphibious",
              image:
                "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/4/44/Swim_Mode.png",
            },
            {
              value: "boss",
              label: "Boss",
              image:
                "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/5/50/Cowardice.png",
            },
          ]}
        />

        <FieldError name="type" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  );
};

export default DinoForm;
