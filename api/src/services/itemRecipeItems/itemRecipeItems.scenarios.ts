import type { Prisma, ItemRecipeItem } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ItemRecipeItemCreateArgs>({
  itemRecipeItem: {
    one: {
      data: {
        Item: { create: { name: 'String' } },
        ItemRecipe: {
          create: {
            Item_ItemRecipe_crafted_item_idToItem: {
              create: { name: 'String' },
            },
          },
        },
      },
    },
    two: {
      data: {
        Item: { create: { name: 'String' } },
        ItemRecipe: {
          create: {
            Item_ItemRecipe_crafted_item_idToItem: {
              create: { name: 'String' },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<ItemRecipeItem, 'itemRecipeItem'>
