export const schema = gql`
  type ItemRecipe {
    id: String!
    created_at: DateTime!
    updated_at: DateTime
    crafted_item_id: BigInt!
    crafting_station_id: BigInt
    crafting_time: Float
    yields: Float!
    required_level: BigInt
    Item_ItemRecipe_crafted_item_idToItem: Item!
    Item_ItemRecipe_crafting_station_idToItem: Item
    ItemRecipeItem: [ItemRecipeItem]!
    UserRecipeItemRecipe: [UserRecipeItemRecipe]!
  }

  type Query {
    itemRecipes: [ItemRecipe] @skipAuth
    itemRecipe(id: String!): ItemRecipe @skipAuth
    itemRecipesByItem(crafted_item_id: BigInt!): [ItemRecipe!]! @skipAuth
    itemRecipesByCraftingStations(crafting_stations: [Int]): [ItemRecipe!]!
      @skipAuth
  }

  input CreateItemRecipeInput {
    created_at: DateTime!
    updated_at: DateTime
    crafted_item_id: BigInt!
    crafting_station_id: BigInt
    crafting_time: Float
    yields: Float!
    required_level: BigInt
  }

  input UpdateItemRecipeInput {
    created_at: DateTime
    updated_at: DateTime
    crafted_item_id: BigInt
    crafting_station_id: BigInt
    crafting_time: Float
    yields: Float
    required_level: BigInt
  }

  type Mutation {
    createItemRecipe(input: CreateItemRecipeInput!): ItemRecipe!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateItemRecipe(id: String!, input: UpdateItemRecipeInput!): ItemRecipe!
      @requireAuth
      @hasPermission(permission: "gamedata_update")
    deleteItemRecipe(id: String!): ItemRecipe!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
