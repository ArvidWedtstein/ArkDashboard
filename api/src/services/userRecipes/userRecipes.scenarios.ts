import type { Prisma, UserRecipe } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserRecipeCreateArgs>({
  userRecipe: {
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

export type StandardScenario = ScenarioData<UserRecipe, 'userRecipe'>
