export const schema = gql`
  type ItemRecipe {
    id: BigInt!
    crafted_item_id: BigInt!
    crafting_station_id: BigInt
    crafting_time: Float
    yields: Float!
    required_level: BigInt
    xp: Float
    skill_quality_multiplier_min: Float
    skill_quality_multiplier_max: Float
    Item_ItemRecipe_crafted_item_idToItem: Item!
    Item_ItemRecipe_crafting_station_idToItem: Item
    ItemRecipeItem: [ItemRecipeItem]!
    UserRecipeItemRecipe: [UserRecipeItemRecipe]!
  }

  type Query {
    itemRecipes: [ItemRecipe] @skipAuth
    itemRecipe(id: BigInt!): ItemRecipe @skipAuth
    itemRecipesByItem(crafted_item_id: BigInt!): [ItemRecipe!]! @skipAuth
    itemRecipesByCraftingStations(crafting_stations: [Int]): [ItemRecipe!]!
      @skipAuth
  }

  input CreateItemRecipeInput {
    crafted_item_id: BigInt!
    crafting_station_id: BigInt
    crafting_time: Float
    yields: Float!
    required_level: BigInt
    xp: Float
    skill_quality_multiplier_min: Float
    skill_quality_multiplier_max: Float
  }

  input UpdateItemRecipeInput {
    crafted_item_id: BigInt
    crafting_station_id: BigInt
    crafting_time: Float
    yields: Float
    required_level: BigInt
    xp: Float
    skill_quality_multiplier_min: Float
    skill_quality_multiplier_max: Float
  }

  type Mutation {
    createItemRecipe(input: CreateItemRecipeInput!): ItemRecipe!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateItemRecipe(id: BigInt!, input: UpdateItemRecipeInput!): ItemRecipe!
      @requireAuth
      @hasPermission(permission: "gamedata_update")
    deleteItemRecipe(id: BigInt!): ItemRecipe!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
