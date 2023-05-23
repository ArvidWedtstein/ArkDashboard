export const schema = gql`
  type Basespot {
    id: BigInt!
    name: String!
    description: String!
    latitude: Float!
    longitude: Float!
    image: String
    created_at: DateTime
    map: BigInt!
    estimated_for_players: String
    defense_images: String
    created_by: String
    turretsetup_image: String
    updated_at: DateTime
    Map: Map!
    TimelineBasespot: [TimelineBasespot]!
  }

  type BasespotPage {
    basespots: [Basespot!]!
    count: Int!
  }
  type Query {
    basespots: [Basespot!]! @skipAuth
    basespot(id: BigInt!): Basespot @requireAuth
    basespotPage(page: Int): BasespotPage @skipAuth
    # @requireAuth(roles: "697b7d70-bab3-4ff9-9c3e-f30b058b621c")
    # @hasPermission(permission: "gamedata_as")
  }

  input CreateBasespotInput {
    name: String!
    description: String!
    latitude: Float!
    longitude: Float!
    image: String
    created_at: DateTime
    map: BigInt!
    estimated_for_players: String
    defense_images: String
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
    map: BigInt
    estimated_for_players: String
    defense_images: String
    created_by: String
    turretsetup_image: String
    updated_at: DateTime
  }

  type Mutation {
    createBasespot(input: CreateBasespotInput!): Basespot! @requireAuth
    updateBasespot(id: BigInt!, input: UpdateBasespotInput!): Basespot!
      @requireAuth
      @hasPermission(permission: "basespot_update")
    deleteBasespot(id: BigInt!): Basespot! @requireAuth
  }
`;
