import type {
  QueryResolvers,
  MutationResolvers,
  DinoRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const dinosPage: QueryResolvers["dinosPage"] = ({
  page = 1,
  search = "",
  diet = "",
  temperament = "",
  type = "",
}) => {
  const dinos_per_page = 36;
  const offset = (page - 1) * dinos_per_page;

  return {
    dinos: db.dino.findMany({
      take: dinos_per_page,
      skip: offset,
      orderBy: { name: "asc" },
      where: {
        AND: [
          {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { synonyms: { contains: search, mode: "insensitive" } },
            ],
          },
          !!type ? { type: { hasSome: type.split(",") } } : {},
          !!diet ? { diet: { in: diet.split(",") } } : {},
          !!temperament ? { temperament: { in: temperament.split(",") } } : {},
        ],
      },
    }),
    temperaments: db.dino.findMany({
      select: { temperament: true },
      distinct: ["temperament"],
    }),
    diets: db.dino.findMany({
      select: { diet: true },
      distinct: ["diet"],
    }),
    count: db.dino.count({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { synonyms: { contains: search, mode: "insensitive" } },
            ],
          },
          !!type ? { type: { hasSome: type.split(",") } } : {},
          !!diet ? { diet: { in: diet.split(",") } } : {},
          !!temperament ? { temperament: { in: temperament.split(",") } } : {},
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
};
