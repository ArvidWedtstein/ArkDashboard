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
    itemRecipes: [ItemRecipe!]! @requireAuth
    itemRecipe(id: String!): ItemRecipe @requireAuth
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
    createItemRecipe(input: CreateItemRecipeInput!): ItemRecipe! @requireAuth
    updateItemRecipe(id: String!, input: UpdateItemRecipeInput!): ItemRecipe!
      @requireAuth
    deleteItemRecipe(id: String!): ItemRecipe! @requireAuth
  }
`
