import type {
  QueryResolvers,
  MutationResolvers,
  UserRecipeRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";
import { validateWithSync } from "@redwoodjs/api";

export const userRecipesByID: QueryResolvers["userRecipesByID"] = ({
  user_id,
}: {
  user_id?: string;
}) => {
  return db.userRecipe.findMany({
    orderBy: {
      created_at: "desc",
    },
    where: {
      OR: [
        {
          created_by: { equals: user_id },
        },
        {
          public_access: { equals: true },
        },
      ],
    },
  });
};

export const userRecipes: QueryResolvers["userRecipes"] = () => {
  const userID = context?.currentUser?.id || context?.currentUser?.sub;
  return db.userRecipe.findMany({
    orderBy: {
      created_at: "desc",
    },
    where: {
      OR: [
        userID && {
          created_by: {
            equals: userID,
          },
        },
        {
          public_access: { equals: true },
        },
      ],
    },
  });
};

export const userRecipe: QueryResolvers["userRecipe"] = ({ id }) => {
  return db.userRecipe.findUnique({
    where: { id },
  });
};

export const createUserRecipe: MutationResolvers["createUserRecipe"] = async ({
  input,
}) => {
  const recipes = await db.userRecipe.findMany({
    where: {
      created_by: { equals: input.created_by },
    },
  });
  validateWithSync(() => {
    if (recipes.length >= 10) {
      throw "You have reached the maximum number of recipes. Please delete one before adding another.";
    }
  });
  validateWithSync(() => {
    if (context.currentUser.id !== input.created_by) {
      throw "Your gallimimus outran the authorization process. Slow down!";
    }
  });
  return db.userRecipe.create({
    data: input,
  });
};

export const updateUserRecipe: MutationResolvers["updateUserRecipe"] = ({
  id,
  input,
}) => {
  validateWithSync(() => {
    if (context.currentUser.id !== input.created_by) {
      throw "Your gallimimus outran the authorization process. You cannot update others recipes";
    }
  });
  return db.userRecipe.update({
    data: input,
    where: { id },
  });
};

export const deleteUserRecipe: MutationResolvers["deleteUserRecipe"] = ({
  id,
}) => {
  return db.userRecipe.delete({
    where: {
      AND: [
        {
          id: { equals: id },
        },
        {
          created_by: { equals: context.currentUser.id },
        },
      ],
    },
  });
};

export const UserRecipe: UserRecipeRelationResolvers = {
  Profile: (_obj, { root }) => {
    return db.userRecipe.findUnique({ where: { id: root?.id } }).Profile();
  },
  UserRecipeItemRecipe: (_obj, { root }) => {
    return db.userRecipe
      .findUnique({ where: { id: root?.id } })
      .UserRecipeItemRecipe();
  },
};
