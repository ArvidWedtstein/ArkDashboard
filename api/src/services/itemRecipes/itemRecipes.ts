import type {
  QueryResolvers,
  MutationResolvers,
  ItemRecipeRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const itemRecipes: QueryResolvers['itemRecipes'] = () => {
  return db.itemRecipe.findMany()
}

export const itemRecipe: QueryResolvers['itemRecipe'] = ({ id }) => {
  return db.itemRecipe.findUnique({
    where: { id },
  })
}

export const createItemRecipe: MutationResolvers['createItemRecipe'] = ({
  input,
}) => {
  return db.itemRecipe.create({
    data: input,
  })
}

export const updateItemRecipe: MutationResolvers['updateItemRecipe'] = ({
  id,
  input,
}) => {
  return db.itemRecipe.update({
    data: input,
    where: { id },
  })
}

export const deleteItemRecipe: MutationResolvers['deleteItemRecipe'] = ({
  id,
}) => {
  return db.itemRecipe.delete({
    where: { id },
  })
}

export const ItemRecipe: ItemRecipeRelationResolvers = {
  Item_ItemRecipe_crafted_item_idToItem: (_obj, { root }) => {
    return db.itemRecipe
      .findUnique({ where: { id: root?.id } })
      .Item_ItemRecipe_crafted_item_idToItem()
  },
  Item_ItemRecipe_crafting_stationToItem: (_obj, { root }) => {
    return db.itemRecipe
      .findUnique({ where: { id: root?.id } })
      .Item_ItemRecipe_crafting_stationToItem()
  },
  Item_ItemRecipe_item_idToItem: (_obj, { root }) => {
    return db.itemRecipe
      .findUnique({ where: { id: root?.id } })
      .Item_ItemRecipe_item_idToItem()
  },
}
