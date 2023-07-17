import type { Prisma, Basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BasespotCreateArgs>({
  basespot: {
    one: {
      data: {
        latitude: 708949.426751897,
        longitude: 4282623.727235115,
        Map: { create: { name: 'String862617' } },
      },
    },
    two: {
      data: {
        latitude: 1539503.5898113751,
        longitude: 8973795.773910884,
        Map: { create: { name: 'String1367022' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Basespot, 'basespot'>
