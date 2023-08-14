import type { Prisma, Map } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MapCreateArgs>({
  map: {
    one: { data: { name: 'String957708' } },
    two: { data: { name: 'String3115587' } },
  },
})

export type StandardScenario = ScenarioData<Map, 'map'>
