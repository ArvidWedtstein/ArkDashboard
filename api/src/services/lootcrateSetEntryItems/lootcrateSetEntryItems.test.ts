import type { LootcrateSetEntryItem } from '@prisma/client'

import {
  lootcrateSetEntryItems,
  lootcrateSetEntryItem,
  createLootcrateSetEntryItem,
  updateLootcrateSetEntryItem,
  deleteLootcrateSetEntryItem,
} from './lootcrateSetEntryItems'
import type { StandardScenario } from './lootcrateSetEntryItems.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('lootcrateSetEntryItems', () => {
  scenario(
    'returns all lootcrateSetEntryItems',
    async (scenario: StandardScenario) => {
      const result = await lootcrateSetEntryItems()

      expect(result.length).toEqual(
        Object.keys(scenario.lootcrateSetEntryItem).length
      )
    }
  )

  scenario(
    'returns a single lootcrateSetEntryItem',
    async (scenario: StandardScenario) => {
      const result = await lootcrateSetEntryItem({
        id: scenario.lootcrateSetEntryItem.one.id,
      })

      expect(result).toEqual(scenario.lootcrateSetEntryItem.one)
    }
  )

  scenario(
    'creates a lootcrateSetEntryItem',
    async (scenario: StandardScenario) => {
      const result = await createLootcrateSetEntryItem({
        input: {
          entry_id: scenario.lootcrateSetEntryItem.two.entry_id,
          item_id: scenario.lootcrateSetEntryItem.two.item_id,
        },
      })

      expect(result.entry_id).toEqual(
        scenario.lootcrateSetEntryItem.two.entry_id
      )
      expect(result.item_id).toEqual(scenario.lootcrateSetEntryItem.two.item_id)
    }
  )

  scenario(
    'updates a lootcrateSetEntryItem',
    async (scenario: StandardScenario) => {
      const original = (await lootcrateSetEntryItem({
        id: scenario.lootcrateSetEntryItem.one.id,
      })) as LootcrateSetEntryItem
      const result = await updateLootcrateSetEntryItem({
        id: original.id,
        input: { entry_id: scenario.lootcrateSetEntryItem.two.entry_id },
      })

      expect(result.entry_id).toEqual(
        scenario.lootcrateSetEntryItem.two.entry_id
      )
    }
  )

  scenario(
    'deletes a lootcrateSetEntryItem',
    async (scenario: StandardScenario) => {
      const original = (await deleteLootcrateSetEntryItem({
        id: scenario.lootcrateSetEntryItem.one.id,
      })) as LootcrateSetEntryItem
      const result = await lootcrateSetEntryItem({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
