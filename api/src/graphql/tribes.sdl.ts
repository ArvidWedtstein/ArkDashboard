export const schema = gql`
  type Tribe {
    id: BigInt!
    created_at: DateTime
    updated_at: DateTime
    created_by: String
    name: String!
    Profile: Profile
  }

  type Query {
    tribes: [Tribe!]! @skipAuth
    tribe(id: BigInt!): Tribe @skipAuth
  }

  input CreateTribeInput {
    created_at: DateTime
    updated_at: DateTime
    created_by: String
    name: String!
  }

  input UpdateTribeInput {
    created_at: DateTime
    updated_at: DateTime
    created_by: String
    name: String
  }

  type Mutation {
    createTribe(input: CreateTribeInput!): Tribe!
      @requireAuth
      @hasPermission(permission: "tribe_create")
    updateTribe(id: BigInt!, input: UpdateTribeInput!): Tribe!
      @requireAuth
      @hasPermission(permission: "tribe_update")
    deleteTribe(id: BigInt!): Tribe!
      @requireAuth
      @hasPermission(permission: "tribe_delete")
  }
`;
