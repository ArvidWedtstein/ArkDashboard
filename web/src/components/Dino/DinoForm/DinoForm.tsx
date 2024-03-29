import {
  Form,
  FormError,
  FieldError,
  Label,
  useForm,
  useFieldArray,
  TextField,
} from "@redwoodjs/forms";
import { Fragment, useRef, useState } from "react";
import type { DinoStat, EditDinoById, NewDino, UpdateDinoInput, UpdateDinoStatInput, dinostattype } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import { ArrayElement, truncate } from "src/lib/formatters";
import { toast } from "@redwoodjs/web/toast";
import Stepper, { Step } from "src/components/Util/Stepper/Stepper";
import { Input } from "src/components/Util/Input/Input";
import Switch from "src/components/Util/Switch/Switch";
import FileUpload from "src/components/Util/FileUpload/FileUpload";
import DatePicker from "src/components/Util/DatePicker/DatePicker";
import Button, { ButtonGroup } from "src/components/Util/Button/Button";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "src/components/Util/Dialog/Dialog";
import { useMutation } from "@redwoodjs/web";
import { Card, CardContent, CardHeader } from "src/components/Util/Card/Card";

type FormDino = NonNullable<EditDinoById["dino"]>;

interface DinoFormProps {
  dino?: EditDinoById["dino"];
  itemsByCategory: NewDino["itemsByCategory"];
  onSave: (data: UpdateDinoInput, id?: FormDino["id"]) => void;
  error?: RWGqlError;
  loading: boolean;
}

const CREATE_DINO_STAT_MUTATION = gql`
  mutation CreateDinoStatMutation($input: CreateDinoStatInput!) {
    createDinoStat(input: $input) {
      id
    }
  }
`;

const UPDATE_DINO_STAT_MUTATION = gql`
  mutation UpdateDinoStatMutation($id: String!, $input: UpdateDinoStatInput!) {
    updateDinoStat(id: $id, input: $input) {
      id
      dino_id
      item_id
      value
      type
    }
  }
`

