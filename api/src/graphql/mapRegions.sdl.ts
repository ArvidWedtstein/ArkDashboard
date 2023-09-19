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
    mapRegions: [MapRegion!]! @requireAuth
    mapRegion(id: BigInt!): MapRegion @requireAuth
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
    createMapRegion(input: CreateMapRegionInput!): MapRegion! @requireAuth
    updateMapRegion(id: BigInt!, input: UpdateMapRegionInput!): MapRegion!
      @requireAuth
    deleteMapRegion(id: BigInt!): MapRegion! @requireAuth
  }
`
