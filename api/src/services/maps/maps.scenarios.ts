import type { Prisma, Map } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MapCreateArgs>({
  map: {
    one: { data: { name: 'String9542383' } },
    two: { data: { name: 'String8088654' } },
  },
})

export type StandardScenario = ScenarioData<Map, 'map'>
