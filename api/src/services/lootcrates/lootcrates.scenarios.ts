import type { Prisma, Lootcrate } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LootcrateCreateArgs>({
  lootcrate: {
    one: { data: { blueprint: 'String', Map: { create: {} } } },
    two: { data: { blueprint: 'String', Map: { create: {} } } },
  },
})

export type StandardScenario = ScenarioData<Lootcrate, 'lootcrate'>
