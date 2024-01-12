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
    stats: JSON
    color: String
    type: String
    category: String!
    health: Float
    food: Float
    torpor: Float
    visible: Boolean
    affinity: Float
    torpor_duration: Float
    damage: Float
    blueprint: String
    crafting_speed_modifier: Float
    resource_consumption_multiplier: Float
    item_production_multiplier: Float
    DinoStat: [DinoStat]!
    ItemRecipe_ItemRecipe_crafted_item_idToItem: [ItemRecipe]!
    ItemRecipe_ItemRecipe_crafting_station_idToItem: [ItemRecipe]!
    ItemRecipeItem: [ItemRecipeItem]!
    LootcrateItem: [LootcrateItem]!
    MapResource: [MapResource]!
  }

  type ItemsPage {
    items: [Item!]!
    count: Int!
  }
  type Query {
    items: [Item!]! @skipAuth
    item(id: BigInt!): Item @skipAuth
    itemsPage(
      page: Int
      search: String
      category: String
      type: String
    ): ItemsPage @skipAuth
    itemsByCategory(category: String!): ItemsPage @skipAuth
    itemsByIds(ids: [BigInt!]!): [Item!]! @skipAuth
    craftingItems: [Item!]! @skipAuth
  }

  input CreateItemInput {
    created_at: DateTime
    name: String!
    description: String
    image: String
    max_stack: Float
    weight: Float
    engram_points: Float
    stats: JSON
    color: String
    type: String
    category: String!
    health: Float
    food: Float
    torpor: Float
    visible: Boolean
    affinity: Float
    torpor_duration: Float
    damage: Float
    blueprint: String
    crafting_speed_modifier: Float
    resource_consumption_multiplier: Float
    item_production_multiplier: Float
  }

  input UpdateItemInput {
    created_at: DateTime
    name: String
    description: String
    image: String
    max_stack: Float
    weight: Float
    engram_points: Float
    stats: JSON
    color: String
    type: String
    category: String
    health: Float
    food: Float
    torpor: Float
    visible: Boolean
    affinity: Float
    torpor_duration: Float
    damage: Float
    blueprint: String
    crafting_speed_modifier: Float
    resource_consumption_multiplier: Float
    item_production_multiplier: Float
  }

  type Mutation {
    createItem(input: CreateItemInput!): Item!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateItem(id: BigInt!, input: UpdateItemInput!): Item!
      @requireAuth
      @hasPermission(permission: "gamedata_update")
    deleteItem(id: BigInt!): Item!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
