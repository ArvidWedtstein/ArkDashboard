export const schema = gql`
  type MapResource {
    id: BigInt!
    created_at: DateTime!
    updated_at: DateTime
    map_id: BigInt!
    item_id: BigInt
    latitude: Float
    longitude: Float
    x: Float
    y: Float
    z: Float
    type: String
    note_index: BigInt
    Item: Item
    Map: Map!
  }

  type Query {
    mapResources: [MapResource!]! @skipAuth
    mapResource(id: BigInt!): MapResource @skipAuth
    mapResourcesByMap(map_id: BigInt, item_id: BigInt): [MapResource] @skipAuth
  }

  input CreateMapResourceInput {
    created_at: DateTime!
    updated_at: DateTime
    map_id: BigInt!
    item_id: BigInt
    latitude: Float
    longitude: Float
    x: Float
    y: Float
    z: Float
    type: String
    note_index: BigInt
  }

  input UpdateMapResourceInput {
    created_at: DateTime
    updated_at: DateTime
    map_id: BigInt
    item_id: BigInt
    latitude: Float
    longitude: Float
    x: Float
    y: Float
    z: Float
    type: String
    note_index: BigInt
  }

  type Mutation {
    createMapResource(input: CreateMapResourceInput!): MapResource!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateMapResource(
      id: BigInt!
      input: UpdateMapResourceInput!
    ): MapResource! @requireAuth @hasPermission(permission: "gamedata_update")
    deleteMapResource(id: BigInt!): MapResource!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
