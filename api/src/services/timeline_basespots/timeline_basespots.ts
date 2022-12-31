import type { QueryResolvers, MutationResolvers } from "types/graphql";

import { db } from "src/lib/db";

const POSTS_PER_PAGE = 6;
export const timelineBasespotsPage = ({ page = 1 }: any) => {
  const offset = (page - 1) * POSTS_PER_PAGE;
  return {
    basespots: db.timeline_basespots.findMany({
      take: POSTS_PER_PAGE,
      skip: offset,
      orderBy: { createdAt: "desc" },
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