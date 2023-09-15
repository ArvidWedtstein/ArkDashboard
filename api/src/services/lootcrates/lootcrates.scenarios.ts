import type { Prisma, Lootcrate } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LootcrateCreateArgs>({
  lootcrate: {
    one: { data: { name: 'String' } },
    two: { data: { name: 'String' } },
  },
})

export type StandardScenario = ScenarioData<Lootcrate, 'lootcrate'>
