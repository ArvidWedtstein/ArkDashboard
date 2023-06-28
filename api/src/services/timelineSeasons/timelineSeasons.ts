import type {
  QueryResolvers,
  MutationResolvers,
  TimelineSeasonRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const timelineSeasons: QueryResolvers['timelineSeasons'] = () => {
  return db.timelineSeason.findMany()
}

export const timelineSeason: QueryResolvers['timelineSeason'] = ({ id }) => {
  return db.timelineSeason.findUnique({
    where: { id },
  })
}

export const createTimelineSeason: MutationResolvers['createTimelineSeason'] =
  ({ input }) => {
    return db.timelineSeason.create({
      data: input,
    })
  }

export const updateTimelineSeason: MutationResolvers['updateTimelineSeason'] =
  ({ id, input }) => {
    return db.timelineSeason.update({
      data: input,
      where: { id },
    })
  }

export const deleteTimelineSeason: MutationResolvers['deleteTimelineSeason'] =
  ({ id }) => {
    return db.timelineSeason.delete({
      where: { id },
    })
  }

export const TimelineSeason: TimelineSeasonRelationResolvers = {
  Timeline: (_obj, { root }) => {
    return db.timelineSeason.findUnique({ where: { id: root?.id } }).Timeline()
  },
  TimelineSeasonEvent: (_obj, { root }) => {
    return db.timelineSeason
      .findUnique({ where: { id: root?.id } })
      .TimelineSeasonEvent()
  },
}
