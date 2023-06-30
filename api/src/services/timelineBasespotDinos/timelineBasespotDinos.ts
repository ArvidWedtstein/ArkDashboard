import type {
  QueryResolvers,
  MutationResolvers,
  TimelineBasespotDinoRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const timelineBasespotDinos: QueryResolvers["timelineBasespotDinos"] =
  () => {
    return db.timelineBasespotDino.findMany();
  };

export const timelineBasespotDino: QueryResolvers["timelineBasespotDino"] = ({
  id,
}) => {
  return db.timelineBasespotDino.findUnique({
    where: { id },
  });
};

export const createTimelineBasespotDino: MutationResolvers["createTimelineBasespotDino"] =
  ({ input }) => {
    return db.timelineBasespotDino.create({
      data: input,
    });
  };

export const updateTimelineBasespotDino: MutationResolvers["updateTimelineBasespotDino"] =
  ({ id, input }) => {
    return db.timelineBasespotDino.update({
      data: input,
      where: { id },
    });
  };

export const deleteTimelineBasespotDino: MutationResolvers["deleteTimelineBasespotDino"] =
  ({ id }) => {
    return db.timelineBasespotDino.delete({
      where: { id },
    });
  };

export const TimelineBasespotDino: TimelineBasespotDinoRelationResolvers = {
  Dino: (_obj, { root }) => {
    return db.timelineBasespotDino
      .findUnique({ where: { id: root?.id } })
      .Dino();
  },
  TimelineBasespot: (_obj, { root }) => {
    return db.timelineBasespotDino
      .findUnique({ where: { id: root?.id } })
      .TimelineBasespot();
  },
};
