import type { Prisma, Basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BasespotCreateArgs>({
  basespot: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 4593232.327819281,
        longitude: 3950045.627006591,
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 9866999.1737315,
        longitude: 1308109.4528637328,
      },
    },
  },
})

export type StandardScenario = ScenarioData<Basespot, 'basespot'>
