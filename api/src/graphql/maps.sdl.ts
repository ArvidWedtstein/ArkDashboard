export const schema = gql`
  type Map {
    id: BigInt!
    created_at: DateTime
    name: String
    img: String
    Basespot: [Basespot]!
    Lootcrate: [Lootcrate]!
    MapCoordinate: [MapCoordinate]!
    MapNote: [MapNote]!
    TimelineBasespot: [TimelineBasespot]!
  }

  type Query {
    maps: [Map!]! @skipAuth
    map(id: BigInt!): Map @skipAuth
  }

  input CreateMapInput {
    created_at: DateTime
    name: String
    img: String
  }

  input UpdateMapInput {
    created_at: DateTime
    name: String
    img: String
  }

  type Mutation {
    createMap(input: CreateMapInput!): Map! @requireAuth
    updateMap(id: BigInt!, input: UpdateMapInput!): Map! @requireAuth
    deleteMap(id: BigInt!): Map! @requireAuth
  }
`;
