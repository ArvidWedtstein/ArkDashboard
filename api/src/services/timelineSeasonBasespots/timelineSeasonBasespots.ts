import type {
  QueryResolvers,
  MutationResolvers,
  TimelineSeasonBasespotRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const timelineSeasonBasespotsByTimelineSeasonId: QueryResolvers["timelineSeasonBasespotsByTimelineSeasonId"] =
  ({ timeline_season_id }) => {
    return db.timelineSeasonBasespot.findMany({
      orderBy: { created_at: "desc" },
      where: { timeline_season_id },
    });
  };

export const timelineSeasonBasespots: QueryResolvers["timelineSeasonBasespots"] =
  () => {
    return db.timelineSeasonBasespot.findMany({
      orderBy: { created_at: "desc" },
    });
  };

export const timelineSeasonBasespot: QueryResolvers["timelineSeasonBasespot"] =
  ({ id }) => {
    return db.timelineSeasonBasespot.findUnique({
      where: { id },
    });
  };

export const createTimelineSeasonBasespot: MutationResolvers["createTimelineSeasonBasespot"] =
  ({ input }) => {
    return db.timelineSeasonBasespot.create({
      data: input,
    });
  };

export const updateTimelineSeasonBasespot: MutationResolvers["updateTimelineSeasonBasespot"] =
  ({ id, input }) => {
    return db.timelineSeasonBasespot.update({
      data: input,
      where: { id },
    });
  };

export const deleteTimelineSeasonBasespot: MutationResolvers["deleteTimelineSeasonBasespot"] =
  ({ id }) => {
    return db.timelineSeasonBasespot.delete({
      where: { id },
    });
  };

export const TimelineSeasonBasespot: TimelineSeasonBasespotRelationResolvers = {
  Basespot: (_obj, { root }) => {
    return db.timelineSeasonBasespot
      .findUnique({ where: { id: root?.id } })
      .Basespot();
  },
  Profile: (_obj, { root }) => {
    return db.timelineSeasonBasespot
      .findUnique({ where: { id: root?.id } })
      .Profile();
  },
  Map: (_obj, { root }) => {
    return db.timelineSeasonBasespot
      .findUnique({ where: { id: root?.id } })
      .Map();
  },
  TimelineSeason: (_obj, { root }) => {
    return db.timelineSeasonBasespot
      .findUnique({ where: { id: root?.id } })
      .TimelineSeason();
  },
};
