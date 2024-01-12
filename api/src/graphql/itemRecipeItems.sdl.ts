export const schema = gql`
  type ItemRecipeItem {
    id: BigInt!
    item_recipe_id: BigInt!
    resource_item_id: BigInt!
    amount: Float!
    ItemRecipe: ItemRecipe!
    Item: Item!
  }

  type Query {
    itemRecipeItems: [ItemRecipeItem!]! @skipAuth
    itemRecipeItem(id: BigInt!): ItemRecipeItem @skipAuth
    itemRecipeItemsByIds(ids: [BigInt!]): [ItemRecipeItem] @skipAuth
  }

  input CreateItemRecipeItemInput {
    item_recipe_id: BigInt!
    resource_item_id: BigInt!
    amount: Float!
  }

  input UpdateItemRecipeItemInput {
    item_recipe_id: BigInt
    resource_item_id: BigInt
    amount: Float
  }

  type Mutation {
    createItemRecipeItem(input: CreateItemRecipeItemInput!): ItemRecipeItem!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateItemRecipeItem(
      id: BigInt!
      input: UpdateItemRecipeItemInput!
    ): ItemRecipeItem!
      @requireAuth
      @hasPermission(permission: "gamedata_update")
    deleteItemRecipeItem(id: BigInt!): ItemRecipeItem!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
