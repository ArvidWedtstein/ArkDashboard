export const schema = gql`
  type Item {
    id: BigInt!
    created_at: DateTime
    name: String!
    description: String
    image: String
    max_stack: Float
    weight: Float
    engram_points: Float
    crafting_time: Float
    req_level: BigInt
    yields: Float
    recipe: JSON
    stats: JSON
    color: String
    crafted_in: [String]!
    effects: [String]!
    type: String!
  }

  type ItemsPage {
    items: [Item!]!
    count: Int!
  }
  type Query {
    items: [Item!]! @skipAuth
    item(id: BigInt!): Item @skipAuth
    itemsPage(page: Int): ItemsPage @skipAuth
  }

  input CreateItemInput {
    created_at: DateTime
    name: String!
    description: String
    image: String
    max_stack: Float
    weight: Float
    engram_points: Float
    crafting_time: Float
    req_level: BigInt
    yields: Float
    recipe: JSON
    stats: JSON
    color: String
    crafted_in: [String]!
    effects: [String]!
    type: String!
  }

  input UpdateItemInput {
    created_at: DateTime
    name: String
    description: String
    image: String
    max_stack: Float
    weight: Float
    engram_points: Float
    crafting_time: Float
    req_level: BigInt
    yields: Float
    recipe: JSON
    stats: JSON
    color: String
    crafted_in: [String]!
    effects: [String]!
    type: String
  }

  type Mutation {
    createItem(input: CreateItemInput!): Item! @requireAuth
    updateItem(id: BigInt!, input: UpdateItemInput!): Item! @requireAuth
    deleteItem(id: BigInt!): Item! @requireAuth
  }
`;