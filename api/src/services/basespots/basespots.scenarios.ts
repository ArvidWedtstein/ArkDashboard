import type { Prisma, Basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BasespotCreateArgs>({
  basespot: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 208081.78331088278,
        longitude: 8163779.812889356,
        Map: { create: { name: 'String2806771' } },
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 3208980.354364419,
        longitude: 2425891.6877492797,
        Map: { create: { name: 'String356597' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Basespot, 'basespot'>
