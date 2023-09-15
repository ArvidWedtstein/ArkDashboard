import type { LootcrateItem } from '@prisma/client'

import {
  lootcrateItems,
  lootcrateItem,
  createLootcrateItem,
  updateLootcrateItem,
  deleteLootcrateItem,
} from './lootcrateItems'
import type { StandardScenario } from './lootcrateItems.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('lootcrateItems', () => {
  scenario('returns all lootcrateItems', async (scenario: StandardScenario) => {
    const result = await lootcrateItems()

    expect(result.length).toEqual(Object.keys(scenario.lootcrateItem).length)
  })

  scenario(
    'returns a single lootcrateItem',
    async (scenario: StandardScenario) => {
      const result = await lootcrateItem({ id: scenario.lootcrateItem.one.id })

      expect(result).toEqual(scenario.lootcrateItem.one)
    }
  )

  scenario('creates a lootcrateItem', async (scenario: StandardScenario) => {
    const result = await createLootcrateItem({
      input: { lootcrate_id: scenario.lootcrateItem.two.lootcrate_id },
    })

    expect(result.lootcrate_id).toEqual(scenario.lootcrateItem.two.lootcrate_id)
  })

  scenario('updates a lootcrateItem', async (scenario: StandardScenario) => {
    const original = (await lootcrateItem({
      id: scenario.lootcrateItem.one.id,
    })) as LootcrateItem
    const result = await updateLootcrateItem({
      id: original.id,
      input: { lootcrate_id: scenario.lootcrateItem.two.lootcrate_id },
    })

    expect(result.lootcrate_id).toEqual(scenario.lootcrateItem.two.lootcrate_id)
  })

  scenario('deletes a lootcrateItem', async (scenario: StandardScenario) => {
    const original = (await deleteLootcrateItem({
      id: scenario.lootcrateItem.one.id,
    })) as LootcrateItem
    const result = await lootcrateItem({ id: original.id })

    expect(result).toEqual(null)
  })
})
