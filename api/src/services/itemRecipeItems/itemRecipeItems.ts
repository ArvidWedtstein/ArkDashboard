import type {
  QueryResolvers,
  MutationResolvers,
  ItemRecipeItemRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const itemRecipeItems: QueryResolvers["itemRecipeItems"] = () => {
  return db.itemRecipeItem.findMany();
};
export const itemRecipeItemsByIds: QueryResolvers["itemRecipeItemsByIds"] = ({
  ids,
}) => {
  return db.itemRecipeItem.findMany({
    where: { item_recipe_id: { in: ids } },
  });
};

export const itemRecipeItem: QueryResolvers["itemRecipeItem"] = ({ id }) => {
  return db.itemRecipeItem.findUnique({
    where: { id },
  });
};

export const createItemRecipeItem: MutationResolvers["createItemRecipeItem"] =
  ({ input }) => {
    return db.itemRecipeItem.create({
      data: input,
    });
  };

export const updateItemRecipeItem: MutationResolvers["updateItemRecipeItem"] =
  ({ id, input }) => {
    return db.itemRecipeItem.update({
      data: input,
      where: { id },
    });
  };

export const deleteItemRecipeItem: MutationResolvers["deleteItemRecipeItem"] =
  ({ id }) => {
    return db.itemRecipeItem.delete({
      where: { id },
    });
  };

export const ItemRecipeItem: ItemRecipeItemRelationResolvers = {
  Item: (_obj, { root }) => {
    return db.itemRecipeItem.findUnique({ where: { id: root?.id } }).Item();
  },
  ItemRecipe: (_obj, { root }) => {
    return db.itemRecipeItem
      .findUnique({ where: { id: root?.id } })
      .ItemRecipe();
  },
};
