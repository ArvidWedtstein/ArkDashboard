import type { Prisma, Map } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MapCreateArgs>({
  map: {
    one: { data: { name: 'String5128793' } },
    two: { data: { name: 'String4287417' } },
  },
})

export type StandardScenario = ScenarioData<Map, 'map'>
