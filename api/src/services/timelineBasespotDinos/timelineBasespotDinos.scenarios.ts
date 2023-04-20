import type { Prisma, TimelineBasespotDino } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TimelineBasespotDinoCreateArgs>({
  timelineBasespotDino: {
    one: {
      data: {
        Dino: {
          create: {
            name: 'String',
            synonyms: 'String',
            can_destroy: 'String',
            immobilized_by: 'String',
            fits_through: 'String',
            eats: 'String',
            drops: 'String',
            method: 'String',
            knockout: 'String',
            type: 'String',
            carryable_by: 'String',
          },
        },
        TimelineBasespot: {
          create: {
            tribeName: 'String',
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
        Dino: {
          create: {
            name: 'String',
            synonyms: 'String',
            can_destroy: 'String',
            immobilized_by: 'String',
            fits_through: 'String',
            eats: 'String',
            drops: 'String',
            method: 'String',
            knockout: 'String',
            type: 'String',
            carryable_by: 'String',
          },
        },
        TimelineBasespot: {
          create: {
            tribeName: 'String',
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
})

export type StandardScenario = ScenarioData<
  TimelineBasespotDino,
  'timelineBasespotDino'
>
