import type {
  QueryResolvers,
  MutationResolvers,
  LootcrateRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const lootcratesByMap = async ({
  map,
  search,
  types,
  color,
}: {
  map?: string;
  search?: string;
  types?: string;
  color?: string;
}) => {
  console.log("PARAMS", { map, search, types, color });

  // return db.lootcrate.findMany({
  //   orderBy: {
  //     name: "asc",
  //   },
  // });

  console.log(
    "SEARCH MAP",
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
      : {}
  );

  console.log(
    "SEARCH NAME",
    search
      ? {
          name: {
            mode: "insensitive",
            contains: search,
          },
        }
      : {}
  );

  console.log(
    "SEARCH ITEM",
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
      : {}
  );

  console.log(
    "SEARCH COLOR",
    color
      ? {
          color: {
            in: color.split(","),
          },
        }
      : {}
  );

  console.log(
    "SEARCH TYPE",
    types
      ? {
          type: {
            in: types.split(","),
          },
        }
      : {}
  );
  console.info("WHERE", {
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
      types
        ? {
            type: {
              in: types.split(","),
            },
          }
        : {},
    ],
  });
  return db.lootcrate.findMany({
    orderBy: { name: "asc" },
    where: {
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
        // color
        //   ? {
        //       color: {
        //         in: color.split(","),
        //       },
        //     }
        //   : {},
        // types
        //   ? {
        //       type: {
        //         in: types.split(","),
        //       },
        //     }
        //   : {},
      ],
    },
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
