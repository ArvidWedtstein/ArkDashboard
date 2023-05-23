export const schema = gql`
  type MapNote {
    id: String!
    created_at: DateTime
    updated_at: DateTime
    map_id: BigInt!
    latitude: Float!
    longitude: Float!
    x: Float
    y: Float
    z: Float
    note_index: BigInt
    Map: Map!
  }

  type Query {
    mapNotes: [MapNote!]! @skipAuth
    mapNote(id: String!): MapNote @skipAuth
  }

  input CreateMapNoteInput {
    created_at: DateTime
    updated_at: DateTime
    map_id: BigInt!
    latitude: Float!
    longitude: Float!
    x: Float
    y: Float
    z: Float
    note_index: BigInt
  }

  input UpdateMapNoteInput {
    created_at: DateTime
    updated_at: DateTime
    map_id: BigInt
    latitude: Float
    longitude: Float
    x: Float
    y: Float
    z: Float
    note_index: BigInt
  }

  type Mutation {
    createMapNote(input: CreateMapNoteInput!): MapNote!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateMapNote(id: String!, input: UpdateMapNoteInput!): MapNote!
      @requireAuth
      @hasPermission(permission: "gamedata_update")
    deleteMapNote(id: String!): MapNote!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
