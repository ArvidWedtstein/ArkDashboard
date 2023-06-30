export const schema = gql`
  type TimelineBasespot {
    id: BigInt!
    created_at: DateTime
    updated_at: DateTime
    start_date: DateTime
    end_date: DateTime
    basespot_id: BigInt
    tribe_name: String!
    map: BigInt
    server: String
    region: String
    season: String
    cluster: String
    created_by: String
    latitude: Float
    longitude: Float
    basespot: Basespot
    Profile: Profile
    Map: Map
    TimelineBasespotDino: [TimelineBasespotDino]!
    TimelineBasespotPerson: [TimelineBasespotPerson]!
    TimelineBasespotRaid: [TimelineBasespotRaid]!
  }

  type Query {
    timelineBasespots: [TimelineBasespot!]! @requireAuth
    timelineBasespot(id: BigInt!): TimelineBasespot @requireAuth
  }

  input CreateTimelineBasespotInput {
    created_at: DateTime
    updated_at: DateTime
    start_date: DateTime
    end_date: DateTime
    basespot_id: BigInt
    tribe_name: String!
    map: BigInt
    server: String
    region: String
    season: String
    cluster: String
    created_by: String
    latitude: Float
    longitude: Float
  }

  input UpdateTimelineBasespotInput {
    created_at: DateTime
    updated_at: DateTime
    start_date: DateTime
    end_date: DateTime
    basespot_id: BigInt
    tribe_name: String
    map: BigInt
    server: String
    region: String
    season: String
    cluster: String
    created_by: String
    latitude: Float
    longitude: Float
  }

  type Mutation {
    createTimelineBasespot(
      input: CreateTimelineBasespotInput!
    ): TimelineBasespot!
      @requireAuth
      @hasPermission(permission: "timeline_create")
    updateTimelineBasespot(
      id: BigInt!
      input: UpdateTimelineBasespotInput!
    ): TimelineBasespot!
      @requireAuth
      @hasPermission(permission: "timeline_update")
    deleteTimelineBasespot(id: BigInt!): TimelineBasespot!
      @requireAuth
      @hasPermission(permission: "timeline_delete")
  }
`;
