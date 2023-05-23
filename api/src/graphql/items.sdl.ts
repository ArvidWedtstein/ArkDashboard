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
    type: String
    category: String!
    health: Float
    Dino: [Dino]!
    DinoStat: [DinoStat]!
    ItemRec_ItemRec_crafted_item_idToItem: [ItemRec]!
    ItemRec_ItemRec_crafting_station_idToItem: [ItemRec]!
    ItemRecipe_ItemRecipe_crafted_item_idToItem: [ItemRecipe]!
    ItemRecipe_ItemRecipe_crafting_stationToItem: [ItemRecipe]!
    ItemRecipe_ItemRecipe_item_idToItem: [ItemRecipe]!
    ItemRecipeItem: [ItemRecipeItem]!
    LootcrateSetEntryItem: [LootcrateSetEntryItem]!
  }

  type ItemsPage {
    items: [Item!]!
    count: Int!
  }
  type Query {
    items: [Item!]! @skipAuth
    item(id: BigInt!): Item @skipAuth
    itemsPage(
      page: Int
      search: String
      category: String
      type: String
    ): ItemsPage @skipAuth
    itemsByCategory(category: String!): ItemsPage @skipAuth
    itemsByIds(id: [BigInt!]!): [Item!]! @skipAuth
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
    health: Float
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
    type: String
    category: String
    health: Float
    ItemRecipe_ItemRecipe_crafted_item_idToItem: JSON
  }

  type Mutation {
    createItem(input: CreateItemInput!): Item!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateItem(id: BigInt!, input: UpdateItemInput!): Item!
      @requireAuth
      @hasPermission(permission: "gamedata_update")
    deleteItem(id: BigInt!): Item!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
