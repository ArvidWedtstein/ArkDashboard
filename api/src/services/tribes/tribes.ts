import type { QueryResolvers, MutationResolvers } from "types/graphql";

import { db } from "src/lib/db";

export const tribes: QueryResolvers["tribes"] = () => {
  return db.tribe.findMany();
};

export const tribe: QueryResolvers["tribe"] = ({ id }) => {
  return db.tribe.findUnique({
    where: { id },
  });
};

export const createTribe: MutationResolvers["createTribe"] = ({ input }) => {
  return db.tribe.create({
    data: input,
  });
};

export const updateTribe: MutationResolvers["updateTribe"] = ({
  id,
  input,
}) => {
  return db.tribe.update({
    data: input,
    where: { id },
  });
};

export const deleteTribe: MutationResolvers["deleteTribe"] = ({ id }) => {
  return db.tribe.delete({
    where: { id },
  });
};
