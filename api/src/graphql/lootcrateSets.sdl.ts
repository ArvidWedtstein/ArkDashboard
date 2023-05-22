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
    updateLootcrateSet(
      id: String!
      input: UpdateLootcrateSetInput!
    ): LootcrateSet! @requireAuth
    deleteLootcrateSet(id: String!): LootcrateSet! @requireAuth
  }
`;
