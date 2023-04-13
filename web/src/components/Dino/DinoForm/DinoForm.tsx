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
} from "@redwoodjs/forms";
import { useEffect, useMemo, useState } from "react";
import type { EditDinoById, UpdateDinoInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import Lookup from "src/components/Util/Lookup/Lookup";
import arkitems from "../../../../public/arkitems.json";
import CheckboxGroup from "src/components/Util/CheckSelect/CheckboxGroup";
import { truncate } from "src/lib/formatters";
import { useQuery } from "@redwoodjs/web";

type FormDino = NonNullable<EditDinoById["dino"]>;

interface DinoFormProps {
  dino?: EditDinoById["dino"];
  onSave: (data: UpdateDinoInput, id?: FormDino["id"]) => void;
  error?: RWGqlError;
  loading: boolean;
}

const QUERY = gql`
   query FindItemsByCategory($category: String!) {
    itemsByCategory(category: $category) {
      items {
        id
        created_at
        name
        description
        image
        max_stack
        weight
        engram_points
        crafting_time
        req_level
        yields
        recipe
        stats
        color
        crafted_in
        effects
        type
      }
      count
    }
  }
`;
const DinoForm = (props: DinoFormProps) => {
  // const { loading, error, data } = useQuery(QUERY, {
  //   variables: { category: 'Resource' },
  // });

  // useEffect(() => {
  //   if (data) {
  //     console.log(data);
  //   }

  //   if (error) {
  //     console.log(error);
  //   }
  // }, [data, error]);


  const [basestat, setBasestat] = useState({
    d: { b: 100, t: 2.5, w: 5.8, a: [{ b: 60 }] },
    f: { b: 2000, t: 10, w: 200 },
    h: { b: 710, t: 5.4, w: 142 },
    m: { b: 100, t: 2.5, w: null, a: { s: { b: 546 } } },
    o: { b: null, t: null, w: null },
    s: { b: 200, t: 10, w: 20 },
    t: { b: 1150, t: null, w: 69 },
    w: { b: 910, t: 4, w: 18.2 },
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

  const { register, control } = useForm({
    defaultValues: {
      attack: [],
      gather_eff: []
    }
  });
  const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({
    control,
    name: 'gather_eff', // the name of the field array in your form data
  });
  const { fields: attackFields, append: appendAttack, remove: removeAttack } = useFieldArray({
    control,
    name: 'attack', // the name of the field array in your form data
  });

  const statEntries = useMemo(() => Object.entries(basestat), [basestat]);

  const [eats, setEats] = useState([]);

  const [useFoundationUnit, setUseFoundationUnit] = useState(false);

  const [ge, setGE] = useState([]);
  const [geType, setGeType] = useState(null);
  const [geValue, setGeValue] = useState(0);

  const [wr, setWR] = useState([]);
  const [wrType, setWrType] = useState(null);
  const [wrValue, setWrValue] = useState(0);



  const onSubmit = (data: FormDino) => {
    props.onSave(data, props?.dino?.id);
  };

  // Movement is shown in game units. UE game units are 1 cm 1:1
  // A foundation is 300x300 game units, i.e 3x3 meters
  // https://ark.fandom.com/wiki/Game_units

  const movementFly = {
    d: {
      walk: { base: 260, sprint: 585 },
      swim: { base: 600 },
      fly: { base: 600, sprint: 1350 },
    },
    w: {
      walk: { base: 260, sprint: 315.3 },
      swim: { base: 600 },
      fly: { base: 600, sprint: 727.5 },
    },
    staminaRates: { sprint: -6, swimOrFly: -0.275 },
  };
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
              defaultValue={props.dino?.synonyms.join(", ")}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{
                required: false,
                setValueAs: (e) =>
                  e.length > 0 ? e.split(",").map((s) => s.trim()) : null,
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

        <fieldset className="rw-form-group">
          <legend>Other</legend>
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
                name="gather_eff"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Gather Efficiency
              </Label>

              {statFields.filter((ge) => ge.type === 'gather_efficiency').map((ge, index) => (
                <div className="rw-button-group justify-start" role="group" key={`ge-${index}`}>
                  <Lookup
                    {...register(`gather_eff.${index}.item_id`)}
                    className="!rounded-none !rounded-l-md !mt-0"
                    options={arkitems.items.filter((f) => f.type === 'Resource').map((item) => {
                      return {
                        type: item.type,
                        label: item.name,
                        value: item.id,
                        image: `https://arkcheat.com/images/ark/items/${item.image}`,
                      };
                    })}
                    search={true}
                    defaultValue={ge.item_id}
                    filterFn={(item, search) => {
                      return item.label.toLowerCase().includes(search.toLowerCase())
                    }}
                  />
                  <input {...register(`gather_eff.${index}.value`, { required: true })} type="number" className="rw-input mt-0 max-w-[7rem]" defaultValue={ge.value} />
                  <button type="button" className="rw-button rw-button-red rounded-none !ml-0 !rounded-r-md" onClick={() => removeStat(index)}>
                    Remove
                  </button>
                </div>
              ))}
              <div className="rw-button-group justify-start">
                <button type="button" className="rw-button rw-button-gray !ml-0" onClick={() => appendStat({ item_id: 0, value: 0, type: 'gather_efficiency' })}>
                  Add Gather Efficiency
                </button>
              </div>

              <FieldError name="gather_eff" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="weight_reduction"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Weight reduction
              </Label>

              {statFields.filter((stat) => stat.type === 'weight_reduction').map((wr, index) => (
                <div className="rw-button-group justify-start" role="group" key={`wr-${index}`}>
                  <Lookup
                    {...register(`gather_eff.${index}.item_id`)}
                    className="!rounded-none !rounded-l-md !mt-0"
                    options={arkitems.items.filter((f) => f.type === 'Resource').map((item) => {
                      return {
                        type: item.type,
                        label: item.name,
                        value: item.id,
                        image: `https://arkcheat.com/images/ark/items/${item.image}`,
                      };
                    })}
                    search={true}
                    defaultValue={wr.item_id}
                    filterFn={(item, search) => {
                      return item.label.toLowerCase().includes(search.toLowerCase())
                    }}
                  />
                  <input {...register(`gather_eff.${index}.value`, { required: true })} type="number" className="rw-input mt-0 max-w-[7rem]" defaultValue={wr.value} />
                  <button type="button" className="rw-button rw-button-red rounded-none !ml-0 !rounded-r-md" onClick={() => removeStat(index)}>
                    Remove
                  </button>
                </div>
              ))}
              <div className="rw-button-group justify-start">
                <button type="button" className="rw-button rw-button-gray !ml-0" onClick={() => appendStat({ item_id: 0, value: 0, type: 'weight_reduction' })}>
                  Add Weight Reduction
                </button>
              </div>

              <FieldError name="weight_reduction" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
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
                    image: "https://arkids.net/image/item/120/stone-doorframe.png",
                  },
                  {
                    value: "1066",
                    label: "Double Doorframe",
                    image:
                      "https://arkids.net/image/item/120/stone-double-doorframe.png",
                  },
                  {
                    value: "143",
                    label: "Dinosaur Gateway",
                    image:
                      "https://arkids.net/image/item/120/stone-dinosaur-gateway.png",
                  },
                  {
                    value: "381",
                    label: "Behemoth Dino Gateway",
                    image:
                      "https://arkids.net/image/item/120/behemoth-stone-dinosaur-gateway.png",
                  },
                  {
                    value: "316",
                    label: "Hatchframe",
                    image: "https://arkids.net/image/item/120/stone-hatchframe.png",
                  },
                  {
                    value: "619",
                    label: "Giant Hatchframe",
                    image:
                      "https://arkids.net/image/item/120/giant-stone-hatchframe.png",
                  },
                ]}
              />

              <FieldError name="fits_through" className="rw-field-error" />
            </div>
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
                defaultValue={props.dino?.can_destroy}
                options={[
                  {
                    value: "t",
                    label: "Thatch",
                    image: "https://arkids.net/image/item/120/thatch-wall.png",
                  },
                  {
                    value: "w",
                    label: "Wood",
                    image: "https://arkids.net/image/item/120/wooden-wall.png",
                  },
                  {
                    value: "a",
                    label: "Adobe",
                    image: "https://arkids.net/image/item/120/adobe-wall.png",
                  },
                  {
                    value: "s",
                    label: "Stone",
                    image: "https://arkids.net/image/item/120/stone-wall.png",
                  },
                  {
                    value: "g",
                    label: "Greenhouse",
                    image: "https://arkids.net/image/item/120/greenhouse-wall.png",
                  },
                  {
                    value: "m",
                    label: "Metal",
                    image: "https://arkids.net/image/item/120/metal-wall.png",
                  },
                  {
                    value: "tk",
                    label: "Tek",
                    image: "https://arkids.net/image/item/120/tek-wall.png",
                  },
                ]}
              />

              <FieldError name="can_destroy" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
              <Label
                name="immobilized_by"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Immobilized by
              </Label>

              <CheckboxGroup
                name="immobilized_by"
                defaultValue={props.dino?.immobilized_by}
                options={[
                  {
                    value: "733",
                    label: "Lasso",
                    image: "https://arkids.net/image/item/120/lasso.png",
                  },
                  {
                    value: "1040",
                    label: "Bola",
                    image: "https://arkids.net/image/item/120/bola.png",
                  },
                  {
                    value: "725",
                    label: "Chain Bola",
                    image: "https://arkids.net/image/item/120/chain-bola.png",
                  },
                  {
                    value: "785",
                    label: "Net Projectile",
                    image: "https://arkids.net/image/item/120/net-projectile.png",
                  },
                  {
                    value: "1252",
                    label: "Plant Species Y Trap",
                    image:
                      "https://arkids.net/image/item/120/plant-species-y-trap.png",
                  },
                  {
                    value: "383",
                    label: "Bear Trap",
                    image: "https://arkids.net/image/item/120/bear-trap.png",
                  },
                  {
                    value: "384",
                    label: "Large Bear Trap",
                    image: "https://arkids.net/image/item/120/large-bear-trap.png",
                  },
                ]}
              />

              <FieldError name="immobilized_by" className="rw-field-error" />
            </div>
          </div>
          <div>
            <div>
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
                    image: "https://www.dododex.com/media/creature/pteranodon.png",
                  },
                  {
                    value: "1e7966e7-d63d-483d-a541-1a6d8cf739c8",
                    label: "Tropeognathus",
                    image: "https://www.dododex.com/media/creature/tropeognathus.png",
                  },
                  {
                    value: "b8e304b3-ab46-4232-9226-c713e5a0d22c",
                    label: "Tapejara",
                    image: "https://www.dododex.com/media/creature/tapejara.png",
                  },
                  {
                    value: "da86d88a-3171-4fc9-b96d-79e8f59f1601",
                    label: "Griffin",
                    image: "https://www.dododex.com/media/creature/griffin.png",
                  },
                  {
                    value: "147922ce-912d-4ab6-b4b6-712a42a9d939",
                    label: "Desmodus",
                    image: "https://www.dododex.com/media/creature/desmodus.png",
                  },
                  {
                    value: "28971d02-8375-4bf5-af20-6acb20bf7a76",
                    label: "Argentavis",
                    image: "https://www.dododex.com/media/creature/argentavis.png",
                  },
                  {
                    value: "f924e5d6-832a-4fb3-abc0-2fa42481cee1",
                    label: "Crystal Wyvern",
                    image: "https://www.dododex.com/media/creature/crystalwyvern.png",
                  },
                  {
                    value: "7aec6bf6-357e-44ec-8647-3943ca34e666",
                    label: "Wyvern",
                    image: "https://www.dododex.com/media/creature/wyvern.png",
                  },
                  {
                    value: "2b938227-61c2-4230-b7da-5d4d55f639ae",
                    label: "Quetzal",
                    image: "https://www.dododex.com/media/creature/quetzal.png",
                  },
                  {
                    value: "b1d6f790-d15c-4813-a6c8-9e6f62fafb52",
                    label: "Tusoteuthis",
                    image: "https://www.dododex.com/media/creature/tusoteuthis.png",
                  },
                  {
                    value: "d670e948-055e-45e1-adf3-e56d63236238",
                    label: "Karkinos",
                    image: "https://www.dododex.com/media/creature/karkinos.png",
                  },
                  {
                    value: "52156470-6075-487b-a042-2f1d0d88536c",
                    label: "Kaprosuchus",
                    image: "https://www.dododex.com/media/creature/kaprosuchus.png",
                  },
                  {
                    value: "f723f861-0aa3-40b5-b2d4-6c48ec0ca683",
                    label: "Procoptodon",
                    image: "https://www.dododex.com/media/creature/procoptodon.png",
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
                      "https://www.dododex.com/media/creature/gigantopithecus.png",
                  },
                ]}
              />

              <FieldError name="carryable_by" className="rw-field-error" />
            </div>
          </div>
        </fieldset>


        <Label
          name="base_stats"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Base stats
        </Label>

        <div className="flex flex-col text-white capitalize">
          <div className="flex flex-row items-center space-x-1">
            <p className="w-5"></p>
            <p className="w-20">Base</p>
            <p className="w-20">Wild inc.</p>
            <p className="w-20">Tamed inc.</p>
          </div>
          {statEntries.map(([stat, value], index) => (
            <div className="flex flex-row items-center space-x-1" key={index}>
              <img
                title={{
                  "s": "Stamina",
                  "w": "Weight",
                  "o": "Oxygen",
                  "d": "Melee Damage",
                  "f": "Food",
                  "m": "Movement Speed",
                  "t": "Torpidity",
                  "h": "Health"
                }[stat]}
                className="h-6 w-6"
                src={{
                  "s": "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/8/8d/Stamina.png",
                  "w": "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/6/6f/Weight.png",
                  "o": "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/1/19/Oxygen.png",
                  "d": "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/0/01/Melee_Damage.png",
                  "f": "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/c/c6/Food.png",
                  "m": "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/e/e1/Movement_Speed.png",
                  "t": "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/3/32/Torpidity.png",
                  "h": "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/9/94/Health.png"
                }[stat]}
                alt=""
              />
              {["b", "w", "t"].map((label) => (
                <input
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

        <fieldset className="rw-form-group ">
          <legend className="inline-flex space-x-3">
            <span>Death</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6">
              <path fill="currentColor" d="M160 192C124.7 192 96 220.7 96 256c0 35.33 28.67 64 64 64s64-28.67 64-64C224 220.7 195.3 192 160 192zM160 288C142.3 288 128 273.7 128 256c0-17.7 14.3-32 32-32s32 14.3 32 32C192 273.7 177.7 288 160 288zM256 0C114.6 0 0 100.3 0 224c0 70.13 36.88 132.6 94.5 173.7c9.75 6.875 15.25 18.02 13.5 29.89l-7.125 21.27C90.63 480 113.8 512 146.5 512h219c32.75 0 55.88-32 45.63-63.13l-7.094-21.27c-1.75-11.75 3.75-23.02 13.5-29.89C475.2 356.6 512 294.1 512 224C512 100.3 397.4 0 256 0zM398.9 371.6c-19.62 14-29.88 37.13-26.62 60.38c.7441 4.096-.4238 .2578 8.5 26.88c2.25 7.277-1.291 21-15.25 21H320v-48c0-8.801-7.199-16-16-16s-16 7.199-16 16v48H224v-48c0-8.801-7.199-16-16-16s-16 7.199-16 16v48H146.5c-11.34 0-18.57-11.04-15.25-21C140.2 432.3 139 436.1 139.8 432c3.25-23.25-7-46.38-26.62-60.38C61.5 334.9 32 281.1 32 224c0-105.9 100.5-192 224-192s224 86.13 224 192C480 281.1 450.5 334.9 398.9 371.6zM352 192c-35.33 0-64 28.67-64 64c0 35.33 28.67 64 64 64s64-28.67 64-64C416 220.7 387.3 192 352 192zM352 288c-17.7 0-32-14.3-32-32c0-17.7 14.3-32 32-32s32 14.3 32 32C384 273.7 369.7 288 352 288z" />
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

              {statFields.filter((ge) => ge.type === 'drops').map((ge, index) => (
                <div className="rw-button-group justify-start !mt-0" role="group" key={`drops-${index}`}>
                  <Lookup
                    {...register(`gather_eff.${index}.item_id`)}
                    className="!rounded-none !rounded-l-md !mt-0"
                    options={arkitems.items.filter((f) => f.type === 'Resource').map((item) => {
                      return {
                        type: item.type,
                        label: item.name,
                        value: item.id,
                        image: `https://arkcheat.com/images/ark/items/${item.image}`,
                      };
                    })}
                    search={true}
                    defaultValue={ge.item_id}
                    filterFn={(item, search) => {
                      return item.label.toLowerCase().includes(search.toLowerCase())
                    }}
                  />
                  <button type="button" title="Close" className="rw-button rw-button-red rounded-none !ml-0 !rounded-r-md" onClick={() => removeStat(index)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="fill-current rw-button-icon w-4">
                      <path d="M315.3 411.3c-6.253 6.253-16.37 6.253-22.63 0L160 278.6l-132.7 132.7c-6.253 6.253-16.37 6.253-22.63 0c-6.253-6.253-6.253-16.37 0-22.63L137.4 256L4.69 123.3c-6.253-6.253-6.253-16.37 0-22.63c6.253-6.253 16.37-6.253 22.63 0L160 233.4l132.7-132.7c6.253-6.253 16.37-6.253 22.63 0c6.253 6.253 6.253 16.37 0 22.63L182.6 256l132.7 132.7C321.6 394.9 321.6 405.1 315.3 411.3z" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="rw-button-group justify-start">
                <button type="button" className="rw-button rw-button-gray !ml-0" onClick={() => appendStat({ item_id: null, value: null, type: 'drops' })}>
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

        <fieldset className="rw-form-group">
          <legend>Taming</legend>
          <div>
            <div>
              <Label
                name="disable_tame"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Disable tame
              </Label>

              <CheckboxField
                name="disable_tame"
                defaultChecked={props.dino?.disable_tame}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />
              <p className="rw-helper-text">If this dino is tamable</p>

              <FieldError name="disable_tame" className="rw-field-error" />
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
            <div>
              {/* TODO: hide this when food is disabled */}
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
              <p className="rw-helper-text">Chances of this dino fleeing while being tamed</p>
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
                defaultValue={props.dino?.base_taming_time || 0}
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
                defaultValue={props.dino?.taming_interval || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="taming_interval" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="taming_bonus_attr"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Taming bonus attribute
              </Label>

              <TextField
                name="taming_bonus_attr"
                defaultValue={props.dino?.taming_bonus_attr || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                emptyAs={0}
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="taming_bonus_attr" className="rw-field-error" />
            </div>
          </div>
        </fieldset>

        <fieldset className="rw-form-group">
          <legend>Breeding</legend>
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
                defaultValue={props.dino?.maturation_time || 0}
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
                defaultValue={props.dino?.incubation_time || 0}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="incubation_time" className="rw-field-error" />
            </div>
          </div>
        </fieldset>

        <fieldset className="rw-form-group">
          <legend>Food</legend>
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
                options={arkitems.items
                  .filter((item) => item.type === "Consumable")
                  .map((item) => ({
                    value: item.id,
                    label: item.name,
                    image: `https://arkids.net/image/item/120/${item.image
                      ? item.image
                        .replace("_(Scorched_Earth)", "")
                        .replace("_(Aberration)", "")
                        .replace("_(Genesis_Part_2)", "")
                        .replaceAll("_", "-")
                        .toLowerCase()
                      : `${item.name.toLowerCase()}.png`
                      }`,
                  }))}
                search={true}
                name="eats"
                onSelect={(e) =>
                  setEats((d) => [
                    ...d,
                    { id: e.id, name: e.name, img: e.image },
                  ])
                }
              />

              {eats.length > 0 ? (
                <div className="mt-2 w-48 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-zinc-500 dark:bg-zinc-600 dark:text-white">
                  {eats.map((food, i) => (
                    <button
                      key={i}
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
                defaultValue={props.dino?.food_consumption_base}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
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
                defaultValue={props.dino?.food_consumption_mult}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError
                name="food_consumption_mult"
                className="rw-field-error"
              />
            </div>
          </div>
        </fieldset>
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

        <div className="flex flex-col text-white space-y-2">
          {Object.entries(movement).map(([k, v], i) => (
            <div>
              <p>{{ "w": "Forwards", "d": "Sideways", "staminaRates": "Stamina Rates" }[k]}</p>
              <div className="flex flex-row items-center space-x-1 space-y-1 relative" key={`m-${i}`}>
                {Object.entries(v).map(([k2, v2]: any, i2) => (
                  <div className="bg-zinc-700 p-3 rounded-lg" key={`m-${i}-c-${i2}`}>
                    <legend className="capitalize text-base font-medium">{k2}</legend>
                    {typeof v2 === 'object' ? Object.entries(v2).map(([k3, v3]: any, i3) => (
                      <div className="mt-2 border-t border-spacing-6">
                        <label className="capitalize text-sm font-light">{k3}</label>
                        <input className="rw-input max-w-[10rem]" key={`m-${i}-c-${i2}-f-${i3}`} onChange={(e) => setMovement((prevMovement) => {
                          const newMovement = { ...prevMovement }
                          newMovement[k][k2][k3] = Number(e.target.value)
                          return newMovement
                        })} defaultValue={truncate(
                          (useFoundationUnit
                            ? Number((v3 as number) / 300)
                            : Number(v3)
                          ).toFixed(2),
                          6
                        )} />
                        {/* <p className="w-20">
                        {useFoundationUnit ? "Foundations" : `Units`} per sec
                      </p> */}
                      </div>
                    )) : (
                      <div>
                        <input className="rw-input max-w-[10rem]" key={`m-${i}-c-${i2}}`} onChange={(e) => setMovement((prevMovement) => {
                          const newMovement = { ...prevMovement }
                          newMovement[k][k2] = Number(e.target.value)
                          return newMovement
                        })} defaultValue={truncate(
                          (useFoundationUnit
                            ? Number(v2 / 300)
                            : Number(v2)
                          ).toFixed(2),
                          6
                        )} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
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
          <div className="rw-button-group justify-start !mt-0" role="group" key={`attack-${index}`}>
            <input {...register(`attack.${index}.name`, { required: true })} type="text" className="rw-input mt-0" defaultValue={atk.name} placeholder={"Name of attack"} />
            <input {...register(`attack.${index}.dmg`, { required: false })} type="number" className="rw-input mt-0 max-w-[8rem]" defaultValue={atk.dmg} placeholder={"Damage"} />
            <input {...register(`attack.${index}.radius`, { required: false })} type="number" className="rw-input mt-0 max-w-[8rem]" defaultValue={atk.radius} placeholder={"Radius"} />
            <input {...register(`attack.${index}.stamina`, { required: false })} type="number" className="rw-input mt-0 max-w-[8rem]" defaultValue={atk.stamina} placeholder={"Stamina drained per use"} />
            <input {...register(`attack.${index}.interval`, { required: false })} type="number" className="rw-input mt-0 max-w-[8rem]" defaultValue={atk.interval} placeholder={"Cooldown"} />
            <button type="button" className="rw-button rw-button-red rounded-none !ml-0 !rounded-r-md" onClick={() => removeAttack(index)}>
              Remove
            </button>
          </div>
        ))}
        <div className="rw-button-group justify-start">
          <button type="button" className="rw-button rw-button-gray" onClick={() => appendAttack({ name: '', dmg: null, radius: null, stamina: null, interval: null })}>
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

        <Label
          name="type"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Dino Type
        </Label>

        <CheckboxGroup
          name="type"
          defaultValue={props.dino?.type}
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
