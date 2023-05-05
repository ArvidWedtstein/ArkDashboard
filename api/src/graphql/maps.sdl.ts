export const schema = gql`
  type Map {
    id: BigInt!
    created_at: DateTime
    name: String
    oil_veins: JSON
    water_veins: JSON
    wyvern_nests: JSON
    ice_wyvern_nests: JSON
    gas_veins: JSON
    deinonychus_nests: JSON
    charge_nodes: JSON
    plant_z_nodes: JSON
    drake_nests: JSON
    glitches: JSON
    magmasaur_nests: JSON
    mutagen_bulbs: JSON
    notes: JSON
    img: String
    Basespot: [Basespot]!
    Lootcrate: [Lootcrate]!
    MapCoordinate: [MapCoordinate]!
    MapNote: [MapNote]!
    TimelineBasespot: [TimelineBasespot]!
  }

  type Query {
    maps: [Map!]! @requireAuth
    map(id: BigInt!): Map @requireAuth
  }

  input CreateMapInput {
    created_at: DateTime
    name: String
    oil_veins: JSON
    water_veins: JSON
    wyvern_nests: JSON
    ice_wyvern_nests: JSON
    gas_veins: JSON
    deinonychus_nests: JSON
    charge_nodes: JSON
    plant_z_nodes: JSON
    drake_nests: JSON
    glitches: JSON
    magmasaur_nests: JSON
    mutagen_bulbs: JSON
    notes: JSON
    img: String
  }

  input UpdateMapInput {
    created_at: DateTime
    name: String
    oil_veins: JSON
    water_veins: JSON
    wyvern_nests: JSON
    ice_wyvern_nests: JSON
    gas_veins: JSON
    deinonychus_nests: JSON
    charge_nodes: JSON
    plant_z_nodes: JSON
    drake_nests: JSON
    glitches: JSON
    magmasaur_nests: JSON
    mutagen_bulbs: JSON
    notes: JSON
    img: String
  }

  type Mutation {
    createMap(input: CreateMapInput!): Map! @requireAuth
    updateMap(id: BigInt!, input: UpdateMapInput!): Map! @requireAuth
    deleteMap(id: BigInt!): Map! @requireAuth
  }
`
