export const schema = gql`
  type LootcrateSetEntry {
    id: String!
    created_at: DateTime
    set_id: String!
    name: String
    weight: Float
    qty: JSON
    quality: JSON
    LootcrateSet: LootcrateSet!
    LootcrateSetEntryItem: [LootcrateSetEntryItem]!
  }

  type Query {
    lootcrateSetEntries: [LootcrateSetEntry!]! @requireAuth
    lootcrateSetEntry(id: String!): LootcrateSetEntry @requireAuth
  }

  input CreateLootcrateSetEntryInput {
    created_at: DateTime
    set_id: String!
    name: String
    weight: Float
    qty: JSON
    quality: JSON
  }

  input UpdateLootcrateSetEntryInput {
    created_at: DateTime
    set_id: String
    name: String
    weight: Float
    qty: JSON
    quality: JSON
  }

  type Mutation {
    createLootcrateSetEntry(
      input: CreateLootcrateSetEntryInput!
    ): LootcrateSetEntry! @requireAuth
    updateLootcrateSetEntry(
      id: String!
      input: UpdateLootcrateSetEntryInput!
    ): LootcrateSetEntry! @requireAuth
    deleteLootcrateSetEntry(id: String!): LootcrateSetEntry! @requireAuth
  }
`
