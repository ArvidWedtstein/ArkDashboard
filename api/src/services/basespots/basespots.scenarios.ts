import type { Prisma, basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.basespotCreateArgs>({
  basespot: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 9447742.875031296,
        longitude: 537169.8331823627,
        defenseImages: 'String',
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 5946377.352008248,
        longitude: 578531.6178329648,
        defenseImages: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<basespot, 'basespot'>
