import type {
  QueryResolvers,
  MutationResolvers,
  LootcrateSetEntryRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const lootcrateSetEntries: QueryResolvers['lootcrateSetEntries'] =
  () => {
    return db.lootcrateSetEntry.findMany()
  }

export const lootcrateSetEntry: QueryResolvers['lootcrateSetEntry'] = ({
  id,
}) => {
  return db.lootcrateSetEntry.findUnique({
    where: { id },
  })
}

export const createLootcrateSetEntry: MutationResolvers['createLootcrateSetEntry'] =
  ({ input }) => {
    return db.lootcrateSetEntry.create({
      data: input,
    })
  }

export const updateLootcrateSetEntry: MutationResolvers['updateLootcrateSetEntry'] =
  ({ id, input }) => {
    return db.lootcrateSetEntry.update({
      data: input,
      where: { id },
    })
  }

export const deleteLootcrateSetEntry: MutationResolvers['deleteLootcrateSetEntry'] =
  ({ id }) => {
    return db.lootcrateSetEntry.delete({
      where: { id },
    })
  }

export const LootcrateSetEntry: LootcrateSetEntryRelationResolvers = {
  LootcrateSet: (_obj, { root }) => {
    return db.lootcrateSetEntry
      .findUnique({ where: { id: root?.id } })
      .LootcrateSet()
  },
}
