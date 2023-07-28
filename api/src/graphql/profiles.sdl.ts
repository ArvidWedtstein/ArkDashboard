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
    updated_by: String
    steam_user_id: String
    Basespot: [Basespot]!
    Basespot_Basespot_updated_byToProfile: [Basespot]!
    Message: [Message]!
    role_profile_role_idTorole: Role!
    Profile: Profile
    other_Profile: [Profile]!
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
    updated_by: String
    steam_user_id: String
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
    updated_by: String
    steam_user_id: String
  }

  type Mutation {
    createProfile(input: CreateProfileInput!): Profile! @requireAuth
    updateProfile(id: String!, input: UpdateProfileInput!): Profile!
      @requireAuth
    deleteProfile(id: String!): Profile! @requireAuth
  }
`;
