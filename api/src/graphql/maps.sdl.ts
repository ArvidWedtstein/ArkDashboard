export const schema = gql`
  type Map {
    id: BigInt!
    created_at: DateTime
    name: String!
    img: String
    updated_at: DateTime
    icon: String
    release_date: DateTime
    parent_map_id: BigInt
    description: String
    topographic_img: String
    boundaries: String
    cord_shift_lat: Float
    cord_shift_lon: Float
    cord_mult_lat: Float
    cord_mult_lon: Float
    Basespot: [Basespot]!
    LootcrateMap: [LootcrateMap]!
    Map: Map
    other_Map: [Map]!
    MapRegion: [MapRegion]!
    MapResource: [MapResource]!
    TimelineSeasonBasespot: [TimelineSeasonBasespot]!
    TimelineSeasonEvent: [TimelineSeasonEvent]!
  }

  type Query {
    maps: [Map!]! @requireAuth
    map(id: BigInt!): Map @requireAuth
  }

  input CreateMapInput {
    created_at: DateTime
    name: String!
    img: String
    updated_at: DateTime
    icon: String
    release_date: DateTime
    parent_map_id: BigInt
    description: String
    topographic_img: String
    boundaries: String
    cord_shift_lat: Float
    cord_shift_lon: Float
    cord_mult_lat: Float
    cord_mult_lon: Float
  }

  input UpdateMapInput {
    created_at: DateTime
    name: String
    img: String
    updated_at: DateTime
    icon: String
    release_date: DateTime
    parent_map_id: BigInt
    description: String
    topographic_img: String
    boundaries: String
    cord_shift_lat: Float
    cord_shift_lon: Float
    cord_mult_lat: Float
    cord_mult_lon: Float
  }

  type Mutation {
    createMap(input: CreateMapInput!): Map!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateMap(id: BigInt!, input: UpdateMapInput!): Map!
      @requireAuth
      @hasPermission(permission: "gamedata_update")
    deleteMap(id: BigInt!): Map!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
