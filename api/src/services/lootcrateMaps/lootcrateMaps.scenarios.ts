import type { Prisma, LootcrateMap } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LootcrateMapCreateArgs>({
  lootcrateMap: {
    one: {
      data: {
        Lootcrate: { create: { name: 'String' } },
        Map: { create: { name: 'String8751714' } },
      },
    },
    two: {
      data: {
        Lootcrate: { create: { name: 'String' } },
        Map: { create: { name: 'String6885412' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<LootcrateMap, 'lootcrateMap'>
