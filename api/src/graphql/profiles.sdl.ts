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
    TimelineBasespot: [TimelineBasespot]!
    role_profile_role_idTorole: Role!
    role_role_createdByToprofile: [Role]!
    timeline: [Timeline]!
    tribe_tribe_createdByToprofile: [Tribe]!
    tribe_tribe_updatedByToprofile: [Tribe]!
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
  }

  type Mutation {
    createProfile(input: CreateProfileInput!): Profile! @requireAuth
    updateProfile(id: String!, input: UpdateProfileInput!): Profile!
      @requireAuth
    deleteProfile(id: String!): Profile! @requireAuth
  }
`
