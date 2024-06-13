import type { Prisma, ItemRecipeItem } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ItemRecipeItemCreateArgs>({
  itemRecipeItem: {
    one: {
      data: {
        amount: 6303345.61038891,
        ItemRecipe: {
          create: {
            Item_ItemRecipe_crafted_item_idToItem: {
              create: { name: 'String' },
            },
          },
        },
        Item: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        amount: 1932682.5015888093,
        ItemRecipe: {
          create: {
            Item_ItemRecipe_crafted_item_idToItem: {
              create: { name: 'String' },
            },
          },
        },
        Item: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<ItemRecipeItem, 'itemRecipeItem'>
