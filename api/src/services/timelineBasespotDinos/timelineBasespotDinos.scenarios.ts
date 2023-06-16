import type { Prisma, TimelineBasespotDino } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TimelineBasespotDinoCreateArgs>({
  timelineBasespotDino: {
    one: {
      data: {
        Dino: {
          create: {
            name: 'String',
            can_destroy: 'String',
            type: 'String',
            carryable_by: 'String',
          },
        },
        TimelineBasespot: {
          create: {
            tribe_name: 'String',
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
        Dino: {
          create: {
            name: 'String',
            can_destroy: 'String',
            type: 'String',
            carryable_by: 'String',
          },
        },
        TimelineBasespot: {
          create: {
            tribe_name: 'String',
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
})

export type StandardScenario = ScenarioData<
  TimelineBasespotDino,
  'timelineBasespotDino'
>
