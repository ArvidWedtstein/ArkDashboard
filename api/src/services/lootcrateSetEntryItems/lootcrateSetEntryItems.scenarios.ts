import type { Prisma, LootcrateSetEntryItem } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LootcrateSetEntryItemCreateArgs>({
  lootcrateSetEntryItem: {
    one: {
      data: {
        LootcrateSetEntry: {
          create: {
            LootcrateSet: {
              create: {
                Lootcrate: {
                  create: { blueprint: 'String', Map: { create: {} } },
                },
              },
            },
          },
        },
        Item: {
          create: { name: 'String', crafted_in: 'String', effects: 'String' },
        },
      },
    },
    two: {
      data: {
        LootcrateSetEntry: {
          create: {
            LootcrateSet: {
              create: {
                Lootcrate: {
                  create: { blueprint: 'String', Map: { create: {} } },
                },
              },
            },
          },
        },
        Item: {
          create: { name: 'String', crafted_in: 'String', effects: 'String' },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  LootcrateSetEntryItem,
  'lootcrateSetEntryItem'
>
