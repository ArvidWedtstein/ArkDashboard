import type {
  QueryResolvers,
  MutationResolvers,
  TimelineRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const timelines: QueryResolvers["timelines"] = () => {
  return db.timeline.findMany({
    where: { created_by: context.currentUser.id },
  });
};

export const timeline: QueryResolvers["timeline"] = ({ id }) => {
  return db.timeline.findUnique({
    where: { id },
  });
};

export const createTimeline: MutationResolvers["createTimeline"] = ({
  input,
}) => {
  return db.timeline.create({
    data: input,
  });
};

export const updateTimeline: MutationResolvers["updateTimeline"] = ({
  id,
  input,
}) => {
  return db.timeline.update({
    data: input,
    where: { id },
  });
};

export const deleteTimeline: MutationResolvers["deleteTimeline"] = ({ id }) => {
  return db.timeline.delete({
    where: { id },
  });
};

export const Timeline: TimelineRelationResolvers = {
  Profile: (_obj, { root }) => {
    return db.timeline.findUnique({ where: { id: root?.id } }).Profile();
  },
  TimelineBasespot: (_obj, { root }) => {
    return db.timeline
      .findUnique({ where: { id: root?.id } })
      .TimelineBasespot();
  },
};
