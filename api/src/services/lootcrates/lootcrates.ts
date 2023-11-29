import type {
  QueryResolvers,
  MutationResolvers,
  LootcrateRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const lootcratesByMap: QueryResolvers["lootcratesByMap"] = async ({
  map,
  search,
  type,
  color,
}: {
  map?: string;
  search?: string;
  type?: string;
  color?: string;
}) => {
  // !!type ? { type: { hasSome: type.split(",") } } : {},
  return db.lootcrate.findMany({
    orderBy: { name: "asc" },
    where:
      map || search || type || color
        ? {
            OR: [
              search
                ? {
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
                  }
                : {},
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
              search
                ? {
                    name: {
                      mode: "insensitive",
                      contains: search,
                    },
                  }
                : {},
              search
                ? {
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
                  }
                : {},
              color
                ? {
                    color: {
                      in: color.split(","),
                    },
                  }
                : {},
            ],
          }
        : {},
  });
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
