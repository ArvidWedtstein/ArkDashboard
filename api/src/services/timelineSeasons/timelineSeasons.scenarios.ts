import type { Prisma, TimelineSeason } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TimelineSeasonCreateArgs>({
  timelineSeason: {
    one: {
      data: {
        Timeline: {
          create: {
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
    },
    two: {
      data: {
        Timeline: {
          create: {
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
    },
  },
})

export type StandardScenario = ScenarioData<TimelineSeason, 'timelineSeason'>
