export const schema = gql`
  type Tribe {
    id: Int!
    name: String!
    description: String
    created_at: DateTime!
    updated_at: DateTime
    createdBy: String
    updatedBy: String
  }

  type Query {
    tribes: [Tribe!]! @skipAuth
    tribe(id: Int!): Tribe @requireAuth
  }

  input CreateTribeInput {
    name: String!
    description: String
    created_at: DateTime!
    updated_at: DateTime
    createdBy: String
    updatedBy: String
  }

  input UpdateTribeInput {
    name: String
    description: String
    created_at: DateTime
    updated_at: DateTime
    createdBy: String
    updatedBy: String
  }

  type Mutation {
    createTribe(input: CreateTribeInput!): Tribe! @requireAuth
    updateTribe(id: Int!, input: UpdateTribeInput!): Tribe! @requireAuth
    deleteTribe(id: Int!): Tribe! @requireAuth
  }
`
