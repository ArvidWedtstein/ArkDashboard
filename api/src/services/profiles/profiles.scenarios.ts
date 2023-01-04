import type { Prisma, profile } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.profileCreateArgs>({
  profile: {
    one: {
      data: {
        id: 'String',
        role_profile_role_idTorole: {
          create: { name: 'String', permissions: 'basespot:delete' },
        },
      },
    },
    two: {
      data: {
        id: 'String',
        role_profile_role_idTorole: {
          create: { name: 'String', permissions: 'basespot:delete' },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<profile, 'profile'>
