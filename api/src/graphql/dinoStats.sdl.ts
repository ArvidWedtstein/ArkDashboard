export const schema = gql`
  type DinoStat {
    id: String!
    created_at: DateTime
    updated_at: DateTime
    dino_id: String!
    item_id: BigInt!
    value: Float
    rank: BigInt
    type: dinostattype!
    Dino: Dino!
    Item: Item!
  }

  enum dinostattype {
    food
    gather_efficiency
    weight_reduction
    immobilized_by
    fits_through
    drops
    saddle
  }

  type Query {
    dinoStats: [DinoStat!]! @skipAuth
    dinoStat(id: String!): DinoStat @skipAuth
  }

  input CreateDinoStatInput {
    created_at: DateTime
    updated_at: DateTime
    dino_id: String!
    item_id: BigInt!
    value: Float
    rank: BigInt
    type: dinostattype!
  }

  input UpdateDinoStatInput {
    created_at: DateTime
    updated_at: DateTime
    dino_id: String
    item_id: BigInt
    value: Float
    rank: BigInt
    type: dinostattype
  }

  type Mutation {
    createDinoStat(input: CreateDinoStatInput!): DinoStat!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateDinoStat(id: String!, input: UpdateDinoStatInput!): DinoStat!
      @requireAuth
      @hasPermission(permission: "gamedata_update")
    deleteDinoStat(id: String!): DinoStat!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
