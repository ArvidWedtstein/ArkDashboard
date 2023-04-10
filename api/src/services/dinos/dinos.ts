import type {
  QueryResolvers,
  MutationResolvers,
  DinoRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const dinos: QueryResolvers["dinos"] = () => {
  return db.dino.findMany();
};
export const dinosPage = ({
  page = 1,
  dinos_per_page = 36,
}: {
  page: number;
  dinos_per_page?: number;
}) => {
  const offset = (page - 1) * dinos_per_page;
  return {
    dinos: db.dino.findMany({
      take: dinos_per_page,
      skip: offset,
      orderBy: { name: "asc" },
    }),
    count: db.dino.count(),
  };
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
