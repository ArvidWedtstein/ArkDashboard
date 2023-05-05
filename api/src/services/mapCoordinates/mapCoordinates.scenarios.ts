import type { Prisma, MapCoordinate } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MapCoordinateCreateArgs>({
  mapCoordinate: {
    one: { data: { Map: { create: {} } } },
    two: { data: { Map: { create: {} } } },
  },
})

export type StandardScenario = ScenarioData<MapCoordinate, 'mapCoordinate'>
