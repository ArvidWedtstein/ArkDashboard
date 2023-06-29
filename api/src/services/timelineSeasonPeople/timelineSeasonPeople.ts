import type {
  QueryResolvers,
  MutationResolvers,
  TimelineSeasonPersonRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const timelineSeasonPeople: QueryResolvers['timelineSeasonPeople'] =
  () => {
    return db.timelineSeasonPerson.findMany()
  }

export const timelineSeasonPerson: QueryResolvers['timelineSeasonPerson'] = ({
  id,
}) => {
  return db.timelineSeasonPerson.findUnique({
    where: { id },
  })
}

export const createTimelineSeasonPerson: MutationResolvers['createTimelineSeasonPerson'] =
  ({ input }) => {
    return db.timelineSeasonPerson.create({
      data: input,
    })
  }

export const updateTimelineSeasonPerson: MutationResolvers['updateTimelineSeasonPerson'] =
  ({ id, input }) => {
    return db.timelineSeasonPerson.update({
      data: input,
      where: { id },
    })
  }

export const deleteTimelineSeasonPerson: MutationResolvers['deleteTimelineSeasonPerson'] =
  ({ id }) => {
    return db.timelineSeasonPerson.delete({
      where: { id },
    })
  }

export const TimelineSeasonPerson: TimelineSeasonPersonRelationResolvers = {
  TimelineSeason: (_obj, { root }) => {
    return db.timelineSeasonPerson
      .findUnique({ where: { id: root?.id } })
      .TimelineSeason()
  },
  Profile: (_obj, { root }) => {
    return db.timelineSeasonPerson
      .findUnique({ where: { id: root?.id } })
      .Profile()
  },
}
