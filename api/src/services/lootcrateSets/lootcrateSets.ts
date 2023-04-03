import type {
  QueryResolvers,
  MutationResolvers,
  LootcrateSetRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const lootcrateSets: QueryResolvers['lootcrateSets'] = () => {
  return db.lootcrateSet.findMany()
}

export const lootcrateSet: QueryResolvers['lootcrateSet'] = ({ id }) => {
  return db.lootcrateSet.findUnique({
    where: { id },
  })
}

export const createLootcrateSet: MutationResolvers['createLootcrateSet'] = ({
  input,
}) => {
  return db.lootcrateSet.create({
    data: input,
  })
}

export const updateLootcrateSet: MutationResolvers['updateLootcrateSet'] = ({
  id,
  input,
}) => {
  return db.lootcrateSet.update({
    data: input,
    where: { id },
  })
}

export const deleteLootcrateSet: MutationResolvers['deleteLootcrateSet'] = ({
  id,
}) => {
  return db.lootcrateSet.delete({
    where: { id },
  })
}

export const LootcrateSet: LootcrateSetRelationResolvers = {
  Lootcrate: (_obj, { root }) => {
    return db.lootcrateSet.findUnique({ where: { id: root?.id } }).Lootcrate()
  },
  LootcrateSetEntry: (_obj, { root }) => {
    return db.lootcrateSet
      .findUnique({ where: { id: root?.id } })
      .LootcrateSetEntry()
  },
}
