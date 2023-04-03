import type {
  QueryResolvers,
  MutationResolvers,
  DinoStatRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const dinoStats: QueryResolvers['dinoStats'] = () => {
  return db.dinoStat.findMany()
}

export const dinoStat: QueryResolvers['dinoStat'] = ({ id }) => {
  return db.dinoStat.findUnique({
    where: { id },
  })
}

export const createDinoStat: MutationResolvers['createDinoStat'] = ({
  input,
}) => {
  return db.dinoStat.create({
    data: input,
  })
}

export const updateDinoStat: MutationResolvers['updateDinoStat'] = ({
  id,
  input,
}) => {
  return db.dinoStat.update({
    data: input,
    where: { id },
  })
}

export const deleteDinoStat: MutationResolvers['deleteDinoStat'] = ({ id }) => {
  return db.dinoStat.delete({
    where: { id },
  })
}

export const DinoStat: DinoStatRelationResolvers = {
  Dino: (_obj, { root }) => {
    return db.dinoStat.findUnique({ where: { id: root?.id } }).Dino()
  },
  Item: (_obj, { root }) => {
    return db.dinoStat.findUnique({ where: { id: root?.id } }).Item()
  },
}
