export const schema = gql`
  type Basespot {
    id: Int!
    name: String!
    description: String!
    latitude: Float!
    longitude: Float!
    image: String
    createdAt: DateTime!
    Map: String
    estimatedForPlayers: String
  }

  type Query {
    basespots: [Basespot!]! @requireAuth
    basespot(id: Int!): Basespot @requireAuth
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
`
