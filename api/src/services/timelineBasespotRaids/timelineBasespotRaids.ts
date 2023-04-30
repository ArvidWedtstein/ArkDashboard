import type {
  QueryResolvers,
  MutationResolvers,
  TimelineBasespotRaidRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const timelineBasespotRaids: QueryResolvers['timelineBasespotRaids'] =
  () => {
    return db.timelineBasespotRaid.findMany()
  }

export const timelineBasespotRaid: QueryResolvers['timelineBasespotRaid'] = ({
  id,
}) => {
  return db.timelineBasespotRaid.findUnique({
    where: { id },
  })
}

export const createTimelineBasespotRaid: MutationResolvers['createTimelineBasespotRaid'] =
  ({ input }) => {
    return db.timelineBasespotRaid.create({
      data: input,
    })
  }

export const updateTimelineBasespotRaid: MutationResolvers['updateTimelineBasespotRaid'] =
  ({ id, input }) => {
    return db.timelineBasespotRaid.update({
      data: input,
      where: { id },
    })
  }

export const deleteTimelineBasespotRaid: MutationResolvers['deleteTimelineBasespotRaid'] =
  ({ id }) => {
    return db.timelineBasespotRaid.delete({
      where: { id },
    })
  }

export const TimelineBasespotRaid: TimelineBasespotRaidRelationResolvers = {
  TimelineBasespot: (_obj, { root }) => {
    return db.timelineBasespotRaid
      .findUnique({ where: { id: root?.id } })
      .TimelineBasespot()
  },
}
