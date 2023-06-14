import type {
  QueryResolvers,
  MutationResolvers,
  DinoRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const dinosPage: QueryResolvers["dinosPage"] = ({
  page = 1,
  search = "",
  category = "",
  dinos_per_page = 36,
}: {
  page: number;
  search?: string;
  category?: string;
  dinos_per_page?: number;
}) => {
  const offset = (page - 1) * dinos_per_page;
  return {
    dinos: db.dino.findMany({
      take: dinos_per_page,
      skip: offset,
      orderBy: { name: "asc" },
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { synonyms: { contains: search, mode: "insensitive" } },
        ],
        AND: [category ? { type: { has: category } } : {}],
      },
    }),
    count: db.dino.count({
      where: {
        OR: [
          { name: { startsWith: search, mode: "insensitive" } },
          { synonyms: { contains: search, mode: "insensitive" } },
          category ? { type: { has: category } } : {},
        ],
      },
    }),
  };
};

export const dinos: QueryResolvers["dinos"] = () => {
  return db.dino.findMany();
};

export const dino: QueryResolvers["dino"] = ({ id }) => {
  return db.dino.findUnique({
    where: { id },
  });
};

export const createDino: MutationResolvers["createDino"] = ({ input }) => {
  return db.dino.create({
    data: input,
  });
};

export const updateDino: MutationResolvers["updateDino"] = ({ id, input }) => {
  return db.dino.update({
    data: input,
    where: { id },
  });
};

export const deleteDino: MutationResolvers["deleteDino"] = ({ id }) => {
  return db.dino.delete({
    where: { id },
  });
};

export const Dino: DinoRelationResolvers = {
  DinoStat: (_obj, { root }) => {
    return db.dino.findUnique({ where: { id: root?.id } }).DinoStat();
  },
  TimelineBasespotDino: (_obj, { root }) => {
    return db.dino
      .findUnique({ where: { id: root?.id } })
      .TimelineBasespotDino();
  },
};
