export const schema = gql`
  type UserRecipe {
    id: String!
    created_at: DateTime!
    updated_at: DateTime
    user_id: String!
    private: Boolean!
    name: String
    Profile: Profile!
    UserRecipeItemRecipe: [UserRecipeItemRecipe]!
  }

  type Query {
    userRecipes: [UserRecipe!]! @skipAuth
    userRecipe(id: String!): UserRecipe @requireAuth
    userRecipesByID(user_id: String): [UserRecipe!]! @skipAuth
  }

  input CreateUserRecipeInput {
    created_at: DateTime
    updated_at: DateTime
    user_id: String!
    private: Boolean!
    name: String
    UserRecipeItemRecipe: JSON
  }

  input UpdateUserRecipeInput {
    created_at: DateTime
    updated_at: DateTime
    user_id: String
    private: Boolean
    name: String
  }

  type Mutation {
    createUserRecipe(input: CreateUserRecipeInput!): UserRecipe! @requireAuth
    updateUserRecipe(id: String!, input: UpdateUserRecipeInput!): UserRecipe!
      @requireAuth
    deleteUserRecipe(id: String!): UserRecipe! @requireAuth
  }
`;
