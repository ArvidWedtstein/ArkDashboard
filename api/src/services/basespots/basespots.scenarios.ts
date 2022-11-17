import type { Prisma, basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.basespotCreateArgs>({
  basespot: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 4914548.822270899,
        longitude: 2756176.010508087,
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 7253804.713020346,
        longitude: 2599283.978262916,
      },
    },
  },
})

export type StandardScenario = ScenarioData<basespot, 'basespot'>
