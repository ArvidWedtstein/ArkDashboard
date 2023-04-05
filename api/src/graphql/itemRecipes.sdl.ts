export const schema = gql`
  type ItemRecipe {
    id: String!
    created_at: DateTime
    updated_at: DateTime
    item_id: BigInt!
    amount: Float!
    crafted_item_id: BigInt!
    crafting_station: BigInt
    Item_ItemRecipe_crafted_item_idToItem: Item!
    Item_ItemRecipe_crafting_stationToItem: Item
    Item_ItemRecipe_item_idToItem: Item!
  }

  type Query {
    itemRecipes: [ItemRecipe!]! @requireAuth
    itemRecipe(id: String!): ItemRecipe @requireAuth
  }

  input CreateItemRecipeInput {
    created_at: DateTime
    updated_at: DateTime
    item_id: BigInt!
    amount: Float!
    crafted_item_id: BigInt!
    crafting_station: BigInt
  }

  input UpdateItemRecipeInput {
    created_at: DateTime
    updated_at: DateTime
    item_id: BigInt
    amount: Float
    crafted_item_id: BigInt
    crafting_station: BigInt
  }

  type Mutation {
    createItemRecipe(input: CreateItemRecipeInput!): ItemRecipe! @requireAuth
    updateItemRecipe(id: String!, input: UpdateItemRecipeInput!): ItemRecipe!
      @requireAuth
    deleteItemRecipe(id: String!): ItemRecipe! @requireAuth
  }
`
