import type { FindItemById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Item from 'src/components/Item/Item'

export const QUERY = gql`
  query FindItemById($id: BigInt!) {
    item: item(id: $id) {
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
  }
`
const item = { "id": 10, "created_at": "2023-02-14T12:07:48.079024+00:00", "name": "Hide", "description": "Thick skin, hacked from most dead animals.", "image": "hide.png", "max_stack": 100, "weight": 0.01, "engram_points": 0, "crafting_time": null, "req_level": 0, "yields": 1, "recipe": null, "stats": null, "color": "#b99e7b", "crafted_in": null, "effects": null, "type": "Other", "DinoEffWeight": [{ "name": "Megalosaurus", "value": 3.61, "is_gather_eff": true, "rank": 27 }, { "name": "Phoenix", "value": 3.72, "is_gather_eff": true, "rank": 21 }, { "name": "Direbear", "value": 3.36, "is_gather_eff": true, "rank": 39 }, { "name": "Kaprosuchus", "value": 2.98, "is_gather_eff": true, "rank": 54 }, { "name": "Enforcer", "value": 3.77, "is_gather_eff": true, "rank": 19 }, { "name": "Terror Bird", "value": 2.82, "is_gather_eff": true, "rank": 62 }, { "name": "Astrodelphis", "value": 3.3, "is_gather_eff": true, "rank": 41 }, { "name": "Liopleurodon", "value": 3.37, "is_gather_eff": true, "rank": 38 }, { "name": "Carnotaurus", "value": 3.22, "is_gather_eff": true, "rank": 47 }, { "name": "Direwolf", "value": 4.14, "is_gather_eff": true, "rank": 5 }, { "name": "Thorny Dragon", "value": 2.99, "is_gather_eff": true, "rank": 53 }, { "name": "Royal Griffin", "value": 3.66, "is_gather_eff": true, "rank": 23 }, { "name": "Carcharodontosaurus", "value": 4.41, "is_gather_eff": true, "rank": 1 }, { "name": "Beelzebufo", "value": 2.43, "is_gather_eff": true, "rank": 67 }, { "name": "Argentavis", "value": 3.21, "is_gather_eff": true, "rank": 48 }, { "name": "Rock Elemental", "value": 3.18, "is_gather_eff": true, "rank": 49 }, { "name": "Raptor", "value": 2.93, "is_gather_eff": true, "rank": 55 }, { "name": "Daeodon", "value": 2.91, "is_gather_eff": true, "rank": 56 }, { "name": "Dunkleosteus", "value": 2.52, "is_gather_eff": true, "rank": 65 }, { "name": "Thylacoleo", "value": 4.1, "is_gather_eff": true, "rank": 6 }, { "name": "Rex", "value": 3.95, "is_gather_eff": true, "rank": 11 }, { "name": "Andrewsarchus", "value": 4.22, "is_gather_eff": true, "rank": 4 }, { "name": "Baryonyx", "value": 3.38, "is_gather_eff": true, "rank": 37 }, { "name": "Quetzal", "value": 2.86, "is_gather_eff": true, "rank": 58 }, { "name": "Purlovia", "value": 3.26, "is_gather_eff": true, "rank": 43 }, { "name": "Tusoteuthis", "value": 3.25, "is_gather_eff": true, "rank": 44 }, { "name": "Tropeognathus", "value": 3.64, "is_gather_eff": true, "rank": 25 }, { "name": "Basilosaurus", "value": 3.1, "is_gather_eff": true, "rank": 51 }, { "name": "Electrophorus", "value": 2.87, "is_gather_eff": true, "rank": 57 }, { "name": "Compy", "value": 1.84, "is_gather_eff": true, "rank": 71 }, { "name": "Sabertooth", "value": 3.96, "is_gather_eff": true, "rank": 10 }, { "name": "Yutyrannus", "value": 4.04, "is_gather_eff": true, "rank": 7 }, { "name": "Sarco", "value": 3.44, "is_gather_eff": true, "rank": 36 }, { "name": "Hyaenodon", "value": 3.49, "is_gather_eff": true, "rank": 33 }, { "name": "Therizinosaurus", "value": 3.87, "is_gather_eff": true, "rank": 14 }, { "name": "Fenrir", "value": 4.32, "is_gather_eff": true, "rank": 3 }, { "name": "Spinosaurus", "value": 3.63, "is_gather_eff": true, "rank": 26 }, { "name": "Diplocaulus", "value": 2.76, "is_gather_eff": true, "rank": 63 }, { "name": "Wyvern", "value": 3.82, "is_gather_eff": true, "rank": 16 }, { "name": "Tapejara", "value": 3.13, "is_gather_eff": true, "rank": 50 }, { "name": "Moschops", "value": 3.24, "is_gather_eff": true, "rank": 46 }, { "name": "Dilophosaur", "value": 2.2, "is_gather_eff": true, "rank": 69 }, { "name": "Arthropluera", "value": 2.85, "is_gather_eff": true, "rank": 60 }, { "name": "Deinonychus", "value": 3, "is_gather_eff": true, "rank": 52 }, { "name": "Pulmonoscorpius", "value": 2.29, "is_gather_eff": true, "rank": 68 }, { "name": "Magmasaur", "value": 3.55, "is_gather_eff": true, "rank": 30 }, { "name": "Reaper", "value": 3.89, "is_gather_eff": true, "rank": 13 }, { "name": "Plesiosaur", "value": 3.25, "is_gather_eff": true, "rank": 44 }, { "name": "Crystal Wyvern", "value": 3.82, "is_gather_eff": true, "rank": 16 }, { "name": "Pelagornis", "value": 2.47, "is_gather_eff": true, "rank": 66 }, { "name": "Basilisk", "value": 3.46, "is_gather_eff": true, "rank": 35 }, { "name": "Bloodstalker", "value": 3.47, "is_gather_eff": true, "rank": 34 }, { "name": "Ravager", "value": 3.59, "is_gather_eff": true, "rank": 28 }, { "name": "Karkinos", "value": 3.55, "is_gather_eff": true, "rank": 30 }, { "name": "Gacha", "value": 3.28, "is_gather_eff": true, "rank": 42 }, { "name": "Managarmr", "value": 3.86, "is_gather_eff": true, "rank": 15 }, { "name": "Shadowmane", "value": 3.99, "is_gather_eff": true, "rank": 9 }, { "name": "Snow Owl", "value": 3.5, "is_gather_eff": true, "rank": 32 }, { "name": "Rock Drake", "value": 3.75, "is_gather_eff": true, "rank": 20 }, { "name": "Velonasaur", "value": 4.03, "is_gather_eff": true, "rank": 8 }, { "name": "Voidwyrm", "value": 3.82, "is_gather_eff": true, "rank": 16 }, { "name": "Allosaurus", "value": 3.68, "is_gather_eff": true, "rank": 22 }, { "name": "Dimorphodon", "value": 2.05, "is_gather_eff": true, "rank": 70 }, { "name": "Giganotosaurus", "value": 4.41, "is_gather_eff": true, "rank": 1 }, { "name": "Griffin", "value": 3.66, "is_gather_eff": true, "rank": 23 }, { "name": "Megalodon", "value": 2.65, "is_gather_eff": true, "rank": 64 }, { "name": "Megatherium", "value": 3.35, "is_gather_eff": true, "rank": 40 }, { "name": "Mosasaurus", "value": 3.57, "is_gather_eff": true, "rank": 29 }, { "name": "Pteranodon", "value": 2.83, "is_gather_eff": true, "rank": 61 }, { "name": "Mantis", "value": 3.93, "is_gather_eff": true, "rank": 12 }, { "name": "Vulture", "value": 2.86, "is_gather_eff": true, "rank": 58 }] }
export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Item not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  // <div className="rw-cell-error">{error?.message}</div>
  <Item item={item} />
)

export const Success = ({ item }: CellSuccessProps<FindItemById>) => {
  return <Item item={item} />
}
