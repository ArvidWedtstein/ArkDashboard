import type { Prisma, UserRecipeItemRecipe } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserRecipeItemRecipeCreateArgs>({
  userRecipeItemRecipe: {
    one: {
      data: {
        ItemRec: {
          create: {
            Item_ItemRecipe_crafted_item_idToItem: {
              create: { name: 'String' },
            },
          },
        },
        UserRecipe: {
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
        ItemRec: {
          create: {
            Item_ItemRecipe_crafted_item_idToItem: {
              create: { name: 'String' },
            },
          },
        },
        UserRecipe: {
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
  UserRecipeItemRecipe,
  'userRecipeItemRecipe'
>
