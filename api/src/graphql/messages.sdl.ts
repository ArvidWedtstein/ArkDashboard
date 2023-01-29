export const schema = gql`
  type Message {
    id: String!
    profile_id: String!
    content: String!
    created_at: DateTime!
    Profile: Profile!
  }

  type Query {
    messages: [Message!]! @requireAuth
    message(id: String!): Message @requireAuth
  }

  input CreateMessageInput {
    profile_id: String!
    content: String!
    created_at: DateTime!
  }

  input UpdateMessageInput {
    profile_id: String
    content: String
    created_at: DateTime
  }

  type Mutation {
    createMessage(input: CreateMessageInput!): Message! @requireAuth
    updateMessage(id: String!, input: UpdateMessageInput!): Message!
      @requireAuth
    deleteMessage(id: String!): Message! @requireAuth
  }
`
