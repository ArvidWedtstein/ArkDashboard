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

export const raidTimelineBasespot: MutationResolvers["raidTimelineBasespot"] =
  ({ id, input }) => {
    // db.timelineBasespotDino.update({
    //   data: {
    //     death_date: new Date(),
    //   },
    //   where: { timelinebasespot_id: id },
    // });
    return db.timelineBasespot.update({
      data: {
        id,
        end_date: input.end_date || new Date(),
        raid_comment: input.raid_comment,
        raided_by: input.raided_by,
      },
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
  timeline: (_obj, { root }) => {
    return db.timelineBasespot
      .findUnique({ where: { id: root?.id } })
      .timeline();
  },
  TimelineBasespotDino: (_obj, { root }) => {
    return db.timelineBasespot
      .findUnique({ where: { id: root?.id } })
      .TimelineBasespotDino();
  },
};
