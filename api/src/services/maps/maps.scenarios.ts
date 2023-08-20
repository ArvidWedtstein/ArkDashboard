import type { Prisma, Map } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MapCreateArgs>({
  map: {
    one: { data: { name: 'String871794' } },
    two: { data: { name: 'String2470640' } },
  },
})

export type StandardScenario = ScenarioData<Map, 'map'>
