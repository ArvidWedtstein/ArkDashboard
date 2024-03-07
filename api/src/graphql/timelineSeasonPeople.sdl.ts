export const schema = gql`
  type TimelineSeasonPerson {
    id: String!
    created_at: DateTime
    updated_at: DateTime
    user_id: String
    ingame_name: String
    timeline_season_id: String!
    permission: String
    TimelineSeason: TimelineSeason!
    Profile: Profile
  }

  type Query {
    timelineSeasonPeople(timeline_season_id: String!): [TimelineSeasonPerson!]!
      @requireAuth
    timelineSeasonPerson(id: String!): TimelineSeasonPerson @requireAuth
  }

  input CreateTimelineSeasonPersonInput {
    created_at: DateTime
    updated_at: DateTime
    user_id: String
    ingame_name: String
    timeline_season_id: String!
    permission: String
  }

  input UpdateTimelineSeasonPersonInput {
    created_at: DateTime
    updated_at: DateTime
    user_id: String
    ingame_name: String
    timeline_season_id: String
    permission: String
  }

  type Mutation {
    createTimelineSeasonPerson(
      input: CreateTimelineSeasonPersonInput!
    ): TimelineSeasonPerson!
      @requireAuth
      @hasPermission(permission: "timeline_create")
    updateTimelineSeasonPerson(
      id: String!
      input: UpdateTimelineSeasonPersonInput!
    ): TimelineSeasonPerson!
      @requireAuth
      @hasPermission(permission: "timeline_update")
    deleteTimelineSeasonPerson(id: String!): TimelineSeasonPerson!
      @requireAuth
      @hasPermission(permission: "timeline_delete")
  }
`;
