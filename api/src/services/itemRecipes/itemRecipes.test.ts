import type { ItemRecipe } from '@prisma/client'

import {
  itemRecipes,
  itemRecipe,
  createItemRecipe,
  updateItemRecipe,
  deleteItemRecipe,
} from './itemRecipes'
import type { StandardScenario } from './itemRecipes.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('itemRecipes', () => {
  scenario('returns all itemRecipes', async (scenario: StandardScenario) => {
    const result = await itemRecipes()

    expect(result.length).toEqual(Object.keys(scenario.itemRecipe).length)
  })

  scenario(
    'returns a single itemRecipe',
    async (scenario: StandardScenario) => {
      const result = await itemRecipe({ id: scenario.itemRecipe.one.id })

      expect(result).toEqual(scenario.itemRecipe.one)
    }
  )

  scenario('creates a itemRecipe', async (scenario: StandardScenario) => {
    const result = await createItemRecipe({
      input: {
        item_id: scenario.itemRecipe.two.item_id,
        crafted_item_id: scenario.itemRecipe.two.crafted_item_id,
      },
    })

    expect(result.item_id).toEqual(scenario.itemRecipe.two.item_id)
    expect(result.crafted_item_id).toEqual(
      scenario.itemRecipe.two.crafted_item_id
    )
  })

  scenario('updates a itemRecipe', async (scenario: StandardScenario) => {
    const original = (await itemRecipe({
      id: scenario.itemRecipe.one.id,
    })) as ItemRecipe
    const result = await updateItemRecipe({
      id: original.id,
      input: { crafted_item_id: scenario.itemRecipe.two.item_id },
    })

    expect(result.crafted_item_id).toEqual(scenario.itemRecipe.two.item_id)
  })

  scenario('deletes a itemRecipe', async (scenario: StandardScenario) => {
    const original = (await deleteItemRecipe({
      id: scenario.itemRecipe.one.id,
    })) as ItemRecipe
    const result = await itemRecipe({ id: original.id })

    expect(result).toEqual(null)
  })
})
