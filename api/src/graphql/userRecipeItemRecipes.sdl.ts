export const schema = gql`
  type UserRecipeItemRecipe {
    id: BigInt!
    created_at: DateTime!
    user_recipe_id: BigInt!
    item_recipe_id: BigInt!
    amount: BigInt
    ItemRecipe: ItemRecipe!
    UserRecipe: UserRecipe!
  }

  type Query {
    userRecipeItemRecipes: [UserRecipeItemRecipe!]! @skipAuth
    userRecipeItemRecipe(id: BigInt!): UserRecipeItemRecipe @requireAuth
  }

  input CreateUserRecipeItemRecipeInput {
    created_at: DateTime!
    user_recipe_id: BigInt!
    item_recipe_id: BigInt!
    amount: BigInt
  }

  input UpdateUserRecipeItemRecipeInput {
    created_at: DateTime
    user_recipe_id: BigInt
    item_recipe_id: BigInt
    amount: BigInt
  }

  type Mutation {
    createUserRecipeItemRecipe(
      input: CreateUserRecipeItemRecipeInput!
    ): UserRecipeItemRecipe! @requireAuth
    updateUserRecipeItemRecipe(
      id: BigInt!
      input: UpdateUserRecipeItemRecipeInput!
    ): UserRecipeItemRecipe! @requireAuth
    deleteUserRecipeItemRecipe(id: BigInt!): UserRecipeItemRecipe! @requireAuth
  }
`;
