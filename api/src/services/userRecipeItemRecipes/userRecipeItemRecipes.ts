import type {
  QueryResolvers,
  MutationResolvers,
  UserRecipeItemRecipeRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const userRecipeItemRecipes: QueryResolvers["userRecipeItemRecipes"] =
  () => {
    return db.userRecipeItemRecipe.findMany();
  };

export const userRecipeItemRecipe: QueryResolvers["userRecipeItemRecipe"] = ({
  id,
}) => {
  return db.userRecipeItemRecipe.findUnique({
    where: { id },
  });
};

export const createUserRecipeItemRecipe: MutationResolvers["createUserRecipeItemRecipe"] =
  ({ input }) => {
    return db.userRecipeItemRecipe.create({
      data: input,
    });
  };

export const updateUserRecipeItemRecipe: MutationResolvers["updateUserRecipeItemRecipe"] =
  ({ id, input }) => {
    return db.userRecipeItemRecipe.update({
      data: input,
      where: { id },
    });
  };

export const deleteUserRecipeItemRecipe: MutationResolvers["deleteUserRecipeItemRecipe"] =
  ({ id }) => {
    return db.userRecipeItemRecipe.delete({
      where: { id },
    });
  };

export const UserRecipeItemRecipe: UserRecipeItemRecipeRelationResolvers = {
  ItemRecipe: (_obj, { root }) => {
    return db.userRecipeItemRecipe
      .findUnique({ where: { id: root?.id } })
      .ItemRecipe();
  },
  UserRecipe: (_obj, { root }) => {
    return db.userRecipeItemRecipe
      .findUnique({ where: { id: root?.id } })
      .UserRecipe();
  },
};
