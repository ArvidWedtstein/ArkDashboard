import type { Prisma, Basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BasespotCreateArgs>({
  basespot: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 2770962.358165543,
        longitude: 5226871.094497763,
        Map: { create: {} },
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 3744264.1235444495,
        longitude: 2419975.4645998795,
        Map: { create: {} },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Basespot, 'basespot'>
