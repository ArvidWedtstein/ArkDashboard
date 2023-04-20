export const schema = gql`
  type TimelineBasespot {
    id: BigInt!
    created_at: DateTime
    updated_at: DateTime
    timeline_id: String!
    start_date: DateTime
    end_date: DateTime
    basespot_id: BigInt
    tribe_name: String!
    map: BigInt
    server: String
    region: String
    season: String
    cluster: String
    location: JSON
    players: [String]!
    created_by: String
    raided_by: String
    raid_comment: String
    latitude: Float
    longitude: Float
    basespot: Basespot
    Profile: Profile
    Map: Map
    timeline: Timeline!
    TimelineBasespotDino: [TimelineBasespotDino]!
  }

  type Query {
    timelineBasespots: [TimelineBasespot!]! @requireAuth
    timelineBasespot(id: BigInt!): TimelineBasespot @requireAuth
  }

  input CreateTimelineBasespotInput {
    created_at: DateTime
    updated_at: DateTime
    timeline_id: String!
    start_date: DateTime
    end_date: DateTime
    basespot_id: BigInt
    tribe_name: String!
    map: BigInt
    server: String
    region: String
    season: String
    cluster: String
    location: JSON
    players: [String]!
    created_by: String
    raided_by: String
    raid_comment: String
    latitude: Float
    longitude: Float
  }

  input UpdateTimelineBasespotInput {
    created_at: DateTime
    updated_at: DateTime
    timeline_id: String
    start_date: DateTime
    end_date: DateTime
    basespot_id: BigInt
    tribe_name: String
    map: BigInt
    server: String
    region: String
    season: String
    cluster: String
    location: JSON
    players: [String]!
    created_by: String
    raided_by: String
    raid_comment: String
    latitude: Float
    longitude: Float
  }
  input RaidTimelineBasespotInput {
    end_date: DateTime
    raided_by: String
    raid_comment: String
  }
  type Mutation {
    createTimelineBasespot(
      input: CreateTimelineBasespotInput!
    ): TimelineBasespot! @requireAuth
    updateTimelineBasespot(
      id: BigInt!
      input: UpdateTimelineBasespotInput!
    ): TimelineBasespot! @requireAuth
    raidTimelineBasespot(
      id: BigInt!
      input: RaidTimelineBasespotInput!
    ): TimelineBasespot! @requireAuth
    deleteTimelineBasespot(id: BigInt!): TimelineBasespot! @requireAuth
  }
`;
