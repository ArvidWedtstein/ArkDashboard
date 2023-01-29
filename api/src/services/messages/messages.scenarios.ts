import type { Prisma, Message } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MessageCreateArgs>({
  message: {
    one: {
      data: {
        content: 'String',
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
        content: 'String',
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

export type StandardScenario = ScenarioData<Message, 'message'>
