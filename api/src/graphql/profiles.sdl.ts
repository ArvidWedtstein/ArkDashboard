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
    Message: [Message]!
    role_profile_role_idTorole: Role!
    Profile: Profile
    other_Profile: [Profile]!
    Timeline: [Timeline]!
    TimelineBasespot: [TimelineBasespot]!
    Tribe: [Tribe]!
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
  }

  type Mutation {
    createProfile(input: CreateProfileInput!): Profile!
      @requireAuth
      @hasPermission(permission: "user_create")
    updateProfile(id: String!, input: UpdateProfileInput!): Profile!
      @requireAuth
      @hasPermission(permission: "user_update")
    deleteProfile(id: String!): Profile!
      @requireAuth
      @hasPermission(permission: "user_delete")
  }
`;
