export const schema = gql`
  type Timeline {
    id: String!
    created_at: DateTime
    updated_at: DateTime
    created_by: String!
    Profile: Profile!
    TimelineBasespot: [TimelineBasespot]!
  }

  type Query {
    timelines: [Timeline!]! @skipAuth
    timeline(id: String!): Timeline @skipAuth
  }

  input CreateTimelineInput {
    created_at: DateTime
    updated_at: DateTime
    created_by: String!
  }

  input UpdateTimelineInput {
    created_at: DateTime
    updated_at: DateTime
    created_by: String
  }

  type Mutation {
    createTimeline(input: CreateTimelineInput!): Timeline! @requireAuth
    updateTimeline(id: String!, input: UpdateTimelineInput!): Timeline!
      @requireAuth
    deleteTimeline(id: String!): Timeline! @requireAuth
  }
`;
