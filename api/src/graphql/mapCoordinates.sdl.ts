export const schema = gql`
  type MapCoordinate {
    id: String!
    created_at: DateTime
    updated_at: DateTime
    latitude: Float
    longitude: Float
    x: Float
    y: Float
    z: Float
    type: String
    map_id: BigInt!
    Map: Map!
  }

  type Query {
    mapCoordinates: [MapCoordinate!]! @requireAuth
    mapCoordinate(id: String!): MapCoordinate @requireAuth
  }

  input CreateMapCoordinateInput {
    created_at: DateTime
    updated_at: DateTime
    latitude: Float
    longitude: Float
    x: Float
    y: Float
    z: Float
    type: String
    map_id: BigInt!
  }

  input UpdateMapCoordinateInput {
    created_at: DateTime
    updated_at: DateTime
    latitude: Float
    longitude: Float
    x: Float
    y: Float
    z: Float
    type: String
    map_id: BigInt
  }

  type Mutation {
    createMapCoordinate(input: CreateMapCoordinateInput!): MapCoordinate!
      @requireAuth
    updateMapCoordinate(
      id: String!
      input: UpdateMapCoordinateInput!
    ): MapCoordinate! @requireAuth
    deleteMapCoordinate(id: String!): MapCoordinate! @requireAuth
  }
`
