export const schema = gql`
  type UserRecipe {
    id: String!
    created_at: DateTime!
    updated_at: DateTime
    user_id: String!
    private: Boolean!
    Profile: Profile!
    UserRecipeItemRecipe: [UserRecipeItemRecipe]!
  }

  type Query {
    userRecipes: [UserRecipe!]! @requireAuth
    userRecipe(id: String!): UserRecipe @requireAuth
  }

  input CreateUserRecipeInput {
    created_at: DateTime!
    updated_at: DateTime
    user_id: String!
    private: Boolean!
  }

  input UpdateUserRecipeInput {
    created_at: DateTime
    updated_at: DateTime
    user_id: String
    private: Boolean
  }

  type Mutation {
    createUserRecipe(input: CreateUserRecipeInput!): UserRecipe! @requireAuth
    updateUserRecipe(id: String!, input: UpdateUserRecipeInput!): UserRecipe!
      @requireAuth
    deleteUserRecipe(id: String!): UserRecipe! @requireAuth
  }
`
