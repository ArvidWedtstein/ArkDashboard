export const schema = gql`
  type LootcrateSetEntryItem {
    id: String!
    created_at: DateTime
    updated_at: DateTime
    entry_id: String!
    item_id: BigInt!
    value: Float
    LootcrateSetEntry: LootcrateSetEntry!
    Item: Item!
  }

  type Query {
    lootcrateSetEntryItems: [LootcrateSetEntryItem!]! @skipAuth
    lootcrateSetEntryItem(id: String!): LootcrateSetEntryItem @skipAuth
  }

  input CreateLootcrateSetEntryItemInput {
    created_at: DateTime
    updated_at: DateTime
    entry_id: String!
    item_id: BigInt!
    value: Float
  }

  input UpdateLootcrateSetEntryItemInput {
    created_at: DateTime
    updated_at: DateTime
    entry_id: String
    item_id: BigInt
    value: Float
  }

  type Mutation {
    createLootcrateSetEntryItem(
      input: CreateLootcrateSetEntryItemInput!
    ): LootcrateSetEntryItem!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateLootcrateSetEntryItem(
      id: String!
      input: UpdateLootcrateSetEntryItemInput!
    ): LootcrateSetEntryItem!
      @requireAuth
      @hasPermission(permission: "gamedata_update")
    deleteLootcrateSetEntryItem(id: String!): LootcrateSetEntryItem!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
