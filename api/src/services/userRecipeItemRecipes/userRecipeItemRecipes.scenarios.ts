import type { Prisma, UserRecipeItemRecipe } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserRecipeItemRecipeCreateArgs>({
  userRecipeItemRecipe: {
    one: {
      data: {
        ItemRecipe: {
          create: {
            Item_ItemRecipe_crafted_item_idToItem: {
              create: { name: 'String' },
            },
          },
        },
        UserRecipe: { create: {} },
      },
    },
    two: {
      data: {
        ItemRecipe: {
          create: {
            Item_ItemRecipe_crafted_item_idToItem: {
              create: { name: 'String' },
            },
          },
        },
        UserRecipe: { create: {} },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  UserRecipeItemRecipe,
  'userRecipeItemRecipe'
>
