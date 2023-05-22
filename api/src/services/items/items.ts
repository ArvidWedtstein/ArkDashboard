import type {
  QueryResolvers,
  MutationResolvers,
  ItemRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const itemsPage = ({
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
export const itemsByIds = ({ id }: { id: number[] }) => {
  return db.item.findMany({
    where: { id: { in: id } },
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
    include: {
      ItemRecipe_ItemRecipe_crafted_item_idToItem: true,
    },
    data: input,
  });
};

export const updateItem: MutationResolvers["updateItem"] = ({ id, input }) => {
  return db.item.update({
    include: {
      ItemRecipe_ItemRecipe_crafted_item_idToItem: true,
    },
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
  ItemRec_ItemRec_crafted_item_idToItem: (_obj, { root }) => {
    return db.item
      .findUnique({ where: { id: root?.id } })
      .ItemRec_ItemRec_crafted_item_idToItem();
  },
  ItemRec_ItemRec_crafting_station_idToItem: (_obj, { root }) => {
    return db.item
      .findUnique({ where: { id: root?.id } })
      .ItemRec_ItemRec_crafting_station_idToItem();
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
  ItemRecipeItem: (_obj, { root }) => {
    return db.item.findUnique({ where: { id: root?.id } }).ItemRecipeItem();
  },
  LootcrateSetEntryItem: (_obj, { root }) => {
    return db.item
      .findUnique({ where: { id: root?.id } })
      .LootcrateSetEntryItem();
  },
};
