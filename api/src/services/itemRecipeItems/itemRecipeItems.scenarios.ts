import type { Prisma, ItemRecipeItem } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ItemRecipeItemCreateArgs>({
  itemRecipeItem: {
    one: {
      data: {
        amount: 6287888.625352145,
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
        amount: 860862.9446806493,
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
