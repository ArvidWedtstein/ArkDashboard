import type { Prisma, Basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BasespotCreateArgs>({
  basespot: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 7575779.19322093,
        longitude: 3542084.9882717743,
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 6446240.95557039,
        longitude: 2032208.771281423,
      },
    },
  },
})

export type StandardScenario = ScenarioData<Basespot, 'basespot'>
