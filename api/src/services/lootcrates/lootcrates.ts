import type {
  QueryResolvers,
  MutationResolvers,
  LootcrateRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const lootcratesByMap = ({
  map,
  search,
}: {
  map?: string;
  search?: string;
}) => {
  const lootcrates = db.lootcrate.findMany({
    orderBy: { name: "asc" },
    where: {
      OR: [
        {
          LootcrateMap: {
            some: {
              Map: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
        !isNaN(parseInt(map))
          ? {
              LootcrateMap: {
                some: {
                  map_id: {
                    equals: parseInt(map),
                  },
                },
              },
            }
          : {},
        {
          name: {
            mode: "insensitive",
            contains: search,
          },
        },
        {
          LootcrateItem: {
            some: {
              Item: {
                name: {
                  mode: "insensitive",
                  contains: search,
                },
              },
            },
          },
        },
      ],
    },
  });

  return lootcrates;
};

export const lootcrates: QueryResolvers["lootcrates"] = () => {
  return db.lootcrate.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const lootcrate: QueryResolvers["lootcrate"] = ({ id }) => {
  return db.lootcrate.findUnique({
    where: { id },
  });
};

export const createLootcrate: MutationResolvers["createLootcrate"] = ({
  input,
}) => {
  return db.lootcrate.create({
    data: input,
  });
};

export const updateLootcrate: MutationResolvers["updateLootcrate"] = ({
  id,
  input,
}) => {
  return db.lootcrate.update({
    data: input,
    where: { id },
  });
};

export const deleteLootcrate: MutationResolvers["deleteLootcrate"] = ({
  id,
}) => {
  return db.lootcrate.delete({
    where: { id },
  });
};

export const Lootcrate: LootcrateRelationResolvers = {
  LootcrateItem: (_obj, { root }) => {
    return db.lootcrate.findUnique({ where: { id: root?.id } }).LootcrateItem();
  },
  LootcrateMap: (_obj, { root }) => {
    return db.lootcrate.findUnique({ where: { id: root?.id } }).LootcrateMap();
  },
};
