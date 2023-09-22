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
import { useEffect, useMemo, useState } from "react";
import type { EditDinoById, UpdateDinoInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import { truncate } from "src/lib/formatters";
import { toast } from "@redwoodjs/web/toast";
import { useLazyQuery } from "@apollo/client";
import Disclosure from "src/components/Util/Disclosure/Disclosure";
import Stepper, { Step } from "src/components/Util/Stepper/Stepper";

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
  const [disableFood, setDisableFood] = useState(props.dino?.disable_food);
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
      wr: props?.dino?.DinoStat.filter((f) => f.type === "weight_reduction") ?? [
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

        <div className="flex flex-row items-start space-x-3">
          <div>
            <Label
              name="name"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Name
            </Label>

            <TextField
              name="name"
              defaultValue={props.dino?.name}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ required: true }}
            />

            <FieldError name="name" className="rw-field-error" />
          </div>
          <div>
            <Label
              name="synonyms"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Synonyms
            </Label>

            <TextField
              name="synonyms"
              defaultValue={props.dino?.synonyms}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{
                required: false,
                pattern: {
                  value: /^[A-Za-z\s,]+$/, // Regex pattern to allow only letters, spaces, and commas
                  message:
                    "Uh oh! Your dino is getting tongue-tied! Only text is allowed, no dino roars or growls!",
                },
              }}
            />
            <p className="rw-helper-text">
              Other names for this dino, comma seperated
            </p>

            <FieldError name="synonyms" className="rw-field-error" />
          </div>
        </div>

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextAreaField
          name="description"
          defaultValue={props.dino?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="description" className="rw-field-error" />

        <Disclosure className="mt-5" title="Other" text_size="text-lg">
          <div>
            <div>
              <Label
                name="taming_notice"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Taming notice
              </Label>

              <TextAreaField
                name="taming_notice"
                defaultValue={props.dino?.taming_notice}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />

              <FieldError name="taming_notice" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="admin_note"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Admin note
              </Label>

              <TextAreaField
                name="admin_note"
                defaultValue={props.dino?.admin_note}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />

              <FieldError name="admin_note" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
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
                          btnClassName="!rounded-none !rounded-l-md border-r-transparent"
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
            </div>
          </div>
          <div>
            {/* <div>
              <Label
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

              <FieldError name="fits_through" className="rw-field-error" />
            </div> */}
          </div>
          <div>
            <div>
              <Label
                name="can_destroy"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Can destroy
              </Label>

              <CheckboxGroup
                name="can_destroy"
                defaultValue={props.dino?.can_destroy || []}
                options={[
                  {
                    value: "t",
                    label: "Thatch",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/thatch-wall.webp",
                  },
                  {
                    value: "w",
                    label: "Wood",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/wooden-wall.webp",
                  },
                  {
                    value: "a",
                    label: "Adobe",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/adobe-wall.webp",
                  },
                  {
                    value: "s",
                    label: "Stone",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/stone-wall.webp",
                  },
                  {
                    value: "g",
                    label: "Greenhouse",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/greenhouse-wall.webp",
                  },
                  {
                    value: "m",
                    label: "Metal",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/metal-wall.webp",
                  },
                  {
                    value: "tk",
                    label: "Tek",
                    image:
                      "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/tek-wall.webp",
                  },
                ]}
              />

              <FieldError name="can_destroy" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              {/* TODO: fix */}
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
            </div>
          </div>
          <div>
            <div>
              {/* TODO: replace with multiselectlookup? */}
              <Label
                name="carryable_by"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Carryable by
              </Label>

              <CheckboxGroup
                name="carryable_by"
                defaultValue={props.dino?.carryable_by}
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

              <FieldError name="carryable_by" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="mounted_weaponry"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Mounted Weaponry
              </Label>

              <CheckboxField
                name="mounted_weaponry"
                defaultChecked={props.dino?.mounted_weaponry}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />
              <p className="rw-helper-text">
                Can you use weapons while riding this dino?
              </p>

              <FieldError name="mounted_weaponry" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="ridable"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Ridable
              </Label>

              <CheckboxField
                name="ridable"
                defaultChecked={props.dino?.ridable}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />

              <FieldError name="ridable" className="rw-field-error" />
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
        </Disclosure>

        <Stepper>
          <Step title="test1">
            <p>test</p>
          </Step>
          <Step title="test2" optional>
            <p>test2</p>
          </Step>
          <Step title="test3">
            <p>test3</p>
          </Step>
        </Stepper>
        <Disclosure title="Stats" text_size="text-lg">
          <div>

          </div>
        </Disclosure>

        <Label
          name="base_stats"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Base stats
        </Label>

        <div className="flex flex-col capitalize text-white">
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
        </div>

        <FieldError name="base_stats" className="rw-field-error" />

        <fieldset className="rw-form-group">
          <legend className="inline-flex space-x-3">
            <span>Death</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 fill-current">
              <path d="M432 480h-416C7.164 480 0 487.2 0 496C0 504.8 7.164 512 16 512h416c8.836 0 16-7.164 16-16C448 487.2 440.8 480 432 480zM48 448C56.84 448 64 440.8 64 432V192c0-88.22 71.78-160 160-160s160 71.78 160 160v240c0 8.844 7.156 16 16 16s16-7.156 16-16l-.0012-240C415.1 86.12 329.9 0 223.1 0S31.1 86.13 31.1 192L32 432C32 440.8 39.16 448 48 448zM223.1 352C232.8 352 240 344.8 240 336v-128h64C312.8 208 320 200.8 320 192s-7.156-16-16-16h-64v-64c0-8.844-7.174-16-16.02-16S208 103.2 208 112v64h-64C135.2 176 128 183.2 128 192s7.156 16 16 16h64v128C208 344.8 215.2 352 223.1 352z" />
            </svg>
          </legend>
          <div>
            <div>
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
            <div>
              <Label
                name="exp_per_kill"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Experience per kill
              </Label>

              <TextField
                name="exp_per_kill"
                defaultValue={props.dino?.exp_per_kill || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="exp_per_kill" className="rw-field-error" />
            </div>
          </div>
        </fieldset>

        <details className="rw-form-group group">
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
        </details>

        <details className="rw-form-group group">
          <summary className="inline-flex items-center">
            Breeding
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
                name="egg_min"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Egg minimum temperature
              </Label>

              <TextField
                name="egg_min"
                defaultValue={props.dino?.egg_min || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="egg_min" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="egg_max"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Egg maximum temperature
              </Label>

              <TextField
                name="egg_max"
                defaultValue={props.dino?.egg_max || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="egg_max" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="maturation_time"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Maturation time
              </Label>

              <TextField
                name="maturation_time"
                defaultValue={props.dino?.maturation_time}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="maturation_time" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="incubation_time"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Incubation time
              </Label>

              <TextField
                name="incubation_time"
                defaultValue={props.dino?.incubation_time}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="incubation_time" className="rw-field-error" />
            </div>
          </div>
        </details>

        <details className="rw-form-group group">
          <summary className="inline-flex items-center">
            Food
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
                name="disable_food"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Disable food
              </Label>

              <CheckboxField
                name="disable_food"
                defaultChecked={props.dino?.disable_food}
                checked={disableFood}
                onChange={(e) => {
                  setDisableFood(e.target.checked);
                }}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />

              <FieldError name="disable_food" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
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
            </div>
          </div>
          <div>
            <div>
              <Label
                name="food_consumption_base"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Food consumption base multiplier
              </Label>

              <TextField
                name="food_consumption_base"
                defaultValue={props.dino?.food_consumption_base || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                emptyAs={0}
                validation={{ valueAsNumber: true }}
              />

              <FieldError
                name="food_consumption_base"
                className="rw-field-error"
              />
            </div>
            <div>
              <Label
                name="food_consumption_mult"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Food consumption multiplier
              </Label>

              <TextField
                name="food_consumption_mult"
                defaultValue={props.dino?.food_consumption_mult || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                emptyAs={0}
                validation={{ valueAsNumber: true }}
              />

              <FieldError
                name="food_consumption_mult"
                className="rw-field-error"
              />
            </div>
            <div>
              <Label
                name="non_violent_food_rate_mult"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Non violent food rate multiplier
              </Label>

              <TextField
                name="non_violent_food_rate_mult"
                defaultValue={props.dino?.non_violent_food_rate_mult || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError
                name="non_violent_food_rate_mult"
                className="rw-field-error"
              />
            </div>
          </div>
        </details>
        <Label
          name="disable_mult"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Disable multipliers
        </Label>

        <CheckboxField
          name="disable_mult"
          defaultChecked={props.dino?.disable_mult}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="disable_mult" className="rw-field-error" />

        <Label
          name="movement"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Movement
        </Label>

        <div className="flex flex-col space-y-2 text-white">
          {Object.entries(movement).map(([k, v], i) => (
            <div key={`m-${i}`}>
              <p>
                {
                  {
                    w: "Forwards",
                    d: "Sideways",
                    staminaRates: "Stamina Rates",
                  }[k]
                }
              </p>
              <div
                className="relative flex flex-row items-center space-x-1 space-y-1"
                key={`m-${i}`}
              >
                {Object.entries(v).map(([k2, v2], i2) => (
                  <div
                    className="rounded-lg bg-zinc-700 p-3"
                    key={`m-${i}-c-${i2}`}
                  >
                    <legend className="text-base font-medium capitalize">
                      {k2}
                    </legend>
                    {typeof v2 === "object" ? (
                      Object.entries(v2).map(([k3, v3], i3) => (
                        <div
                          className="mt-2 border-spacing-6 border-t"
                          key={`m-${i}-c-${i2}-s-${i3}`}
                        >
                          <label className="text-sm font-light capitalize">
                            {k3}
                          </label>
                          <input
                            className="rw-input max-w-[10rem]"
                            key={`m-${i}-c-${i2}-f-${i3}`}
                            onChange={(e) =>
                              setMovement((prevMovement) => {
                                const newMovement = { ...prevMovement };
                                newMovement[k][k2][k3] = Number(e.target.value);
                                return newMovement;
                              })
                            }
                            defaultValue={truncate(
                              (useFoundationUnit
                                ? Number((v3 as number) / 300)
                                : Number(v3)
                              ).toFixed(2),
                              6
                            )}
                          />
                          {/* <p className="w-20">
                        {useFoundationUnit ? "Foundations" : `Units`} per sec
                      </p> */}
                        </div>
                      ))
                    ) : (
                      <div>
                        <input
                          className="rw-input max-w-[10rem]"
                          key={`m-${i}-c-${i2}}`}
                          onChange={(e) =>
                            setMovement((prevMovement) => {
                              const newMovement = { ...prevMovement };
                              newMovement[k][k2] = Number(e.target.value);
                              return newMovement;
                            })
                          }
                          defaultValue={truncate(
                            (useFoundationUnit
                              ? Number(v2 / 300)
                              : Number(v2)
                            ).toFixed(2),
                            6
                          )}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          {/* TODO: change this to togglebutton */}
          <input
            type="checkbox"
            checked={useFoundationUnit}
            className="peer sr-only"
            onChange={(e) => setUseFoundationUnit(!useFoundationUnit)}
          />
          <div className="rw-toggle peer-focus:ring-pea-300 dark:peer-focus:ring-pea-800 peer-checked:bg-pea-500 peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Game Units / Foundation
          </span>
        </label>

        <p className="rw-helper-text">Movement speeds</p>

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
