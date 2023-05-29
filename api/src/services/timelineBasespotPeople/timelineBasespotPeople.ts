import type {
  QueryResolvers,
  MutationResolvers,
  TimelineBasespotPersonRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const timelineBasespotPeople: QueryResolvers['timelineBasespotPeople'] =
  () => {
    return db.timelineBasespotPerson.findMany()
  }

export const timelineBasespotPerson: QueryResolvers['timelineBasespotPerson'] =
  ({ id }) => {
    return db.timelineBasespotPerson.findUnique({
      where: { id },
    })
  }

export const createTimelineBasespotPerson: MutationResolvers['createTimelineBasespotPerson'] =
  ({ input }) => {
    return db.timelineBasespotPerson.create({
      data: input,
    })
  }

export const updateTimelineBasespotPerson: MutationResolvers['updateTimelineBasespotPerson'] =
  ({ id, input }) => {
    return db.timelineBasespotPerson.update({
      data: input,
      where: { id },
    })
  }

export const deleteTimelineBasespotPerson: MutationResolvers['deleteTimelineBasespotPerson'] =
  ({ id }) => {
    return db.timelineBasespotPerson.delete({
      where: { id },
    })
  }

export const TimelineBasespotPerson: TimelineBasespotPersonRelationResolvers = {
  TimelineBasespot: (_obj, { root }) => {
    return db.timelineBasespotPerson
      .findUnique({ where: { id: root?.id } })
      .TimelineBasespot()
  },
  Profile: (_obj, { root }) => {
    return db.timelineBasespotPerson
      .findUnique({ where: { id: root?.id } })
      .Profile()
  },
}
