import type { Prisma, Map } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MapCreateArgs>({
  map: {
    one: { data: { name: 'String1960398' } },
    two: { data: { name: 'String4971756' } },
  },
})

export type StandardScenario = ScenarioData<Map, 'map'>
