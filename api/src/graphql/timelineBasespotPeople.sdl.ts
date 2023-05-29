export const schema = gql`
  type TimelineBasespotPerson {
    id: String!
    created_at: DateTime!
    updated_at: DateTime
    user_id: String
    timelinebasespot_id: BigInt!
    ingame_name: String
    TimelineBasespot: TimelineBasespot!
    Profile: Profile
  }

  type Query {
    timelineBasespotPeople: [TimelineBasespotPerson!]! @requireAuth
    timelineBasespotPerson(id: String!): TimelineBasespotPerson @requireAuth
  }

  input CreateTimelineBasespotPersonInput {
    created_at: DateTime!
    updated_at: DateTime
    user_id: String
    timelinebasespot_id: BigInt!
    ingame_name: String
  }

  input UpdateTimelineBasespotPersonInput {
    created_at: DateTime
    updated_at: DateTime
    user_id: String
    timelinebasespot_id: BigInt
    ingame_name: String
  }

  type Mutation {
    createTimelineBasespotPerson(
      input: CreateTimelineBasespotPersonInput!
    ): TimelineBasespotPerson! @requireAuth
    updateTimelineBasespotPerson(
      id: String!
      input: UpdateTimelineBasespotPersonInput!
    ): TimelineBasespotPerson! @requireAuth
    deleteTimelineBasespotPerson(id: String!): TimelineBasespotPerson!
      @requireAuth
  }
`
