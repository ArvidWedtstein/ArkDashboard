import type { Prisma, Item } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ItemCreateArgs>({
  item: {
    one: { data: { name: 'String', crafted_in: 'String', effects: 'String' } },
    two: { data: { name: 'String', crafted_in: 'String', effects: 'String' } },
  },
})

export type StandardScenario = ScenarioData<Item, 'item'>
