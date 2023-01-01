export const schema = gql`
  type Basespot {
    id: Int!
    name: String!
    description: String!
    latitude: Float!
    longitude: Float!
    image: String
    created_at: DateTime!
    Map: String
    estimatedForPlayers: String
  }

  type BasespotPage {
    basespots: [Basespot!]!
    count: Int!
  }

  type Query {
    basespots: [Basespot!]! @skipAuth
    basespot(id: Int!): Basespot @requireAuth
    basespotPage(page: Int): BasespotPage @skipAuth
  }

  input CreateBasespotInput {
    name: String!
    description: String!
    latitude: Float!
    longitude: Float!
    image: String
    Map: String
    estimatedForPlayers: String
  }

  input UpdateBasespotInput {
    name: String
    description: String
    latitude: Float
    longitude: Float
    image: String
    Map: String
    estimatedForPlayers: String
  }

  type Mutation {
    createBasespot(input: CreateBasespotInput!): Basespot! @requireAuth
    updateBasespot(id: Int!, input: UpdateBasespotInput!): Basespot!
      @requireAuth
    deleteBasespot(id: Int!): Basespot! @requireAuth
  }
`;
