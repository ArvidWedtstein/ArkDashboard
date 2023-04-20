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
    tribes: [Tribe!]! @requireAuth
    tribe(id: Int!): Tribe @requireAuth
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
    createTribe(input: CreateTribeInput!): Tribe! @requireAuth
    updateTribe(id: Int!, input: UpdateTribeInput!): Tribe! @requireAuth
    deleteTribe(id: Int!): Tribe! @requireAuth
  }
`
