export const schema = gql`
  type UserRecipeItemRecipe {
    id: String!
    created_at: DateTime!
    updated_at: DateTime
    user_recipe_id: String!
    item_recipe_id: String!
    ItemRecipe: ItemRecipe!
    UserRecipe: UserRecipe!
  }

  type Query {
    userRecipeItemRecipes: [UserRecipeItemRecipe!]! @requireAuth
    userRecipeItemRecipe(id: String!): UserRecipeItemRecipe @requireAuth
  }

  input CreateUserRecipeItemRecipeInput {
    created_at: DateTime!
    updated_at: DateTime
    user_recipe_id: String!
    item_recipe_id: String!
  }

  input UpdateUserRecipeItemRecipeInput {
    created_at: DateTime
    updated_at: DateTime
    user_recipe_id: String
    item_recipe_id: String
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
