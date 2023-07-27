export const schema = gql`
  type Basespot {
    id: String!
    created_at: DateTime
    updated_at: DateTime
    created_by: String
    updated_by: String
    name: String
    description: String
    latitude: Float!
    longitude: Float!
    map_id: BigInt!
    thumbnail: String
    turretsetup_images: String
    published: Boolean
    level: String
    estimated_for_players: String
    type: String
    base_images: String
    Profile: Profile
    Map: Map!
    Profile_Basespot_updated_byToProfile: Profile
    TimelineSeasonBasespot: [TimelineSeasonBasespot]!
  }

  type BasespotPage {
    basespots: [Basespot!]!
    count: Int!
  }
  type Query {
    basespots: [Basespot!]! @skipAuth
    basespot(id: String!): Basespot @requireAuth
    basespotTypes: [Basespot] @skipAuth
    basespotPage(page: Int, map: Int, type: String): BasespotPage @skipAuth
    # @requireAuth(roles: "697b7d70-bab3-4ff9-9c3e-f30b058b621c")
    # @hasPermission(permission: "gamedata_as")
  }

  input CreateBasespotInput {
    created_at: DateTime
    updated_at: DateTime
    created_by: String
    updated_by: String
    name: String
    description: String
    latitude: Float!
    longitude: Float!
    map_id: BigInt!
    thumbnail: String
    turretsetup_images: String
    published: Boolean
    level: String
    estimated_for_players: String
    type: String
    base_images: String
  }

  input UpdateBasespotInput {
    created_at: DateTime
    updated_at: DateTime
    created_by: String
    updated_by: String
    name: String
    description: String
    latitude: Float
    longitude: Float
    map_id: BigInt
    thumbnail: String
    turretsetup_images: String
    published: Boolean
    level: String
    estimated_for_players: String
    type: String
    base_images: String
  }

  type Mutation {
    createBasespot(input: CreateBasespotInput!): Basespot!
      @requireAuth
      @hasPermission(permission: "basespot_create")
    updateBasespot(id: String!, input: UpdateBasespotInput!): Basespot!
      @requireAuth
      @hasPermission(permission: "basespot_update")
    deleteBasespot(id: String!): Basespot!
      @requireAuth
      @hasPermission(permission: "basespot_delete")
  }
`;
