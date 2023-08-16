export const schema = gql`
  type Tribe {
    id: String!
    created_at: DateTime
    updated_at: DateTime
    name: String!
    created_by: String
    Profile: Profile
  }

  type Query {
    tribes: [Tribe!]! @skipAuth
    # @requireAuth(roles: "697b7d70-bab3-4ff9-9c3e-f30b058b621c")
    tribe(id: String!): Tribe @skipAuth
  }

  input CreateTribeInput {
    created_at: DateTime
    updated_at: DateTime
    name: String!
    created_by: String
  }

  input UpdateTribeInput {
    created_at: DateTime
    updated_at: DateTime
    name: String
    created_by: String
  }

  type Mutation {
    createTribe(input: CreateTribeInput!): Tribe!
      @requireAuth
      @hasPermission(permission: "tribe_create")
    updateTribe(id: String!, input: UpdateTribeInput!): Tribe!
      @requireAuth
      @hasPermission(permission: "tribe_update")
    deleteTribe(id: String!): Tribe!
      @requireAuth
      @hasPermission(permission: "tribe_delete")
  }
`;
