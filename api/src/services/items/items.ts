import type {
  QueryResolvers,
  MutationResolvers,
  ItemRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const itemsPage = ({
  page = 1,
  items_per_page = 36,
}: {
  page: number;
  items_per_page?: number;
}) => {
  const offset = (page - 1) * items_per_page;
  return {
    items: db.item.findMany({
      take: items_per_page,
      skip: offset,
      orderBy: { name: "asc" },
    }),
    count: db.item.count(),
  };
};

export const itemsByCategory: QueryResolvers["itemsByCategory"] = ({
  category,
}: {
  category: string;
}) => {
  return {
    items: db.item.findMany({
      where: { category: category },
      orderBy: { created_at: "desc" },
    }),
    count: db.item.count({ where: { type: category } }),
  };
};

export const items: QueryResolvers["items"] = () => {
  return db.item.findMany();
};

export const item: QueryResolvers["item"] = ({ id }) => {
  return db.item.findUnique({
    where: { id },
  });
};

export const createItem: MutationResolvers["createItem"] = ({ input }) => {
  return db.item.create({
    include: {
      ItemRecipe_ItemRecipe_crafted_item_idToItem: true,
    },
    data: input,
  });
};
// https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#connect-or-create-a-record
export const updateItem: MutationResolvers["updateItem"] = ({ id, input }) => {
  return db.item.update({
    include: {
      ItemRecipe_ItemRecipe_crafted_item_idToItem: true,
    },
    // data: {
    //   ItemRecipe_ItemRecipe_crafted_item_idToItem: {
    //     upsert: [
    //       {
    //         create: {
    //           item_id: input.ItemRecipe_ItemRecipe_crafted_item_idToItem[0]
    //             .item_id,
    //         },
    //         update: {
    //           item_id: input.ItemRecipe_ItemRecipe_crafted_item_idToItem[0]
    //             .item_id,
    //         },
    //         where: {
    //           item_id: input.ItemRecipe_ItemRecipe_crafted_item_idToItem[0]
    //             .item_id,
    //         },
    //       }
    //     ]
    //   },
    // },
    data: input,
    where: { id },
  });
};

export const deleteItem: MutationResolvers["deleteItem"] = ({ id }) => {
  return db.item.delete({
    where: { id },
  });
};

export const Item: ItemRelationResolvers = {
  Dino: (_obj, { root }) => {
    return db.item.findUnique({ where: { id: root?.id } }).Dino();
  },
  DinoStat: (_obj, { root }) => {
    return db.item.findUnique({ where: { id: root?.id } }).DinoStat();
  },
  ItemRecipe_ItemRecipe_crafted_item_idToItem: (_obj, { root }) => {
    return db.item
      .findUnique({ where: { id: root?.id } })
      .ItemRecipe_ItemRecipe_crafted_item_idToItem();
  },
  ItemRecipe_ItemRecipe_crafting_stationToItem: (_obj, { root }) => {
    return db.item
      .findUnique({ where: { id: root?.id } })
      .ItemRecipe_ItemRecipe_crafting_stationToItem();
  },
  ItemRecipe_ItemRecipe_item_idToItem: (_obj, { root }) => {
    return db.item
      .findUnique({ where: { id: root?.id } })
      .ItemRecipe_ItemRecipe_item_idToItem();
  },
  LootcrateSetEntryItem: (_obj, { root }) => {
    return db.item
      .findUnique({ where: { id: root?.id } })
      .LootcrateSetEntryItem();
  },
};
