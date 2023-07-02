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
          user_id: { equals: user_id },
        },
        {
          private: { equals: false },
        },
      ],
    },
  });
};

export const userRecipes: QueryResolvers["userRecipes"] = () => {
  return db.userRecipe.findMany({
    orderBy: {
      created_at: "desc",
    },
    where: {
      OR: [
        {
          user_id: {
            equals: context?.currentUser?.id || context?.currentUser.sub,
          },
        },
        {
          private: { equals: false },
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

export const createUserRecipe: MutationResolvers["createUserRecipe"] = ({
  input,
}) => {
  validateWithSync(() => {
    if (context.currentUser.id !== input.user_id) {
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
    if (context.currentUser.id !== input.user_id) {
      throw "Your gallimimus outran the authorization process. Slow down!";
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
    where: { id },
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
