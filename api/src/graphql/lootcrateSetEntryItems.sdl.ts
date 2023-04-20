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
    lootcrateSetEntryItems: [LootcrateSetEntryItem!]! @requireAuth
    lootcrateSetEntryItem(id: String!): LootcrateSetEntryItem @requireAuth
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
    ): LootcrateSetEntryItem! @requireAuth
    updateLootcrateSetEntryItem(
      id: String!
      input: UpdateLootcrateSetEntryItemInput!
    ): LootcrateSetEntryItem! @requireAuth
    deleteLootcrateSetEntryItem(id: String!): LootcrateSetEntryItem!
      @requireAuth
  }
`
