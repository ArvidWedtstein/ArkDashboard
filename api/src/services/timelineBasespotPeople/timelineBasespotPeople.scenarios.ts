import type { Prisma, TimelineBasespotPerson } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TimelineBasespotPersonCreateArgs>(
  {
    timelineBasespotPerson: {
      one: {
        data: {
          TimelineBasespot: {
            create: {
              tribe_name: 'String',
              players: 'String',
              timeline: {
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
          TimelineBasespot: {
            create: {
              tribe_name: 'String',
              players: 'String',
              timeline: {
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
  }
)

export type StandardScenario = ScenarioData<
  TimelineBasespotPerson,
  'timelineBasespotPerson'
>
