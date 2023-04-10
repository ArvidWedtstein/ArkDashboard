export const schema = gql`
  type Dino {
    id: String!
    created_at: DateTime
    name: String!
    synonyms: [String]!
    description: String
    taming_notice: String
    can_destroy: [String]!
    immobilized_by: [String]!
    base_stats: JSON
    gather_eff: JSON
    exp_per_kill: Float
    fits_through: [String]!
    egg_min: Float
    egg_max: Float
    tdps: Float
    eats: [String]!
    maturation_time: String
    weight_reduction: JSON
    incubation_time: Float
    affinity_needed: Float
    aff_inc: Float
    flee_threshold: Float
    hitboxes: JSON
    drops: [String]!
    food_consumption_base: Float
    food_consumption_mult: Float
    disable_ko: Boolean
    violent_tame: Boolean
    taming_bonus_attr: Float
    disable_food: Boolean
    disable_mult: Boolean
    water_movement: Boolean
    admin_note: String
    base_points: Float
    method: [String]!
    knockout: [String]!
    non_violent_food_affinity_mult: Float
    non_violent_food_rate_mult: Float
    taming_interval: Float
    base_taming_time: Float
    disable_tame: Boolean
    x_variant: Boolean
    attack: JSON
    mounted_weaponry: Boolean
    ridable: Boolean
    flyer_dino: Boolean
    water_dino: Boolean
    movement: JSON
    type: [String]!
    carryable_by: [String]!
    DinoStat: [DinoStat]!
    TimelineBasespotDino: [TimelineBasespotDino]!
  }
  type DinosPage {
    dinos: [Dino!]!
    count: Int!
  }
  type Query {
    dinos: [Dino!]! @skipAuth
    dino(id: String!): Dino @skipAuth
    dinosPage(page: Int): DinosPage @skipAuth
  }

  input CreateDinoInput {
    created_at: DateTime
    name: String!
    synonyms: [String]!
    description: String
    taming_notice: String
    can_destroy: [String]!
    immobilized_by: [String]!
    base_stats: JSON
    gather_eff: JSON
    exp_per_kill: Float
    fits_through: [String]!
    egg_min: Float
    egg_max: Float
    tdps: Float
    eats: [String]!
    maturation_time: String
    weight_reduction: JSON
    incubation_time: Float
    affinity_needed: Float
    aff_inc: Float
    flee_threshold: Float
    hitboxes: JSON
    drops: [String]!
    food_consumption_base: Float
    food_consumption_mult: Float
    disable_ko: Boolean
    violent_tame: Boolean
    taming_bonus_attr: Float
    disable_food: Boolean
    disable_mult: Boolean
    water_movement: Boolean
    admin_note: String
    base_points: Float
    method: [String]!
    knockout: [String]!
    non_violent_food_affinity_mult: Float
    non_violent_food_rate_mult: Float
    taming_interval: Float
    base_taming_time: Float
    disable_tame: Boolean
    x_variant: Boolean
    attack: JSON
    mounted_weaponry: Boolean
    ridable: Boolean
    flyer_dino: Boolean
    water_dino: Boolean
    movement: JSON
    type: [String]!
    carryable_by: [String]!
  }

  input UpdateDinoInput {
    created_at: DateTime
    name: String
    synonyms: [String]!
    description: String
    taming_notice: String
    can_destroy: [String]!
    immobilized_by: [String]!
    base_stats: JSON
    gather_eff: JSON
    exp_per_kill: Float
    fits_through: [String]!
    egg_min: Float
    egg_max: Float
    tdps: Float
    eats: [String]!
    maturation_time: String
    weight_reduction: JSON
    incubation_time: Float
    affinity_needed: Float
    aff_inc: Float
    flee_threshold: Float
    hitboxes: JSON
    drops: [String]!
    food_consumption_base: Float
    food_consumption_mult: Float
    disable_ko: Boolean
    violent_tame: Boolean
    taming_bonus_attr: Float
    disable_food: Boolean
    disable_mult: Boolean
    water_movement: Boolean
    admin_note: String
    base_points: Float
    method: [String]!
    knockout: [String]!
    non_violent_food_affinity_mult: Float
    non_violent_food_rate_mult: Float
    taming_interval: Float
    base_taming_time: Float
    disable_tame: Boolean
    x_variant: Boolean
    attack: JSON
    mounted_weaponry: Boolean
    ridable: Boolean
    flyer_dino: Boolean
    water_dino: Boolean
    movement: JSON
    type: [String]!
    carryable_by: [String]!
  }

  type Mutation {
    createDino(input: CreateDinoInput!): Dino! @requireAuth
    updateDino(id: String!, input: UpdateDinoInput!): Dino! @requireAuth
    deleteDino(id: String!): Dino! @requireAuth
  }
`;
