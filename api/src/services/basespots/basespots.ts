import type {
  QueryResolvers,
  MutationResolvers,
  BasespotRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";
import { requireAuth } from "src/lib/auth";
import { prismaVersion } from "@redwoodjs/api";

const POSTS_PER_PAGE = 6;
export const basespotPage: QueryResolvers["basespotPage"] = ({
  page,
  map,
  type,
}) => {
  const offset = (page - 1) * POSTS_PER_PAGE;
  const types = type?.split(",").map((t) => t.trim());
  const where = {
    ...(map && { map_id: map }),
    ...(type && {
      type: {
        in: types,
      },
    }),
  };
  return {
    basespots: db.basespot.findMany({
      take: POSTS_PER_PAGE,
      skip: offset,
      orderBy: { created_at: "desc" },
      where: where,
    }),
    count: db.basespot.count({
      where: where,
    }),
  };
};

export const basespotsTypes: QueryResolvers["basespotTypes"] = () => {
  // return db.basespot.findMany();
  // return db.$queryRaw`SELECT type FROM Basespot;`;
  return db.basespot.groupBy({
    by: ["type"],
  });
  // return db.basespot.findMany({
  //   distinct: ["type"],
  // });
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
  Profile: (_obj, { root }) => {
    return db.basespot.findUnique({ where: { id: root?.id } }).Profile();
  },
  Map: (_obj, { root }) => {
    return db.basespot.findUnique({ where: { id: root?.id } }).Map();
  },
  Profile_Basespot_updated_byToProfile: (_obj, { root }) => {
    return db.basespot
      .findUnique({ where: { id: root?.id } })
      .Profile_Basespot_updated_byToProfile();
  },
  TimelineSeasonBasespot: (_obj, { root }) => {
    return db.basespot
      .findUnique({ where: { id: root?.id } })
      .TimelineSeasonBasespot();
  },
};
