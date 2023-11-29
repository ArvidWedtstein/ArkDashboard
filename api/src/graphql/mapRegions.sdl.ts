export const schema = gql`
  type MapRegion {
    id: BigInt!
    created_at: DateTime
    updated_at: DateTime
    name: String
    map_id: BigInt!
    wind: Float
    temperature: Float
    priority: BigInt
    outside: Boolean
    start_x: Float
    start_y: Float
    start_z: Float
    end_x: Float
    end_y: Float
    end_z: Float
    Map: Map!
  }

  type Query {
    mapRegions: [MapRegion!]! @skipAuth
    mapRegion(id: BigInt!): MapRegion @skipAuth
    mapRegionsByMap(map_id: BigInt!): [MapRegion]! @skipAuth
  }

  input CreateMapRegionInput {
    created_at: DateTime
    updated_at: DateTime
    name: String
    map_id: BigInt!
    wind: Float
    temperature: Float
    priority: BigInt
    outside: Boolean
    start_x: Float
    start_y: Float
    start_z: Float
    end_x: Float
    end_y: Float
    end_z: Float
  }

  input UpdateMapRegionInput {
    created_at: DateTime
    updated_at: DateTime
    name: String
    map_id: BigInt
    wind: Float
    temperature: Float
    priority: BigInt
    outside: Boolean
    start_x: Float
    start_y: Float
    start_z: Float
    end_x: Float
    end_y: Float
    end_z: Float
  }

  type Mutation {
    createMapRegion(input: CreateMapRegionInput!): MapRegion!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateMapRegion(id: BigInt!, input: UpdateMapRegionInput!): MapRegion!
      @requireAuth
      @hasPermission(permission: "gamedata_update")
    deleteMapRegion(id: BigInt!): MapRegion!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
