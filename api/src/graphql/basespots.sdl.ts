export const schema = gql`
  type Basespot {
    id: BigInt!
    name: String!
    description: String!
    latitude: Float!
    longitude: Float!
    image: String
    created_at: DateTime!
    Map: String!
    estimatedForPlayers: String
    defenseImages: [String]!
    created_by: String
    turretsetup_image: String
    updated_at: DateTime
    TimelineBasespot: [TimelineBasespot]!
  }

  type Query {
    basespots: [Basespot!]! @requireAuth
    basespot(id: BigInt!): Basespot @requireAuth
  }

  input CreateBasespotInput {
    name: String!
    description: String!
    latitude: Float!
    longitude: Float!
    image: String
    created_at: DateTime!
    Map: String!
    estimatedForPlayers: String
    defenseImages: [String]!
    created_by: String
    turretsetup_image: String
    updated_at: DateTime
  }

  input UpdateBasespotInput {
    name: String
    description: String
    latitude: Float
    longitude: Float
    image: String
    created_at: DateTime
    Map: String
    estimatedForPlayers: String
    defenseImages: [String]!
    created_by: String
    turretsetup_image: String
    updated_at: DateTime
  }

  type Mutation {
    createBasespot(input: CreateBasespotInput!): Basespot! @requireAuth
    updateBasespot(id: BigInt!, input: UpdateBasespotInput!): Basespot!
      @requireAuth
    deleteBasespot(id: BigInt!): Basespot! @requireAuth
  }
`
