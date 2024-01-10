export const schema = gql`
  type UserRecipe {
    id: BigInt!
    created_at: DateTime
    updated_at: DateTime
    created_by: String
    public_access: Boolean
    name: String
    Profile: Profile
    UserRecipeItemRecipe: [UserRecipeItemRecipe]!
  }

  type Query {
    userRecipes: [UserRecipe!]! @skipAuth
    userRecipe(id: BigInt!): UserRecipe @requireAuth
    userRecipesByID(user_id: String): [UserRecipe!]! @skipAuth
  }

  input CreateUserRecipeInput {
    created_at: DateTime
    updated_at: DateTime
    created_by: String
    public_access: Boolean
    name: String
    UserRecipeItemRecipe: JSON
  }

  input UpdateUserRecipeInput {
    created_at: DateTime
    updated_at: DateTime
    created_by: String
    public_access: Boolean
    name: String
  }

  type Mutation {
    createUserRecipe(input: CreateUserRecipeInput!): UserRecipe! @requireAuth
    updateUserRecipe(id: BigInt!, input: UpdateUserRecipeInput!): UserRecipe!
      @requireAuth
    deleteUserRecipe(id: BigInt!): UserRecipe! @requireAuth
  }
`;
