export const schema = gql`
  type Tribe {
    id: Int!
    name: String!
    description: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    createdBy: String
  }

  type Query {
    tribes: [Tribe!]! @skipAuth
    tribe(id: Int!): Tribe @requireAuth
  }

  input CreateTribeInput {
    name: String!
    description: String!
    createdBy: String
  }

  input UpdateTribeInput {
    name: String
    description: String
  }

  type Mutation {
    createTribe(input: CreateTribeInput!): Tribe! @requireAuth
    updateTribe(id: Int!, input: UpdateTribeInput!): Tribe! @requireAuth
    deleteTribe(id: Int!): Tribe! @requireAuth
  }
`;
