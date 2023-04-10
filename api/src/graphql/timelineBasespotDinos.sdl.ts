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
    health: JSON
    stamina: JSON
    oxygen: JSON
    food: JSON
    weight: JSON
    melee_damage: JSON
    movement_speed: JSON
    torpor: JSON
    gender: String
    Dino: Dino!
    TimelineBasespot: TimelineBasespot!
  }

  type Query {
    timelineBasespotDinos: [TimelineBasespotDino!]! @requireAuth
    timelineBasespotDino(id: String!): TimelineBasespotDino @requireAuth
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
    health: JSON
    stamina: JSON
    oxygen: JSON
    food: JSON
    weight: JSON
    melee_damage: JSON
    movement_speed: JSON
    torpor: JSON
    gender: String
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
    health: JSON
    stamina: JSON
    oxygen: JSON
    food: JSON
    weight: JSON
    melee_damage: JSON
    movement_speed: JSON
    torpor: JSON
    gender: String
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
`
