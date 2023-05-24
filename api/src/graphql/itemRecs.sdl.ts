export const schema = gql`
  type ItemRec {
    id: String!
    created_at: DateTime!
    updated_at: DateTime
    crafted_item_id: BigInt!
    crafting_station_id: BigInt
    crafting_time: Float
    yields: Float!
    Item_ItemRec_crafted_item_idToItem: Item!
    Item_ItemRec_crafting_station_idToItem: Item
    ItemRecipeItem: [ItemRecipeItem]!
  }

  type Query {
    itemRecs: [ItemRec!]! @skipAuth
    itemRec(id: String!): ItemRec @skipAuth
  }

  input CreateItemRecInput {
    created_at: DateTime!
    updated_at: DateTime
    crafted_item_id: BigInt!
    crafting_station_id: BigInt
    crafting_time: Float
    yields: Float!
  }

  input UpdateItemRecInput {
    created_at: DateTime
    updated_at: DateTime
    crafted_item_id: BigInt
    crafting_station_id: BigInt
    crafting_time: Float
    yields: Float
  }

  type Mutation {
    createItemRec(input: CreateItemRecInput!): ItemRec!
      @requireAuth
      @hasPermission(permission: "gamedata_create")
    updateItemRec(id: String!, input: UpdateItemRecInput!): ItemRec!
      @requireAuth
      @hasPermission(permission: "gamedata_update")
    deleteItemRec(id: String!): ItemRec!
      @requireAuth
      @hasPermission(permission: "gamedata_delete")
  }
`;
