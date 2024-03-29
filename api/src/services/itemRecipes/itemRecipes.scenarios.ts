import type { Prisma, ItemRecipe } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ItemRecipeCreateArgs>({
  itemRecipe: {
    one: {
      data: {
        Item_ItemRecipe_crafted_item_idToItem: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        Item_ItemRecipe_crafted_item_idToItem: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<ItemRecipe, 'itemRecipe'>
