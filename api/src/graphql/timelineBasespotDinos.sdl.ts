export const schema = gql`
  type TimelineBasespotDino {
    id: String!
    created_at: DateTime
    updated_at: DateTime
    timelinebasespot_id: BigInt!
    dino_id: String!
    name: String
    birth_date: DateTime
    death_date: DateTime
    death_cause: String
    level_wild: BigInt
    level: BigInt
    health: Float
    stamina: Float
    oxygen: Float
    food: Float
    weight: Float
    melee_damage: Float
    movement_speed: Float
    torpor: Float
    gender: String
    wild_health: Float
    wild_stamina: Float
    wild_oxygen: Float
    wild_food: Float
    wild_weight: Float
    wild_melee_damage: Float
    wild_movement_speed: Float
    wild_torpor: Float
    Dino: Dino!
    TimelineBasespot: TimelineBasespot!
  }

  type Query {
    timelineBasespotDinos: [TimelineBasespotDino!]! @skipAuth
    timelineBasespotDino(id: String!): TimelineBasespotDino @skipAuth
  }

  input CreateTimelineBasespotDinoInput {
    created_at: DateTime
    updated_at: DateTime
    timelinebasespot_id: BigInt!
    dino_id: String!
    name: String
    birth_date: DateTime
    death_date: DateTime
    death_cause: String
    level_wild: BigInt
    level: BigInt
    health: Float
    stamina: Float
    oxygen: Float
    food: Float
    weight: Float
    melee_damage: Float
    movement_speed: Float
    torpor: Float
    gender: String
    wild_health: Float
    wild_stamina: Float
    wild_oxygen: Float
    wild_food: Float
    wild_weight: Float
    wild_melee_damage: Float
    wild_movement_speed: Float
    wild_torpor: Float
  }

  input UpdateTimelineBasespotDinoInput {
    created_at: DateTime
    updated_at: DateTime
    timelinebasespot_id: BigInt
    dino_id: String
    name: String
    birth_date: DateTime
    death_date: DateTime
    death_cause: String
    level_wild: BigInt
    level: BigInt
    health: Float
    stamina: Float
    oxygen: Float
    food: Float
    weight: Float
    melee_damage: Float
    movement_speed: Float
    torpor: Float
    gender: String
    wild_health: Float
    wild_stamina: Float
    wild_oxygen: Float
    wild_food: Float
    wild_weight: Float
    wild_melee_damage: Float
    wild_movement_speed: Float
    wild_torpor: Float
  }

  type Mutation {
    createTimelineBasespotDino(
      input: CreateTimelineBasespotDinoInput!
    ): TimelineBasespotDino! @requireAuth
    updateTimelineBasespotDino(
      id: String!
      input: UpdateTimelineBasespotDinoInput!
    ): TimelineBasespotDino! @requireAuth
    deleteTimelineBasespotDino(id: String!): TimelineBasespotDino! @requireAuth
  }
`;
