import type { Prisma, basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.basespotCreateArgs>({
  basespot: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 5074652.219468377,
        longitude: 3568157.0729538235,
        defenseImages: 'String',
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 5839174.396450983,
        longitude: 9979201.309636971,
        defenseImages: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<basespot, 'basespot'>
