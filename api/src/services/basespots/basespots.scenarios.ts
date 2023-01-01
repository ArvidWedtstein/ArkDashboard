import type { Prisma, basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.basespotCreateArgs>({
  basespot: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 313039.5051991064,
        longitude: 1401448.5157089496,
        defenseImages: 'String',
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 1607598.6219214622,
        longitude: 7566501.325123738,
        defenseImages: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<basespot, 'basespot'>
