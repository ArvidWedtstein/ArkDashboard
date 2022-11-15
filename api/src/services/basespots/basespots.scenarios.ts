import type { Prisma, Basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BasespotCreateArgs>({
  basespot: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 7533731.607565706,
        longitude: 5432524.179146543,
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 596443.2605507874,
        longitude: 3458014.157946405,
      },
    },
  },
})

export type StandardScenario = ScenarioData<Basespot, 'basespot'>
