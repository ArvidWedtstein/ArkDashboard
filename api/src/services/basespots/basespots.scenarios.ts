import type { Prisma, Basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BasespotCreateArgs>({
  basespot: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 6306619.108183385,
        longitude: 2213735.1594601483,
        Map: { create: {} },
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 1422407.2070458815,
        longitude: 7642832.804069352,
        Map: { create: {} },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Basespot, 'basespot'>
