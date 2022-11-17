import type { Prisma, Tribe } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TribeCreateArgs>({
  tribe: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        updatedAt: '2022-11-17T07:21:19.877Z',
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        updatedAt: '2022-11-17T07:21:19.877Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Tribe, 'tribe'>
