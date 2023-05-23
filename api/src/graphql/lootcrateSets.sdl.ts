export const schema = gql`
  type LootcrateSet {
    id: String!
    created_at: DateTime
    lootcrate_id: String!
    name: String
    can_repeat_items: Boolean
    qty_scale: JSON
    weight: BigInt
    Lootcrate: Lootcrate!
    LootcrateSetEntry: [LootcrateSetEntry]!
  }

  type Query {
    lootcrateSets: [LootcrateSet!]! @skipAuth
    lootcrateSet(id: String!): LootcrateSet @skipAuth
  }

  input CreateLootcrateSetInput {
    created_at: DateTime
    lootcrate_id: String!
    name: String
    can_repeat_items: Boolean
    qty_scale: JSON
    weight: BigInt
  }

  input UpdateLootcrateSetInput {
    created_at: DateTime
    lootcrate_id: String
    name: String
    can_repeat_items: Boolean
    qty_scale: JSON
    weight: BigInt
  }

  type Mutation {
    createLootcrateSet(input: CreateLootcrateSetInput!): LootcrateSet!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateLootcrateSet(
      id: String!
      input: UpdateLootcrateSetInput!
    ): LootcrateSet! @requireAuth @hasPermission(permission: "gamedata_update")
    deleteLootcrateSet(id: String!): LootcrateSet!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
