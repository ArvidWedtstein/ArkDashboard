import type {
  QueryResolvers,
  MutationResolvers,
  LootcrateMapRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const lootcrateMaps: QueryResolvers['lootcrateMaps'] = () => {
  return db.lootcrateMap.findMany()
}

export const lootcrateMap: QueryResolvers['lootcrateMap'] = ({ id }) => {
  return db.lootcrateMap.findUnique({
    where: { id },
  })
}

export const createLootcrateMap: MutationResolvers['createLootcrateMap'] = ({
  input,
}) => {
  return db.lootcrateMap.create({
    data: input,
  })
}

export const updateLootcrateMap: MutationResolvers['updateLootcrateMap'] = ({
  id,
  input,
}) => {
  return db.lootcrateMap.update({
    data: input,
    where: { id },
  })
}

export const deleteLootcrateMap: MutationResolvers['deleteLootcrateMap'] = ({
  id,
}) => {
  return db.lootcrateMap.delete({
    where: { id },
  })
}

export const LootcrateMap: LootcrateMapRelationResolvers = {
  Lootcrate: (_obj, { root }) => {
    return db.lootcrateMap.findUnique({ where: { id: root?.id } }).Lootcrate()
  },
  Map: (_obj, { root }) => {
    return db.lootcrateMap.findUnique({ where: { id: root?.id } }).Map()
  },
}
