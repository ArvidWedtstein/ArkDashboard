import type { Prisma, Lootcrate } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LootcrateCreateArgs>({
  lootcrate: {
    one: {
      data: { blueprint: 'String', Map: { create: { name: 'String9201634' } } },
    },
    two: {
      data: { blueprint: 'String', Map: { create: { name: 'String3692696' } } },
    },
  },
})

export type StandardScenario = ScenarioData<Lootcrate, 'lootcrate'>
