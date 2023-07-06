export const schema = gql`
  type Basespot {
    id: BigInt!
    name: String!
    description: String!
    latitude: Float!
    longitude: Float!
    image: String
    created_at: DateTime
    map_id: BigInt!
    estimated_for_players: String
    defense_images: String
    created_by: String
    turretsetup_image: String
    updated_at: DateTime
    type: String
    server: String
    published: Boolean
    Profile: Profile
    Map: Map!
    TimelineSeasonBasespot: [TimelineSeasonBasespot]!
  }

  type BasespotPage {
    basespots: [Basespot!]!
    count: Int!
  }
  type Query {
    basespots: [Basespot!]! @skipAuth
    basespot(id: BigInt!): Basespot @requireAuth
    basespotPage(page: Int, map: Int, type: String): BasespotPage @skipAuth
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
    map_id: BigInt!
    estimated_for_players: String
    defense_images: String
    created_by: String
    turretsetup_image: String
    updated_at: DateTime
    type: String
    server: String
    published: Boolean
  }

  input UpdateBasespotInput {
    name: String
    description: String
    latitude: Float
    longitude: Float
    image: String
    created_at: DateTime
    map_id: BigInt
    estimated_for_players: String
    defense_images: String
    created_by: String
    turretsetup_image: String
    updated_at: DateTime
    type: String
    server: String
    published: Boolean
  }

  type Mutation {
    createBasespot(input: CreateBasespotInput!): Basespot!
      @requireAuth
      @hasPermission(permission: "basespot_create")
    updateBasespot(id: BigInt!, input: UpdateBasespotInput!): Basespot!
      @requireAuth
      @hasPermission(permission: "basespot_update")
    deleteBasespot(id: BigInt!): Basespot!
      @requireAuth
      @hasPermission(permission: "basespot_delete")
  }
`;
