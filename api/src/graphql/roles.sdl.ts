export const schema = gql`
  type Role {
    id: String!
    name: String!
    created_by: String
    permissions: [permission]!
    profile_profile_role_idTorole: [Profile]!
    Profile_Role_created_byToProfile: Profile
  }

  enum permission {
    basespot_delete
    basespot_create
    basespot_update
    basespot_view
    role_create
    role_update
    role_delete
    user_create
    user_update
    user_delete
    tribe_create
    tribe_update
    tribe_delete
    timeline_create
    timeline_update
    timeline_delete
    gamedata_delete
    gamedata_update
    gamedata_create
  }

  type Query {
    roles: [Role!]! @requireAuth
    role(id: String!): Role @requireAuth
  }

  input CreateRoleInput {
    name: String!
    created_by: String
    permissions: [permission]!
  }

  input UpdateRoleInput {
    name: String
    created_by: String
    permissions: [permission]!
  }

  type Mutation {
    createRole(input: CreateRoleInput!): Role! @requireAuth
    updateRole(id: String!, input: UpdateRoleInput!): Role! @requireAuth
    deleteRole(id: String!): Role! @requireAuth
  }
`
