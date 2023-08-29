export const schema = gql`
  type Lootcrate {
    id: BigInt!
    created_at: DateTime!
    updated_at: DateTime
    name: String!
    blueprint: String
    required_level: BigInt
    quality_mult: JSON
    set_qty: JSON
    repeat_in_sets: Boolean
    color: String
    LootcrateItem: [LootcrateItem]!
    LootcrateMap: [LootcrateMap]!
  }

  type Query {
    lootcrates: [Lootcrate!]! @skipAuth
    lootcrate(id: BigInt!): Lootcrate @skipAuth
  }

  input CreateLootcrateInput {
    created_at: DateTime!
    updated_at: DateTime
    name: String!
    blueprint: String
    required_level: BigInt
    quality_mult: JSON
    set_qty: JSON
    repeat_in_sets: Boolean
    color: String
  }

  input UpdateLootcrateInput {
    created_at: DateTime
    updated_at: DateTime
    name: String
    blueprint: String
    required_level: BigInt
    quality_mult: JSON
    set_qty: JSON
    repeat_in_sets: Boolean
    color: String
  }

  type Mutation {
    createLootcrate(input: CreateLootcrateInput!): Lootcrate!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateLootcrate(id: BigInt!, input: UpdateLootcrateInput!): Lootcrate!
      @requireAuth
      @hasPermission(permission: "gamedata_update")
    deleteLootcrate(id: BigInt!): Lootcrate!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
