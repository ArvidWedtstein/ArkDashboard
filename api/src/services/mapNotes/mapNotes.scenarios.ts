import type { Prisma, MapNote } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MapNoteCreateArgs>({
  mapNote: {
    one: { data: { Map: { create: {} } } },
    two: { data: { Map: { create: {} } } },
  },
})

export type StandardScenario = ScenarioData<MapNote, 'mapNote'>
