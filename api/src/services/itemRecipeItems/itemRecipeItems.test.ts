import type { ItemRecipeItem } from '@prisma/client'

import {
  itemRecipeItems,
  itemRecipeItem,
  createItemRecipeItem,
  updateItemRecipeItem,
  deleteItemRecipeItem,
} from './itemRecipeItems'
import type { StandardScenario } from './itemRecipeItems.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('itemRecipeItems', () => {
  scenario(
    'returns all itemRecipeItems',
    async (scenario: StandardScenario) => {
      const result = await itemRecipeItems()

      expect(result.length).toEqual(Object.keys(scenario.itemRecipeItem).length)
    }
  )

  scenario(
    'returns a single itemRecipeItem',
    async (scenario: StandardScenario) => {
      const result = await itemRecipeItem({
        id: scenario.itemRecipeItem.one.id,
      })

      expect(result).toEqual(scenario.itemRecipeItem.one)
    }
  )

  scenario('creates a itemRecipeItem', async (scenario: StandardScenario) => {
    const result = await createItemRecipeItem({
      input: {
        item_recipe_id: scenario.itemRecipeItem.two.item_recipe_id,
        resource_item_id: scenario.itemRecipeItem.two.resource_item_id,
        amount: 3072002.6313558836,
      },
    })

    expect(result.item_recipe_id).toEqual(
      scenario.itemRecipeItem.two.item_recipe_id
    )
    expect(result.resource_item_id).toEqual(
      scenario.itemRecipeItem.two.resource_item_id
    )
    expect(result.amount).toEqual(3072002.6313558836)
  })

  scenario('updates a itemRecipeItem', async (scenario: StandardScenario) => {
    const original = (await itemRecipeItem({
      id: scenario.itemRecipeItem.one.id,
    })) as ItemRecipeItem
    const result = await updateItemRecipeItem({
      id: original.id,
      input: { amount: 590286.1599876164 },
    })

    expect(result.amount).toEqual(590286.1599876164)
  })

  scenario('deletes a itemRecipeItem', async (scenario: StandardScenario) => {
    const original = (await deleteItemRecipeItem({
      id: scenario.itemRecipeItem.one.id,
    })) as ItemRecipeItem
    const result = await itemRecipeItem({ id: original.id })

    expect(result).toEqual(null)
  })
})
