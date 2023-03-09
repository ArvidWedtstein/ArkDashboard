import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  TextAreaField,
  CheckboxField,
  Submit,
  SelectField,
} from '@redwoodjs/forms'
import { useState } from 'react'
import type { EditDinoById, UpdateDinoInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import Lookup from 'src/components/Util/Lookup/Lookup'
import arkitems from "../../../../public/arkitems.json";
type FormDino = NonNullable<EditDinoById['dino']>

interface DinoFormProps {
  dino?: EditDinoById['dino']
  onSave: (data: UpdateDinoInput, id?: FormDino['id']) => void
  error: RWGqlError
  loading: boolean
}

const DinoForm = (props: DinoFormProps) => {
  const [fitsThrough, setFitsThrough] = useState([]);
  const [affected, setAffected] = useState([]);
  const [canDestroy, setCanDestroy] = useState([]);
  const [types, setTypes] = useState([]);
  const [drops, setDrops] = useState([]);
  const [eats, setEats] = useState([]);
  const onSubmit = (data: FormDino) => {
    console.log(data)
    console.log(fitsThrough)
    data.fits_through = fitsThrough;
    data.drops = drops
    // delete data["flyer_dino"]
    props.onSave(data, props?.dino?.id)
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
          <div className="">
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
          <div className="">
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

        <TextField
          name="description"
          defaultValue={props.dino?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="description" className="rw-field-error" />

        <fieldset className="rw-form-group">
          <legend >Taming</legend>
          <div>
            <div>
              <Label
                name="taming_notice"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Taming notice
              </Label>

              <TextField
                name="taming_notice"
                defaultValue={props.dino?.taming_notice}
                className="rw-input"
                errorClassName="rw-input rw-input-error"
              />

              <FieldError name="taming_notice" className="rw-field-error" />
            </div>
            <div className="">
              <Label
                name="admin_note"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Admin note
              </Label>

              <TextField
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

        <div className="flex gap-3">
          <label>
            <input type="checkbox" onChange={(e) => setCanDestroy((f) => canDestroy.includes('322') ? f.filter((f) => f !== "322") : [...f, ""])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/thatch-wall.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Thatch</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setCanDestroy((f) => canDestroy.includes('322') ? f.filter((f) => f !== "322") : [...f, "322"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/wooden-wall.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Wood</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setCanDestroy((f) => canDestroy.includes('1066') ? f.filter((f) => f !== "1066") : [...f, "1066"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/adobe-wall.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Adobe</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setCanDestroy((f) => canDestroy.includes('143') ? f.filter((f) => f !== "143") : [...f, "143"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/stone-wall.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Stone</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setCanDestroy((f) => canDestroy.includes('381') ? f.filter((f) => f !== "381") : [...f, "381"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/greenhouse-wall.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Greenhouse</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setCanDestroy((f) => canDestroy.includes('316') ? f.filter((f) => f !== "316") : [...f, "316"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/metal-wall.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Metal</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setCanDestroy((f) => canDestroy.includes('619') ? f.filter((f) => f !== "619") : [...f, "619"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/tek-wall.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Tek</span>
            </span>
          </label>
        </div>

        <FieldError name="can_destroy" className="rw-field-error" />


        <Label
          name="immobilized_by"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Immobilized by
        </Label>

        <div className="flex gap-3">
          <label>
            <input type="checkbox" onChange={(e) => setAffected((f) => affected.includes('733') ? f.filter((f) => f !== "733") : [...f, "733"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/lasso.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Lasso</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setAffected((f) => affected.includes('1040') ? f.filter((f) => f !== "1040") : [...f, "1040"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/bola.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Bola</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setAffected((f) => affected.includes('785') ? f.filter((f) => f !== "785") : [...f, "785"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/net-projectile.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Net Projectile</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setAffected((f) => affected.includes('725') ? f.filter((f) => f !== "725") : [...f, "725"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/chain-bola.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Chain Bola</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setAffected((f) => affected.includes('1252') ? f.filter((f) => f !== "1252") : [...f, "1252"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/plant-species-y-trap.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Plant Species Y Trap</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setAffected((f) => affected.includes('383') ? f.filter((f) => f !== "383") : [...f, "383"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/bear-trap.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Bear Trap</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setAffected((f) => fitsThrough.includes('384') ? f.filter((f) => f !== "384") : [...f, "384"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/large-bear-trap.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Large Bear Trap</span>
            </span>
          </label>
        </div>

        <FieldError name="immobilized_by" className="rw-field-error" />

        {/* TODO: Find a better alternative */}
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

        <FieldError name="base_stats" className="rw-field-error" />

        <Label
          name="gather_eff"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Gather Efficiency
        </Label>

        <TextAreaField
          name="gather_eff"
          defaultValue={JSON.stringify(props.dino?.gather_eff)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs='undefined'
          validation={{ valueAsJSON: true }}
        />


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

        <div className="flex gap-3">
          <label>
            <input type="checkbox" onChange={(e) => setFitsThrough((f) => fitsThrough.includes('322') ? f.filter((f) => f !== "322") : [...f, "322"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/stone-doorframe.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Doorframe</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setFitsThrough((f) => fitsThrough.includes('1066') ? f.filter((f) => f !== "1066") : [...f, "1066"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/stone-double-doorframe.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Double Doorframe</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setFitsThrough((f) => fitsThrough.includes('143') ? f.filter((f) => f !== "143") : [...f, "143"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/stone-dinosaur-gateway.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Dinosaur Gateway</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setFitsThrough((f) => fitsThrough.includes('381') ? f.filter((f) => f !== "381") : [...f, "381"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/behemoth-stone-dinosaur-gateway.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Behemoth Dino Gateway</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setFitsThrough((f) => fitsThrough.includes('316') ? f.filter((f) => f !== "316") : [...f, "316"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/stone-hatchframe.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Hatchframe</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setFitsThrough((f) => fitsThrough.includes('619') ? f.filter((f) => f !== "619") : [...f, "619"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/giant-stone-hatchframe.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Giant Hatchframe</span>
            </span>
          </label>
        </div>

        <FieldError name="fits_through" className="rw-field-error" />


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
          <legend>Taming</legend>
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
        </fieldset>

        <Label
          name="eats"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Eats
        </Label>

        <Lookup
          items={arkitems.items.filter((item) => item.type === 'Consumable')}
          search={true}
          name="eats"
          onChange={(e) => setEats((d) => [...d, { id: e.id, name: e.name, img: e.img }])}
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

        {/* <TextField
          name="eats"
          defaultValue={props.dino?.eats}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        /> */}

        <FieldError name="eats" className="rw-field-error" />

        <Label
          name="weight_reduction"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Weight reduction
        </Label>

        {/* <Lookup
          items={arkitems.items.filter((item) => item.type === 'Consumable')}
          search={true}
          name="weight_reduction"
          onChange={(e) => setEats((d) => [...d, { id: e.id, name: e.name, img: e.img }])}
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
        } */}

        <TextAreaField
          name="weight_reduction"
          defaultValue={JSON.stringify(props.dino?.weight_reduction)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={'undefined'}
          validation={{ valueAsJSON: true }}
        />

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
          onChange={(e) => setDrops((d) => [...d, { id: e.id, name: e.name, img: e.img }])}
        />

        <div className="flex flex-row">
          {drops.map((drop, i) => (
            <button key={i} className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 hover:ring hover:ring-red-500" onClick={() => setDrops((d) => d.filter((g) => g.id !== drop.id))}>{drop.name}</button>
          ))}
        </div>
        {/* <TextField
          name="drops"
          defaultValue={props.dino?.drops}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: false }}
        /> */}

        <FieldError name="drops" className="rw-field-error" />

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


        <FieldError name="disable_ko" className="rw-field-error" />

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


        <FieldError name="violent_tame" className="rw-field-error" />

        <Label
          name="taming_bonus_attr"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Taming bonus attr
        </Label>

        <TextField
          name="taming_bonus_attr"
          defaultValue={props.dino?.taming_bonus_attr}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true }}
        />


        <FieldError name="taming_bonus_attr" className="rw-field-error" />

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
          name="base_points"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Base points
        </Label>

        <TextField
          name="base_points"
          defaultValue={props.dino?.base_points}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
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

        <TextField
          name="method"
          defaultValue={props.dino?.method}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={null}
          validation={{ required: false }}
        />

        <div className="flex gap-3">
          <label>
            <input type="checkbox" onChange={(e) => setAffected((f) => affected.includes('v') ? f.filter((f) => f !== "v") : [...f, "v"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/lasso.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">V</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setAffected((f) => affected.includes('n') ? f.filter((f) => f !== "n") : [...f, "n"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://arkids.net/image/item/120/bola.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">N</span>
            </span>
          </label>
        </div>

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
          Non violent food rate mult
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
          validation={{ valueAsNumber: true }}
        />


        <FieldError name="base_taming_time" className="rw-field-error" />

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
          Attack
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

        <div className="flex gap-3">
          <label>
            <input type="checkbox" onChange={(e) => setTypes((f) => types.includes('flyer') ? f.filter((f) => f !== "flyer") : [...f, "flyer"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/7/78/Landing.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Flyer</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setTypes((f) => types.includes('ground') ? f.filter((f) => f !== "ground") : [...f, "ground"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/f/f5/Slow.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Ground</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setTypes((f) => types.includes('water') ? f.filter((f) => f !== "water") : [...f, "water"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/9/9d/Water.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Water</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setTypes((f) => types.includes('amphibious') ? f.filter((f) => f !== "amphibious") : [...f, "amphibious"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/4/44/Swim_Mode.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Amphibious</span>
            </span>
          </label>
          <label>
            <input type="checkbox" onChange={(e) => setTypes((f) => types.includes('boss') ? f.filter((f) => f !== "boss") : [...f, "boss"])} className="rw-check-input" />
            <span className="rw-check-tile">
              <span className="transition-all duration-150 ease-in text-gray-900 dark:text-stone-200">
                <img className="w-12 h-12" src="https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/5/50/Cowardice.png" />
              </span>
              <span className="text-center transition-all duration-300 ease-linear text-gray-900 dark:text-stone-200 text-xs mx-2">Boss</span>
            </span>
          </label>
        </div>

        <FieldError name="type" className="rw-field-error" />


        {/* <Label
          name="flyer_dino"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Flyer Dino
        </Label>

        <CheckboxField
          name="flyer_dino"
          defaultChecked={props.dino?.flyer_dino}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="flyer_dino" className="rw-field-error" />

        <Label
          name="water_dino"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Water Dino
        </Label>

        <CheckboxField
          name="water_dino"
          defaultChecked={props.dino?.water_dino}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="water_dino" className="rw-field-error" /> */}

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
