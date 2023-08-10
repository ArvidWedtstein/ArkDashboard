import type { Prisma, Map } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MapCreateArgs>({
  map: {
    one: { data: { name: 'String5751554' } },
    two: { data: { name: 'String2137404' } },
  },
})

export type StandardScenario = ScenarioData<Map, 'map'>
