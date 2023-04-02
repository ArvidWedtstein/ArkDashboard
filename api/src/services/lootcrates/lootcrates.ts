import type {
  QueryResolvers,
  MutationResolvers,
  LootcrateRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const lootcrates: QueryResolvers['lootcrates'] = () => {
  return db.lootcrate.findMany()
}

export const lootcrate: QueryResolvers['lootcrate'] = ({ id }) => {
  return db.lootcrate.findUnique({
    where: { id },
  })
}

export const createLootcrate: MutationResolvers['createLootcrate'] = ({
  input,
}) => {
  return db.lootcrate.create({
    data: input,
  })
}

export const updateLootcrate: MutationResolvers['updateLootcrate'] = ({
  id,
  input,
}) => {
  return db.lootcrate.update({
    data: input,
    where: { id },
  })
}

export const deleteLootcrate: MutationResolvers['deleteLootcrate'] = ({
  id,
}) => {
  return db.lootcrate.delete({
    where: { id },
  })
}

export const Lootcrate: LootcrateRelationResolvers = {
  Map: (_obj, { root }) => {
    return db.lootcrate.findUnique({ where: { id: root?.id } }).Map()
  },
  LootcrateSet: (_obj, { root }) => {
    return db.lootcrate.findUnique({ where: { id: root?.id } }).LootcrateSet()
  },
}