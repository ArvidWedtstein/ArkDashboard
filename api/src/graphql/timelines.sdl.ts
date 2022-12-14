export const schema = gql`
  type Timeline {
    id: String!
    createdAt: DateTime
    updatedAt: DateTime
    createdBy: String
    TimelineBasespot: [TimelineBasespot]!
    profile: Profile
  }

  type Query {
    timelines: [Timeline!]! @requireAuth
    timeline(id: String!): Timeline @skipAuth
  }

  input CreateTimelineInput {
    createdBy: String
  }

  input UpdateTimelineInput {
    createdBy: String
  }

  type Mutation {
    createTimeline(input: CreateTimelineInput!): Timeline! @requireAuth
    updateTimeline(id: String!, input: UpdateTimelineInput!): Timeline!
      @requireAuth
    deleteTimeline(id: String!): Timeline! @requireAuth
  }
`
