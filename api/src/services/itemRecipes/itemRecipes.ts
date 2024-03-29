import type {
  QueryResolvers,
  MutationResolvers,
  ItemRecipeRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const itemRecipesByCraftingStations: QueryResolvers["itemRecipesByCraftingStations"] =
  ({ crafting_stations }: { crafting_stations: number[] }) => {
    return db.itemRecipe.findMany({
      where: {
        OR: [
          { crafting_station_id: { in: [126, ...crafting_stations] } },
          { crafting_station_id: { equals: null } },
        ],
        AND: [{ crafting_station_id: { notIn: [572, 525, 214] } }],
      },
      distinct: ["crafted_item_id"],
    });
  };

export const itemRecipesByItem: QueryResolvers["itemRecipesByItem"] = ({
  crafted_item_id,
}) => {
  return db.itemRecipe.findMany({
    where: { crafted_item_id: crafted_item_id },
  });
};

export const itemRecipes: QueryResolvers["itemRecipes"] = () => {
  const recipes = db.itemRecipe.findMany({
    where: { crafting_station_id: { notIn: [572, 525, 214] } },
    // distinct: ["crafted_item_id"],
    select: {
      id: true,
      crafting_time: true,
      crafting_station_id: true,
      yields: true,
      Item_ItemRecipe_crafted_item_idToItem: {
        select: {
          id: true,
          name: true,
          image: true,
          category: true,
          type: true,
        },
      },
      // ItemRecipeItem: {
      //   select: {
      //     id: true,
      //     amount: true,
      //     Item: {
      //       select: {
      //         id: true,
      //         name: true,
      //         image: true,
      //       },
      //     },
      //   },
      // },
    },
  });
  return recipes;
};

// export const itemRecipes: QueryResolvers['itemRecipes'] = () => {
//   return db.itemRecipe.findMany()
// }

export const itemRecipe: QueryResolvers["itemRecipe"] = ({ id }) => {
  return db.itemRecipe.findUnique({
    where: { id },
  });
};

export const createItemRecipe: MutationResolvers["createItemRecipe"] = ({
  input,
}) => {
  return db.itemRecipe.create({
    data: input,
  });
};

export const updateItemRecipe: MutationResolvers["updateItemRecipe"] = ({
  id,
  input,
}) => {
  return db.itemRecipe.update({
    data: input,
    where: { id },
  });
};

export const deleteItemRecipe: MutationResolvers["deleteItemRecipe"] = ({
  id,
}) => {
  return db.itemRecipe.delete({
    where: { id },
  });
};

export const ItemRecipe: ItemRecipeRelationResolvers = {
  Item_ItemRecipe_crafted_item_idToItem: (_obj, { root }) => {
    return db.itemRecipe
      .findUnique({ where: { id: root?.id } })
      .Item_ItemRecipe_crafted_item_idToItem();
  },
  Item_ItemRecipe_crafting_station_idToItem: (_obj, { root }) => {
    return db.itemRecipe
      .findUnique({ where: { id: root?.id } })
      .Item_ItemRecipe_crafting_station_idToItem();
  },
  ItemRecipeItem: (_obj, { root }) => {
    return db.itemRecipe
      .findUnique({ where: { id: root?.id } })
      .ItemRecipeItem();
  },
  UserRecipeItemRecipe: (_obj, { root }) => {
    return db.itemRecipe
      .findUnique({ where: { id: root?.id } })
      .UserRecipeItemRecipe();
  },
};
