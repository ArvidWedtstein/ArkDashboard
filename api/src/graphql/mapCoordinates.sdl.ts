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
    mapCoordinates: [MapCoordinate!]! @skipAuth
    mapCoordinate(id: String!): MapCoordinate @skipAuth
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
      @hasPermission(permission: "gamedata_create")
    updateMapCoordinate(
      id: String!
      input: UpdateMapCoordinateInput!
    ): MapCoordinate! @requireAuth @hasPermission(permission: "gamedata_update")
    deleteMapCoordinate(id: String!): MapCoordinate!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
