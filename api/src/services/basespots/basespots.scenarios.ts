import type { Prisma, Basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BasespotCreateArgs>({
  basespot: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 4779677.282582755,
        longitude: 8038758.078103898,
        Map_Basespot_MapToMap: { create: {} },
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 6434091.744368917,
        longitude: 855793.6717077097,
        Map_Basespot_MapToMap: { create: {} },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Basespot, 'basespot'>
