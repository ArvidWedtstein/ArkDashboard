import type { Prisma, Basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BasespotCreateArgs>({
  basespot: {
    one: {
      data: {
        latitude: 2937349.228990287,
        longitude: 698925.7125431058,
        Map: { create: { name: 'String1312153' } },
      },
    },
    two: {
      data: {
        latitude: 6460713.509948774,
        longitude: 6309705.631153131,
        Map: { create: { name: 'String1984626' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Basespot, 'basespot'>
