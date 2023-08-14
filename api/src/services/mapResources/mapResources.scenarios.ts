import type { Prisma, MapResource } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MapResourceCreateArgs>({
  mapResource: {
    one: { data: { Map: { create: { name: 'String3184073' } } } },
    two: { data: { Map: { create: { name: 'String8762522' } } } },
  },
})

export type StandardScenario = ScenarioData<MapResource, 'mapResource'>
