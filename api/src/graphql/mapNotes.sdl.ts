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
    mapNotes: [MapNote!]! @requireAuth
    mapNote(id: String!): MapNote @requireAuth
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
    createMapNote(input: CreateMapNoteInput!): MapNote! @requireAuth
    updateMapNote(id: String!, input: UpdateMapNoteInput!): MapNote!
      @requireAuth
    deleteMapNote(id: String!): MapNote! @requireAuth
  }
`
