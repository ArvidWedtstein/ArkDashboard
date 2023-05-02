import type {
  QueryResolvers,
  MutationResolvers,
  LootcrateSetEntryItemRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const lootcrateSetEntryItems: QueryResolvers["lootcrateSetEntryItems"] =
  () => {
    return db.lootcrateSetEntryItem.findMany();
  };

export const lootcrateSetEntryItem: QueryResolvers["lootcrateSetEntryItem"] = ({
  id,
}) => {
  return db.lootcrateSetEntryItem.findUnique({
    where: { id },
  });
};

export const createLootcrateSetEntryItem: MutationResolvers["createLootcrateSetEntryItem"] =
  ({ input }) => {
    return db.lootcrateSetEntryItem.create({
      data: input,
    });
  };

export const updateLootcrateSetEntryItem: MutationResolvers["updateLootcrateSetEntryItem"] =
  ({ id, input }) => {
    return db.lootcrateSetEntryItem.update({
      data: input,
      where: { id },
    });
  };

export const deleteLootcrateSetEntryItem: MutationResolvers["deleteLootcrateSetEntryItem"] =
  ({ id }) => {
    return db.lootcrateSetEntryItem.delete({
      where: { id },
    });
  };

export const LootcrateSetEntryItem: LootcrateSetEntryItemRelationResolvers = {
  LootcrateSetEntry: (_obj, { root }) => {
    return db.lootcrateSetEntryItem
      .findUnique({ where: { id: root?.id } })
      .LootcrateSetEntry();
  },
  Item: (_obj, { root }) => {
    return db.lootcrateSetEntryItem
      .findUnique({ where: { id: root?.id } })
      .Item();
  },
};
