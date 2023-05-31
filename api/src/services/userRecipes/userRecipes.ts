import type {
  QueryResolvers,
  MutationResolvers,
  UserRecipeRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const userRecipes: QueryResolvers['userRecipes'] = () => {
  return db.userRecipe.findMany()
}

export const userRecipe: QueryResolvers['userRecipe'] = ({ id }) => {
  return db.userRecipe.findUnique({
    where: { id },
  })
}

export const createUserRecipe: MutationResolvers['createUserRecipe'] = ({
  input,
}) => {
  return db.userRecipe.create({
    data: input,
  })
}

export const updateUserRecipe: MutationResolvers['updateUserRecipe'] = ({
  id,
  input,
}) => {
  return db.userRecipe.update({
    data: input,
    where: { id },
  })
}

export const deleteUserRecipe: MutationResolvers['deleteUserRecipe'] = ({
  id,
}) => {
  return db.userRecipe.delete({
    where: { id },
  })
}

export const UserRecipe: UserRecipeRelationResolvers = {
  Profile: (_obj, { root }) => {
    return db.userRecipe.findUnique({ where: { id: root?.id } }).Profile()
  },
  UserRecipeItemRecipe: (_obj, { root }) => {
    return db.userRecipe
      .findUnique({ where: { id: root?.id } })
      .UserRecipeItemRecipe()
  },
}