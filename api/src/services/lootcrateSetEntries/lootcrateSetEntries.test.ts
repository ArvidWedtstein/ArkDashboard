import type { LootcrateSetEntry } from '@prisma/client'

import {
  lootcrateSetEntries,
  lootcrateSetEntry,
  createLootcrateSetEntry,
  updateLootcrateSetEntry,
  deleteLootcrateSetEntry,
} from './lootcrateSetEntries'
import type { StandardScenario } from './lootcrateSetEntries.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('lootcrateSetEntries', () => {
  scenario(
    'returns all lootcrateSetEntries',
    async (scenario: StandardScenario) => {
      const result = await lootcrateSetEntries()

      expect(result.length).toEqual(
        Object.keys(scenario.lootcrateSetEntry).length
      )
    }
  )

  scenario(
    'returns a single lootcrateSetEntry',
    async (scenario: StandardScenario) => {
      const result = await lootcrateSetEntry({
        id: scenario.lootcrateSetEntry.one.id,
      })

      expect(result).toEqual(scenario.lootcrateSetEntry.one)
    }
  )

  scenario(
    'creates a lootcrateSetEntry',
    async (scenario: StandardScenario) => {
      const result = await createLootcrateSetEntry({
        input: { set_id: scenario.lootcrateSetEntry.two.set_id },
      })

      expect(result.set_id).toEqual(scenario.lootcrateSetEntry.two.set_id)
    }
  )

  scenario(
    'updates a lootcrateSetEntry',
    async (scenario: StandardScenario) => {
      const original = (await lootcrateSetEntry({
        id: scenario.lootcrateSetEntry.one.id,
      })) as LootcrateSetEntry
      const result = await updateLootcrateSetEntry({
        id: original.id,
        input: { set_id: scenario.lootcrateSetEntry.two.set_id },
      })

      expect(result.set_id).toEqual(scenario.lootcrateSetEntry.two.set_id)
    }
  )

  scenario(
    'deletes a lootcrateSetEntry',
    async (scenario: StandardScenario) => {
      const original = (await deleteLootcrateSetEntry({
        id: scenario.lootcrateSetEntry.one.id,
      })) as LootcrateSetEntry
      const result = await lootcrateSetEntry({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
