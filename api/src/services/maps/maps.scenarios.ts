import type { Prisma, Map } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MapCreateArgs>({
  map: { one: { data: {} }, two: { data: {} } },
})

export type StandardScenario = ScenarioData<Map, 'map'>
