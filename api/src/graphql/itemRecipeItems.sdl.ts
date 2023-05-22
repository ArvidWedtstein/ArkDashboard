export const schema = gql`
  type ItemRecipeItem {
    id: String!
    created_at: DateTime!
    updated_at: DateTime
    item_recipe_id: String!
    item_id: BigInt!
    amount: Float!
    Item: Item!
    ItemRec: ItemRec!
  }

  type Query {
    itemRecipeItems: [ItemRecipeItem!]! @skipAuth
    itemRecipeItem(id: String!): ItemRecipeItem @skipAuth
    itemRecipesByIds(item_recipe_id: [String!]!): [ItemRecipeItem!]! @skipAuth
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
`;
