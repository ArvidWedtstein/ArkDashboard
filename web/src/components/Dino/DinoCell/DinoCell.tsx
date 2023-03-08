import type { FindDinoById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Dino from 'src/components/Dino/Dino'

export const QUERY = gql`
  query FindDinoById($id: String!) {
    dino: dino(id: $id) {
      id
      created_at
      name
      synonyms
      description
      taming_notice
      can_destroy
      immobilized_by
      base_stats
      gather_eff
      exp_per_kill
      fits_through
      egg_min
      egg_max
      tdps
      eats
      maturation_time
      weight_reduction
      incubation_time
      affinity_needed
      aff_inc
      flee_threshold
      hitboxes
      drops
      food_consumption_base
      food_consumption_mult
      disable_ko
      violent_tame
      taming_bonus_attr
      disable_food
      disable_mult
      water_movement
      admin_note
      base_points
      method
      knockout
      non_violent_food_affinity_mult
      non_violent_food_rate_mult
      taming_interval
      base_taming_time
      exp_per_kill_adj
      disable_tame
      x_variant
      attack
      mounted_weaponry
      ridable
      flyer_dino
      water_dino
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Dino not found</div>

// let dino = { "id": "8a8f4d3b-1278-457c-8c20-1186f069cd11", "created_at": "2023-02-14T10:56:19.905364+00:00", "name": "Dunkleosteus", "synonyms": ["dunky", "dunkleo"], "description": null, "taming_notice": null, "can_destroy": ["t", "a", "w", "s"], "immobilized_by": ["net projectile"], "base_stats": { "d": { "a": [{ "b": 60 }], "b": 100, "t": 2.5, "w": 5.8 }, "f": { "b": 2000, "t": 10, "w": 200 }, "h": { "b": 710, "t": 5.4, "w": 142 }, "m": { "a": { "s": { "b": 546 } }, "b": 100, "t": 2.5, "w": null }, "o": { "b": null, "t": null, "w": null }, "s": { "b": 200, "t": 10, "w": 20 }, "t": { "b": 1150, "t": null, "w": 69 }, "w": { "b": 910, "t": 4, "w": 18.2 } }, "gather_eff": [{ "value": 2.57, "itemId": 75 }, { "value": 2.97, "itemId": 7 }, { "value": 3.25, "itemId": 8 }, { "value": 4.3, "itemId": 9 }, { "value": 4.6, "itemId": 142 }, { "value": 4.2, "itemId": 162 }, { "value": 2.94, "itemId": 12 }, { "value": 2.61, "itemId": 252 }, { "value": 2.52, "itemId": 10 }, { "value": 2.65, "itemId": 11 }, { "value": 3.1, "itemId": 786 }, { "value": 3.24, "itemId": 787 }], "exp_per_kill": 12, "fits_through": ["giant hatchframe", "behemoth dinosaur gateway"], "egg_min": null, "egg_max": null, "tdps": 1, "eats": ["Superior Kibble", "Titanoboa Kibble", "Raw Mutton", "Raw Prime Meat", "Cooked Lamb Chop", "Cooked Prime Meat", "Raw Prime Fish Meat", "Raw Meat", "Cooked Prime Fish Meat", "Cooked Meat", "Raw Fish Meat", "Cooked Fish Meat"], "maturation_time": "297000", "weight_reduction": [{ "value": 50, "itemId": 8 }, { "value": 50, "itemId": 9 }, { "value": 75, "itemId": 142 }, { "value": 50, "itemId": 162 }, { "value": 50, "itemId": 456 }, { "value": 50, "itemId": 78 }], "incubation_time": null, "affinity_needed": 1300, "aff_inc": 60, "flee_threshold": null, "hitboxes": null, "drops": ["787", "11", "786"], "food_consumption_base": 0.001852, "food_consumption_mult": 199.983994, "disable_ko": false, "violent_tame": true, "taming_bonus_attr": 3.275, "disable_food": false, "disable_mult": false, "water_movement": true, "admin_note": null, "base_points": 28800, "method": null, "knockout": null, "non_violent_food_affinity_mult": null, "non_violent_food_rate_mult": null, "taming_interval": 69, "base_taming_time": 1150, "exp_per_kill_adj": null, "disable_tame": false, "x_variant": true, "attack": [{ "dmg": 60, "name": "None", "radius": 350, "stamina": 0, "interval": 0.33 }], "mounted_weaponry": false, "ridable": true, "flyer_dino": false, "water_dino": true }
export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
  // <Dino dino={dino} />
)

export const Success = ({ dino }: CellSuccessProps<FindDinoById>) => {
  return <Dino dino={dino} />
}
