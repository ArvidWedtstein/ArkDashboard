export const schema = gql`
  type ItemRecipe {
    id: String!
    created_at: DateTime
    updated_at: DateTime
    item_id: BigInt!
    amount: Float!
    yields: Float
    crafted_item_id: BigInt!
    crafting_station: BigInt
    Item_ItemRecipe_crafted_item_idToItem: Item!
    Item_ItemRecipe_crafting_stationToItem: Item
    Item_ItemRecipe_item_idToItem: Item!
  }

  type Query {
    itemRecipes: [ItemRecipe!]! @skipAuth
    itemRecipe(id: String!): ItemRecipe @skipAuth
  }

  input CreateItemRecipeInput {
    created_at: DateTime
    updated_at: DateTime
    item_id: BigInt!
    amount: Float!
    yields: Float
    crafted_item_id: BigInt!
    crafting_station: BigInt
  }

  input UpdateItemRecipeInput {
    created_at: DateTime
    updated_at: DateTime
    item_id: BigInt
    amount: Float
    yields: Float
    crafted_item_id: BigInt
    crafting_station: BigInt
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
