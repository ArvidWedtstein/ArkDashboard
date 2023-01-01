import type { QueryResolvers, MutationResolvers } from "types/graphql";

import { db } from "src/lib/db";

const POSTS_PER_PAGE = 6;
export const timelineBasespotsPage = ({ page = 1 }: any) => {
  const offset = (page - 1) * POSTS_PER_PAGE;
  return {
    basespots: db.timeline_basespots.findMany({
      take: POSTS_PER_PAGE,
      skip: offset,
      orderBy: { created_at: "desc" },
    }),
    count: db.basespot.count(),
  };
};

export const timeline_basespots = () => {
  return db.timeline_basespots.findMany();
};
