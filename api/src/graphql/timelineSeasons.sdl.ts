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
    timeline_id: String!
    Timeline: Timeline!
    TimelineSeasonBasespot: [TimelineSeasonBasespot]!
    TimelineSeasonEvent: [TimelineSeasonEvent]!
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
    timeline_id: String!
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
    timeline_id: String
  }

  type Mutation {
    createTimelineSeason(input: CreateTimelineSeasonInput!): TimelineSeason!
      @requireAuth
    updateTimelineSeason(
      id: String!
      input: UpdateTimelineSeasonInput!
    ): TimelineSeason! @requireAuth
    deleteTimelineSeason(id: String!): TimelineSeason! @requireAuth
  }
`
