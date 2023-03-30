import type {
  QueryResolvers,
  MutationResolvers,
  DinoEffWeightRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const dinoEffWeights: QueryResolvers['dinoEffWeights'] = () => {
  return db.dinoEffWeight.findMany()
}

export const dinoEffWeight: QueryResolvers['dinoEffWeight'] = ({ id }) => {
  return db.dinoEffWeight.findUnique({
    where: { id },
  })
}

export const createDinoEffWeight: MutationResolvers['createDinoEffWeight'] = ({
  input,
}) => {
  return db.dinoEffWeight.create({
    data: input,
  })
}

export const updateDinoEffWeight: MutationResolvers['updateDinoEffWeight'] = ({
  id,
  input,
}) => {
  return db.dinoEffWeight.update({
    data: input,
    where: { id },
  })
}

export const deleteDinoEffWeight: MutationResolvers['deleteDinoEffWeight'] = ({
  id,
}) => {
  return db.dinoEffWeight.delete({
    where: { id },
  })
}

export const DinoEffWeight: DinoEffWeightRelationResolvers = {
  Dino: (_obj, { root }) => {
    return db.dinoEffWeight.findUnique({ where: { id: root?.id } }).Dino()
  },
  Item: (_obj, { root }) => {
    return db.dinoEffWeight.findUnique({ where: { id: root?.id } }).Item()
  },
}
