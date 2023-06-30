export const schema = gql`
  type TimelineSeason {
    id: String!
    created_at: DateTime
    updated_at: DateTime
    server: String
    season: String
    tribe_name: String
    season_start_date: DateTime
    season_end_date: DateTime
    cluster: String
    created_by: String
    Profile: Profile
    TimelineSeasonBasespot: [TimelineSeasonBasespot]!
    TimelineSeasonEvent: [TimelineSeasonEvent]!
    TimelineSeasonPerson: [TimelineSeasonPerson]!
  }

  type Query {
    timelineSeasons: [TimelineSeason!]! @requireAuth
    timelineSeason(id: String!): TimelineSeason @requireAuth
  }

  input CreateTimelineSeasonInput {
    created_at: DateTime
    updated_at: DateTime
    server: String
    season: String
    tribe_name: String
    season_start_date: DateTime
    season_end_date: DateTime
    cluster: String
    created_by: String
  }

  input UpdateTimelineSeasonInput {
    created_at: DateTime
    updated_at: DateTime
    server: String
    season: String
    tribe_name: String
    season_start_date: DateTime
    season_end_date: DateTime
    cluster: String
    created_by: String
  }

  type Mutation {
    createTimelineSeason(input: CreateTimelineSeasonInput!): TimelineSeason!
      @requireAuth
      @hasPermission(permission: "timeline_create")
    updateTimelineSeason(
      id: String!
      input: UpdateTimelineSeasonInput!
    ): TimelineSeason!
      @requireAuth
      @hasPermission(permission: "timeline_update")
    deleteTimelineSeason(id: String!): TimelineSeason!
      @requireAuth
      @hasPermission(permission: "timeline_delete")
  }
`;
