import type { Prisma, ItemRec } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ItemRecCreateArgs>({
  itemRec: {
    one: {
      data: {
        Item_ItemRec_crafted_item_idToItem: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        Item_ItemRec_crafted_item_idToItem: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<ItemRec, 'itemRec'>
