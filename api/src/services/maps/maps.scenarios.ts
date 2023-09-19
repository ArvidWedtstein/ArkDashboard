import type { Prisma, Map } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MapCreateArgs>({
  map: {
    one: { data: { name: 'String7388019' } },
    two: { data: { name: 'String2271408' } },
  },
})

export type StandardScenario = ScenarioData<Map, 'map'>
