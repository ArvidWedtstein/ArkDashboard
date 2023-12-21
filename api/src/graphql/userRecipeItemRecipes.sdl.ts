export const schema = gql`
  type UserRecipeItemRecipe {
    id: String!
    created_at: DateTime!
    updated_at: DateTime
    user_recipe_id: String!
    amount: BigInt
    item_recipe_id: BigInt
    ItemRecipe: ItemRecipe
    UserRecipe: UserRecipe!
  }

  type Query {
    userRecipeItemRecipes: [UserRecipeItemRecipe!]! @skipAuth
    userRecipeItemRecipe(id: String!): UserRecipeItemRecipe @requireAuth
  }

  input CreateUserRecipeItemRecipeInput {
    created_at: DateTime!
    updated_at: DateTime
    user_recipe_id: String!
    amount: BigInt
    item_recipe_id: BigInt
  }

  input UpdateUserRecipeItemRecipeInput {
    created_at: DateTime
    updated_at: DateTime
    user_recipe_id: String
    amount: BigInt
    item_recipe_id: BigInt
  }

  type Mutation {
    createUserRecipeItemRecipe(
      input: CreateUserRecipeItemRecipeInput!
    ): UserRecipeItemRecipe! @requireAuth
    updateUserRecipeItemRecipe(
      id: String!
      input: UpdateUserRecipeItemRecipeInput!
    ): UserRecipeItemRecipe! @requireAuth
    deleteUserRecipeItemRecipe(id: String!): UserRecipeItemRecipe! @requireAuth
  }
`;
