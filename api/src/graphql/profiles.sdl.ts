export const schema = gql`
  type Profile {
    id: String!
    updated_at: DateTime
    username: String
    full_name: String
    avatar_url: String
    website: String
    biography: String
    status: user_status!
    role_id: String!
    created_at: DateTime
    steam_user_id: String
    banned_until: DateTime
    email: String
    Basespot: [Basespot]!
    Basespot_Basespot_updated_byToProfile: [Basespot]!
    Message: [Message]!
    role_profile_role_idTorole: Role!
    Role_Role_created_byToProfile: [Role]!
    TimelineSeason: [TimelineSeason]!
    TimelineSeasonBasespot: [TimelineSeasonBasespot]!
    TimelineSeasonEvent: [TimelineSeasonEvent]!
    TimelineSeasonEvent_TimelineSeasonEvent_updated_byToProfile: [TimelineSeasonEvent]!
    TimelineSeasonPerson: [TimelineSeasonPerson]!
    Tribe: [Tribe]!
    UserRecipe: [UserRecipe]!
  }

  enum user_status {
    ONLINE
    OFFLINE
  }

  type Query {
    profiles: [Profile!]! @requireAuth
    profile(id: String!): Profile @requireAuth
  }

  input CreateProfileInput {
    updated_at: DateTime
    username: String
    full_name: String
    avatar_url: String
    website: String
    biography: String
    status: user_status!
    role_id: String!
    created_at: DateTime
    steam_user_id: String
    banned_until: DateTime
    email: String
  }

  input BanProfileInput {
    banned_until: DateTime
  }

  input UpdateProfileInput {
    updated_at: DateTime
    username: String
    full_name: String
    avatar_url: String
    website: String
    biography: String
    status: user_status
    role_id: String
    created_at: DateTime
    steam_user_id: String
    banned_until: DateTime
    email: String
  }

  type Mutation {
    createProfile(input: CreateProfileInput!): Profile!
      @requireAuth
      @hasPermission(permission: "user_create")
    banProfile(id: String!, input: BanProfileInput!): Profile!
      @requireAuth
      @hasPermission(permission: "user_update")
    updateProfile(id: String!, input: UpdateProfileInput!): Profile!
      @requireAuth
    deleteProfile(id: String!): Profile!
      @requireAuth
      @hasPermission(permission: "user_delete")
  }
`;
