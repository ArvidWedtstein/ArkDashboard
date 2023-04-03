import type { Prisma, LootcrateSetEntry } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LootcrateSetEntryCreateArgs>({
  lootcrateSetEntry: {
    one: {
      data: {
        LootcrateSet: {
          create: {
            Lootcrate: { create: { blueprint: 'String', Map: { create: {} } } },
          },
        },
      },
    },
    two: {
      data: {
        LootcrateSet: {
          create: {
            Lootcrate: { create: { blueprint: 'String', Map: { create: {} } } },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  LootcrateSetEntry,
  'lootcrateSetEntry'
>
