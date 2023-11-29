import type { Prisma, MapRegion } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MapRegionCreateArgs>({
  mapRegion: {
    one: { data: { Map: { create: { name: 'String9201397' } } } },
    two: { data: { Map: { create: { name: 'String558466' } } } },
  },
})

export type StandardScenario = ScenarioData<MapRegion, 'mapRegion'>
