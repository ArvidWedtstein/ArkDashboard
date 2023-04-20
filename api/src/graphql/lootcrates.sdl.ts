export const schema = gql`
  type Lootcrate {
    id: String!
    created_at: DateTime
    updated_at: DateTime
    blueprint: String!
    name: String
    map: BigInt!
    level_requirement: JSON
    decay_time: JSON
    no_repeat_in_sets: Boolean
    quality_multiplier: JSON
    set_qty: JSON
    color: String
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
    map: BigInt!
    level_requirement: JSON
    decay_time: JSON
    no_repeat_in_sets: Boolean
    quality_multiplier: JSON
    set_qty: JSON
    color: String
  }

  input UpdateLootcrateInput {
    created_at: DateTime
    updated_at: DateTime
    blueprint: String
    name: String
    map: BigInt
    level_requirement: JSON
    decay_time: JSON
    no_repeat_in_sets: Boolean
    quality_multiplier: JSON
    set_qty: JSON
    color: String
  }

  type Mutation {
    createLootcrate(input: CreateLootcrateInput!): Lootcrate! @requireAuth
    updateLootcrate(id: String!, input: UpdateLootcrateInput!): Lootcrate!
      @requireAuth
    deleteLootcrate(id: String!): Lootcrate! @requireAuth
  }
`;
