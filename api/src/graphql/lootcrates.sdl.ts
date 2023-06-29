export const schema = gql`
  type Lootcrate {
    id: String!
    created_at: DateTime
    updated_at: DateTime
    blueprint: String!
    name: String
    map_id: BigInt!
    level_requirement: JSON
    decay_time: JSON
    no_repeat_in_sets: Boolean
    quality_multiplier: JSON
    set_qty: JSON
    color: String
    latitude: Float
    longitude: Float
    Map: Map!
    LootcrateSet: [LootcrateSet]!
  }

  type Query {
    lootcrates: [Lootcrate!]! @skipAuth
    lootcrate(id: String!): Lootcrate @skipAuth
    lootcratesByMap(map: String): [Lootcrate!]! @skipAuth
  }

  input CreateLootcrateInput {
    created_at: DateTime
    updated_at: DateTime
    blueprint: String!
    name: String
    map_id: BigInt!
    level_requirement: JSON
    decay_time: JSON
    no_repeat_in_sets: Boolean
    quality_multiplier: JSON
    set_qty: JSON
    color: String
    latitude: Float
    longitude: Float
  }

  input UpdateLootcrateInput {
    created_at: DateTime
    updated_at: DateTime
    blueprint: String
    name: String
    map_id: BigInt
    level_requirement: JSON
    decay_time: JSON
    no_repeat_in_sets: Boolean
    quality_multiplier: JSON
    set_qty: JSON
    color: String
    latitude: Float
    longitude: Float
  }

  type Mutation {
    createLootcrate(input: CreateLootcrateInput!): Lootcrate!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateLootcrate(id: String!, input: UpdateLootcrateInput!): Lootcrate!
      @requireAuth
      @hasPermission(permission: "gamedata_update")
    deleteLootcrate(id: String!): Lootcrate!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
