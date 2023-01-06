export const schema = gql`
  type TimelineBasespot {
    id: BigInt!
    created_at: DateTime
    updated_at: DateTime
    timeline_id: String!
    startDate: DateTime
    endDate: DateTime
    basespot_id: BigInt
    tribeName: String!
    map: String
    server: String
    region: String
    season: String
    cluster: String
    location: JSON
    players: [String]!
    created_by: String
    raided_by: String
    raidcomment: String
    basespot: Basespot
    profile: Profile
    timeline: Timeline!
  }


  type Query {
    timelineBasespots: [TimelineBasespot!]! @requireAuth
    timelineBasespot(id: BigInt!): TimelineBasespot @requireAuth
  }

  input CreateTimelineBasespotInput {
    created_at: DateTime
    updated_at: DateTime
    timeline_id: String!
    startDate: DateTime
    endDate: DateTime
    basespot_id: BigInt
    tribeName: String!
    map: String
    server: String
    region: String
    season: String
    cluster: String
    location: JSON
    players: [String]!
    created_by: String
    raided_by: String
    raidcomment: String
  }

  input UpdateTimelineBasespotInput {
    created_at: DateTime
    updated_at: DateTime
    timeline_id: String
    startDate: DateTime
    endDate: DateTime
    basespot_id: BigInt
    tribeName: String
    map: String
    server: String
    region: String
    season: String
    cluster: String
    location: JSON
    players: [String]!
    created_by: String
    raided_by: String
    raidcomment: String
  }

  type Mutation {
    createTimelineBasespot(
      input: CreateTimelineBasespotInput!
    ): TimelineBasespot! @requireAuth
    updateTimelineBasespot(
      id: BigInt!
      input: UpdateTimelineBasespotInput!
    ): TimelineBasespot! @requireAuth
    deleteTimelineBasespot(id: BigInt!): TimelineBasespot! @requireAuth
  }
`
