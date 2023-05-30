import type {
  QueryResolvers,
  MutationResolvers,
  BasespotRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";
import { requireAuth } from "src/lib/auth";

const POSTS_PER_PAGE = 6;
export const basespotPage: QueryResolvers["basespotPage"] = ({
  page,
  map,
}: {
  page: number;
  map?: number;
}) => {
  const offset = (page - 1) * POSTS_PER_PAGE;
  return {
    basespots: db.basespot.findMany({
      take: POSTS_PER_PAGE,
      skip: offset,
      orderBy: { created_at: "desc" },
      where: map ? { map: map } : {},
    }),
    count: db.basespot.count({
      where: map ? { map: map } : {},
    }),
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
  requireAuth({ roles: "f0c1b8e9-5f27-4430-ad8f-5349f83339c0" });
  return db.basespot.create({
    data: input,
  });
};

export const updateBasespot: MutationResolvers["updateBasespot"] = ({
  id,
  input,
}) => {
  requireAuth({ roles: "f0c1b8e9-5f27-4430-ad8f-5349f83339c0" });

  return db.basespot.update({
    data: input,
    where: { id },
  });
};

export const deleteBasespot: MutationResolvers["deleteBasespot"] = ({ id }) => {
  requireAuth({ roles: "f0c1b8e9-5f27-4430-ad8f-5349f83339c0" });
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
