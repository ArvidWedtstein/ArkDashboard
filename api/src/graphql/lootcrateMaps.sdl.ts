export const schema = gql`
  type LootcrateMap {
    id: BigInt!
    created_at: DateTime!
    updated_at: DateTime
    lootcrate_id: BigInt!
    map_id: BigInt!
    positions: JSON
    description: String
    Lootcrate: Lootcrate!
    Map: Map!
  }

  type Query {
    lootcrateMaps: [LootcrateMap!]! @skipAuth
    lootcrateMap(id: BigInt!): LootcrateMap @skipAuth
  }

  input CreateLootcrateMapInput {
    created_at: DateTime!
    updated_at: DateTime
    lootcrate_id: BigInt!
    map_id: BigInt!
    positions: JSON
    description: String
  }

  input UpdateLootcrateMapInput {
    created_at: DateTime
    updated_at: DateTime
    lootcrate_id: BigInt
    map_id: BigInt
    positions: JSON
    description: String
  }

  type Mutation {
    createLootcrateMap(input: CreateLootcrateMapInput!): LootcrateMap!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateLootcrateMap(
      id: BigInt!
      input: UpdateLootcrateMapInput!
    ): LootcrateMap! @requireAuth @hasPermission(permission: "gamedata_update")
    deleteLootcrateMap(id: BigInt!): LootcrateMap!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
