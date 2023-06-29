import type { Prisma, Basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BasespotCreateArgs>({
  basespot: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 2360551.989500814,
        longitude: 1913261.1700626346,
        Map: { create: { name: 'String169085' } },
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 193144.11848058377,
        longitude: 6163664.209112316,
        Map: { create: { name: 'String3542984' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Basespot, 'basespot'>
