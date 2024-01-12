import type {
  QueryResolvers,
  MutationResolvers,
  TribeRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";
import { validate, validateUniqueness } from "@redwoodjs/api";

export const tribes: QueryResolvers["tribes"] = () => {
  return db.tribe.findMany({
    orderBy: { created_at: "desc" },
  });
};

export const createTribe: MutationResolvers["createTribe"] = ({ input }) => {
  validate(input.name, "name", {
    presence: true,
    length: { minimum: 2, maximum: 255 },
  });
  return validateUniqueness(
    "tribe",
    { name: input.name },
    { message: "That tribe does already exist" },
    (db) => {
      return db.tribe.create({
        data: input,
      });
    }
  );
};

export const updateTribe: MutationResolvers["updateTribe"] = ({
  id,
  input,
}) => {
  validate(input.name, "name", {
    presence: true,
    length: { minimum: 2, maximum: 100 },
  });
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

export const Tribe: TribeRelationResolvers = {
  Profile: (_obj, { root }) => {
    return db.tribe.findUnique({ where: { id: root?.id } }).Profile();
  },
};
