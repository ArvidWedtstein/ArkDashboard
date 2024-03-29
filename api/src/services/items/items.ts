import type {
  QueryResolvers,
  MutationResolvers,
  ItemRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";
import { validate, validateWithSync } from "@redwoodjs/api";

// TODO: Outsource old, unused queries
export const craftingItems: QueryResolvers["craftingItems"] = () => {
  // Returns the items that are either used in a recipe or have a recipe or are a crafting station.
  return db.item.findMany({
    // include: {
    //   ItemRecipe_ItemRecipe_crafted_item_idToItem: true,
    //   ItemRecipe_ItemRecipe_crafting_station_idToItem: true,
    // },
    where: {
      OR: [
        {
          ItemRecipe_ItemRecipe_crafted_item_idToItem: {
            some: {},
          },
        },
        {
          ItemRecipeItem: {
            some: {},
          },
        },
        {
          ItemRecipe_ItemRecipe_crafting_station_idToItem: {
            some: {},
          },
        },
      ],
    },
  });
};

export const itemsPage: QueryResolvers["itemsPage"] = ({
  page = 1,
  search = "",
  category = "",
  type = "",
}: {
  page: number;
  search?: string;
  category?: string;
  type?: string;
}) => {
  // https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance
  const offset = (page - 1) * 36;
  // validateWithSync(() => {
  //   if (
  //     !context.currentUser.permissions.some((d) => d.includes("items:read"))
  //   ) {
  //     throw "Your gallimimus outran the authorization process. Slow down!";
  //   }
  // });
  return {
    items: db.item.findMany({
      take: 36,
      skip: offset,
      orderBy: { name: "asc" },
      where: {
        AND: [
          { name: { startsWith: search, mode: "insensitive" } },
          category ? { category: { in: category.split(",") } } : {},
          type ? { type: { contains: type, mode: "insensitive" } } : {},
          { visible: true },
        ],
      },
    }),
    // categories: db.item.findMany({
    //   select: { category: true },
    //   distinct: ["category"],
    //   where: {
    //     visible: true,
    //   },
    // }),
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
