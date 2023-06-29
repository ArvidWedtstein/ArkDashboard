import type { Prisma, TimelineSeasonPerson } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TimelineSeasonPersonCreateArgs>({
  timelineSeasonPerson: {
    one: {
      data: {
        TimelineSeason: {
          create: {
            Timeline: {
              create: {
                Profile: {
                  create: {
                    id: 'String',
                    role_profile_role_idTorole: {
                      create: {
                        name: 'String',
                        permissions: 'basespot:delete',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        TimelineSeason: {
          create: {
            Timeline: {
              create: {
                Profile: {
                  create: {
                    id: 'String',
                    role_profile_role_idTorole: {
                      create: {
                        name: 'String',
                        permissions: 'basespot:delete',
                      },
                    },
                  },
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
  TimelineSeasonPerson,
  'timelineSeasonPerson'
>
