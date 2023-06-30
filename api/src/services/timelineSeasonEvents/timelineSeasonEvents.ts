import type {
  QueryResolvers,
  MutationResolvers,
  TimelineSeasonEventRelationResolvers,
  TimelineSeason,
} from "types/graphql";

import { db } from "src/lib/db";

export const timelineSeasonEvents: QueryResolvers["timelineSeasonEvents"] = ({
  timeline_season_id,
}: Required<Pick<any, "timeline_season_id">>) => {
  // TODO: fix type
  return db.timelineSeasonEvent.findMany({
    orderBy: { created_at: "desc" },
    where: { timeline_season_id },
  });
};

export const timelineSeasonEvent: QueryResolvers["timelineSeasonEvent"] = ({
  id,
}) => {
  return db.timelineSeasonEvent.findUnique({
    where: { id },
  });
};

export const createTimelineSeasonEvent: MutationResolvers["createTimelineSeasonEvent"] =
  ({ input }) => {
    return db.timelineSeasonEvent.create({
      data: input,
    });
  };

export const updateTimelineSeasonEvent: MutationResolvers["updateTimelineSeasonEvent"] =
  ({ id, input }) => {
    return db.timelineSeasonEvent.update({
      data: input,
      where: { id },
    });
  };

export const deleteTimelineSeasonEvent: MutationResolvers["deleteTimelineSeasonEvent"] =
  ({ id }) => {
    return db.timelineSeasonEvent.delete({
      where: { id },
    });
  };

export const TimelineSeasonEvent: TimelineSeasonEventRelationResolvers = {
  Profile: (_obj, { root }) => {
    return db.timelineSeasonEvent
      .findUnique({ where: { id: root?.id } })
      .Profile();
  },
  Map: (_obj, { root }) => {
    return db.timelineSeasonEvent.findUnique({ where: { id: root?.id } }).Map();
  },
  TimelineSeason: (_obj, { root }) => {
    return db.timelineSeasonEvent
      .findUnique({ where: { id: root?.id } })
      .TimelineSeason();
  },
};
