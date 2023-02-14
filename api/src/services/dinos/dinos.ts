import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const dinos: QueryResolvers['dinos'] = () => {
  return db.dino.findMany()
}

export const dino: QueryResolvers['dino'] = ({ id }) => {
  return db.dino.findUnique({
    where: { id },
  })
}

export const createDino: MutationResolvers['createDino'] = ({ input }) => {
  return db.dino.create({
    data: input,
  })
}

export const updateDino: MutationResolvers['updateDino'] = ({ id, input }) => {
  return db.dino.update({
    data: input,
    where: { id },
  })
}

export const deleteDino: MutationResolvers['deleteDino'] = ({ id }) => {
  return db.dino.delete({
    where: { id },
  })
}
