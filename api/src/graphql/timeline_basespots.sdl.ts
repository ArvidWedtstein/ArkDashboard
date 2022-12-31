export const schema = gql`
  type Timeline_Basespot {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime
    createdBy: String
    timeline_id: String
    startDate: Date
    endDate: DateTime
    raided_by: String
    raidcomment: String
    basespot_id: Int
    tribeName: String
    map: String
    server: String
    region: String
    season: String
    cluster: String
    location: String
    players: [String]
    created_by: String
  }

  type TimelineBasespotPage {
    timeline_basespots: [Timeline_Basespot!]!
    count: Int!
  }

  type Query {
    timeline_basespots: [Timeline_Basespot!]! @skipAuth
    timeline_basespot(id: Int!): Timeline_Basespot @requireAuth
    timelineBasespotPage(page: Int): TimelineBasespotPage @skipAuth
  }
`;
// input CreateTribeInput {
//   name: String!
//   description: String
//   createdBy: String
// }

// input UpdateTribeInput {
//   name: String
//   description: String
// }

// type Mutation {
//   createTribe(input: CreateTribeInput!): Tribe! @requireAuth
//   updateTribe(id: Int!, input: UpdateTribeInput!): Tribe! @requireAuth
//   deleteTribe(id: Int!): Tribe! @requireAuth
// }
