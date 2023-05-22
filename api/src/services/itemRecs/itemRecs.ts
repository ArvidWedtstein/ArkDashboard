import type {
  QueryResolvers,
  MutationResolvers,
  ItemRecRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const itemRecs: QueryResolvers["itemRecs"] = () => {
  return db.itemRec.findMany();
};

export const itemRec: QueryResolvers["itemRec"] = ({ id }) => {
  return db.itemRec.findUnique({
    where: { id },
  });
};

export const createItemRec: MutationResolvers["createItemRec"] = ({
  input,
}) => {
  return db.itemRec.create({
    data: input,
  });
};

export const updateItemRec: MutationResolvers["updateItemRec"] = ({
  id,
  input,
}) => {
  return db.itemRec.update({
    data: input,
    where: { id },
  });
};

export const deleteItemRec: MutationResolvers["deleteItemRec"] = ({ id }) => {
  return db.itemRec.delete({
    where: { id },
  });
};

export const ItemRec: ItemRecRelationResolvers = {
  Item_ItemRec_crafted_item_idToItem: (_obj, { root }) => {
    return db.itemRec
      .findUnique({ where: { id: root?.id } })
      .Item_ItemRec_crafted_item_idToItem();
  },
  Item_ItemRec_crafting_station_idToItem: (_obj, { root }) => {
    return db.itemRec
      .findUnique({ where: { id: root?.id } })
      .Item_ItemRec_crafting_station_idToItem();
  },
  ItemRecipeItem: (_obj, { root }) => {
    return db.itemRec.findUnique({ where: { id: root?.id } }).ItemRecipeItem();
  },
};
