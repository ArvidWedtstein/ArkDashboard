import type { Prisma, Basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BasespotCreateArgs>({
  basespot: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 4948551.965423993,
        longitude: 477050.54582068307,
        Map: { create: { name: 'String4762681' } },
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 8543344.174358694,
        longitude: 3733796.3975089593,
        Map: { create: { name: 'String9187137' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Basespot, 'basespot'>
