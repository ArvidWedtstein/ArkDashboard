export const schema = gql`
  type ItemRecipeItem {
    id: String!
    created_at: DateTime!
    updated_at: DateTime
    item_recipe_id: String!
    item_id: BigInt!
    amount: Float!
    Item: Item!
    ItemRec: ItemRecipe!
  }

  type Query {
    itemRecipeItems: [ItemRecipeItem!]! @requireAuth
    itemRecipeItem(id: String!): ItemRecipeItem @requireAuth
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
    updateItemRecipeItem(
      id: String!
      input: UpdateItemRecipeItemInput!
    ): ItemRecipeItem! @requireAuth
    deleteItemRecipeItem(id: String!): ItemRecipeItem! @requireAuth
  }
`
