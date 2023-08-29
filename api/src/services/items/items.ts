import type {
  QueryResolvers,
  MutationResolvers,
  ItemRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";
import { validate, validateWithSync } from "@redwoodjs/api";

export const itemsPage: QueryResolvers["itemsPage"] = ({
  page = 1,
  search = "",
  category = "",
  type = "",
  items_per_page = 36,
}: {
  page: number;
  search?: string;
  category?: string;
  type?: string;
  items_per_page?: number;
}) => {
  const offset = (page - 1) * items_per_page;
  // validateWithSync(() => {
  //   if (
  //     !context.currentUser.permissions.some((d) => d.includes("items:read"))
  //   ) {
  //     throw "Your gallimimus outran the authorization process. Slow down!";
  //   }
  // });
  return {
    items: db.item.findMany({
      take: items_per_page,
      skip: offset,
      orderBy: { name: "asc" },
      where: {
        AND: [
          { name: { startsWith: search, mode: "insensitive" } },
          category
            ? { category: { contains: category, mode: "insensitive" } }
            : {},
          type ? { type: { contains: type, mode: "insensitive" } } : {},
          { visible: true },
        ],
      },
    }),
    count: db.item.count({
      where: {
        AND: [
          { name: { startsWith: search, mode: "insensitive" } },
          category
            ? { category: { contains: category, mode: "insensitive" } }
            : {},
          type ? { type: { contains: type, mode: "insensitive" } } : {},
        ],
      },
    }),
  };
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment      <-- Necessary for my ESLint setup
// @ts-ignore: Unreachable code error
export const itemsByCategory: QueryResolvers["itemsByCategory"] = ({
  category,
  type,
}: {
  category: string;
  type?: string;
}) => {
  const categories = category.split(",");
  return {
    items: db.item.findMany({
      where: { category: { in: categories, mode: "insensitive" } },
      orderBy: { created_at: "desc" },
    }),
    count: db.item.count({
      where: { category: { in: categories, mode: "insensitive" } },
    }),
  };
};
export const itemsByIds: QueryResolvers["itemsByIds"] = ({
  ids,
}: {
  ids: number[];
}) => {
  return db.item.findMany({
    where: { id: { in: ids } },
  });
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
    data: input,
  });
};

export const updateItem: MutationResolvers["updateItem"] = ({ id, input }) => {
  return db.item.update({
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
  DinoStat: (_obj, { root }) => {
    return db.item.findUnique({ where: { id: root?.id } }).DinoStat();
  },
  ItemRecipe_ItemRecipe_crafted_item_idToItem: (_obj, { root }) => {
    return db.item
      .findUnique({ where: { id: root?.id } })
      .ItemRecipe_ItemRecipe_crafted_item_idToItem();
  },
  ItemRecipe_ItemRecipe_crafting_station_idToItem: (_obj, { root }) => {
    return db.item
      .findUnique({ where: { id: root?.id } })
      .ItemRecipe_ItemRecipe_crafting_station_idToItem();
  },
  ItemRecipeItem: (_obj, { root }) => {
    return db.item.findUnique({ where: { id: root?.id } }).ItemRecipeItem();
  },
  LootcrateItem: (_obj, { root }) => {
    return db.item.findUnique({ where: { id: root?.id } }).LootcrateItem();
  },
  MapResource: (_obj, { root }) => {
    return db.item.findUnique({ where: { id: root?.id } }).MapResource();
  },
};
