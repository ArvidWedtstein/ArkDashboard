import type { Prisma, LootcrateItem } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LootcrateItemCreateArgs>({
  lootcrateItem: {
    one: { data: { Lootcrate: { create: { name: 'String' } } } },
    two: { data: { Lootcrate: { create: { name: 'String' } } } },
  },
})

export type StandardScenario = ScenarioData<LootcrateItem, 'lootcrateItem'>
