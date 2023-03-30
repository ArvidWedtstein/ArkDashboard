export const schema = gql`
  type DinoEffWeight {
    id: String!
    created_at: DateTime
    updated_at: DateTime
    dino_id: String!
    item_id: BigInt!
    value: Float!
    is_gather_eff: Boolean!
    Dino: Dino!
    Item: Item!
  }

  type Query {
    dinoEffWeights: [DinoEffWeight!]! @requireAuth
    dinoEffWeight(id: String!): DinoEffWeight @requireAuth
  }

  input CreateDinoEffWeightInput {
    created_at: DateTime
    updated_at: DateTime
    dino_id: String!
    item_id: BigInt!
    value: Float!
    is_gather_eff: Boolean!
  }

  input UpdateDinoEffWeightInput {
    created_at: DateTime
    updated_at: DateTime
    dino_id: String
    item_id: BigInt
    value: Float
    is_gather_eff: Boolean
  }

  type Mutation {
    createDinoEffWeight(input: CreateDinoEffWeightInput!): DinoEffWeight!
      @requireAuth
    updateDinoEffWeight(
      id: String!
      input: UpdateDinoEffWeightInput!
    ): DinoEffWeight! @requireAuth
    deleteDinoEffWeight(id: String!): DinoEffWeight! @requireAuth
  }
`
