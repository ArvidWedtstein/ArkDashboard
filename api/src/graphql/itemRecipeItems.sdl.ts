export const schema = gql`
  type ItemRecipeItem {
    id: String!
    created_at: DateTime!
    updated_at: DateTime
    item_recipe_id: String!
    item_id: BigInt!
    amount: Float!
    Item: Item!
    ItemRecipe: ItemRecipe!
  }

  type Query {
    itemRecipeItems: [ItemRecipeItem!]! @skipAuth
    itemRecipeItem(id: String!): ItemRecipeItem @skipAuth
  }

  input CreateItemRecipeItemInput {
    created_at: DateTime!
    updated_at: DateTime
    item_recipe_id: String!
    item_id: BigInt!
    amount: Float!
  }

  input UpdateItemRecipeItemInput {
    created_at: DateTime
    updated_at: DateTime
    item_recipe_id: String
    item_id: BigInt
    amount: Float
  }

  type Mutation {
    createItemRecipeItem(input: CreateItemRecipeItemInput!): ItemRecipeItem!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateItemRecipeItem(
      id: String!
      input: UpdateItemRecipeItemInput!
    ): ItemRecipeItem!
      @requireAuth
      @hasPermission(permission: "gamedata_update")
    deleteItemRecipeItem(id: String!): ItemRecipeItem!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
