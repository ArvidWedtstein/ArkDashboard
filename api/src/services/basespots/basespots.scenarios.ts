import type { Prisma, basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.basespotCreateArgs>({
  basespot: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 449043.0178136551,
        longitude: 5552600.707802355,
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 6982812.684359019,
        longitude: 2345235.1868476737,
      },
    },
  },
})

export type StandardScenario = ScenarioData<basespot, 'basespot'>
