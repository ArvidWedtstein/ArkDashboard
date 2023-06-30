import type {
  QueryResolvers,
  MutationResolvers,
  TimelineBasespotRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const timelineBasespots: QueryResolvers["timelineBasespots"] = () => {
  return db.timelineBasespot.findMany({
    orderBy: { start_date: "asc" },
  });
};

export const timelineBasespot: QueryResolvers["timelineBasespot"] = ({
  id,
}) => {
  return db.timelineBasespot.findUnique({
    where: { id },
  });
};

export const createTimelineBasespot: MutationResolvers["createTimelineBasespot"] =
  ({ input }) => {
    return db.timelineBasespot.create({
      data: input,
    });
  };

export const updateTimelineBasespot: MutationResolvers["updateTimelineBasespot"] =
  ({ id, input }) => {
    return db.timelineBasespot.update({
      data: input,
      where: { id },
    });
  };

export const deleteTimelineBasespot: MutationResolvers["deleteTimelineBasespot"] =
  ({ id }) => {
    return db.timelineBasespot.delete({
      where: { id },
    });
  };

export const TimelineBasespot: TimelineBasespotRelationResolvers = {
  basespot: (_obj, { root }) => {
    return db.timelineBasespot
      .findUnique({ where: { id: root?.id } })
      .basespot();
  },
  Profile: (_obj, { root }) => {
    return db.timelineBasespot
      .findUnique({ where: { id: root?.id } })
      .Profile();
  },
  Map: (_obj, { root }) => {
    return db.timelineBasespot.findUnique({ where: { id: root?.id } }).Map();
  },
  TimelineBasespotDino: (_obj, { root }) => {
    return db.timelineBasespot
      .findUnique({ where: { id: root?.id } })
      .TimelineBasespotDino();
  },
  TimelineBasespotPerson: (_obj, { root }) => {
    return db.timelineBasespot
      .findUnique({ where: { id: root?.id } })
      .TimelineBasespotPerson();
  },
  TimelineBasespotRaid: (_obj, { root }) => {
    return db.timelineBasespot
      .findUnique({ where: { id: root?.id } })
      .TimelineBasespotRaid();
  },
};
