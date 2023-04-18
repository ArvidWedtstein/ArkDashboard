import type {
  QueryResolvers,
  MutationResolvers,
  BasespotRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

const POSTS_PER_PAGE = 6;
export const basespotPage = ({ page = 1 }: { page: number }) => {
  const offset = (page - 1) * POSTS_PER_PAGE;

  return {
    basespots: db.basespot.findMany({
      take: POSTS_PER_PAGE,
      skip: offset,
      orderBy: { created_at: "desc" },
    }),
    count: db.basespot.count(),
  };
};

export const basespots: QueryResolvers["basespots"] = () => {
  return db.basespot.findMany();
};

export const basespot: QueryResolvers["basespot"] = ({ id }) => {
  return db.basespot.findUnique({
    where: { id },
  });
};

export const createBasespot: MutationResolvers["createBasespot"] = ({
  input,
}) => {
  return db.basespot.create({
    data: input,
  });
};

export const updateBasespot: MutationResolvers["updateBasespot"] = ({
  id,
  input,
}) => {
  return db.basespot.update({
    data: input,
    where: { id },
  });
};

export const deleteBasespot: MutationResolvers["deleteBasespot"] = ({ id }) => {
  return db.basespot.delete({
    where: { id },
  });
};

export const Basespot: BasespotRelationResolvers = {
  Map: (_obj, { root }) => {
    return db.basespot.findUnique({ where: { id: root?.id } }).Map();
  },
  TimelineBasespot: (_obj, { root }) => {
    return db.basespot
      .findUnique({ where: { id: root?.id } })
      .TimelineBasespot();
  },
};
