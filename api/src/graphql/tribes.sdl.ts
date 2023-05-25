export const schema = gql`
  type Tribe {
    id: Int!
    name: String!
    description: String
    created_at: DateTime
    updated_at: DateTime
    created_by: String
    updated_by: String
    Profile: Profile
  }

  type Query {
    tribes: [Tribe!]! @skipAuth
    # @requireAuth(roles: "697b7d70-bab3-4ff9-9c3e-f30b058b621c")
    tribe(id: Int!): Tribe @skipAuth
  }

  input CreateTribeInput {
    name: String!
    description: String
    created_at: DateTime
    updated_at: DateTime
    created_by: String
    updated_by: String
  }

  input UpdateTribeInput {
    name: String
    description: String
    created_at: DateTime
    updated_at: DateTime
    created_by: String
    updated_by: String
  }

  type Mutation {
    createTribe(input: CreateTribeInput!): Tribe!
      @requireAuth
      @hasPermission(permission: "tribe_create")
    updateTribe(id: Int!, input: UpdateTribeInput!): Tribe!
      @requireAuth
      @hasPermission(permission: "tribe_update")
    deleteTribe(id: Int!): Tribe! @requireAuth
  }
`;
