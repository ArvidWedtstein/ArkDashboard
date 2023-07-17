import type { Prisma, Basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BasespotCreateArgs>({
  basespot: {
    one: {
      data: {
        latitude: 524857.5684509737,
        longitude: 6841714.721721995,
        Map: { create: { name: 'String6685201' } },
      },
    },
    two: {
      data: {
        latitude: 5294820.848047348,
        longitude: 6155133.017622953,
        Map: { create: { name: 'String4264594' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Basespot, 'basespot'>
