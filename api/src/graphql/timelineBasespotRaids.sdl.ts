export const schema = gql`
  type TimelineBasespotRaid {
    id: String!
    created_at: DateTime!
    updated_at: DateTime
    timelinebasespot_id: BigInt!
    raid_start: DateTime
    raid_end: DateTime
    raid_comment: String
    attacker_players: String
    tribe_name: String
    base_survived: Boolean!
    defenders: String
    TimelineBasespot: TimelineBasespot!
  }

  type Query {
    timelineBasespotRaids: [TimelineBasespotRaid!]! @skipAuth
    timelineBasespotRaid(id: String!): TimelineBasespotRaid @skipAuth
  }

  input CreateTimelineBasespotRaidInput {
    created_at: DateTime!
    updated_at: DateTime
    timelinebasespot_id: BigInt!
    raid_start: DateTime
    raid_end: DateTime
    raid_comment: String
    attacker_players: String
    tribe_name: String
    base_survived: Boolean!
    defenders: String
  }

  input UpdateTimelineBasespotRaidInput {
    created_at: DateTime
    updated_at: DateTime
    timelinebasespot_id: BigInt
    raid_start: DateTime
    raid_end: DateTime
    raid_comment: String
    attacker_players: String
    tribe_name: String
    base_survived: Boolean
    defenders: String
  }

  type Mutation {
    createTimelineBasespotRaid(
      input: CreateTimelineBasespotRaidInput!
    ): TimelineBasespotRaid! @requireAuth
    updateTimelineBasespotRaid(
      id: String!
      input: UpdateTimelineBasespotRaidInput!
    ): TimelineBasespotRaid! @requireAuth
    deleteTimelineBasespotRaid(id: String!): TimelineBasespotRaid! @requireAuth
  }
`;
