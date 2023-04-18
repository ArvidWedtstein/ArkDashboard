import type { Prisma, Basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BasespotCreateArgs>({
  basespot: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 8166979.04655915,
        longitude: 3914794.083721653,
        Map: { create: {} },
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 5952785.223335399,
        longitude: 3561371.8959259,
        Map: { create: {} },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Basespot, 'basespot'>
