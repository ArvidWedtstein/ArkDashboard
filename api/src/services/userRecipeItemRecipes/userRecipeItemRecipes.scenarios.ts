import type { Prisma, UserRecipeItemRecipe } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserRecipeItemRecipeCreateArgs>({
  userRecipeItemRecipe: {
    one: {
      data: {
        UserRecipe: {
          create: {
            Profile: {
              create: {
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
        UserRecipe: {
          create: {
            Profile: {
              create: {
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
  UserRecipeItemRecipe,
  'userRecipeItemRecipe'
>
