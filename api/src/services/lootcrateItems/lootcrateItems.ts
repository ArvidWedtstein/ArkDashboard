import type {
  QueryResolvers,
  MutationResolvers,
  LootcrateItemRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const lootcrateItems: QueryResolvers['lootcrateItems'] = () => {
  return db.lootcrateItem.findMany()
}

export const lootcrateItem: QueryResolvers['lootcrateItem'] = ({ id }) => {
  return db.lootcrateItem.findUnique({
    where: { id },
  })
}

export const createLootcrateItem: MutationResolvers['createLootcrateItem'] = ({
  input,
}) => {
  return db.lootcrateItem.create({
    data: input,
  })
}

export const updateLootcrateItem: MutationResolvers['updateLootcrateItem'] = ({
  id,
  input,
}) => {
  return db.lootcrateItem.update({
    data: input,
    where: { id },
  })
}

export const deleteLootcrateItem: MutationResolvers['deleteLootcrateItem'] = ({
  id,
}) => {
  return db.lootcrateItem.delete({
    where: { id },
  })
}

export const LootcrateItem: LootcrateItemRelationResolvers = {
  Item: (_obj, { root }) => {
    return db.lootcrateItem.findUnique({ where: { id: root?.id } }).Item()
  },
  Lootcrate: (_obj, { root }) => {
    return db.lootcrateItem.findUnique({ where: { id: root?.id } }).Lootcrate()
  },
}
