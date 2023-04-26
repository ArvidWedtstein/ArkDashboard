export const schema = gql`
  type Item {
    id: BigInt!
    created_at: DateTime
    name: String!
    description: String
    image: String
    max_stack: Float
    weight: Float
    engram_points: Float
    crafting_time: Float
    req_level: BigInt
    yields: Float
    stats: JSON
    color: String
    crafted_in: [String]!
    type: String
    category: String!
    Dino: [Dino]!
    DinoStat: [DinoStat]!
    ItemRecipe_ItemRecipe_crafted_item_idToItem: [ItemRecipe]!
    ItemRecipe_ItemRecipe_crafting_stationToItem: [ItemRecipe]!
    ItemRecipe_ItemRecipe_item_idToItem: [ItemRecipe]!
    LootcrateSetEntryItem: [LootcrateSetEntryItem]!
  }

  type ItemsPage {
    items: [Item!]!
    count: Int!
  }
  type Query {
    items: [Item!]! @skipAuth
    item(id: BigInt!): Item @skipAuth
    itemsPage(page: Int): ItemsPage @skipAuth
    itemsByCategory(category: String!): ItemsPage @skipAuth
  }

  input CreateItemInput {
    created_at: DateTime
    name: String!
    description: String
    image: String
    max_stack: Float
    weight: Float
    engram_points: Float
    crafting_time: Float
    req_level: BigInt
    yields: Float
    stats: JSON
    color: String
    type: String
    category: String!
    ItemRecipe_ItemRecipe_crafted_item_idToItem: JSON
  }

  input UpdateItemInput {
    created_at: DateTime
    name: String
    description: String
    image: String
    max_stack: Float
    weight: Float
    engram_points: Float
    crafting_time: Float
    req_level: BigInt
    yields: Float
    stats: JSON
    color: String
    crafted_in: [String]!
    type: String
    category: String
  }

  type Mutation {
    createItem(input: CreateItemInput!): Item! @requireAuth
    updateItem(id: BigInt!, input: UpdateItemInput!): Item! @requireAuth
    deleteItem(id: BigInt!): Item! @requireAuth
  }
`;
