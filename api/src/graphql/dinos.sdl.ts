export const schema = gql`
  type Dino {
    id: String!
    created_at: DateTime
    name: String!
    synonyms: String
    description: String
    taming_notice: String
    can_destroy: [String]!
    base_stats: JSON
    exp_per_kill: Float
    egg_min: Float
    egg_max: Float
    maturation_time: Float
    incubation_time: Float
    affinity_needed: Float
    aff_inc: Float
    flee_threshold: Float
    hitboxes: JSON
    food_consumption_base: Float
    food_consumption_mult: Float
    taming_ineffectiveness: Float
    disable_food: Boolean
    disable_mult: Boolean
    admin_note: String
    base_points: Float
    non_violent_food_affinity_mult: Float
    non_violent_food_rate_mult: Float
    taming_interval: Float
    base_taming_time: Float
    attack: JSON
    mounted_weaponry: Boolean
    ridable: Boolean
    movement: JSON
    type: [String]!
    carryable_by: [String]!
    icon: String
    image: String
    multipliers: JSON
    baby_food_consumption_mult: Float
    gestation_time: Float
    mating_cooldown_min: BigInt
    mating_cooldown_max: BigInt
    temperament: String
    diet: String
    released: DateTime
    tamable: Boolean
    breedable: Boolean
    bp: String
    default_dmg: Float
    default_swing_radius: Float
    targeting_team_name: String
    flags: JSON
    drag_weight: Float
    taming_method: String
    variants: [String]!
    torpor_immune: Boolean
    torpor_depetion_per_second: Float
    DinoStat: [DinoStat]!
  }

  type DinosPage {
    dinos: [Dino!]
    diets: [JSON]
    temperaments: [JSON]
    count: Int
  }

  type Query {
    dinos: [Dino!]! @skipAuth
    dino(id: String!): Dino @skipAuth
    dinosPage(
      page: Int
      search: String
      type: String
      diet: String
      temperament: String
    ): DinosPage! @skipAuth
  }

  input CreateDinoInput {
    created_at: DateTime
    name: String!
    synonyms: String
    description: String
    taming_notice: String
    can_destroy: [String]!
    base_stats: JSON
    exp_per_kill: Float
    egg_min: Float
    egg_max: Float
    maturation_time: Float
    incubation_time: Float
    affinity_needed: Float
    aff_inc: Float
    flee_threshold: Float
    hitboxes: JSON
    food_consumption_base: Float
    food_consumption_mult: Float
    taming_ineffectiveness: Float
    disable_food: Boolean
    disable_mult: Boolean
    admin_note: String
    base_points: Float
    non_violent_food_affinity_mult: Float
    non_violent_food_rate_mult: Float
    taming_interval: Float
    base_taming_time: Float
    attack: JSON
    mounted_weaponry: Boolean
    ridable: Boolean
    movement: JSON
    type: [String]!
    carryable_by: [String]!
    icon: String
    image: String
    multipliers: JSON
    baby_food_consumption_mult: Float
    gestation_time: Float
    mating_cooldown_min: BigInt
    mating_cooldown_max: BigInt
    temperament: String
    diet: String
    released: DateTime
    tamable: Boolean
    breedable: Boolean
    bp: String
    default_dmg: Float
    default_swing_radius: Float
    targeting_team_name: String
    flags: JSON
    drag_weight: Float
    taming_method: String
    variants: [String]!
    torpor_immune: Boolean
    torpor_depetion_per_second: Float
  }

  input UpdateDinoInput {
    created_at: DateTime
    name: String
    synonyms: String
    description: String
    taming_notice: String
    can_destroy: [String]!
    base_stats: JSON
    exp_per_kill: Float
    egg_min: Float
    egg_max: Float
    maturation_time: Float
    incubation_time: Float
    affinity_needed: Float
    aff_inc: Float
    flee_threshold: Float
    hitboxes: JSON
    food_consumption_base: Float
    food_consumption_mult: Float
    taming_ineffectiveness: Float
    disable_food: Boolean
    disable_mult: Boolean
    admin_note: String
    base_points: Float
    non_violent_food_affinity_mult: Float
    non_violent_food_rate_mult: Float
    taming_interval: Float
    base_taming_time: Float
    attack: JSON
    mounted_weaponry: Boolean
    ridable: Boolean
    movement: JSON
    type: [String]!
    carryable_by: [String]!
    icon: String
    image: String
    multipliers: JSON
    baby_food_consumption_mult: Float
    gestation_time: Float
    mating_cooldown_min: BigInt
    mating_cooldown_max: BigInt
    temperament: String
    diet: String
    released: DateTime
    tamable: Boolean
    breedable: Boolean
    bp: String
    default_dmg: Float
    default_swing_radius: Float
    targeting_team_name: String
    flags: JSON
    drag_weight: Float
    taming_method: String
    variants: [String]!
    torpor_immune: Boolean
    torpor_depetion_per_second: Float
  }

  type Mutation {
    createDino(input: CreateDinoInput!): Dino!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateDino(id: String!, input: UpdateDinoInput!): Dino!
      @requireAuth
      @hasPermission(permission: "gamedata_update")
    deleteDino(id: String!): Dino!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
