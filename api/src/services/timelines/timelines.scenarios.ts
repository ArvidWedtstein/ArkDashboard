import type { Prisma, Timeline } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TimelineCreateArgs>({
  timeline: {
    one: {
      data: {
        Profile: {
          create: {
            id: 'String',
            role_profile_role_idTorole: {
              create: { name: 'String', permissions: 'basespot:delete' },
            },
          },
        },
      },
    },
    two: {
      data: {
        Profile: {
          create: {
            id: 'String',
            role_profile_role_idTorole: {
              create: { name: 'String', permissions: 'basespot:delete' },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Timeline, 'timeline'>
