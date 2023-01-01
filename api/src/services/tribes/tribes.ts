import type { QueryResolvers, MutationResolvers } from "types/graphql";

import { db } from "src/lib/db";

export const tribes: QueryResolvers["tribes"] = () => {
  return db.tribe.findMany();
};
// const POSTS_PER_PAGE = 10;
// export const tribes = ({ page = 1 }: any) => {
//   const offset = (page - 1) * POSTS_PER_PAGE;
//   return {
//     tribes: db.tribe.findMany({
//       take: POSTS_PER_PAGE,
//       skip: offset,
//       orderBy: { created_at: "desc" },
//     }),
//     count: db.tribe.count(),
//   };
// };

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
