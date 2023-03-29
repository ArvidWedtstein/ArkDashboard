import type { Prisma, LootcrateSet } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LootcrateSetCreateArgs>({
  lootcrateSet: {
    one: {
      data: {
        Lootcrate: { create: { blueprint: 'String', Map: { create: {} } } },
      },
    },
    two: {
      data: {
        Lootcrate: { create: { blueprint: 'String', Map: { create: {} } } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<LootcrateSet, 'lootcrateSet'>
