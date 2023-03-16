import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  TextAreaField,
  CheckboxField,
  Submit,
} from '@redwoodjs/forms'
import { useMemo, useState } from 'react'
import type { EditDinoById, UpdateDinoInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import Lookup from 'src/components/Util/Lookup/Lookup'
import arkitems from "../../../../public/arkitems.json";
import CheckboxGroup from 'src/components/Util/CheckSelect/CheckboxGroup'
import { truncate } from 'src/lib/formatters'

type FormDino = NonNullable<EditDinoById['dino']>

interface DinoFormProps {
  dino?: EditDinoById['dino']
  onSave: (data: UpdateDinoInput, id?: FormDino['id']) => void
  error?: RWGqlError
  loading: boolean
}

const DinoForm = (props: DinoFormProps) => {
  const [basestat, setBasestat] = useState({
    "d": { "b": 100, "t": 2.5, "w": 5.8, "a": [{ "b": 60 }], },
    "f": { "b": 2000, "t": 10, "w": 200 },
    "h": { "b": 710, "t": 5.4, "w": 142 },
    "m": { "b": 100, "t": 2.5, "w": null, "a": { "s": { "b": 546 } }, },
    "o": { "b": null, "t": null, "w": null },
    "s": { "b": 200, "t": 10, "w": 20 },
    "t": { "b": 1150, "t": null, "w": 69 },
    "w": { "b": 910, "t": 4, "w": 18.2 }
  });
  const statEntries = useMemo(
    () => Object.entries(basestat),
    [basestat]
  );
  const [drops, setDrops] = useState([]);
  const [eats, setEats] = useState([]);

  const [useFoundationUnit, setUseFoundationUnit] = useState(false);

  const [ge, setGE] = useState([]);
  const [geType, setGeType] = useState(null);
  const [geValue, setGeValue] = useState(0);

  const addGE = (data) => {
    data.preventDefault()

    if (!geType || ge.filter((stat) => stat.id === geType).length > 0) return
    setGE([...ge, { id: geType, value: geValue }]);
    setGeType(null);
    setGeValue(0);
  }

  const [wr, setWR] = useState([]);
  const [wrType, setWrType] = useState(null);
  const [wrValue, setWrValue] = useState(0);

  const addWR = (data) => {
    data.preventDefault()

    if (!wrType || wr.filter((stat) => stat.id === wrType).length > 0) return
    setWR([...wr, { id: wrType, value: wrValue }]);
    setWrType(null);
    setWrValue(0);
  }

  const onSubmit = (data: FormDino) => {
    props.onSave(data, props?.dino?.id)
  }

  // Movement is shown in game units. UE game units are 1 cm 1:1
  // A foundation is 300x300 game units, i.e 3x3 meters
  // https://ark.fandom.com/wiki/Game_units

  const movementFly = {
    "d": {
      "walk": { "base": 260, "sprint": 585 },
      "swim": { "base": 600 },
      "fly": { "base": 600, "sprint": 1350 }
    },
    "w": {
      "walk": { "base": 260, "sprint": 315.3 },
      "swim": { "base": 600 },
      "fly": { "base": 600, "sprint": 727.5 }
    },
    "staminaRates": { "sprint": -6, "swimOrFly": -0.275 }
  }
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
              defaultValue={props.dino?.synonyms.join(', ')}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ required: false, setValueAs: (e) => e.length > 0 ? e.split(',').map((s) => s.trim()) : null }}
            />
            <p className="rw-helper-text">Other names for this dino, comma seperated</p>

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
        </fieldset>

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
            { value: "t", label: "Thatch", image: "https://arkids.net/image/item/120/thatch-wall.png" },
            { value: "w", label: "Wood", image: "https://arkids.net/image/item/120/wooden-wall.png" },
            { value: "a", label: "Adobe", image: "https://arkids.net/image/item/120/adobe-wall.png" },
            { value: "s", label: "Stone", image: "https://arkids.net/image/item/120/stone-wall.png" },
            { value: "g", label: "Greenhouse", image: "https://arkids.net/image/item/120/greenhouse-wall.png" },
            { value: "m", label: "Metal", image: "https://arkids.net/image/item/120/metal-wall.png" },
            { value: "tk", label: "Tek", image: "https://arkids.net/image/item/120/tek-wall.png" },
          ]}
        />

        <FieldError name="can_destroy" className="rw-field-error" />

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
            { value: "733", label: "Lasso", image: "https://arkids.net/image/item/120/lasso.png" },
            { value: "1040", label: "Bola", image: "https://arkids.net/image/item/120/bola.png" },
            { value: "725", label: "Chain Bola", image: "https://arkids.net/image/item/120/chain-bola.png" },
            { value: "785", label: "Net Projectile", image: "https://arkids.net/image/item/120/net-projectile.png" },
            { value: "1252", label: "Plant Species Y Trap", image: "https://arkids.net/image/item/120/plant-species-y-trap.png" },
            { value: "383", label: "Bear Trap", image: "https://arkids.net/image/item/120/bear-trap.png" },
            { value: "384", label: "Large Bear Trap", image: "https://arkids.net/image/item/120/large-bear-trap.png" }
          ]}
        />

        <FieldError name="immobilized_by" className="rw-field-error" />


        <Label
          name="carryable_by"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Carryable by
        </Label>

        <CheckboxGroup
          name="carryable_by"
          // defaultValue={props.dino?.carryable_by}
          options={[
            { value: "e85015a5-8694-44e6-81d3-9e1fdd06061d", label: "Pteranodon", image: "https://www.dododex.com/media/creature/pteranodon.png" },
            { value: "1e7966e7-d63d-483d-a541-1a6d8cf739c8", label: "Tropeognathus", image: "https://www.dododex.com/media/creature/tropeognathus.png" },
            { value: "b8e304b3-ab46-4232-9226-c713e5a0d22c", label: "Tapejara", image: "https://www.dododex.com/media/creature/tapejara.png" },
            { value: "da86d88a-3171-4fc9-b96d-79e8f59f1601", label: "Griffin", image: "https://www.dododex.com/media/creature/griffin.png" },
            { value: "147922ce-912d-4ab6-b4b6-712a42a9d939", label: "Desmodus", image: "https://www.dododex.com/media/creature/desmodus.png" },
            { value: "28971d02-8375-4bf5-af20-6acb20bf7a76", label: "Argentavis", image: "https://www.dododex.com/media/creature/argentavis.png" },
            { value: "f924e5d6-832a-4fb3-abc0-2fa42481cee1", label: "Crystal Wyvern", image: "https://www.dododex.com/media/creature/crystalwyvern.png" },
            { value: "7aec6bf6-357e-44ec-8647-3943ca34e666", label: "Wyvern", image: "https://www.dododex.com/media/creature/wyvern.png" },
            { value: "2b938227-61c2-4230-b7da-5d4d55f639ae", label: "Quetzal", image: "https://www.dododex.com/media/creature/quetzal.png" },
            { value: "b1d6f790-d15c-4813-a6c8-9e6f62fafb52", label: "Tusoteuthis", image: "https://www.dododex.com/media/creature/tusoteuthis.png" },
            { value: "d670e948-055e-45e1-adf3-e56d63236238", label: "Karkinos", image: "https://www.dododex.com/media/creature/karkinos.png" },
            { value: "52156470-6075-487b-a042-2f1d0d88536c", label: "Kaprosuchus", image: "https://www.dododex.com/media/creature/kaprosuchus.png" },
            { value: "f723f861-0aa3-40b5-b2d4-6c48ec0ca683", label: "Procoptodon", image: "https://www.dododex.com/media/creature/procoptodon.png" },
            { value: "human", label: "Human", image: "https://www.dododex.com/media/item/Pet.png" },
            { value: "94708e56-483b-4eef-ad35-2b9ce0e9c669", label: "Gigantopithecus", image: "https://www.dododex.com/media/creature/gigantopithecus.png" },
          ]}
        />

        <FieldError name="carryable_by" className="rw-field-error" />


        <Label
          name="base_stats"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Base stats
        </Label>

        <TextAreaField
          name="base_stats"
          defaultValue={JSON.stringify(props.dino?.base_stats)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={'undefined'}
          validation={{ valueAsJSON: true }}
        />

        <div className="text-white flex flex-col">
          <div className="flex flex-row items-center space-x-1">
            <p className="w-5"></p>
            <p className="w-20">base</p>
            <p className="w-20">wild inc.</p>
            <p className="w-20">tamed inc.</p>
          </div>
          {statEntries.map(([stat, value], index) => (
            <div className="flex flex-row items-center space-x-1" key={index}>
              <p className="w-5">{stat}</p>
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


        <Label
          name="gather_eff"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Gather Efficiency
        </Label>

        <div className="flex flex-col">
          {ge && ge.map((stat, index) =>
            <div className="rw-button-group !mt-0 justify-start text-white">
              <p className="rw-input mt-0 !rounded-l-md !rounded-none w-40">{arkitems.items.find((i) => i.id === stat.id).name}</p>
              <input name="value" type="number" className="w-20 rw-input mt-0 !rounded-r-md" step={5} defaultValue={stat.value} />
              <button className="rw-button rw-button-red" onClick={() => setGE((s) => s.filter((v) => v.id !== stat.id))}>
                Remove Stat
              </button>
            </div>
          )}
        </div>
        <div className="rw-button-group justify-start">
          <Lookup
            className="rw-input mt-0 !rounded-l-md !rounded-none"
            items={arkitems.items.filter((item) => item.type === 'Resource').map((g) => {
              return { value: g.id, name: g.name, image: `https://arkids.net/image/item/120/${g.image ? g.image.replace('_(Scorched_Earth)', '').replace('_(Aberration)', '').replace('_(Genesis_Part_2)', '').replaceAll('_', '-').toLowerCase() : `${g.name.toLowerCase()}.png`}` }
            })}
            search={true}
            name="gather_eff"
            onChange={(e) => setGeType(e.value)}
          />
          <input name="value" type="number" className="rw-input mt-0 !rounded-r-md" defaultValue={geValue} onChange={(e) => setGeValue(e.currentTarget.valueAsNumber)} />
          <button className="rw-button rw-button-green" onClick={addGE}>
            Add stat
          </button>
        </div>

        <FieldError name="gather_eff" className="rw-field-error" />


        <Label
          name="exp_per_kill"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Exp per kill
        </Label>

        <TextField
          name="exp_per_kill"
          defaultValue={props.dino?.exp_per_kill}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />


        <FieldError name="exp_per_kill" className="rw-field-error" />

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
            { value: "322", label: "Doorframe", image: "https://arkids.net/image/item/120/stone-doorframe.png" },
            { value: "1066", label: "Double Doorframe", image: "https://arkids.net/image/item/120/stone-double-doorframe.png" },
            { value: "143", label: "Dinosaur Gateway", image: "https://arkids.net/image/item/120/stone-dinosaur-gateway.png" },
            { value: "381", label: "Behemoth Dino Gateway", image: "https://arkids.net/image/item/120/behemoth-stone-dinosaur-gateway.png" },
            { value: "316", label: "Hatchframe", image: "https://arkids.net/image/item/120/stone-hatchframe.png" },
            { value: "619", label: "Giant Hatchframe", image: "https://arkids.net/image/item/120/giant-stone-hatchframe.png" }
          ]}
        />

        <FieldError name="fits_through" className="rw-field-error" />


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
                defaultValue={props.dino?.tdps}
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
                defaultValue={props.dino?.affinity_needed}
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
                defaultValue={props.dino?.aff_inc}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="aff_inc" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="non_violent_food_affinity_mult"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Non violent food affinity mult
              </Label>

              <TextField
                name="non_violent_food_affinity_mult"
                defaultValue={props.dino?.non_violent_food_affinity_mult}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="non_violent_food_affinity_mult" className="rw-field-error" />
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
                emptyAs={'undefined'}
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
                defaultValue={props.dino?.taming_interval}
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
                defaultValue={props.dino?.egg_min}
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
                defaultValue={props.dino?.egg_max}
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
                items={arkitems.items.filter((item) => item.type === 'Consumable').map((item) => ({ value: item.id, name: item.name, image: `https://arkids.net/image/item/120/${item.image ? item.image.replace('_(Scorched_Earth)', '').replace('_(Aberration)', '').replace('_(Genesis_Part_2)', '').replaceAll('_', '-').toLowerCase() : `${item.name.toLowerCase()}.png`}` }))}
                search={true}
                name="eats"
                onChange={(e) => setEats((d) => [...d, { id: e.id, name: e.name, img: e.image }])}
              />

              {eats.length > 0 ? (
                <div className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-zinc-600 dark:border-zinc-500 dark:text-white mt-2">
                  {eats.map((food, i) => (
                    <button key={i} onClick={() => setEats((d) => d.filter((g) => g.id !== food.id))} className="block w-full px-2 py-1 first:rounded-t-lg last:rounded-b-lg transition-color cursor-pointer hover:ring hover:ring-red-500">
                      {food.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="rw-helper-text">
                  No food added yet.
                  Does this dino even eat?
                </p>
              )
              }

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
                Food consumption base
              </Label>

              <TextField
                name="food_consumption_base"
                defaultValue={props.dino?.food_consumption_base}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="food_consumption_base" className="rw-field-error" />
            </div>
            <div>
              <Label
                name="food_consumption_mult"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Food consumption mult
              </Label>

              <TextField
                name="food_consumption_mult"
                defaultValue={props.dino?.food_consumption_mult}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{ valueAsNumber: true }}
              />

              <FieldError name="food_consumption_mult" className="rw-field-error" />
            </div>
          </div>
        </fieldset>

        <Label
          name="weight_reduction"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Weight reduction
        </Label>

        <div className="flex flex-col">
          {wr && wr.map((stat, index) =>
            <div className="rw-button-group !mt-0 justify-start text-white">
              <p className="rw-input mt-0 !rounded-l-md !rounded-none w-40">{arkitems.items.find((i) => i.id === stat.id).name}</p>
              <input name="value" type="number" className="w-20 rw-input mt-0 !rounded-r-md" step={5} defaultValue={stat.value} />
              <button className="rw-button rw-button-red" onClick={() => setWR((s) => s.filter((v) => v.id !== stat.id))}>
                Remove Stat
              </button>
            </div>
          )}
        </div>
        <div className="rw-button-group justify-start">
          <Lookup
            className="rw-input mt-0 !rounded-l-md !rounded-none"
            items={arkitems.items.filter((item) => item.type === 'Resource').map((g) => {
              return { value: g.id, name: g.name, image: `https://arkids.net/image/item/120/${g.image ? g.image.replace('_(Scorched_Earth)', '').replace('_(Aberration)', '').replace('_(Genesis_Part_2)', '').replaceAll('_', '-').toLowerCase() : `${g.name.toLowerCase()}.png`}` }
            })}
            search={true}
            name="weight_reduction"
            onChange={(e) => setWrType(e.value)}
          />
          <input name="value" type="number" className="rw-input mt-0 !rounded-r-md" defaultValue={wrValue} onChange={(e) => setWrValue(e.currentTarget.valueAsNumber)} />
          <button className="rw-button rw-button-green" onClick={addWR}>
            Add stat
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

        <Lookup
          items={arkitems.items.filter((item) => item.type === 'Resource')}
          search={true}
          name="drops"
          onChange={(e) => setDrops((d) => [...d, { id: e.id, name: e.name, img: e.image }])}
        />

        <div className="flex flex-row mt-2">
          {drops.map((drop, i) => (
            <button key={i} className="inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 hover:ring hover:ring-red-500" onClick={() => setDrops((d) => d.filter((g) => g.id !== drop.id))}>
              <img className="rw-button-icon w-4 h-4" src={`https://www.arkresourcecalculator.com/assets/images/80px-${drop.img}`} />
              {drop.name}
            </button>
          ))}
        </div>

        <FieldError name="drops" className="rw-field-error" />


        <Label
          name="disable_mult"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Disable mult
        </Label>

        <CheckboxField
          name="disable_mult"
          defaultChecked={props.dino?.disable_mult}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="disable_mult" className="rw-field-error" />

        <Label
          name="water_movement"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Water movement
        </Label>

        <CheckboxField
          name="water_movement"
          defaultChecked={props.dino?.water_movement}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />
        <p className="rw-helper-text">Can this dino move in water?</p>

        <FieldError name="water_movement" className="rw-field-error" />


        <Label
          name="movement"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Movement
        </Label>

        <div className="text-white flex flex-col">
          <div className="flex flex-row items-center space-x-1">
            <p className="w-14"></p>
            <p className="w-20">base</p>
            <p className="w-20">sprint</p>
          </div>
          {Object.entries(movementFly["w"]).map(([stat, value], index) => (
            <div className="flex flex-row items-center space-x-1" key={index}>
              <p className="w-14">{stat}</p>
              {["base", "sprint"].map((label) => (
                <p
                  className="rw-input w-20"
                  contentEditable="true"

                >{!value[label] ? '-' : truncate((useFoundationUnit ? Number(value[label] / 300) : Number(value[label])).toFixed(2), 6)}</p >
              ))}
              <p className="w-20">{useFoundationUnit ? 'Foundations' : `Units`} per sec</p>
            </div>
          ))}
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={useFoundationUnit} className="sr-only peer" onChange={(e) => setUseFoundationUnit(!useFoundationUnit)} />
          <div className="rw-toggle peer-focus:ring-pea-300 dark:peer-focus:ring-pea-800 peer-checked:bg-pea-600 peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Game Units / Foundation</span>
        </label>

        {/* <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <img className="w-8 h-8" src={"https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/7/78/Landing.png"} />
          </span>
          <TextField
            name="movement"
            defaultValue={JSON.stringify(props.dino?.movement)}
            className="rw-input pl-12"
            errorClassName="rw-input rw-input-error"
          />
        </div> */}
        <p className="rw-helper-text">Walking Movement speeds</p>

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
          name="method"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Method
        </Label>

        <CheckboxGroup
          name="method"
          defaultValue={props.dino?.method}
          options={[
            { label: 'v', image: 'https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/7/78/Landing.png' },
            { label: 'n', image: 'https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/f/f5/Slow.png' }
          ]}
        />

        <FieldError name="method" className="rw-field-error" />


        {/* TODO: Remove knockout column */}
        <Label
          name="knockout"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Knockout
        </Label>

        <TextField
          name="knockout"
          defaultValue={props.dino?.knockout}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: false }}
        />

        <FieldError name="knockout" className="rw-field-error" />

        <Label
          name="non_violent_food_rate_mult"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Non violent food rate multiplier
        </Label>

        <TextField
          name="non_violent_food_rate_mult"
          defaultValue={props.dino?.non_violent_food_rate_mult}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />

        <FieldError name="non_violent_food_rate_mult" className="rw-field-error" />


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

        <TextField
          name="attack"
          defaultValue={JSON.stringify(props.dino?.attack)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={'undefined'}
          validation={{ valueAsJSON: true }}
        />

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
        <p className="rw-helper-text">Can you use weapons while riding this dino?</p>

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
            { value: 'flyer', label: 'Flyer', image: 'https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/7/78/Landing.png' },
            { value: 'ground', label: 'Ground', image: 'https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/f/f5/Slow.png' },
            { value: 'water', label: 'Water', image: 'https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/9/9d/Water.png' },
            { value: 'amphibious', label: 'Amphibious', image: 'https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/4/44/Swim_Mode.png' },
            { value: 'boss', label: 'Boss', image: 'https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/5/50/Cowardice.png' },
          ]}
        />

        <FieldError name="type" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit
            disabled={props.loading}
            className="rw-button rw-button-blue"
          >
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default DinoForm
