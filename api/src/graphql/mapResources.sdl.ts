export const schema = gql`
  type MapResource {
    id: BigInt!
    created_at: DateTime!
    updated_at: DateTime
    map_id: BigInt!
    item_id: BigInt
    latitude: Float
    longitude: Float
    type: String
    Item: Item
    Map: Map!
  }

  type Query {
    mapResources: [MapResource!]! @requireAuth
    mapResource(id: BigInt!): MapResource @requireAuth
  }

  input CreateMapResourceInput {
    created_at: DateTime!
    updated_at: DateTime
    map_id: BigInt!
    item_id: BigInt
    latitude: Float
    longitude: Float
    type: String
  }

  input UpdateMapResourceInput {
    created_at: DateTime
    updated_at: DateTime
    map_id: BigInt
    item_id: BigInt
    latitude: Float
    longitude: Float
    type: String
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
