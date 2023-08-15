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
    Basespot: [Basespot]!
    Lootcrate: [Lootcrate]!
    Map: Map
    other_Map: [Map]!
    MapCoordinate: [MapCoordinate]!
    MapNote: [MapNote]!
    MapResource: [MapResource]!
    TimelineSeasonBasespot: [TimelineSeasonBasespot]!
    TimelineSeasonEvent: [TimelineSeasonEvent]!
  }

  type Query {
    maps: [Map!]! @skipAuth
    map(id: BigInt!): Map @skipAuth
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
