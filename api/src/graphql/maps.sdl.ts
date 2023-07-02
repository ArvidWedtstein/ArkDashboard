export const schema = gql`
  type Map {
    id: BigInt!
    created_at: DateTime
    name: String!
    img: String
    updated_at: DateTime
    icon: String
    Basespot: [Basespot]!
    Lootcrate: [Lootcrate]!
    MapCoordinate: [MapCoordinate]!
    MapNote: [MapNote]!
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
  }

  input UpdateMapInput {
    created_at: DateTime
    name: String
    img: String
    updated_at: DateTime
    icon: String
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