const DinoForm = (props: DinoFormProps) => {
  const { dino, itemsByCategory, loading, error } = props;
  const [disableFood, setDisableFood] = useState(
    dino?.disable_food ?? false
  );

  // TODO: fix this
  const [basestat, setBasestat] = useState(
    dino?.base_stats ?? {
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
    (dino?.movement as Movement) ?? {
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
    attack: {
      id?: string;
      dmg?: number;
      name?: string;
      interval?: number;
      radius?: number;
      stamina?: number;
    }[];
  };

  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      attack: dino?.attack as FormValues["attack"] || [],
    },
  });

  const {
    fields: attackFields,
    append: appendAttack,
    remove: removeAttack,
  } = useFieldArray({
    control,
    name: "attack", // the name of the field array in your form data
  });

  const [useFoundationUnit, setUseFoundationUnit] = useState(false);

  const onSubmit = (data: FormDino) => (e) => {
    e.preventDefault();
    console.log(data);


    props.onSave(data, props?.dino?.id);
  };

  const formRef = useRef<HTMLFormElement>();

  const [openModal, setOpenModal] = useState<{
    open: boolean;
    dino_stat?: ArrayElement<EditDinoById["dino"]["DinoStat"]>
  }>({ open: false, dino_stat: null });

  const modalRef = useRef<HTMLDivElement>();

  const [createDinoStat] = useMutation(
    CREATE_DINO_STAT_MUTATION,
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
  const [updateDinoStat] = useMutation(
    UPDATE_DINO_STAT_MUTATION,
    {
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateDinoStatInput,
    id: DinoStat["id"]
  ) => {
    toast.promise(id ? updateDinoStat({ variables: { id, input } }) : createDinoStat({ variables: { input } }), {
      loading: `${id ? 'Updating' : 'Creating'} dinostat...`,
      success: `Dinostat successfully ${id ? 'updated' : 'created'}`,
      error: `Failed to ${id ? 'update' : 'create'} dinostat.`,
    });
  }

  const [selectedType, setSelectedType] = useState<dinostattype>(null);
  const checkTypes = {
    "immobilized_by": [
      {
        value: "733",
        label: "Lasso",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/lasso.webp",
      },
      {
        value: "1040",
        label: "Bola",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/bola.webp",
      },
      {
        value: "725",
        label: "Chain Bola",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/chain-bola.webp",
      },
      {
        value: "785",
        label: "Net Projectile",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/net-projectile.webp",
      },
      {
        value: "1252",
        label: "Plant Species Y Trap",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/plant-species-y-trap.webp",
      },
      {
        value: "383",
        label: "Bear Trap",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/bear-trap.webp",
      },
      {
        value: "384",
        label: "Large Bear Trap",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/large-bear-trap.webp",
      },
    ],
    "fits_through": [
      {
        value: "322",
        label: "Doorframe",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-doorframe.webp",
      },
      {
        value: 1066,
        label: "Double Doorframe",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-double-doorframe.webp",
      },
      {
        value: "143",
        label: "Dinosaur Gateway",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-dinosaur-gateway.webp",
      },
      {
        value: "381",
        label: "Behemoth Dino Gateway",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/behemoth-stone-dinosaur-gateway.webp",
      },
      {
        value: "316",
        label: "Hatchframe",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-hatchframe.webp",
      },
      {
        value: "619",
        label: "Giant Hatchframe",
        image:
          "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/giant-stone-hatchframe.webp",
      },
    ]
  }

  return (
    <div className="-mt-4 text-sm">
      <Dialog ref={modalRef} open={openModal.open} onClose={() => setOpenModal({ open: false, dino_stat: null })}>
        <DialogTitle>
          {openModal.dino_stat ? 'Edit' : 'New'} Dino Stat
        </DialogTitle>
        <DialogContent dividers>
          <Form<NonNullable<UpdateDinoStatInput>> onSubmit={(data) => onSave(data, openModal?.dino_stat?.id)} error={error} className="text-sm my-3">
            <FormError
              error={props.error}
              wrapperClassName="rw-form-error-wrapper"
              titleClassName="rw-form-error-title"
              listClassName="rw-form-error-list"
            />

            <div className="flex flex-row space-x-3">
              <Lookup
                label="Type"
                margin="none"
                isOptionEqualToValue={(option, value) => option.value === value.value}
                getOptionLabel={(option) => option.label}
                getOptionValue={(opt) => opt.value}
                options={[
                  { value: "food", label: "Food" },
                  { value: "gather_efficiency", label: "Gather Efficiency" },
                  { value: "weight_reduction", label: "Weight Reduction" },
                  { value: "immobilized_by", label: "Immobilized By" },
                  { value: "fits_through", label: "Fits Through" },
                  { value: "drops", label: "Drops" },
                  { value: "saddle", label: "Saddle" },
                  { value: "bossrecipe", label: "Bossrecipe" },
                  { value: "engrams", label: "Engrams" },
                ] as { value: dinostattype, label: string }[]}
                onSelect={(e) => {
                  setSelectedType(e.value)
                }}
                name="type"
                defaultValue={openModal?.dino_stat?.type}
                closeOnSelect
              />

              {!["immobilized_by", "fits_through", "saddle", "food"].includes(selectedType) && (
                <Input
                  label="Value"
                  name="value"
                  type="number"
                  defaultValue={openModal?.dino_stat?.value}
                  margin="none"
                  validation={{ valueAsNumber: true }}
                />
              )}
            </div>


            {["immobilized_by", "fits_through"].includes(selectedType) ? (
              <Fragment>
                <Label
                  name="item_id"
                  className="rw-label capitalize"
                  errorClassName="rw-label rw-label-error"
                >
                  {selectedType.replaceAll('_', ' ')}
                </Label>

                <CheckboxGroup
                  name="item_id"
                  defaultValue={openModal?.dino_stat?.item_id?.toString()}
                  exclusive
                  options={checkTypes[selectedType]}
                />

                <FieldError name="item_id" className="rw-field-error" />
              </Fragment>
            ) : (
              <Lookup
                margin="normal"
                label="Item"
                options={itemsByCategory?.items.filter((c) => (selectedType === 'saddle' ? c.type === 'Saddle' : true))}
                name="item_id"
                loading={loading}
                defaultValue={openModal?.dino_stat?.item_id}
                getOptionValue={({ id }) => id}
                getOptionLabel={({ name }) => name}
                getOptionImage={({ image }) => `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${image}`}
                validation={{ required: true }}
              />
            )}

            <TextField
              name="dino_id"
              defaultValue={openModal?.dino_stat?.dino_id || dino?.id}
              className="hidden"
              errorClassName="text-error-500"
              validation={{ required: true }}
            />
          </Form>
        </DialogContent>
        <DialogActions className="space-x-1">
          <Button
            type="button"
            color="success"
            variant="contained"
            onClick={() => {
              if (modalRef?.current) {
                modalRef.current.querySelector("form")?.requestSubmit();
              }
            }}
            startIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="pointer-events-none"
                fill="currentColor"
              >
                <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
              </svg>
            }
          >
            Save
          </Button>
          <Button
            type="reset"
            color="error"
            onClick={() => setOpenModal({ open: false, dino_stat: null })}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Form onSubmit={handleSubmit(onSubmit)} ref={formRef} error={error}>
        <FormError
          error={error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
        <Stepper completion onStepComplete={(step, final) => {
          if (!final) return;
          formRef.current.submit();
          // formRef?.current?.requestSubmit();
        }}>
          <Step title="General">
            <div className="flex flex-row items-start space-x-3">
              <Input
                label="Name"
                name="name"
                defaultValue={dino?.name}
                color="DEFAULT"
                helperText="Dinos name"
              />

              <Input
                label="Synonyms"
                margin="normal"
                name="synonyms"
                defaultValue={dino?.synonyms}
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
                defaultValue={dino?.description}
                color="DEFAULT"
                label="Description"
                variant="contained"
                rows={5}
                multiline
              />
              <Input
                label="Admin Note"
                name="admin_note"
                defaultValue={dino?.admin_note}
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
              defaultValue={dino?.variants.join(', ')}
              helperText="Variants that this dino has, comma seperated"
              validation={{
                required: false,
              }}
            />

            <DatePicker
              label="Release Date"
              name="relased"
              defaultValue={dino?.released ? new Date(dino?.released) : new Date()}
            />

            <br />

            <FileUpload
              label="Image"
              name="image"
              secondaryName="icon"
              defaultValue={props?.dino?.image ? `Dino/${props?.dino?.image}` : null}
              defaultSecondaryValue={props?.dino?.icon ? `DinoIcon/${props?.dino?.icon}` : null}
              storagePath={`arkimages`}
              valueFormatter={(filename, isUpload) => isUpload ? filename.includes('DinoIcon/') ? filename : `DinoIcon/${filename} ` : filename ? filename.includes('DinoIcon/') ? filename.replaceAll('DinoIcon/', '') : filename.includes('Dino/') ? filename.replaceAll('Dino/', '') : filename : null}
            />

            <div className="flex flex-col space-y-2 my-2">
              <Switch
                name="ridable"
                onLabel="Ridable"
                defaultChecked={dino?.ridable}
                helperText="Is this dino ridable?"
              />

              <Switch
                name="mounted_weaponry"
                onLabel="Mounted Weaponry"
                defaultChecked={dino?.mounted_weaponry}
                helperText="Can you use weapons while riding this dino?"
              />

              <Switch
                name="disable_mult"
                onLabel="Disable multipliers"
                defaultChecked={dino?.disable_mult}
              />
            </div>

            <CheckboxGroup
              name="type"
              defaultValue={dino?.type ?? []}
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
              defaultValue={dino?.temperament ?? "Neutral"}
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
              defaultValue={dino?.targeting_team_name ?? "TargetOnlyPlayers"}
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
              defaultValue={dino?.bp}
              color="DEFAULT"
              variant="outlined"
            />
            \
            {/* TODO: add newer fields. */}
            {/* FIELD checklist:
            ["flags","multipliers","hitboxes","icon","image"*/}
          </Step>

          <Step title="Food" className="flex flex-col-reverse" optional>

            <Switch
              name="disable_food"
              onLabel="Disable Food?"
              defaultChecked={disableFood || dino?.disable_food}
              onChange={(e) => {
                setDisableFood(e.target.checked);
              }}
            />

            <Lookup
              label="Diet"
              name="diet"
              defaultValue={dino?.diet}
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
              defaultValue={dino?.food_consumption_base || 0}
              validation={{ valueAsNumber: true }}
              color="DEFAULT"
              type="number"
              variant="outlined"
            />

            <Input
              label="Food consumption base multiplier"
              name="food_consumption_mult"
              defaultValue={dino?.food_consumption_mult || 0}
              validation={{ valueAsNumber: true }}
              color="DEFAULT"
              type="number"
              variant="outlined"
            />
            <Input
              label="Non violent food rate multiplier"
              name="non_violent_food_rate_mult"
              defaultValue={dino?.non_violent_food_rate_mult || 0}
              validation={{ valueAsNumber: true }}
              color="DEFAULT"
              type="number"
              variant="outlined"
            />
          </Step>

          <Step title="Taming" className="flex flex-col" optional>

            <Input
              label="Taming Notice"
              name="taming_notice"
              defaultValue={dino?.taming_notice}
              color="DEFAULT"
              multiline
              variant="outlined"
              helperText="Some info about the taming process of this dino"
            />

            <Switch
              name="tamable"
              onLabel="Tamable"
              defaultChecked={dino?.tamable}
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
              defaultValue={dino?.taming_method}
            />

            <Input
              label="Torpor Depletion per second"
              name="torpor_depetion_per_second"
              defaultValue={dino?.torpor_depetion_per_second}
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
              defaultValue={dino?.affinity_needed}
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
              defaultValue={dino?.affinity_needed}
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
              defaultValue={dino?.non_violent_food_affinity_mult}
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
              defaultValue={dino?.flee_threshold}
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
              defaultValue={dino?.base_taming_time}
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
              defaultValue={dino?.taming_interval}
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
              defaultValue={dino?.taming_ineffectiveness}
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
              defaultValue={JSON.stringify(dino?.hitboxes, null, 2)}
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
            <Label
              name="base_stats"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Base stats
            </Label>
            <div className="grid w-fit grid-rows-[8] text-white">
              {Object.entries(basestat).map(([statChar, statVariants], sIndex) => (
                <ButtonGroup className="my-1" key={`basestat-${sIndex}`}>
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
                </ButtonGroup>
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
                defaultValue={dino?.can_destroy}
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
              defaultValue={dino?.exp_per_kill || 0}
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
                      <Card variant="elevation" key={`m-${i}-c-${i2}`}>
                        <CardHeader
                          title={(
                            <Fragment>
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
                            </Fragment>
                          )}
                          titleProps={{
                            className: "inline-flex items-center space-x-3 w-full capitalize !font-medium border-b pb-1"
                          }}
                        />
                        <CardContent>
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <FieldError name="movement" className="rw-field-error" />

            {props?.dino && (
              <div className="mt-3 table table-auto rounded-lg max-w-2xl border border-zinc-500 border-opacity-70 p-2 text-left">
                <div className="table-header-group w-full text-xs text-black dark:text-zinc-300">
                  <div className="table-cell p-2">Item</div>
                  <div className="table-cell w-1/5 p-2">Value</div>
                  <div className="table-cell p-2">Type</div>
                  <div className="table-cell p-2">Action</div>
                </div>
                {props?.dino?.DinoStat.map((dinoStat) => {
                  return (
                    <div className={`table-row-group w-full text-xs text-black dark:text-white`}>
                      <div className="table-cell w-2/5 p-2">{dinoStat.Item.name}</div>
                      <div className="table-cell p-2">
                        {dinoStat.value}
                      </div>
                      <div className="table-cell truncate p-2">
                        {dinoStat.type}
                      </div>
                      <div className="table-cell align-middle relative">
                        <Button
                          permission="gamedata_update"
                          color="primary"
                          variant="outlined"
                          size="small"
                          onClick={() => setOpenModal({ open: true, dino_stat: dinoStat })}
                          startIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                              <path d="M493.2 56.26l-37.51-37.51C443.2 6.252 426.8 0 410.5 0c-16.38 0-32.76 6.25-45.26 18.75L45.11 338.9c-8.568 8.566-14.53 19.39-17.18 31.21l-27.61 122.8C-1.7 502.1 6.158 512 15.95 512c1.047 0 2.116-.1034 3.198-.3202c0 0 84.61-17.95 122.8-26.93c11.54-2.717 21.87-8.523 30.25-16.9l321.2-321.2C518.3 121.7 518.2 81.26 493.2 56.26zM149.5 445.2c-4.219 4.219-9.252 7.039-14.96 8.383c-24.68 5.811-69.64 15.55-97.46 21.52l22.04-98.01c1.332-5.918 4.303-11.31 8.594-15.6l247.6-247.6l82.76 82.76L149.5 445.2zM470.7 124l-50.03 50.02l-82.76-82.76l49.93-49.93C393.9 35.33 401.9 32 410.5 32s16.58 3.33 22.63 9.375l37.51 37.51C483.1 91.37 483.1 111.6 470.7 124z" />
                            </svg>
                          }
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  )
                })}
                <div className={`table-row-group w-full text-xs text-black dark:text-white`}>
                  <div className="table-cell w-2/5 p-2">-</div>
                  <div className="table-cell p-2">
                    -
                  </div>
                  <div className="table-cell truncate p-2">
                    -
                  </div>
                  <div className="table-cell align-middle relative">
                    <Button
                      permission="gamedata_update"
                      color="primary"
                      variant="outlined"
                      size="small"
                      onClick={() => setOpenModal({ open: true, dino_stat: null })}
                    >
                      New
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Input
              label={"Base points"}
              name="base_points"
              defaultValue={dino?.base_points || 0}
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
                defaultValue={dino?.default_dmg || 0}
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
                defaultValue={dino?.default_swing_radius || 0}
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

            {attackFields.map(({ id, name, dmg, radius, stamina, interval }, index) => (
              <ButtonGroup key={`attack-${index}`} className="mt-2">
                <Input
                  label={`Name`}
                  {...register(`attack.${index}.name`, { required: true })}
                  defaultValue={name}
                  margin="none"
                />
                <Input
                  label={`Damage`}
                  {...register(`attack.${index}.dmg`, { required: false })}
                  defaultValue={dmg}
                  type="number"
                  margin="none"
                />
                <Input
                  label={`Radius`}
                  {...register(`attack.${index}.radius`, { required: false })}
                  defaultValue={radius}
                  type="number"
                  margin="none"
                />
                <Input
                  label={`Stamina`}
                  {...register(`attack.${index}.stamina`, { required: false })}
                  defaultValue={stamina}
                  type="number"
                  margin="none"
                />
                <Input
                  label={`Interval`}
                  {...register(`attack.${index}.interval`, { required: false })}
                  defaultValue={interval}
                  type="number"
                  margin="none"
                />
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeAttack(index)}
                  startIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
                    </svg>
                  }
                >
                  Remove
                </Button>
              </ButtonGroup>
            ))}
            <Button
              variant="contained"
              color="success"
              className="my-2"
              onClick={() =>
                appendAttack({
                  name: "",
                  dmg: null,
                  radius: null,
                  stamina: null,
                  interval: null,
                })
              }
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                </svg>
              }
            >
              Add Attack
            </Button>

            <FieldError name="attack" className="rw-field-error" />
          </Step>

          <Step title="Mating">
            <Switch
              name="breedable"
              onLabel="Breedable"
              defaultChecked={dino?.breedable}
              helperText="Is this dino breedable?"
            />

            <FieldError name="breedable" className="rw-field-error" />

            <div className="flex flex-row items-start space-x-3">

              <Input
                label="Egg minimum temperature"
                name="egg_min"
                defaultValue={dino?.egg_min || 0}
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
                defaultValue={dino?.egg_max || 0}
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
                defaultValue={dino?.mating_cooldown_min || 0}
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
                defaultValue={dino?.mating_cooldown_max || 0}
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
                defaultValue={dino?.incubation_time || 0}
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
                defaultValue={dino?.maturation_time || 0}
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
                defaultValue={dino?.gestation_time || 0}
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
                defaultValue={dino?.baby_food_consumption_mult || 0}
                InputProps={{
                  min: 0,
                }}
                color="DEFAULT"
                type="number"
                variant="outlined"
                validation={{ valueAsNumber: true, min: 0 }}
              />

            </div>
          </Step>
        </Stepper>


        {/* <Button variant="contained" color="success" disabled={props.loading} type="submit">
          Submit
        </Button> */}
      </Form>
    </div>
  );
};

export default DinoForm;
