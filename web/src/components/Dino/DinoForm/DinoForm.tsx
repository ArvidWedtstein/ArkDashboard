import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
  useForm,
  useFieldArray,
  NumberField,
} from "@redwoodjs/forms";
import { Fragment, useEffect, useRef, useState } from "react";
import type { EditDinoById, UpdateDinoInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import { truncate } from "src/lib/formatters";
import { toast } from "@redwoodjs/web/toast";
import { useLazyQuery } from "@apollo/client";
import Disclosure from "src/components/Util/Disclosure/Disclosure";
import Stepper, { Step } from "src/components/Util/Stepper/Stepper";
import { Input } from "src/components/Util/Input/Input";
import Switch from "src/components/Util/Switch/Switch";
import Alert from "src/components/Util/Alert/Alert";
import NewDinoStat from "src/components/DinoStat/NewDinoStat/NewDinoStat";
import FileUpload from "src/components/Util/FileUpload/FileUpload";
import DatePicker from "src/components/Util/DatePicker/DatePicker";
import Button from "src/components/Util/Button/Button";
import clsx from "clsx";
import DateCalendar from "src/components/Util/DateCalendar/DateCalendar";

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
  const [basestat, setBasestat] = useState(
    props.dino?.base_stats ?? {
      d: { b: 0, t: 0, w: 0, a: [{ b: 0 }] },
      f: { b: 0, t: 0, w: 0 },
      h: { b: 0, t: 0, w: 0 },
      m: { b: 0, t: 0, w: null, a: { s: { b: 0 } } },
      o: { b: null, t: null, w: null },
      s: { b: 0, t: 0, w: 0 },
      t: { b: 0, t: null, w: 0 },
      w: { b: 0, t: 0, w: 0 },
    }
  );

  type Movement = {
    d?: {
      walk?: {
        base?: number;
        sprint?: number;
      };
      swim?: {
        base?: number;
        sprint?: number;
      };
      fly?: {
        base?: number;
        sprint?: number;
      };
    };
    w?: {
      walk?: {
        base?: number;
        sprint?: number;
      };
      swim?: {
        base?: number;
        sprint?: number;
      };
      fly?: {
        base?: number;
        sprint?: number;
      };
    };
    staminaRates: {
      sprint?: number;
      swimOrFly?: number;
    };
  };

  const [movement, setMovement] = useState<Movement>(
    (props.dino?.movement as Movement) ?? {
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
    }
  );

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

  const [eats, setEats] = useState([]);

  const [useFoundationUnit, setUseFoundationUnit] = useState(false);
  const onSubmit = (data: FormDino) => {

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

    props.onSave(data, props?.dino?.id);
  };

  const formRef = useRef<HTMLFormElement>();
  return (
    <div className="rw-form-wrapper">
      <Form onSubmit={onSubmit} ref={formRef} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
        <Stepper completion onStepComplete={(step, final) => {
          if (!final) return;
          formRef?.current?.requestSubmit();
        }}>
          <Step title="General">
            <div className="flex flex-row items-start space-x-3">
              <Input
                label="Name"
                name="name"
                defaultValue={props.dino?.name}
                color="DEFAULT"
                helperText="Dinos name"
              />

              <Input
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
              <Input
                name="description"
                defaultValue={props.dino?.description}
                color="DEFAULT"
                label="Description"
                variant="contained"
                rows={5}
                multiline
              />
              <Input
                label="Admin Note"
                name="admin_note"
                defaultValue={props.dino?.admin_note}
                color="DEFAULT"
                variant="contained"
                rows={5}
                multiline
                helperText="Some admin related info about this dino"
              />
            </div>

            <Input
              label="Variants"
              margin="normal"
              name="variants"
              defaultValue={props.dino?.variants.join(', ')}
              helperText="Variants that this dino has, comma seperated"
              validation={{
                required: false,
              }}
            />


            {/* <Input
              label="Release Date"
              variant="contained"
              color="success"
              type="date"
              name="released"
              placeholder="YYYY-MM-DD"
              defaultValue={props.dino?.released || null}
              validation={{
                valueAsDate: true
              }}
              InputLabelProps={{
                shrink: true
              }}
            /> */}

            <DatePicker
              label="Release Date"
              name="relased"
              defaultValue={props.dino?.released ? new Date(props.dino?.released) : new Date()}
            />
            <br />

            <FileUpload
              label="Image"
              name="image"
              secondaryName="icon"
              defaultValue={props?.dino?.image ? `Dino/${props?.dino?.image}` : null}
              defaultSecondaryValue={props?.dino?.icon ? `DinoIcon/${props?.dino?.icon}` : null}
              storagePath={`arkimages`}
              valueFormatter={(filename) => filename ? filename.includes('DinoIcon/') ? filename.replaceAll('DinoIcon/', '') : filename.includes('Dino/') ? filename.replaceAll('Dino/', '') : filename : null}
            />

            <div className="flex flex-col space-y-2 my-2">
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
                defaultChecked={props.dino?.disable_mult}
              />
            </div>

            <CheckboxGroup
              name="type"
              defaultValue={props.dino?.type ?? []}
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

            <Lookup
              label="Temperament"
              name="temperament"
              defaultValue={props.dino?.temperament ?? "Neutral"}
              options={[
                "Aggressive",
                "Angry",
                "Cowardly",
                "Curious",
                "Defensive",
                "Doctile",
                "Elusive",
                "Evasive",
                "Evasive, Aggressive when attacked",
                "Extemely Territorial",
                "Fearful",
                "Flippant",
                "Friendly",
                "Highly Aggressive",
                "Languorous",
                "Loyal",
                "Naive",
                "Neutral",
                "Nocturnally Aggressive",
                "Oblivious",
                "Opportunistic",
                "Passive",
                "Patient",
                "Reactive",
                "Short-Tempered",
                "Skittish",
                "Stupid",
                "Territorial"
              ]}
            />

            <Lookup
              label="Target Team"
              name="targeting_team_name"
              defaultValue={props.dino?.targeting_team_name ?? "TargetOnlyPlayers"}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              getOptionValue={(opt) => opt.value}
              options={[
                { value: "Herbivores", label: "Herbivores" },
                { value: "Herbivore_Small", label: "Herbivore Small" },
                { value: "Herbivores_Medium", label: "Herbivores Medium" },
                {
                  value: "Herbivores_Medium_Aggressive",
                  label: "Herbivores Medium Aggressive",
                },
                { value: "Herbivores_Large", label: "Herbivores Large" },
                {
                  value: "Herbivores_Large_Aggressive",
                  label: "Herbivores Large Aggressive",
                },
                {
                  value: "Herbivores_Large_Aggressive_PlayersOrAggressors",
                  label: "Herbivores Large Aggressive PlayersOrAggressors",
                },
                { value: "Herbivore_Water", label: "Herbivore Water" },
                { value: "TargetOnlyPlayers", label: "TargetOnlyPlayers" },
                {
                  value: "Carnivores_Medium_TargetPlayerOrTamed",
                  label: "Carnivores Medium TargetPlayerOrTamed",
                },
                { value: "Robot_Neutral", label: "Robot Neutral" },
                { value: "Carnivores_Medium", label: "Carnivores Medium" },
                {
                  value: "Carnivore_Water_PlayerOrTamed",
                  label: "Carnivore Water PlayerOrTamed",
                },
                { value: "Carnivore_Water", label: "Carnivores Water" },
                { value: "Carnivores_High", label: "Carnivores High" },
                { value: "Carnivores_Low", label: "Carnivores Low" },
                { value: "Bot", label: "Bot" },
              ]}
            />


            <Input
              label="Blueprint"
              name="bp"
              defaultValue={props.dino?.bp}
              color="DEFAULT"
              variant="outlined"
            />
            \
            {/* TODO: add newer fields. */}
            {/* FIELD checklist:
            ["flags","multipliers","default_dmg","default_swing_radius","hitboxes","targeting_team_name","icon","image"*/}
          </Step>

          <Step title="Food" className="flex flex-col-reverse" optional>

            <Switch
              name="disable_food"
              onLabel="Disable Food?"
              defaultChecked={disableFood || props.dino?.disable_food}
              onChange={(e) => {
                setDisableFood(e.target.checked);
              }}
            />

            <Lookup
              label="Diet"
              name="diet"
              defaultValue={props.dino?.diet}
              options={[
                "Sanguivore",
                "Minerals",
                "Flame Eater",
                "Herbivore",
                "Piscivore",
                "Coprophagic",
                "Carnivore",
                "Bottom Feeder",
                "Sweet Tooth",
                "Carrion-Feeder",
                "Sanguinivore",
                "Omnivore"
              ]}
            />


            <Input
              label="Food consumption base"
              name="food_consumption_base"
              defaultValue={props.dino?.food_consumption_base || 0}
              validation={{ valueAsNumber: true }}
              color="DEFAULT"
              type="number"
              variant="outlined"
            />

            <Input
              label="Food consumption base multiplier"
              name="food_consumption_mult"
              defaultValue={props.dino?.food_consumption_mult || 0}
              validation={{ valueAsNumber: true }}
              color="DEFAULT"
              type="number"
              variant="outlined"
            />
            <Input
              label="Non violent food rate multiplier"
              name="non_violent_food_rate_mult"
              defaultValue={props.dino?.non_violent_food_rate_mult || 0}
              validation={{ valueAsNumber: true }}
              color="DEFAULT"
              type="number"
              variant="outlined"
            />
            {/* </Form> */}
          </Step>

          <Step title="Taming" className="flex flex-col" optional>

            <Input
              label="Taming Notice"
              name="taming_notice"
              defaultValue={props.dino?.taming_notice}
              color="DEFAULT"
              multiline
              variant="outlined"
              helperText="Some info about the taming process of this dino"
            />

            <Switch
              name="tamable"
              onLabel="Tamable"
              defaultChecked={props.dino?.tamable}
            />

            <Lookup
              getOptionLabel={(opt) => opt.name}
              isOptionEqualToValue={(opt, val) => opt.value === val.value}
              getOptionValue={(opt) => opt.value}
              options={[
                { name: 'Knockout', value: 'KO' },
                { name: 'Non Violent', value: 'NV' },
              ]}
              multiple
              label="Taming Method"
              name="taming_method"
              defaultValue={props.dino?.taming_method}
            />

            <Input
              label="Torpor Depletion per second"
              name="torpor_depetion_per_second"
              defaultValue={props.dino?.torpor_depetion_per_second}
              InputProps={{
                min: 0
              }}
              color="DEFAULT"
              variant="outlined"
              helperText="How much torpidity this dino looses per second"
              type="number"
              validation={{ valueAsNumber: true }}
            />

            <Input
              label="Affinity needed"
              name="affinity_needed"
              defaultValue={props.dino?.affinity_needed}
              InputProps={{
                min: 0
              }}
              color="DEFAULT"
              variant="outlined"
              helperText="Base Affinity needed to tame this dino. This will later be multiplied by the affinity increase per level"
              type="number"
              validation={{ valueAsNumber: true }}
            />

            <Input
              label="Affinity Increase Per Level"
              name="aff_inc"
              defaultValue={props.dino?.affinity_needed}
              InputProps={{
                min: 0
              }}
              color="DEFAULT"
              variant="outlined"
              helperText="Affinity increase (per level).  "
              type="number"
              validation={{ valueAsNumber: true }}
            />

            {/* TODO: disable if disableFood? */}

            <Input
              label="Non violent food affinity multiplier"
              name="non_violent_food_affinity_mult"
              defaultValue={props.dino?.non_violent_food_affinity_mult}
              InputProps={{
                min: 0
              }}
              color="DEFAULT"
              variant="outlined"
              helperText="Affinity increase (per level).  "
              type="number"
              validation={{ valueAsNumber: true }}
            />

            <Input
              label="Flee Threshold"
              name="flee_threshold"
              defaultValue={props.dino?.flee_threshold}
              InputProps={{
                min: 0
              }}
              color="DEFAULT"
              variant="outlined"
              helperText="Chance of this dino fleeing while being tamed"
              type="number"
              validation={{ valueAsNumber: true }}
            />

            <Input
              label="Base Taming Time"
              name="base_taming_time"
              defaultValue={props.dino?.base_taming_time}
              InputProps={{
                min: 0,
                endAdornment: (
                  <p>s</p>
                )
              }}
              color="DEFAULT"
              variant="outlined"
              helperText="Base taming time in seconds"
              type="number"
              validation={{ valueAsNumber: true }}
            />

            <Input
              label="Taming Interval"
              name="taming_interval"
              defaultValue={props.dino?.taming_interval}
              InputProps={{
                min: 0,
                endAdornment: (
                  <p>s</p>
                )
              }}
              color="DEFAULT"
              variant="outlined"
              helperText="Taming interval in seconds"
              type="number"
              validation={{ valueAsNumber: true }}
            />

            <Input
              label="Taming Ineffectiveness"
              name="taming_ineffectiveness"
              defaultValue={props.dino?.taming_ineffectiveness}
              InputProps={{
                min: 0,
              }}
              color="DEFAULT"
              variant="outlined"
              type="number"
              validation={{ valueAsNumber: true }}
            />

            <Input
              label="Hitboxes"
              name="hitboxes"
              defaultValue={JSON.stringify(props.dino?.hitboxes, null, 2)}
              InputProps={{
                min: 0,
              }}
              color="DEFAULT"
              variant="outlined"
              multiline
              validation={{ valueAsJSON: true }}
            />
            {/* </Form> */}
          </Step>
          <Step title="Stats">
            {/* <Form<FormDino> onSubmit={onSubmit} error={props.error}>
            <FormError
              error={props.error}
              wrapperClassName="rw-form-error-wrapper"
              titleClassName="rw-form-error-title"
              listClassName="rw-form-error-list"
            /> */}
            <Label
              name="base_stats"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Base stats
            </Label>
            <div className="grid w-fit grid-rows-[8] text-white">
              {Object.entries(basestat).map(([statChar, statVariants], sIndex) => (
                <div className="my-1 grid grid-cols-4" key={`basestat-${sIndex}`}>
                  {Object.entries(statVariants).map(
                    ([variantChar, variants], index) => {
                      const stat = {
                        s: "Stamina",
                        w: "Weight",
                        o: "Oxygen",
                        d: "Melee Damage",
                        f: "Food",
                        m: "Movement Speed",
                        t: "Torpidity",
                        h: "Health",
                      }[statChar];

                      const variant = {
                        b: "Base",
                        w: "Wild",
                        t: "Tamed",
                        a: "Additive",
                      }[variantChar];
                      return (
                        <Fragment key={`basestat-${sIndex}-${index}`}>
                          <Input
                            label={`${variant} ${stat}`}
                            defaultValue={variants?.toString() ?? 0}
                            InputProps={{
                              startAdornment: (
                                <img
                                  src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/${stat
                                    .toLowerCase()
                                    .replaceAll(" ", "_")}.webp`}
                                  className="h-4"
                                />
                              ),
                            }}
                            SuffixProps={{
                              className: clsx('-mr-px', {
                                "rounded-l": index === 0,
                                "rounded-r rounded-l-none": index == Object.entries(statVariants).length - 1,
                                "rounded-none": index !== Object.entries(statVariants).length - 1
                              })
                            }}
                            onChange={(e) => {
                              setBasestat((prev: object) => ({
                                ...prev,
                                [statChar]: {
                                  ...prev[statChar],
                                  [variantChar]: e.target.value,
                                },
                              }));
                            }}
                            color="DEFAULT"
                            variant="outlined"
                            type="number"
                            validation={{ valueAsNumber: true }}
                          />
                        </Fragment>
                      );
                    }
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-row items-start space-x-3">
              <Lookup
                multiple
                closeOnSelect
                label="Carryable By"
                name="carryable_by"
                getOptionLabel={(option) => option.label}
                getOptionValue={(opt) => opt.value}
                getOptionImage={(option) => option.label === 'Human' ? "https://www.dododex.com/media/item/Pet.png" : `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/creature_${option.label.replaceAll(' ', '').toLowerCase()}.webp`}
                options={[
                  {
                    value: "e85015a5-8694-44e6-81d3-9e1fdd06061d",
                    label: "Pteranodon",
                  },
                  {
                    value: "1e7966e7-d63d-483d-a541-1a6d8cf739c8",
                    label: "Tropeognathus",
                  },
                  {
                    value: "b8e304b3-ab46-4232-9226-c713e5a0d22c",
                    label: "Tapejara",
                  },
                  {
                    value: "da86d88a-3171-4fc9-b96d-79e8f59f1601",
                    label: "Griffin",
                  },
                  {
                    value: "147922ce-912d-4ab6-b4b6-712a42a9d939",
                    label: "Desmodus",
                  },
                  {
                    value: "28971d02-8375-4bf5-af20-6acb20bf7a76",
                    label: "Argentavis",
                  },
                  {
                    value: "f924e5d6-832a-4fb3-abc0-2fa42481cee1",
                    label: "Crystal Wyvern",
                  },
                  {
                    value: "7aec6bf6-357e-44ec-8647-3943ca34e666",
                    label: "Wyvern",
                  },
                  {
                    value: "2b938227-61c2-4230-b7da-5d4d55f639ae",
                    label: "Quetzal",
                  },
                  {
                    value: "b1d6f790-d15c-4813-a6c8-9e6f62fafb52",
                    label: "Tusoteuthis",
                  },
                  {
                    value: "d670e948-055e-45e1-adf3-e56d63236238",
                    label: "Karkinos",
                  },
                  {
                    value: "52156470-6075-487b-a042-2f1d0d88536c",
                    label: "Kaprosuchus",
                  },
                  {
                    value: "f723f861-0aa3-40b5-b2d4-6c48ec0ca683",
                    label: "Procoptodon",
                  },
                  {
                    value: "human",
                    label: "Human",
                  },
                  {
                    value: "94708e56-483b-4eef-ad35-2b9ce0e9c669",
                    label: "Gigantopithecus",
                  },
                ]}
              />

              <Lookup
                label="Can Destroy"
                name="can_destroy"
                multiple
                helperText="Structuretypes this dino can destroy"
                getOptionLabel={(option) => option.label}
                defaultValue={props.dino?.can_destroy}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                getOptionValue={(opt) => opt.value}
                getOptionImage={(option) => `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${option.label.replaceAll(' ', '').toLowerCase()}-wall.webp`}
                options={[
                  {
                    label: "Thatch",
                    value: "t",
                  },
                  {
                    label: "Wood",
                    value: "w",
                  },
                  {
                    label: "Adobe",
                    value: "a",
                  },
                  {
                    label: "Stone",
                    value: "s",
                  },
                  {
                    label: "Greenhouse",
                    value: "g",
                  },
                  {
                    label: "Metal",
                    value: "m",
                  },
                  {
                    label: "Tek",
                    value: "tk",
                  },
                ]}
              />
            </div>



            <Input
              label="Experience per kill"
              name="exp_per_kill"
              defaultValue={props.dino?.exp_per_kill || 0}
              InputProps={{
                min: 0,
              }}
              color="DEFAULT"
              type="number"
              variant="outlined"
              validation={{ valueAsNumber: true, min: 0 }}
            />
            <br />
            <Label
              name="movement"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Movement
            </Label>

            <div className="mt-3 grid grid-flow-row gap-5 text-black dark:text-white">
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
                    className="relative grid auto-cols-max grid-flow-col gap-1"
                    key={`m-${i}`}
                  >
                    {Object.entries(v).map(([stattype, v2], i2) => (
                      <div
                        className="rounded bg-zinc-700 p-4"
                        key={`m-${i}-c-${i2}`}
                      >
                        <legend className="inline-flex w-full border-spacing-6 items-center space-x-3 border-b pb-2 text-base font-medium capitalize">
                          {stattype === "fly" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 640 512"
                              className="h-5 w-5 fill-current"
                            >
                              <path d="M624 480H17.11c-8.836 0-16 7.162-16 16c0 8.836 7.164 16 16 16H624c8.801 0 16-7.201 16-16C640 487.2 632.8 480 624 480zM80.49 371.3C88.24 379.4 98.86 384 109.1 384l127.1-.125c11.25-.125 22.38-2.625 32.5-7.625l283-140.4c29.25-14.38 52.88-34.5 68.38-58.13c18-27.25 22.38-50.25 13.25-68.38c-11.62-22.88-42-30.75-72.75-30.75c-26 0-52.5 6.5-78.75 19.62l-92.75 46L181.2 67.63C177.2 65.25 172.7 64 167.1 64c-4 0-7.875 .875-11.5 2.625l-64 31.75c-7.5 3.75-12.62 11-13.75 19.38C77.61 127 82.11 136.1 90.24 141l136.5 84.13l-84 41.63L75.99 233.9c-7.25-3.625-15.63-3.625-22.88 0l-39 19.38c-7 3.375-12.12 9.875-13.62 17.5s.5 15.62 5.625 21.5L80.49 371.3zM64.61 263.9l78.25 38.5l149.9-74.25L118.5 121.3l49.38-24.5l224 82.13l105-52c21.88-10.75 43.63-16.25 64.63-16.25c16.25 0 39.38 3.625 44.25 13.25c3.375 6.75-.875 20.25-11.38 36.25C581.1 179 562.6 195.4 538.5 207.3L255.4 347.5c-5.625 2.875-11.88 4.375-18.25 4.375L110.1 352c-2.375 0-4.625-1-6.375-2.625L36.49 277.8L64.61 263.9z" />
                            </svg>
                          )}
                          {stattype === "swim" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 576 512"
                              className="h-5 w-5 fill-current"
                            >
                              <path d="M176 336C184.8 336 192 328.8 192 320c0-28.06 8.625-54.94 24.92-77.77L238.6 211.9C245.1 202.8 252.9 195 261.3 187.9l160.7 128.6C424.1 318.9 428.5 320 431.1 320c4.703 0 9.344-2.062 12.52-6c5.516-6.906 4.391-16.97-2.5-22.5L289.2 169.3c6.895-3.346 14.07-6.143 21.48-8.262c38.11-10.86 78.86-13.14 117.1-6.688l32.72 5.453c8.734 1.5 16.97-4.438 18.41-13.16c1.453-8.719-4.438-16.95-13.16-18.41l-32.72-5.453c-43.73-7.25-89.39-4.703-131.1 7.469C266 140.5 234.3 162.9 212.6 193.3L190.9 223.6C170.7 251.9 160 285.2 160 320C160 328.8 167.2 336 176 336zM104 240c39.77 0 72-32.24 72-72C176 128.2 143.8 96 104 96C64.24 96 32 128.2 32 168C32 207.8 64.24 240 104 240zM104 128C126.1 128 144 145.9 144 168S126.1 208 104 208S64 190.1 64 168S81.94 128 104 128zM562 383.1c-28.14-3.625-53.29-18.34-69.03-40.38c-6-8.438-20.04-8.438-26.04 0c-18.44 25.84-49.45 41.2-82.97 41.2c-33.52 0-64.53-15.35-82.97-41.2c-6.031-8.438-20.03-8.438-26.06 0c-18.44 25.84-49.45 41.2-82.97 41.2c-33.51 0-64.53-15.35-82.97-41.2C106 338.5 101.2 336 96 336s-10.02 2.5-13.02 6.719c-15.73 22.03-40.89 36.75-69.03 40.38c-8.766 1.125-14.95 9.156-13.83 17.94c1.125 8.75 9.029 15.06 17.92 13.81c29.98-3.875 57.48-17.47 77.94-38.09C120.6 401.6 155.3 416 192.1 416C228.9 416 263.4 401.6 288 376.8C312.6 401.6 347.3 416 384.1 416c36.78 0 71.28-14.41 95.9-39.25c20.45 20.62 47.95 34.22 77.94 38.09c8.951 1.375 16.79-5.062 17.92-13.81C576.1 392.3 570.8 384.2 562 383.1z" />
                            </svg>
                          )}
                          {stattype === "sprint" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 640 512"
                              className="h-5 w-5 fill-current"
                            >
                              <path d="M512 224c-8.875 0-16 7.125-16 16S503.1 256 512 256s16-7.125 16-16S520.9 224 512 224zM602.9 191.2c-.625-.5-58.5-36-58.5-36c-2.5-1.625-9.75-5.125-18.38-7.5c-1.249-7.5-2.874-14.75-4.874-22.13C515.3 103.8 492.5 32 446.6 32c-38 0-44.25 41.88-44.5 43.38c-32.13-17.25-55.5-13.25-69.75 1C323.8 85.12 311.9 104.8 328 139.8C297 123.4 266.5 112 240 112c-45.75 0-86.25 18.38-117.9 52.38C108.6 151.2 90.88 144 72 144c-19.25 0-37.38 7.5-51 21.12c-28 28-28 73.75 0 101.8C34.62 280.5 52.75 288 72 288c12.75 0 24.75-3.625 35.5-9.75c3.625 6.25 7.625 12.38 12.88 18l54 58.5l-25 13.5C136 377.1 128 392.1 128 408.2V432c0 17.25 8.875 32.75 23.88 41.5C159.4 477.9 167.7 480 175.9 480c8.125 0 16.46-2.125 23.83-6.375l55.25-31.5l25.5 27.63C286.5 476.2 295 480 304 480h160c17.62 0 32-14.38 32-32c0-35.25-28.75-64-64-64H384l70.38-32h97C600.3 352 640 312.2 640 263.4C640 234.8 626.1 207.8 602.9 191.2zM96.25 246.9C71.75 266.1 49.38 250 43.62 244.2c-15.62-15.62-15.62-40.87 0-56.5c15.62-15.63 41-15.63 56.62 0C101.5 189 102.5 190.5 103.5 192C95.75 209.4 93.12 228.5 96.25 246.9zM183.9 445.9C173.4 451.9 160 444.2 160 432v-23.75c0-5.375 2.625-10.37 5.75-12.62l31-16.62l36 39L183.9 445.9zM551.4 320l-103.4-.0018L384 346.6v-2.25c0-49.75-33.38-93.1-81.25-107.6L260.4 224.6c-20.5-5.875-29.13 25-8.75 30.75L293.1 267.5C328.1 277.2 352 308.9 352 344.4V416h80c17.62 0 31.98 14.38 31.98 32L304 448L143.9 274.5C121.5 250.2 121.1 213.1 143 188.5C163.1 165.8 194.3 144 239.9 144C297.2 144 392.8 219.2 448 256c0-31.12-.5-30.75 3.5-43c-15.25-3.5-37.75-17.88-59.13-39.25c-31-31-47.62-64.38-37.38-74.75c10.75-10.75 45.13 7.875 74.75 37.38C433 139.6 436 142.9 438.9 146.2C427.2 101.6 430.8 64 446.6 64c13.88 0 32.88 30 43.62 70c4 15.25 6.25 29.87 6.875 42.5c14.25-1 25.03 3.351 30.65 6.101l56.48 34.66C599.1 227.9 608 244.1 608 263.4C608 294.6 582.6 320 551.4 320z" />
                            </svg>
                          )}
                          {stattype === "walk" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 320 512"
                              className="h-5 w-5 fill-current"
                            >
                              <path d="M200 112C230.9 112 256 86.88 256 56S230.9 0 200 0S144 25.12 144 56S169.1 112 200 112zM200 32C213.2 32 224 42.77 224 56S213.2 80 200 80S176 69.23 176 56S186.8 32 200 32zM312.9 274.7l-38.84-25.89c-2.969-1.969-5.188-4.922-6.312-8.281l-16.78-50.36c-9.094-27.16-32.16-47.52-60.22-53.13l-19.31-3.859C151.8 129.3 131.6 132.8 114.6 143L61.94 174.6C55.88 178.2 50.59 183.2 46.69 189.1l-28 42.02C13.78 238.5 15.78 248.4 23.13 253.3c7.312 4.859 17.25 2.922 22.19-4.438l28-42.02c1.312-1.953 3.062-3.641 5.062-4.844l45.43-27.23L106.1 245.8c-7.375 29.59 2.406 60.3 25.56 80.13l74.66 64.02c2.375 2.047 4.125 4.75 5 7.75l29.34 102.8C242.6 507.4 249 512 256 512c1.438 0 2.938-.2031 4.406-.6094c8.5-2.438 13.41-11.28 10.97-19.78l-29.34-102.8c-2.656-9.078-7.812-17.11-14.94-23.2L152.4 301.6C138.6 289.7 132.7 271.3 137.1 253.5l22.26-89.03c1.926 .1445 3.82-.3027 5.744 .0723l19.34 3.859C201.3 171.8 215.1 184 220.6 200.3l16.78 50.34c3.375 10.06 10.06 18.84 18.91 24.77l38.88 25.91C297.8 303.1 300.9 304 304 304c5.156 0 10.22-2.5 13.31-7.125C322.2 289.5 320.2 279.6 312.9 274.7zM119.2 353.7c-7.906-3.891-17.5-.7656-21.47 7.156L68 420.2c-.75 1.5-1.75 2.891-3 4.125l-60.31 60.33c-6.25 6.25-6.25 16.38 0 22.62C7.813 510.4 11.91 512 16 512s8.188-1.562 11.31-4.688l60.31-60.33c3.688-3.688 6.719-7.891 9-12.47l29.69-59.36C130.3 367.3 127.1 357.6 119.2 353.7z" />
                            </svg>
                          )}
                          {stattype === "swimOrFly" && (
                            <div className="inline-flex items-center space-x-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                                className="h-5 w-5 fill-current"
                              >
                                <path d="M176 336C184.8 336 192 328.8 192 320c0-28.06 8.625-54.94 24.92-77.77L238.6 211.9C245.1 202.8 252.9 195 261.3 187.9l160.7 128.6C424.1 318.9 428.5 320 431.1 320c4.703 0 9.344-2.062 12.52-6c5.516-6.906 4.391-16.97-2.5-22.5L289.2 169.3c6.895-3.346 14.07-6.143 21.48-8.262c38.11-10.86 78.86-13.14 117.1-6.688l32.72 5.453c8.734 1.5 16.97-4.438 18.41-13.16c1.453-8.719-4.438-16.95-13.16-18.41l-32.72-5.453c-43.73-7.25-89.39-4.703-131.1 7.469C266 140.5 234.3 162.9 212.6 193.3L190.9 223.6C170.7 251.9 160 285.2 160 320C160 328.8 167.2 336 176 336zM104 240c39.77 0 72-32.24 72-72C176 128.2 143.8 96 104 96C64.24 96 32 128.2 32 168C32 207.8 64.24 240 104 240zM104 128C126.1 128 144 145.9 144 168S126.1 208 104 208S64 190.1 64 168S81.94 128 104 128zM562 383.1c-28.14-3.625-53.29-18.34-69.03-40.38c-6-8.438-20.04-8.438-26.04 0c-18.44 25.84-49.45 41.2-82.97 41.2c-33.52 0-64.53-15.35-82.97-41.2c-6.031-8.438-20.03-8.438-26.06 0c-18.44 25.84-49.45 41.2-82.97 41.2c-33.51 0-64.53-15.35-82.97-41.2C106 338.5 101.2 336 96 336s-10.02 2.5-13.02 6.719c-15.73 22.03-40.89 36.75-69.03 40.38c-8.766 1.125-14.95 9.156-13.83 17.94c1.125 8.75 9.029 15.06 17.92 13.81c29.98-3.875 57.48-17.47 77.94-38.09C120.6 401.6 155.3 416 192.1 416C228.9 416 263.4 401.6 288 376.8C312.6 401.6 347.3 416 384.1 416c36.78 0 71.28-14.41 95.9-39.25c20.45 20.62 47.95 34.22 77.94 38.09c8.951 1.375 16.79-5.062 17.92-13.81C576.1 392.3 570.8 384.2 562 383.1z" />
                              </svg>
                              <span className="font-light">/</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 512"
                                className="h-5 w-5 fill-current"
                              >
                                <path d="M624 480H17.11c-8.836 0-16 7.162-16 16c0 8.836 7.164 16 16 16H624c8.801 0 16-7.201 16-16C640 487.2 632.8 480 624 480zM80.49 371.3C88.24 379.4 98.86 384 109.1 384l127.1-.125c11.25-.125 22.38-2.625 32.5-7.625l283-140.4c29.25-14.38 52.88-34.5 68.38-58.13c18-27.25 22.38-50.25 13.25-68.38c-11.62-22.88-42-30.75-72.75-30.75c-26 0-52.5 6.5-78.75 19.62l-92.75 46L181.2 67.63C177.2 65.25 172.7 64 167.1 64c-4 0-7.875 .875-11.5 2.625l-64 31.75c-7.5 3.75-12.62 11-13.75 19.38C77.61 127 82.11 136.1 90.24 141l136.5 84.13l-84 41.63L75.99 233.9c-7.25-3.625-15.63-3.625-22.88 0l-39 19.38c-7 3.375-12.12 9.875-13.62 17.5s.5 15.62 5.625 21.5L80.49 371.3zM64.61 263.9l78.25 38.5l149.9-74.25L118.5 121.3l49.38-24.5l224 82.13l105-52c21.88-10.75 43.63-16.25 64.63-16.25c16.25 0 39.38 3.625 44.25 13.25c3.375 6.75-.875 20.25-11.38 36.25C581.1 179 562.6 195.4 538.5 207.3L255.4 347.5c-5.625 2.875-11.88 4.375-18.25 4.375L110.1 352c-2.375 0-4.625-1-6.375-2.625L36.49 277.8L64.61 263.9z" />
                              </svg>
                            </div>
                          )}
                          <span className="grow">{stattype}</span>
                        </legend>
                        <div className="pt-3">
                          {typeof v2 === "object" ? (
                            Object.entries(v2).map(([k3, v3], i3) => (
                              <div key={`m-${i}-c-${i2}-s-${i3}`}>
                                <Input
                                  label={k3}
                                  InputLabelProps={{
                                    className: 'capitalize'
                                  }}
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
                                      newMovement[k][stattype][k3] = Number(
                                        e.target.value
                                      );
                                      return newMovement;
                                    });
                                  }}
                                  InputProps={{
                                    min: 0,
                                  }}
                                  color="DEFAULT"
                                  type="number"
                                  variant="outlined"
                                  validation={{ valueAsNumber: true, min: 0 }}
                                />
                              </div>
                            ))
                          ) : (
                            <div key={`m-${i}-c-${i2}`}>
                              <Input
                                label={stattype}
                                InputLabelProps={{
                                  className: 'capitalize'
                                }}
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
                                    newMovement[k][stattype] = Number(
                                      e.target.value
                                    );
                                    return newMovement;
                                  })
                                }
                                InputProps={{
                                  min: 0,
                                }}
                                color="DEFAULT"
                                type="number"
                                variant="outlined"
                                validation={{ valueAsNumber: true, min: 0 }}
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

            <Input
              label={"Base points"}
              name="base_points"
              defaultValue={props.dino?.base_points || 0}
              InputProps={{
                min: 0,
              }}
              color="DEFAULT"
              type="number"
              variant="outlined"
              validation={{ valueAsNumber: true, min: 0 }}
            />

            {/* TODO: add info box here about base point */}

            <div className="flex flex-row items-start space-x-3">
              <Input
                label="Default Damage"
                name="default_dmg"
                defaultValue={props.dino?.default_dmg || 0}
                InputProps={{
                  min: 0,
                }}
                color="DEFAULT"
                type="number"
                variant="outlined"
                validation={{ valueAsNumber: true, min: 0 }}
              />

              <Input
                label="Default Swing Radius"
                name="default_swing_radius"
                defaultValue={props.dino?.default_swing_radius || 0}
                InputProps={{
                  min: 0,
                }}
                color="DEFAULT"
                type="number"
                variant="outlined"
                validation={{ valueAsNumber: true, min: 0 }}
              />
            </div>
            {/* https://react-hook-form.com/docs/usefieldarray */}
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
            {/* </Form> */}
          </Step>

          <Step title="Mating">
            {/* <Form<FormDino> onSubmit={onSubmit} error={props.error}>
              <FormError
                error={props.error}
                wrapperClassName="rw-form-error-wrapper"
                titleClassName="rw-form-error-title"
                listClassName="rw-form-error-list"
              /> */}
            <Switch
              name="breedable"
              onLabel="Breedable"
              defaultChecked={props.dino?.breedable}
              helperText="Is this dino breedable?"
            />

            <FieldError name="breedable" className="rw-field-error" />

            <div className="flex flex-row items-start space-x-3">

              <Input
                label="Egg minimum temperature"
                name="egg_min"
                defaultValue={props.dino?.egg_min || 0}
                InputProps={{
                  min: 0,
                  endAdornment: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current" viewBox="0 0 512 512">
                      <path d="M159.1 354.7l.0005-50.72c0-8.869-7.125-15.99-15.1-15.99S128 295.1 128 303.1l.0015 50.72c-21.1 7.871-35.24 30.36-31.24 53.35C100.6 431.1 120.6 447.1 144 447.1s43.37-16.83 47.24-39.94C195.2 385 181.1 362.6 159.1 354.7zM223.1 79.98C223.1 35.88 188.1 0 144 0S64.01 35.88 64.01 79.98l.0068 241.7c-43.12 43.98-42.62 114.4 1.125 157.8c43.62 43.35 114.1 43.35 157.7 0c43.74-43.35 44.24-113.8 1.125-157.8L223.1 79.98zM219.9 425.1C208.1 457.7 178.4 479.7 144 479.7s-64.99-21.99-75.86-54.6s.375-68.46 27.87-89.08v-256.1c0-26.48 21.5-47.97 47.99-47.97s47.99 21.49 47.99 47.97v256.1C219.5 356.7 230.7 392.5 219.9 425.1zM507.3 356.7c-6.25-6.25-16.38-6.25-22.62 0L416 425.4V48C416 39.16 408.8 32 400 32S384 39.16 384 48v377.4l-68.69-68.69C312.2 353.6 308.1 352 304 352s-8.188 1.562-11.31 4.688c-6.25 6.25-6.25 16.38 0 22.62l96 96c6.25 6.25 16.38 6.25 22.62 0l96-96C513.6 373.1 513.6 362.9 507.3 356.7z" />
                    </svg>
                  )
                }}
                color="DEFAULT"
                type="number"
                variant="outlined"
                helperText="Minimum temperature for the egg to hatch"
                validation={{ valueAsNumber: true, min: 0 }}
              />

              <Input
                label="Egg maximum temperature"
                name="egg_max"
                defaultValue={props.dino?.egg_max || 0}
                InputProps={{
                  min: 0,
                  endAdornment: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current">
                      <path d="M223.1 79.98C223.1 35.88 188.1 0 144 0S64.01 35.88 64.01 79.98l.0068 241.7c-43.12 43.98-42.62 114.4 1.125 157.8c43.62 43.35 114.1 43.35 157.7 0c43.74-43.35 44.24-113.8 1.125-157.8L223.1 79.98zM219.9 425.1C208.1 457.7 178.4 479.7 144 479.7s-64.99-21.99-75.86-54.6s.375-68.46 27.87-89.08v-256.1c0-26.48 21.5-47.97 47.99-47.97s47.99 21.49 47.99 47.97v256.1C219.5 356.7 230.7 392.5 219.9 425.1zM159.1 354.7v-274.7c0-8.869-7.125-15.96-15.1-15.96S128 71.09 128 79.96v274.7c-21.1 7.871-35.24 30.36-31.24 53.35C100.6 431.1 120.6 447.1 144 447.1s43.37-16.83 47.24-39.94C195.2 385 181.1 362.6 159.1 354.7zM507.3 132.7l-96-96c-6.25-6.25-16.38-6.25-22.62 0l-96 96c-6.25 6.25-6.25 16.38 0 22.62s16.38 6.25 22.62 0L384 86.63V464c0 8.844 7.156 16 16 16s16-7.156 16-16V86.63l68.69 68.69C487.8 158.4 491.9 160 496 160s8.188-1.562 11.31-4.688C513.6 149.1 513.6 138.9 507.3 132.7z" />
                    </svg>
                  )
                }}
                color="DEFAULT"
                type="number"
                variant="outlined"
                helperText="Maximum temperature for the egg to hatch"
                validation={{ valueAsNumber: true, min: 0 }}
              />
            </div>

            <div className="flex flex-row items-start space-x-3">
              <Input
                label="Mating cooldown minimum"
                name="mating_cooldown_min"
                defaultValue={props.dino?.mating_cooldown_min || 0}
                InputProps={{
                  min: 0,
                  endAdornment: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-4 h-4 fill-current">
                      <path d="M32 256c-17.67 0-32 14.33-32 32c0 17.67 14.33 32 32 32s32-14.33 32-32C64 270.3 49.67 256 32 256zM84.35 446.4c-12.5 12.5-12.5 32.76 0 45.26c12.5 12.5 32.76 12.5 45.26 0c12.5-12.5 12.5-32.76 0-45.26C117.1 433.9 96.85 433.9 84.35 446.4zM129.6 129.6c12.5-12.5 12.5-32.76 0-45.25c-12.5-12.5-32.76-12.5-45.26 0c-12.5 12.5-12.5 32.76 0 45.25C96.85 142.1 117.1 142.1 129.6 129.6zM288 64c17.67 0 32-14.33 32-32c0-17.67-14.33-32-32-32c-17.67 0-32 14.33-32 32C256 49.67 270.3 64 288 64zM446.4 446.4c-12.5 12.5-12.5 32.76 0 45.26c12.5 12.5 32.76 12.5 45.26 0c12.5-12.5 12.5-32.76 0-45.26S458.9 433.9 446.4 446.4zM401.1 174.9c-62.48-62.48-163.8-62.48-226.3 .002s-62.48 163.8 0 226.3c62.48 62.49 163.8 62.49 226.3 .002S463.6 237.3 401.1 174.9zM378.5 378.5c-46.03 46.03-118.4 49.05-168.6 10.17l89.37-89.37c6.254-6.254 6.254-16.37 0-22.63c-6.252-6.254-16.37-6.254-22.63 0L187.3 366.1c-38.89-50.17-35.86-122.5 10.17-168.6c49.91-49.91 131.1-49.91 181 0C428.4 247.4 428.4 328.6 378.5 378.5zM544 256c-17.67 0-32 14.33-32 32c0 17.67 14.33 32 32 32s32-14.33 32-32C576 270.3 561.7 256 544 256zM446.4 84.35c-12.5 12.5-12.5 32.76 0 45.25c12.5 12.5 32.76 12.5 45.26 0c12.5-12.5 12.5-32.76 0-45.25C479.2 71.86 458.9 71.86 446.4 84.35z" />
                    </svg>
                  )
                }}
                color="DEFAULT"
                type="number"
                variant="outlined"
                validation={{ valueAsNumber: true, min: 0 }}
              />


              <Input
                label="Mating cooldown maximum"
                name="mating_cooldown_max"
                defaultValue={props.dino?.mating_cooldown_max || 0}
                InputProps={{
                  min: 0,
                  endAdornment: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-4 h-4 fill-current">
                      <path d="M32 256c-17.67 0-32 14.33-32 32c0 17.67 14.33 32 32 32s32-14.33 32-32C64 270.3 49.67 256 32 256zM129.6 129.6c12.5-12.5 12.5-32.76 0-45.25c-12.5-12.5-32.76-12.5-45.26 0c-12.5 12.5-12.5 32.76 0 45.25C96.85 142.1 117.1 142.1 129.6 129.6zM288 64c17.67 0 32-14.33 32-32c0-17.67-14.33-32-32-32c-17.67 0-32 14.33-32 32C256 49.67 270.3 64 288 64zM84.35 446.4c-12.5 12.5-12.5 32.76 0 45.26c12.5 12.5 32.76 12.5 45.26 0c12.5-12.5 12.5-32.76 0-45.26C117.1 433.9 96.85 433.9 84.35 446.4zM544 256c-17.67 0-32 14.33-32 32c0 17.67 14.33 32 32 32s32-14.33 32-32C576 270.3 561.7 256 544 256zM446.4 84.35c-12.5 12.5-12.5 32.76 0 45.25c12.5 12.5 32.76 12.5 45.25 0c12.5-12.5 12.5-32.76 0-45.25C479.2 71.86 458.9 71.86 446.4 84.35zM446.4 446.4c-12.5 12.5-12.5 32.76 0 45.26c12.5 12.5 32.76 12.5 45.25 0c12.5-12.5 12.5-32.76 0-45.26S458.9 433.9 446.4 446.4zM401.1 174.9c-62.48-62.48-163.8-62.48-226.3 0s-62.48 163.8 0 226.3s163.8 62.48 226.3 0S463.6 237.3 401.1 174.9zM388.7 366.1l-89.37-89.37c-6.254-6.252-16.37-6.252-22.63 0c-6.254 6.254-6.254 16.37 0 22.63l89.36 89.37c-50.17 38.89-122.5 35.86-168.6-10.17c-49.91-49.91-49.91-131.1-.002-181c49.91-49.91 131.1-49.91 181 0C424.5 243.5 427.6 315.9 388.7 366.1z" />
                    </svg>
                  )
                }}
                color="DEFAULT"
                type="number"
                variant="outlined"
                validation={{ valueAsNumber: true, min: 0 }}
              />
            </div>

            <div className="flex flex-row items-start space-x-3">
              <Input
                label="Incubation Time"
                name="incubation_time"
                defaultValue={props.dino?.incubation_time || 0}
                InputProps={{
                  min: 0,
                  endAdornment: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-4 h-4 fill-current">
                      <path d="M192 16c-106 0-192 200.6-192 300S85.1 496 192 496c105.1 0 192-80.63 192-180S297.1 16 192 16zM192 464c-88.22 0-160-66.39-160-148C32 222.3 114.2 48 192 48s160 174.3 160 268C352 397.6 280.2 464 192 464zM135.2 117.1C100.7 160.7 64 240.4 64 304C64 312.8 71.16 320 80 320S96 312.8 96 304c0-54.19 32.59-126.9 64.13-165.1c5.547-6.875 4.469-16.94-2.406-22.5C150.9 109.1 140.8 111 135.2 117.1z" />
                    </svg>
                  )
                }}
                color="DEFAULT"
                type="number"
                variant="outlined"
                validation={{ valueAsNumber: true, min: 0 }}
              />

              <Input
                label="Maturation Time"
                name="maturation_time"
                defaultValue={props.dino?.maturation_time || 0}
                InputProps={{
                  min: 0,
                  endAdornment: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current">
                      <path d="M80 96h-64C7.156 96 0 103.2 0 112C0 226.7 93.31 320 208 320H256v144c0 8.836 7.164 16 16 16s16-7.164 16-16v-160C288 189.3 194.7 96 80 96zM208 288C116.3 288 40.83 217.6 32.72 128H80c91.66 0 167.2 70.41 175.3 160H208zM496 32h-64c-66.75 0-129.9 32.41-168.1 86.66C257.9 125.8 259.5 135.8 266.7 141c7.141 5.125 17.16 3.5 22.33-3.656C322.1 91.41 375.5 64 432 64h47.27c-7.734 83.78-75.48 152.4-160.6 159.4c-8.812 .7187-15.36 8.438-14.64 17.25c.7031 8.375 7.688 14.69 15.94 14.69c.4375 0 .8906-.0313 1.328-.0625C428.2 246.5 512 155.4 512 48C512 39.16 504.8 32 496 32z" />
                    </svg>
                  )
                }}
                color="DEFAULT"
                type="number"
                variant="outlined"
                validation={{ valueAsNumber: true, min: 0 }}
              />

              <Input
                label="Gestation Time"
                name="gestation_time"
                defaultValue={props.dino?.gestation_time || 0}
                InputProps={{
                  min: 0,
                }}
                color="DEFAULT"
                type="number"
                variant="outlined"
                validation={{ valueAsNumber: true, min: 0 }}
              />

              <Input
                label="Baby food consumption multiplier"
                name="baby_food_consumption_mult"
                defaultValue={props.dino?.baby_food_consumption_mult || 0}
                InputProps={{
                  min: 0,
                }}
                color="DEFAULT"
                type="number"
                variant="outlined"
                validation={{ valueAsNumber: true, min: 0 }}
              />

            </div>
            {/* </Form> */}
          </Step>
        </Stepper>

        {/* <Disclosure className="mt-5" title="Other" text_size="text-lg">
        <NewDinoStat dino_id={props?.dino?.id} />
        <div>
          <div>
             TODO: convert this to DinoStat Form *
            TODO: Find solution for this stuff
            {/ Add for fits_through, gather_eff, weight_red, immobilized_by, drops and the other types *}
            {/ <Label
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

              <FieldError name="immobilized_by" className="rw-field-error" /> *}
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

              <FieldError name="fits_through" className="rw-field-error" /> *}
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
                        // defaultValue={[ge.item_id]}
                        closeOnSelect={true}
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
                        defaultValue={w.item_id}
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
                        defaultValue={d.item_id}
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
            {/* {props.dino?.ridable && (<> /}

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
                      defaultValue={s.item_id}
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
          </div>
        </div>
      </Disclosure> */}

        {/* <Button variant="contained" color="success" disabled={props.loading} type="submit">
          Submit
        </Button> */}
      </Form>
    </div>
  );
};

export default DinoForm;
