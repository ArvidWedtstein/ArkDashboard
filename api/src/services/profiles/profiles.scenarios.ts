import type { Prisma, Profile } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ProfileCreateArgs>({
  profile: {
    one: {
      data: {
        role_profile_role_idTorole: {
          create: { name: 'String', permissions: 'basespot:delete' },
        },
      },
    },
    two: {
      data: {
        role_profile_role_idTorole: {
          create: { name: 'String', permissions: 'basespot:delete' },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Profile, 'profile'>
