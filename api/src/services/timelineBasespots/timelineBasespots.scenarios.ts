import type { Prisma, TimelineBasespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TimelineBasespotCreateArgs>({
  timelineBasespot: {
    one: {
      data: {
        tribeName: 'String',
        players: 'String',
        timeline: {
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
        tribeName: 'String',
        players: 'String',
        timeline: {
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

export type StandardScenario = ScenarioData<
  TimelineBasespot,
  'timelineBasespot'
>
