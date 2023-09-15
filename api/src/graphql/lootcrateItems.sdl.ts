export const schema = gql`
  type LootcrateItem {
    id: BigInt!
    created_at: DateTime!
    updated_at: DateTime
    lootcrate_id: BigInt!
    item_id: BigInt
    type: String
    set_name: String
    entry_name: String
    set_weight: Float
    entry_weight: Float
    set_qty_scale: JSON
    entry_qty: JSON
    entry_quality: JSON
    set_can_repeat_items: Boolean
    bp_chance: Float
    Item: Item
    Lootcrate: Lootcrate!
  }

  type Query {
    lootcrateItems: [LootcrateItem!]! @skipAuth
    lootcrateItem(id: BigInt!): LootcrateItem @skipAuth
  }

  input CreateLootcrateItemInput {
    created_at: DateTime!
    updated_at: DateTime
    lootcrate_id: BigInt!
    item_id: BigInt
    type: String
    set_name: String
    entry_name: String
    set_weight: Float
    entry_weight: Float
    set_qty_scale: JSON
    entry_qty: JSON
    entry_quality: JSON
    set_can_repeat_items: Boolean
    bp_chance: Float
  }

  input UpdateLootcrateItemInput {
    created_at: DateTime
    updated_at: DateTime
    lootcrate_id: BigInt
    item_id: BigInt
    type: String
    set_name: String
    entry_name: String
    set_weight: Float
    entry_weight: Float
    set_qty_scale: JSON
    entry_qty: JSON
    entry_quality: JSON
    set_can_repeat_items: Boolean
    bp_chance: Float
  }

  type Mutation {
    createLootcrateItem(input: CreateLootcrateItemInput!): LootcrateItem!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateLootcrateItem(
      id: BigInt!
      input: UpdateLootcrateItemInput!
    ): LootcrateItem! @requireAuth @hasPermission(permission: "gamedata_update")
    deleteLootcrateItem(id: BigInt!): LootcrateItem!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
