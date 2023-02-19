import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const maps: QueryResolvers['maps'] = () => {
  return db.map.findMany()
}

export const map: QueryResolvers['map'] = ({ id }) => {
  return db.map.findUnique({
    where: { id },
  })
}

export const createMap: MutationResolvers['createMap'] = ({ input }) => {
  return db.map.create({
    data: input,
  })
}

export const updateMap: MutationResolvers['updateMap'] = ({ id, input }) => {
  return db.map.update({
    data: input,
    where: { id },
  })
}

export const deleteMap: MutationResolvers['deleteMap'] = ({ id }) => {
  return db.map.delete({
    where: { id },
  })
}
