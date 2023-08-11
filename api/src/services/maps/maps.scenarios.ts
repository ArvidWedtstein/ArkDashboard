import type { Prisma, Map } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MapCreateArgs>({
  map: {
    one: { data: { name: 'String1531652' } },
    two: { data: { name: 'String1303617' } },
  },
})

export type StandardScenario = ScenarioData<Map, 'map'>
