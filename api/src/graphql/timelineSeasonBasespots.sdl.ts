export const schema = gql`
  type TimelineSeasonBasespot {
    id: BigInt!
    created_at: DateTime
    updated_at: DateTime
    start_date: DateTime
    end_date: DateTime
    map_id: BigInt
    created_by: String
    latitude: Float
    longitude: Float
    timeline_season_id: String!
    basespot_id: String
    Basespot: Basespot
    Profile: Profile
    Map: Map
    TimelineSeason: TimelineSeason!
  }

  type Query {
    timelineSeasonBasespots: [TimelineSeasonBasespot!]! @requireAuth
    timelineSeasonBasespot(id: BigInt!): TimelineSeasonBasespot @requireAuth
  }

  input CreateTimelineSeasonBasespotInput {
    created_at: DateTime
    updated_at: DateTime
    start_date: DateTime
    end_date: DateTime
    map_id: BigInt
    created_by: String
    latitude: Float
    longitude: Float
    timeline_season_id: String!
    basespot_id: String
  }

  input UpdateTimelineSeasonBasespotInput {
    created_at: DateTime
    updated_at: DateTime
    start_date: DateTime
    end_date: DateTime
    map_id: BigInt
    created_by: String
    latitude: Float
    longitude: Float
    timeline_season_id: String
    basespot_id: String
  }

  type Mutation {
    "Creates a new TimelineSeasonBasespot."
    createTimelineSeasonBasespot(
      input: CreateTimelineSeasonBasespotInput!
    ): TimelineSeasonBasespot!
      @requireAuth
      @hasPermission(permission: "timeline_create")

    "Updates an existing TimelineSeasonBasespot."
    updateTimelineSeasonBasespot(
      id: BigInt!
      input: UpdateTimelineSeasonBasespotInput!
    ): TimelineSeasonBasespot!
      @requireAuth
      @hasPermission(permission: "timeline_update")

    "Deletes an existing TimelineSeasonBasespot."
    deleteTimelineSeasonBasespot(id: BigInt!): TimelineSeasonBasespot!
      @requireAuth
      @hasPermission(permission: "timeline_delete")
  }
`;
